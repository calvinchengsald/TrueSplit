
export const standardizeNumber = (number) => {
    
    var finalCost = 0;
    number = number.replace(/[^0-9.]/,'');
    var costArr = number.split('.');
    if( costArr.length == 1){
        finalCost = costArr[0].replace(/^0/,'');
    } 
    else if (costArr.length > 1) {
        finalCost = costArr[0].replace(/^0/,'') + '.'+ costArr[1].substring(0,2);
    }

    return finalCost;
} 