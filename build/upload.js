const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')
const cdnConfig = require('../app.config').cdn
const {
    ak,
    sk,
    bucket
} = cdnConfig
const mac = new qiniu.auth.digest.Mac(ak, sk)
const config = new qiniu.conf.Config()
    // 华东对应的是z0, 七牛上的文档有写
config.zone = qiniu.zone.Zone_z0
    // 上传的方法
const doUpload = (key, file) => {
        const options = {
            scope: bucket + ':' + key
        }
        const formUploader = new qiniu.form_up.FormUploader(config)
        const putExtra = new qiniu.form_up.PutExtra()
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken = putPolicy.uploadToken(mac)
        return new Promise((resolve, reject) => {
            formUploader.putFile(uploadToken, key, file, putExtra, (err, body, info) => {
                if (err) {
                    return reject(err)
                }
                if (info.statusCode === 200) {
                    resolve(body)
                } else {
                    reject(body)
                }
            })
        })
    }
    // public里面还有文件夹，写个递归的方法
const publicPath = path.join(__dirname, '../public')
const uploadAll = (dir, prefix) => {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        // path.join(dir, file)拿到文件路径
        const filePath = path.join(dir, file)
        const key = prefix ? `${prefix}/${file}` : file
        console.log('filePath', filePath, 'key', key)
        if (fs.lstatSync(filePath).isDirectory()) {
            // 如果是文件夹,递归
            return uploadAll(filePath, key)
        }
        doUpload(key, filePath)
            .then(resp => console.log(resp))
            .catch(err => console.error(err))
    })
}
uploadAll(publicPath)
