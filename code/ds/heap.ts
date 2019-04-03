import {Queue,Comparable} from './collection';

export class ArrayHeap<T extends Comparable<T>> implements Queue<T>{
    private _arr:T[];
    private _offset:number = -1;
    constructor(capacity:number = 16){
        this._arr = new Array<T>(capacity);
    }
    findMin(): T {
        return this._arr[0]||null;
    }    
    removeMin(): T {
        if(this._offset < 0)return null;
        let min:T = this.findMin();
        let holeIdx = 0;
        while(true){
            let leftSubIdx = this.getLeftIdx(holeIdx),
                leftSubItem = this.getLeftItem(holeIdx),
                rightSubIdx = this.getRightIdx(holeIdx),
                rightSubItem = this.getRightItem(holeIdx),
                moveIdx:number = 0,
                needBreak = false;
            if(rightSubItem){
                if(leftSubItem.compareTo(rightSubItem) < 0){
                    moveIdx = leftSubIdx;
                }
                else{
                    moveIdx = rightSubIdx;
                }
            }
            else if(leftSubItem){
                moveIdx = leftSubIdx;
            }
            else if(holeIdx != this._offset){
                moveIdx = this._offset;
                needBreak = true
            }
            else{
                break;
            }
            this._arr[holeIdx] = this._arr[moveIdx];
            holeIdx = moveIdx;
            if(needBreak)break;
        }
        delete this._arr[this._offset];
        this._offset --;
        return min;
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
        let arr = [];
        for(let i=0;i<=this._offset;i++){
            let t:T = this._arr[i];
            arr.push(t.toString());
        }
        console.log('Array Heap : ',arr.join(','));
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

