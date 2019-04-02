import {Heap,Comparable,Weight} from './define';

class ArrayHeap<T extends Comparable<T>> implements Heap<T>{
    private _arr:T[];
    private _offset:number = -1;
    constructor(capacity:number){
        this._arr = new Array<T>(capacity);
    }
    findMin(): T {
        return this._arr[0]||null;
    }    
    removeMin(): T {
        throw new Error("Method not implemented.");
    }
    add(value: T): boolean {
        this._offset++;
        if(this._offset == 0){
            this._arr[0] = value;
            return true;
        }
        let targetIdx:number = this._offset;
        while(true){
            let pIdx = this.getParentIdx(targetIdx),
                pItem = this.getParentItem(targetIdx);
            if(pIdx == -1 || value.compareTo(pItem) > 0){
                this._arr[targetIdx] = value;
                break;
            }
            else{
                this._arr[targetIdx] = pItem;
                targetIdx = pIdx;
            }
        }
        return true;
    }
    contains(value: T): boolean {
        let i:T = this._arr.find((i:T)=>i.compareTo(value) == 0);
        return i?true:false;
    }
    remove(value: T): boolean {
        throw new Error("Method not implemented.");
    }
    isEmpty(): boolean {
        return this._offset == -1;
    }
    size(): number {
        return this._offset + 1;
    }

    print(){
        console.log(this._arr.map((i:T)=>i.toString()).join(','));
    }

    private getItem(idx:number):T{
        return this._arr[idx];
    }

    private getLeftIdx(idx:number):number{
        return (idx+1) * 2 -1;
    }
    private getLeftItem(idx:number):T{
        return this._arr[this.getLeftIdx(idx)];
    }

    private getRightIdx(idx:number):number{
        return (idx+1)*2;
    }
    private getRightItem(idx:number):T{
        return this._arr[this.getRightIdx(idx)];
    }

    private getParentIdx(idx:number):number{
        if(idx == 0)return -1;
        return Math.floor((idx+1)/2)-1;
    }
    private getParentItem(idx:number):T{
        if(idx == 0)return null;
        return this._arr[this.getParentIdx(idx)];
    }
}

let init = function(){
    let data:number[] = [8,3,6,4,2,7];
    let heap:Heap<Weight> = new ArrayHeap<Weight>(16);
    data.forEach(function(n:number){
        heap.add(Weight.from(n));
    });
    heap.print();
    console.log('min',heap.findMin().toString());
}
init();