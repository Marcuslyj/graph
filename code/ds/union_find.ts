import {UnionFind,Indexable} from './collection';
export class ArrayUnionFind<T extends Indexable> implements UnionFind<T>{
    private _arr:number[];
    private _size:number = 0;
    constructor(capacity:number = 16){
        this._arr = new Array<number>(capacity);
    }
    union(a: T, b: T): void {
        if(a.getIndex() == b.getIndex())return;
        if(this.test(a,b))return;
        let aIdx = this.find(a),
            bIdx = this.find(b);
        if(aIdx == bIdx){
            debugger;
        }
        this._arr[aIdx] = bIdx;
    }    
    test(a: T, b: T): boolean {
        let aRoot = this.find(a),
            bRoot = this.find(b);
        return aRoot == bRoot;
    }
    find(a:T):number{
        let aIdx = a.getIndex(),
            arIdx = this._arr[aIdx],
            aGIdx = arIdx < 0 ? aIdx : arIdx,
            rIdx = aGIdx;
        if(arIdx === undefined){
            return NaN;
        }
        while(true){
            if(this._arr[rIdx] < 0){
                break;
            }
            else{
                rIdx = this._arr[rIdx];
            }
        }
        if(aGIdx != rIdx){
            this._arr[aIdx] = rIdx;
        }
        return rIdx;
    }
    add(value: T): boolean {
        let idx = value.getIndex();
        let has = this._arr[idx] !== undefined;
        this._arr[idx] = -1;
        return !has;
    }
    contains(value: T): boolean {
        return this._arr[value.getIndex()] !== undefined;
    }
    remove(value: T): boolean {
        return delete this._arr[value.getIndex()];
    }
    isEmpty(): boolean {
        return this._size == 0;
    }
    size(): number {
        return this._size;
    }
    print(): void {
        let arr:any[] = [];
        for(let i=0;i<this._arr.length;i++){
            let a:number = this._arr[i];
            arr.push(a===undefined?'':a);
        }
        console.log('AUF : ',arr.join(','));
    }
}

class Room implements Indexable{
    static WALL_RIGHT = 0;
    static WALL_BOTTOM = 1;
    private _wall:boolean[] = [true,true];
    private _idx:number;
    constructor(private _x:number,private _y:number,private _maze:Maze){
        this._idx = _y * _maze.width + _x;
        if(_x == _maze.width - 1){
            this._wall[Room.WALL_RIGHT] = false;
        }
        if(_y == _maze.height - 1){
            this._wall[Room.WALL_BOTTOM] = false;
        }
    }
    breakWall(wall:number){
        this._wall[wall] = false;
    }

    getIndex(): number {
        return this._idx;
    }    
    toString(): string {
        let b:string = (this._y == this._maze.height - 1 || this._wall[Room.WALL_BOTTOM])?'_':' ',
            r:string = (this._x == this._maze.width - 1 || this._wall[Room.WALL_RIGHT])?'|':' ',
            l:string = this._x == 0?'|':'';
        return l+b+r;
    }

    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }

    get wallRight(){
        return this._wall[Room.WALL_RIGHT];
    }
    get wallBottom(){
        return this._wall[Room.WALL_BOTTOM];
    }

}
export class Maze{
    private _roomList:Room[];
    private _startRoom:Room;
    private _endRoom:Room;
    private _uf:UnionFind<Room>;
    constructor(private _width:number,private _height:number = _width){
        this._roomList = new Array<Room>(_width * _height);
        this._uf = new ArrayUnionFind(_width * _height);
        this.each((w:number,h:number,idx:number)=>{
            let r = new Room(w,h,this);
            this._roomList[idx] = r;
            this._uf.add(r);
        });
        this._startRoom = this._roomList[0];
        this._endRoom = this._roomList[this._roomList.length - 1];
    }

    init(){
        while(!this._uf.test(this._startRoom,this._endRoom)){
            this.randBreakWall();
        }
        this.each((x:number,y:number,idx:number)=>{
            let room = this._roomList[idx];
            this.breakWall(room,Room.WALL_RIGHT);
            this.breakWall(room,Room.WALL_BOTTOM);
        });
    }
    private randBreakWall():boolean{
        let rnd = Math.floor(Math.random() * this._roomList.length);
        let room = this._roomList[rnd],
            wall = -1;
        if(room.wallBottom && room.wallRight){
            wall = Math.random() < 0.5 ? Room.WALL_RIGHT:Room.WALL_BOTTOM;
        }
        else if(room.wallBottom){
            wall = Room.WALL_BOTTOM;
        }
        else if(room.wallRight){
            wall = Room.WALL_RIGHT;
        }
        else{
            return false;
        }
        return this.breakWall(room,wall);
    }

    breakWall(room:Room,wall:number):boolean{
        let nRoom = this.getNeighborhood(room,wall);
        if(!nRoom)return false;
        if(this._uf.test(room,nRoom)){
            return false;
        }
        room.breakWall(wall);
        this._uf.union(room,nRoom);
        return true;
    }

    getNeighborhood(room:Room,wall:number):Room{
        let nIdx:number = 0;
        if(wall == Room.WALL_BOTTOM){
            if(room.y == this._height - 1)return null;
            nIdx = room.getIndex() + this._width;
        }
        else{
            if(room.x == this._width - 1)return null;
            nIdx = room.getIndex() + 1;
        }
        return this._roomList[nIdx];
    }
    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }

    print(){
        let arr:string[] = [];
        for(let i=0;i<this._width;i++){
            arr.push(i==0?' ':'_','_');
        }
        arr.push('\n')
        this.each((w:number,h:number,idx:number)=>{
            let r:Room = this._roomList[idx];
            arr.push(r.toString());
            if(w == this._width - 1){
                arr.push('\n');
            }
        });
        console.log(arr.join(''));
    }

    private each(fn:(w:number,h:number,idx:number)=>void){
        for(let h=0;h<this._height;h++){
            for(let w=0;w<this._width;w++){
                fn.call(this,w,h,h*this._width+w)
            }
        }
    }
}