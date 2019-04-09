import {Tree,Comparable} from './collection';
import utils from '../utils';
type NodeColor = ''|'R'|'B';
export class BNode<T extends Comparable<T>>{
    static NO_COLOR:NodeColor = '';
    static BLACK:NodeColor = 'B';
    static RED:NodeColor = 'R';
    private _leftNode:BNode<T> = null;
    private _rightNode:BNode<T> = null;
    private _parentNode:BNode<T> = null;
    private _value:T;
    public color:NodeColor = BNode.NO_COLOR;
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
    protected _rootNode:BNode<T>;
    protected _size:number = 0;
    range(begin: T, end: T): T[] {
        throw new Error("Method not implemented.");
    }
    isEmpty(): boolean {
        return this._size == 0;
    }
    add(value:T):boolean{
        let n = this.doAdd(value);
        return n != null;
    }
    protected doAdd(value:T):BNode<T>{
        if(!this._rootNode){
            this._rootNode = new BNode(value);
            this._size ++;
            return this._rootNode;
        }
        let curNode = this._rootNode;
        while(true){
            let c = value.compareTo(curNode.value);
            if(c == 0){
                return null;
            }
            if(c < 0){
                if(!curNode.leftNode){
                    let n = new BNode(value);
                    curNode.setLeftNode(n);
                    this._size++;
                    return n;
                }
                curNode = curNode.leftNode;
            }
            else{
                if(!curNode.rightNode){
                    let n = new BNode(value);
                    curNode.setRightNode(n);
                    this._size++;
                    return n;
                }
                curNode = curNode.rightNode;
            }
        }
    }

    findNode(targetValue:T):BNode<T>{
        let curNode = this._rootNode;
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
        if(n == this._rootNode){
            this._rootNode = null;
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
        this.doPrint(this._rootNode,0,arr);
        console.log(arr.join(''),'\n');
    }
    private doPrint(curNode:BNode<T>,deep:number,arr:string[]){
        arr.push(utils.spaceFill(curNode.value.toString()+curNode.color,5));
        if(curNode.rightNode){
            this.doPrint(curNode.rightNode,deep+1,arr);
        }
        if(curNode.leftNode){
            arr.push('\n',utils.spaceFill('\\',(deep+1)*5));
            this.doPrint(curNode.leftNode,deep+1,arr);
        }
    }

    private doFindDir(isRight:boolean = false,curNode:BNode<T> = this._rootNode):BNode<T>{
        let target:BNode<T> = curNode;
        while(true){
            if(!curNode)break;
            target = curNode;
            curNode = isRight?curNode.rightNode:curNode.leftNode;
        }
        return target;

    }
    private doFindDirValue(isRight:boolean = false,curNode:BNode<T> = this._rootNode):T|null{
        let n = this.doFindDir(isRight,curNode);
        if(n){
            return n.value;
        }
        return null;
    }
}

/**
 * 红黑树，代码还是有点问题
 */
export class RBTree<T extends Comparable<T>> extends BinarySearchTree<T>{
    add(value:T):boolean{
        let n = super.doAdd(value);
        if(!n)return false;
        if(n == this._rootNode){
            this._rootNode.color = BNode.BLACK;
            return true;
        }
        n.color = BNode.RED;
        this.afterAdd(n);
        return true;
    }

    private afterAdd(curNode:BNode<T>){
        let parentNode = curNode.parentNode,
            uncleNode = this.getUncle(curNode);
        if(!parentNode || !parentNode.parentNode)return;
        /*
        当前节点的父节点是红色，且当前节点的祖父节点的另一个子节点（叔叔节点）也是红色。
        (01) 将“父节点”设为黑色。
        (02) 将“叔叔节点”设为黑色。
        (03) 将“祖父节点”设为“红色”。
        (04) 将“祖父节点”设为“当前节点”(红色节点)；即，之后继续对“当前节点”进行操作。
        */
        if(this.isRed(parentNode) && this.isRed(uncleNode)){
            parentNode.color = BNode.BLACK;
            uncleNode.color = BNode.BLACK;
            parentNode.parentNode.color = BNode.RED;
            this.afterAdd(parentNode.parentNode);
        }
        /*
        当前节点的父节点是红色，叔叔节点是黑色，且当前节点是其父节点的右孩子
        (01) 将“父节点”作为“新的当前节点”。
        (02) 以“新的当前节点”为支点进行左旋。
        */
        else if(this.isRed(parentNode) && this.isBlack(uncleNode) && curNode == parentNode.rightNode){
            this.rotateLeft(parentNode);
        }
        /*
        当前节点的父节点是红色，叔叔节点是黑色，且当前节点是其父节点的左孩子
        (01) 将“父节点”设为“黑色”。
        (02) 将“祖父节点”设为“红色”。
        (03) 以“祖父节点”为支点进行右旋。
        */
        else if(this.isRed(parentNode) && this.isBlack(uncleNode) && curNode == parentNode.leftNode){
            parentNode.color = BNode.BLACK;
            parentNode.parentNode.color = BNode.RED;
            this.rotateRight(parentNode.parentNode);
        }
    }

    private isBlack(node:BNode<T>):boolean{
        return !node || node.color == BNode.BLACK;
    }

    private isRed(node:BNode<T>):boolean{
        return node != null && node.color == BNode.RED;
    }

    private rotateLeft(curNode:BNode<T>){
        let parentNode = curNode.parentNode,
            rightNode = curNode.rightNode;
        if(curNode == parentNode.leftNode){
            parentNode.setLeftNode(rightNode);
        }
        else{
            parentNode.setRightNode(rightNode);
        }
        curNode.setRightNode(rightNode.leftNode);
        rightNode.setLeftNode(curNode);
    }
    private rotateRight(curNode:BNode<T>){
        let parentNode = curNode.parentNode,
            leftNode = curNode.leftNode;
        if(curNode == parentNode.leftNode){
            parentNode.setLeftNode(leftNode);
        }
        else{
            parentNode.setLeftNode(leftNode);
        }
        curNode.setLeftNode(leftNode.rightNode);
        leftNode.setRightNode(curNode);
    }

    private getUncle(n:BNode<T>):BNode<T>{
        let grandNode:BNode<T>;
        if(!n.parentNode || !(grandNode = n.parentNode.parentNode)){
            return null;
        }
        if(grandNode.leftNode == n.parentNode){
            return grandNode.rightNode;
        }
        else{
            return grandNode.leftNode;
        }
    }
}