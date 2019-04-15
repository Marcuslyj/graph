export class Weight implements Comparable<Weight>,Indexable{
    private static _cCount:number = 0;
    static from(value:number,data:any = null):Weight{
        return new Weight(value,data);
    }
    static startCompareCounting(){
        this._cCount = 0;
    }
    static endCompareCounting():number{
        console.log('Compare Count = ',this._cCount);
        return this._cCount;
    }
    private _value:number = 0;
    private _data:any = null;
    constructor(value:number,data:any = null){
        this._value = value;
        this._data = data;
    }
    compareTo(target: Weight): number {
        Weight._cCount ++;
        return this._value - target._value;
    }    
    valueOf(): number {
        return this._value;
    }
    toString():string{
        return String(this._value);
    }
    getIndex():number{
        return this._value;
    }
    get value():number{
        return this._value;
    }

    get data():any{
        return this._data;
    }
}
export interface Comparable<T>{
    compareTo(target:T):number;
    valueOf():number;
    toString():string;
}
export interface Indexable{
    getIndex():number;
    toString():string;
}


export interface Collection<T>{
    /**
     * 添加值
     */
    add(value:T):boolean;
    /**
     * 是否包含
     */
    contains(value:T):boolean;
    remove(value:T):boolean;
    isEmpty():boolean;
    size():number;
    print():void;
}
export interface Tree<T extends Comparable<T>> extends Collection<T>{
    findMax():T;
    findMin():T;
    range(begin:T,end:T):T[];
}

export interface Queue<T extends Comparable<T>> extends Collection<T>{
    /**
     * 获取但不移除此队列的头；如果此队列为空，则返回 null。
     */
    findMin():T;
    /**
     * 获取并移除此队列的头，如果此队列为空，则返回 null。
     */
    removeMin():T;
}

export interface UnionFind<T> extends Collection<T>{
    /**
     * 联合两个元素，使他们建立关系
     */
    union(a:T,b:T):void;
    /**
     * 判断两个元素是否已经建立关系
     */
    test(a:T,b:T):boolean;
    find(a:T):any;
}