var result = 1
var add = (num) => {
    result *= num
    console.log('num', num)
    if (num > 1) {
        num--
        add(num)
    } else {
        console.log('result', result)
        return
    }
}
