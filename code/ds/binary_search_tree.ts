import {Tree,Comparable,Weight} from './collection';
import utils from '../utils';
export class BNode<T extends Comparable<T>>{
    private _leftNode:BNode<T> = null;
    private _rightNode:BNode<T> = null;
    private _parentNode:BNode<T> = null;
    private _value:T;
    constructor(value:T){
        this._value = value;
    }

    isLeaf():boolean{
        return this._leftNode == null && this._rightNode == null;
    }

    isOneChild():BNode<T>{
        if(this._leftNode == null && this._rightNode != null){
            return this._rightNode;
        }
        else if(this._leftNode != null && this._rightNode == null){
            return this._leftNode;
        }
        return null;
    }

    setLeftNode(leftNode:BNode<T>){
        if(leftNode){
            leftNode._parentNode = this;
        }
        this._leftNode = leftNode || null;
    }

    setRightNode(rightNode:BNode<T>){
        if(rightNode){
            rightNode._parentNode = this;
        }
        this._rightNode = rightNode || null;
    }

    replaceValueWith(targetNode:BNode<T>){
        this._value = targetNode.value;
    }

    get value():T{
        return this._value;
    }

    get leftNode():BNode<T>{
        return this._leftNode;
    }

    get rightNode():BNode<T>{
        return this._rightNode;
    }

    get parentNode():BNode<T>{
        return this._parentNode;
    }

    destroy(){
        this._value = null;
        this._leftNode = this._rightNode = this._parentNode = null;
    }

    toString():string{
        let arr:string[] = [];
        if(this._leftNode){
            arr.push(String(this._leftNode.value),'<');
        }
        arr.push(String(this.value));
        if(this._rightNode){
            arr.push('>',String(this._rightNode.value))
        }
        return arr.join('')
    }
}


export class BinarySearchTree<T extends Comparable<T>> implements Tree<T>{
    rootNode:BNode<T>;
    private _size:number = 0;
    range(begin: T, end: T): T[] {
        throw new Error("Method not implemented.");
    }
    isEmpty(): boolean {
        return this._size == 0;
    }
    add(value:T):boolean{
        if(!this.rootNode){
            this.rootNode = new BNode(value);
            this._size ++;
            return false;
        }
        let curNode = this.rootNode;
        while(true){
            let c = value.compareTo(curNode.value);
            if(c == 0){
                return false;
            }
            if(c < 0){
                if(!curNode.leftNode){
                    curNode.setLeftNode(new BNode(value));
                    this._size++;
                    return true;
                }
                curNode = curNode.leftNode;
            }
            else{
                if(!curNode.rightNode){
                    curNode.setRightNode(new BNode(value));
                    this._size++;
                    return true;
                }
                curNode = curNode.rightNode;
            }
        }
    }

    findNode(targetValue:T):BNode<T>{
        let curNode = this.rootNode;
        while(true){
            if(!curNode)return null;
            let c = targetValue.compareTo(curNode.value);
            if(c == 0){
                return curNode;
            }
            else if(c < 0){
                curNode = curNode.leftNode;
            }
            else{
                curNode = curNode.rightNode;
            }
        }
    }

    contains(targetValue:T):boolean{
        let n = this.findNode(targetValue);
        if(n == null){
            return false;
        }
        return true;
    }

    findMax():T|null{
        return this.doFindDirValue(true);
    }

    findMin():T|null{
        return this.doFindDirValue();
    }

    remove(value:T):boolean{
        let n = this.findNode(value);
        if(!n)return false;
        this.doDelete(n);
        this._size--;
        return true;
    }

    size():number{
        return this._size;
    }

    private doDelete(n:BNode<T>):void{
        let p = n.parentNode;
        let oneChild:BNode<T>;
        if(n == this.rootNode){
            this.rootNode = null;
            n.destroy();
        }
        else if(n.isLeaf()){
            if(p.leftNode == n){
                p.setLeftNode(null);
            }
            else{
                p.setRightNode(null);
            }
            n.destroy();
        }
        else if(oneChild = n.isOneChild()){
            if(p.leftNode == n){
                p.setLeftNode(oneChild);
            }
            else{
                p.setRightNode(oneChild);
            }
            n.destroy();
        }
        else {
            let rightMin = this.doFindDir(false,n.rightNode);
            n.replaceValueWith(rightMin);
            this.doDelete(rightMin);
        }
    }

    print():void{
        let arr:string[] = ['BST size = ',String(this._size),'\n'];
        this.doPrint(this.rootNode,0,arr);
        console.log(arr.join(''),'\n');
    }
    private doPrint(curNode:BNode<T>,deep:number,arr:string[]){
        arr.push(utils.spaceFill(curNode.value.toString(),4));
        if(curNode.rightNode){
            this.doPrint(curNode.rightNode,deep+1,arr);
        }
        if(curNode.leftNode){
            arr.push('\n',utils.spaceFill('\\',(deep+1)*4));
            this.doPrint(curNode.leftNode,deep+1,arr);
        }
    }

    private doFindDir(isRight:boolean = false,curNode:BNode<T> = this.rootNode):BNode<T>{
        let target:BNode<T> = curNode;
        while(true){
            if(!curNode)break;
            target = curNode;
            curNode = isRight?curNode.rightNode:curNode.leftNode;
        }
        return target;

    }
    private doFindDirValue(isRight:boolean = false,curNode:BNode<T> = this.rootNode):T|null{
        let n = this.doFindDir(isRight,curNode);
        if(n){
            return n.value;
        }
        return null;
    }
}