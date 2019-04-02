export interface Comparable<T>{
    compareTo(target:T):number;
    valueOf():number;
    toString():string;
}

export class Weight implements Comparable<Weight>{
    static from(value:number,data:any = null):Weight{
        return new Weight(value,data);
    }
    private _value:number = 0;
    private _data:any = null;
    constructor(value:number,data:any = null){
        this._value = value;
        this._data = data;
    }
    compareTo(target: Weight): number {
        return this._value - target._value;
    }    
    valueOf(): number {
        return this._value;
    }
    toString():string{
        return String(this._value);
    }
    get value():number{
        return this._value;
    }

    get data():any{
        return this._data;
    }
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

export interface Heap<T extends Comparable<T>> extends Collection<T>{
    findMin():T;
    removeMin():T;
}
