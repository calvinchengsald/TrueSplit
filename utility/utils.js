
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
    var result = isNaN(str)?0:( isNaN(parseFloat(str))?0:parseFloat(str)   );
    if(result === "-0"){
        return 0;
    }
    return result;
}
export const parseFloatZero2 = (str) => {
    var result = isNaN(str)?"0":( isNaN(parseFloat(str))?0:parseFloat(str).toFixed(2)   );
    if(result === "-0.00"){
        return "0.00";
    }
    return result;
}
export const parseFloatZero0 = (str) => {
    var result = isNaN(str)?"0":( isNaN(parseFloat(str))?0:parseFloat(str).toFixed(0)   );
    if(result === "-0"){
        return "0";
    }
    return result;
}

export const coalesceZero = (val1, val2) => {
    // console.log(val1 + " / " + val2 + " / " +  val1.replace(/[\s0]/,'')+ "/" + (val1 === undefined || val1 === null || val1.replace(/[\s0]/,'')===''));
    return  (val1 === undefined || val1 === null || val1.replace(/[\s0]/,'')==='')? val2: val1;
}
export const coalesce = (val1, val2) => {
    return  (val1 === undefined || val1 === null || val1.replace(/[\s]/,'')==='')? val2: val1;
}



// if object is null, remove it from the list
// export function sortObjectArrayByKey(arr, sortKey)
// {
//   arr = arr.filter( (data) => data!==null);
//   for (var i = 1; i < arr.length; i++) 
//   {
//     if (arr[i][sortKey] < arr[0][sortKey]) 
//     {
//       //move current element to the first position
//       arr.unshift(arr.splice(i,1)[0]);
//     } 
//     else if (arr[i][sortKey] > arr[i-1][sortKey]) 
//     {
//       //leave current element where it is
//       continue;
//     } 
//     else {
//       //find where element should go
//       for (var j = 1; j < i; j++) {
//         if (arr[i][sortKey] > arr[j-1][sortKey] && arr[i][sortKey] < arr[j][sortKey]) 
//         {
//           //move element
//           arr.splice(j,0,arr.splice(i,1)[0]);
//         }
//       }
//     }
//   }
//   return arr;
// }

// if object is null, remove it from the list
export function sortObjectArrayByKey(arr, sortKey){
    arr = arr.filter( (data) => data!==null);
    var temp;
    for (var i = 0; i < arr.length-1; i++) {
        if (arr[i][sortKey] < arr[i+1][sortKey]) {
            temp = arr[i]
            arr[i] = arr[i+1]
            arr[i+1] = temp
            i=-1;
        }
    }
    return arr
}
