
export const standardizeNumber = (number) => {
    
    var finalCost = 0;
    number = number.replace(/\s/,'');
    number = number.substring(0,1).replace(/[^0-9.-]/,'') + number.substring(1,number.length).replace(/[^0-9.]/,'');
    var costArr = number.split('.');
    if( costArr.length == 1){
        finalCost = costArr[0].replace(/^0/,'');
    } 
    else if (costArr.length > 1) {
        finalCost = costArr[0].replace(/^0/,'') + '.'+ costArr[1].substring(0,2);
    }

    return finalCost;
} 

export const parseFloatZero = (str) => {
    return isNaN(str)?0:parseFloat(str)
}
export const parseFloatZero2 = (str) => {
    return isNaN(str)?0:parseFloat(str).toFixed(2)
}