export default {
    spaceFill(str:string|number,size:number=3){
        str = String(str);
        if(str.length >= size){
            return str;
        }
        let arr:string[] = [];
        for(let i=0;i<size - str.length;i++){
            arr.push(' ');
        }
        arr.push(str);
        return arr.join('');
    },
    randNumArr(count:number = 10,min:number = 0,max:number = 100):number[]{
        let arr:number[] = [];
        for(let i=0;i<count;i++){
            arr.push(Math.floor((max-min)*Math.random())+1);
        }
        return arr;
    }
};
