import {Comparable,Collection} from './collection';
import utils from '../utils';
class Item<T extends Comparable<T>>{
    next:Item<T> = null;
    below:Item<T> = null;
    value:T;
    constructor(value:T){
        this.value = value;
    }

    compareTo(target:T):number{
        if(!this.value){
            return -1;
        }
        return this.value.compareTo(target);
    }
}

export class JumpList<T extends Comparable<T>> implements Collection<T>{
    private _root:Item<T>;
    private _lowRoot:Item<T>;
    private _size:number = 0;
    constructor(private _isSet:boolean = true){
        let r = new Item(null);
        this._root = r;
        this._lowRoot = r;
    }
    add(value: T): boolean {
        let s = this._size;
        let needJumpItem = this.doAddValue(value,this._root);
        if(needJumpItem){
            let nr = new Item(this._root.value);
            let nj = new Item(value);
            nr.next = nj;
            nj.below = needJumpItem;
            nr.below = this._root;
            this._root = nr;
        }
        return s != this._size;
    }    
    private doAddValue(value:T,curItem:Item<T>):Item<T>{
        while (true) {
            let c = 0;
            if(curItem.next && (c = curItem.next.compareTo(value)) <= 0){
                if(c == 0 && this._isSet){
                    return null;
                }
                curItem = curItem.next;
            }
            else if(curItem.below){
                let needJumpItem = this.doAddValue(value,curItem.below);
                if(needJumpItem){
                    let i = new Item(value);
                    i.next = curItem.next;
                    curItem.next = i;
                    i.below = needJumpItem;
                    return Math.random() < .5 ? i:null;
                }
                return null;
            }
            else{
                let i:Item<T>,
                    c = curItem.compareTo(value);
                if( c < 0){
                    i = new Item(value);
                    i.next = curItem.next;
                    curItem.next = i;
                    this._size ++;
                }
                else{
                    debugger;
                    i = new Item(curItem.value);
                    curItem.value = value;
                    i.next = curItem.next;
                    curItem.next = i;
                }
                return Math.random() < .5 ?i:null;
            }
        }
    }
    contains(value: T): boolean {
        let n = 0;
        let curItem = this._root;
        while(curItem){
            if(curItem.next){
                let c = curItem.next.compareTo(value);
                if(c==0)return true;
                if(c < 0){
                    curItem = curItem.next;
                    continue;
                }
            }
            let c = curItem.compareTo(value);
            if(c == 0){
                return true;
            }
            if(c > 0){
                return false;
            }
            if(curItem.below){
                curItem = curItem.below;
            }
        }
        return false;
    }
    remove(value: T): boolean {
        if(this.doRemove(value,this._root)){
            this._size --;
            return true;
        }
        return false;
    }
    private doRemove(value:T,preItem:Item<T>):boolean{
        let curItem = preItem.next;
        while (curItem) {
            let c = curItem.compareTo(value);
            if(c == 0){
                if(curItem.below){
                    this.doRemove(value,preItem.below);
                }
                if(preItem == this._root && !curItem.next){
                    this._root = this._root.below;
                }
                else{
                    preItem.next = curItem.next;
                }
                return true;
            }
            else if(c < 0){
                preItem = curItem;
                curItem = curItem.next;
                if(!curItem && preItem.below){
                    return this.doRemove(value,preItem.below);
                }
            }
            else if(preItem.below){
                return this.doRemove(value,preItem.below);
            }
            else{
                return false;
            }
        }
        return false;
    }
    isEmpty(): boolean {
        return this._size == 0;
    }
    size(): number {
        return this._size;
    }
    print(): void {
        let arr:string[] = [];
        let curRoot = this._root;
        do{
            let curPointer = this._lowRoot.next,
                curItem = curRoot.next;
            do{
                if(curRoot == this._lowRoot || curItem.value.compareTo(curPointer.value) == 0){
                    arr.push(utils.spaceFill(curItem.value.toString(),4));
                    if(curItem.next){
                        curItem = curItem.next;
                    }
                    else{
                        break;
                    }
                }
                else{
                    arr.push(utils.spaceFill('',4));
                }
            }while(curPointer = curPointer.next)
            arr.push('\n');
        }while(curRoot = curRoot.below)
        console.log('JumpList size =',this._size);
        console.log(arr.join(''));
    }
}