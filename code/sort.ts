type SortFn = (arr:number[])=>void;
let randArr = function(len:number = 20,min:number=0,max:number=100):number[]{
    let arr:number[] = [];
    for(let i=0;i<len;i++){
        let n = Math.floor(Math.random() * (max - min))+1;
        arr.push(n);
    }
    return arr;
}
let arrSwitch = function(arr:any[],aIdx:number,bIdx:number){
    let tmp = arr[aIdx];
    arr[aIdx] = arr[bIdx];
    arr[bIdx] = tmp;
}

let quickSort = function(arr:number[],startIdx:number=0,endIdx:number = arr.length){
    if(endIdx - startIdx < 2)return;
    let targetVal = arr[startIdx],
        targetIdx = startIdx;
    for(let i=startIdx+1;i<endIdx;i++){
        let val = arr[i];
        if(val < targetVal){
            for(let j=i;j>targetIdx;j--){
                arr[j] = arr[j-1];
            }
            arr[targetIdx] = val;
            targetIdx ++;
        }
    }
    quickSort(arr,startIdx,targetIdx);
    quickSort(arr,targetIdx+1,endIdx);
}


let main = function(){
    //let arr:number[] = [9,14,92,26,3,61,12,71,8,28,36,8,10,2,32,45];
    let arr = randArr();
    let sortedArr = arr.map(i=>i).sort(function(a,b){return a-b});
    let sortFn:SortFn = quickSort;
    console.log(arr.join(','));
    sortFn(arr);
    console.log(arr.join(','),sortedArr.join(',') == arr.join(','));
}

main();