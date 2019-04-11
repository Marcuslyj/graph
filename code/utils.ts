export default {
    spaceFill(str:string|number = '',size:number=3){
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
    },
    cloneMap:function(source:Map<any,any>,target?:Map<any,any>){
        if(!target){
            target = new Map();
        }
        source.forEach(function(value,key){
            target.set(key,value);
        });
        return target;
    },
    cloneSet:function(source:Set<any>,target?:Set<any>){
        if(!target){
            target = new Set();
        }
        source.forEach(function(value){
            target.add(value);
        });
        return target;
    }
};
