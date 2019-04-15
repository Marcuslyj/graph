import utils from '../utils';
import {Comparable,UnionFind} from './collection';
import {ArrayHeap} from './heap';
import {MapUnionFind} from './union_find';
export const graphUtils = {
    /**
     * 判断一个顶点度的序列是否可图
     * 根据Havel-Hakimi定理
     * @param degArr 顶点度的序列
     */
    canGraph(degArr:number[],connectCb?:(startIdx:number,endIdx:number)=>void):boolean{
        type DIdx = {d:number,idx:number};
        let compareFn = function(a:DIdx,b:DIdx):number{ return b.d - a.d; }
        let cpArr:DIdx[] = degArr.map((d,idx)=>({d,idx}));
        for(let i=0;i<cpArr.length;i++){
            cpArr.sort(compareFn);
            let first = cpArr[i];
            for(let j=0;j<first.d;j++){
                let n = cpArr[i+j+1];
                if(n !== undefined){
                    cpArr[i+j+1].d = n.d-1;
                    connectCb && connectCb(first.idx,n.idx);
                }
            }
            let isAllZero = true;
            for(let k=i+1;k<cpArr.length;k++){
                if(cpArr[k].d < 0){
                    return false;
                }
                else if(cpArr[k].d != 0){
                    isAllZero = false;
                    break;
                }
            }
            if(isAllZero){
                return true;
            }
        }
        return false;
    },
    /**
     * 根据顶点度的序列构建无向图
     * @param degArr 
     */
    buildGraphByDegArr<T>(degArr:number[]):Graph<T>{
        if(!this.canGraph(degArr))return null;
        let graph:Graph<T> = new MatrixGraph();
        degArr.forEach((d,idx)=>graph.addVertex(idx));
        this.canGraph(degArr,function(startIdx:number,endIdx:number){
            graph.connect(startIdx,endIdx);
        });
        return graph;
    }
}
/**
 * 顶点度的类型
 */
export enum VertexDegType {
    /**
     * 全部度
     */
    ALL,
    /**
     * 入度
     */
    IN,
    /**
     * 出度
     */OUT
}
export type VertexName = string|number;
export type VertexWeight = {
    vertex:VertexName,
    weight:number
};
/**
 * @param path 当前的遍历路径
 * @returns 如果返回false，则终止遍历
 */
export type TraversalCallback = (path:VertexName[])=>boolean|undefined;
let vertexWeightCompareFn = function(a:VertexWeight,b:VertexWeight){
    if(isFinite(a.weight) && isFinite(b.weight)){
        return a.weight - b.weight;
    }
    else if(!isFinite(a.weight) && !isFinite(b.weight)){
        return 0;
    }
    else if(!isFinite(a.weight)){
        return 1;
    }
    else {
        return -1;
    }
}
class VertexEdgeWeight implements Comparable<VertexEdgeWeight>{
    constructor(public readonly a:VertexName,public readonly b:VertexName,public readonly weight:number){

    }
    compareTo(target: VertexEdgeWeight): number {
        return this.weight - target.weight;
    }    
    valueOf(): number {
        return this.weight;
    }
    toString(): string {
        return `${this.a}-${this.weight}-${this.b}`;
    }
}
export abstract class Graph<T>{
    protected _vertexNameSet:Set<VertexName> = new Set();
    abstract print():void;
    /**
     * 连接连个顶点
     * @param start开始顶点
     * @param end结束顶点
     * @param directed 是否有向默认false
     * @param weight 权重默认1
     */
    abstract connect(start:VertexName,end:VertexName,directed?:boolean,weight?:number):Graph<T>;
    /**
     * 获取已经连接的两点之间的距离
     * @param start 开始点
     * @param end 结束点
     * @returns 如果两点未连接，则返回Infinity
     */
    abstract getWeight(start:VertexName,end:VertexName):number;
    /**
     * 获取顶点的度
     * @param type 度的类型。默认为全部
     */
    abstract getDeg(name:VertexName,type?:VertexDegType):number;
    abstract getConnected(start:VertexName):VertexWeight[];
    /**
     * 根据名称添加顶点
     * @param names 名称
     */
    addVertexByNames(...names:VertexName[]):Graph<T>{
        names.forEach((n:VertexName)=>this.addVertex(n));
        return this;
    }
    /**
     * 添加一个顶点
     * @param name 顶点名称
     * @param data 数据
     */
    addVertex(name:VertexName,data:T = null):Graph<T>{
        this.doAddVertex(name,data);
        this._vertexNameSet.add(name);
        return this;
    }
    /**
     * 删除一个顶点
     * @param name 顶点名称
     */
    removeVertex(name:VertexName):Graph<T>{
        this._vertexNameSet.delete(name);
        this.doRemoveVertex(name);
        return this;
    }

    /**
     * 拓扑有序序列
     * 可以用来判断图是否有环
     * 对一个 AOV 网络进行拓扑排序的方法为： (1) 从AOV 网络中选择一个入度为 0（即没有直接前驱）的顶点并输出； (2) 从AOV 网络中删除该顶点及该顶点发出的所有边； (3) 重复步骤(1)和(2)，直至找不到入度为 0的顶点。 按照上面的方法进行拓扑排序，其结果有两种情形：第一种，所有的顶点都输出来了，也就 是整个拓扑排序完成了；第二种，仍有顶点没有输出，但剩下的图中再也没有入度为 0 的顶点， 拓扑排序不能再继续进行下去了，这就说明此图是有环图。 
     * @param isReverse 是否为逆拓扑排序 ，默认为false
     * @returns 拓扑排序后的顶点名称列表，无法拓扑排序则为null
     */
    topologicalOrderSequence(isReverse:boolean = false):VertexName[]{
        let arr:VertexName[] = [];
        let c = this.clone();
        while(true){
            let hasZero = false;
            for(const name of c._vertexNameSet){
                if(c.getDeg(name,isReverse?VertexDegType.OUT: VertexDegType.IN) == 0){
                    hasZero = true;
                    arr.push(name);
                    c.removeVertex(name);
                    break;
                }
            }
            if(!hasZero){
                if(c.order == 0){
                    return arr;
                }
                return null;
            }
        }
    }

    /**
     * 计算路径长度
     * @param path 顶点名称的路径
     */
    pathLength(path:VertexName[]):number{
        if(path.length < 2){
            throw new Error('Path must has at least 2 vertex name');
        }
        let sum = 0;
        for(let i=0;i<path.length-1;i++){
            let w = this.getWeight(path[i],path[i+1]);
            if(!isFinite(w)){
                return Infinity;
            }
            sum += w;
        }
        return sum;
    }

    /**
     * 求两个顶点的最长路径
     * @param start 开始点
     * @param end 结束点
     */
    longestPath(start:VertexName,end:VertexName):VertexName[]{
        return null;
    }

    /**
     * 获取有向有权图的关键路径
     */
    criticalPath():VertexName[]{
        let tos = this.topologicalOrderSequence();
        if(!tos)return null;
        return null;
    }

    /**
     * 深度优先遍历
     * @param start 开始位置
     */
    dft(start:VertexName,cb?:TraversalCallback):void{
        debugger;
        type StackItem = {
            curIdx:number,
            vertexList:VertexName[]
        };
        let mapper = function(i:VertexWeight){return i.vertex};
        let stack:StackItem[] = [{
            curIdx:0,
            vertexList:this.getConnected(start).map(mapper)
        }];
        while(stack.length){
            let curItem = stack[stack.length - 1];
            if(curItem.curIdx < curItem.vertexList.length){
                console.log(curItem.vertexList[curItem.curIdx]);
                let connected = this.getConnected(curItem.vertexList[curItem.curIdx]);
                if(connected && connected.length){
                    stack.push({
                        curIdx:0,
                        vertexList:connected.map(mapper)
                    })
                }
                curItem.curIdx++;
            }
            else{
                stack.pop();
            }
        }
    }
    /**
     * 广度优先遍历
     * @param start 开始位置
     */
    bft(start:VertexName,cb?:TraversalCallback):void{
    }

    /**
     * 克隆一个图
     */
    clone():Graph<T>{
        let c = this.doClone();
        utils.cloneSet(this._vertexNameSet,c._vertexNameSet);
        return c;
    }

    /**
     * 获取无向图的最小生成树
     */
    miniSpannirngTree():Graph<T>{
        let c = this.doClone(true);
        let heap:ArrayHeap<VertexEdgeWeight> = new ArrayHeap();
        let uf:UnionFind<VertexName> = new MapUnionFind();
        let names = Array.from<VertexName>(this._vertexNameSet);
        for(let i=0;i<names.length;i++){
            let startName = names[i];
            c.addVertex(startName);
            uf.add(startName);
            for(let j=i+1;j<names.length;j++){
                let endName = names[j];
                let w = this.getWeight(startName,endName);
                if(!isFinite(w))continue;
                heap.add(new VertexEdgeWeight(startName,endName,w));
            }
        }
        let curVEW:VertexEdgeWeight = null;
        while(curVEW = heap.removeMin()){
            if(uf.test(curVEW.a,curVEW.b)){
                continue;
            }
            uf.union(curVEW.a,curVEW.b);
            c.connect(curVEW.a,curVEW.b,false,curVEW.weight);
        }
        return c;
    }

    /**
     * 计算最短路径
     */
    shortestPath(start:VertexName,end:VertexName):VertexName[]{
        return this.shortestPath_dijkstra(start,end);
    }

    private shortestPath_dijkstra(start:VertexName,end:VertexName):VertexName[]{
        let s:Set<VertexName> = new Set();
        let pathPrev:Map<VertexName,VertexName> = new Map();
        let dist:Map<VertexName,number> = new Map();
        this._vertexNameSet.forEach((end)=>{
            if(start === end)return;
            s.add(end);
            dist.set(end,this.getWeight(start,end));
        });
        while(s.size){
            let minV:VertexName = null,
                minDist = Number.MAX_SAFE_INTEGER;
            s.forEach(function(n){
                let d = dist.get(n);
                if(d < minDist){
                    minDist = d;
                    minV = n;
                }
            });
            s.delete(minV);
            let connected = this.getConnected(minV);
            if(connected && connected.length){
                connected.forEach(function(cv){
                    let cvd = dist.get(cv.vertex),
                        newD = minDist + cv.weight;
                    if(newD < cvd){
                        dist.set(cv.vertex,newD);
                        pathPrev.set(cv.vertex,minV);
                    }
                });
            }
        }
        let ret:VertexName[] = [];
        let cur = end;
        while(cur){
            ret.unshift(cur);
            cur = pathPrev.get(cur);
        }
        ret.unshift(start);
        return ret;
    }

    /**
     * @readonly
     * 获取图的阶（顶点个数）
     */
    get order():number{
        return this._vertexNameSet.size;
    }

    protected abstract doAddVertex(name:VertexName,data:T):void;
    protected abstract doRemoveVertex(name:VertexName):void;
    protected abstract doClone(onlyInstance?:boolean):Graph<T>;
}
/**
 * 邻接表图
 */
//export class ListGraph<T> implements Graph<T>{ }
/**
 * 邻接矩阵图
 */
export class MatrixGraph<T> extends Graph<T>{
    private _dataMap:Map<string,T>;
    private _vertexIdxMap:Map<VertexName,number> = new Map();
    private _edgeMatrix:number[][] = [];
    getConnected(start: VertexName): VertexWeight[] {
        let arr:VertexWeight[] = [];
        let startIdx = this.getVertexIdxByName(start);
        this._vertexIdxMap.forEach((endIdx,end)=>{
            if(start === end)return;
            let w = this._edgeMatrix[startIdx][endIdx];
            if(w){
                arr.push({
                    vertex:end,
                    weight:w
                });
            }
        });
        return arr;
    }
    getWeight(start: VertexName, end: VertexName): number {
        if(start === end)return 0;
        let startIdx = this.getVertexIdxByName(start),
            endIdx = this.getVertexIdxByName(end);
        let w = this._edgeMatrix[startIdx][endIdx];
        return w || Infinity;
    }
    getDeg(name:VertexName,type: VertexDegType = VertexDegType.ALL): number {
        let d = 0,
            idx = this.getVertexIdxByName(name);
        if(type == VertexDegType.ALL || type == VertexDegType.OUT){
            let wArr = this._edgeMatrix[idx];
            wArr.forEach(function(w:number){
                if(w){
                    d++;
                }
            });
        }
        if(type == VertexDegType.ALL || type == VertexDegType.IN){
            this._edgeMatrix.forEach(function(wArr:number[]){
                let w = wArr[idx];
                if(w){
                    d++;
                }
            });
        }
        return d;
    }

    protected doAddVertex(name: VertexName, data: T = null): void {
        if(data && !this._dataMap){
            this._dataMap = new Map();
        }
        this._vertexIdxMap.set(name,this._edgeMatrix.length);
        this._edgeMatrix.push([]);
    }    
    protected doRemoveVertex(name:VertexName):void{
        let idx = this.getVertexIdxByName(name);
        this._vertexIdxMap.delete(name);
        //更新idx索引
        this._vertexIdxMap.forEach(function(value:number,key:VertexName,map:Map<VertexName,number>){
            if(value > idx){
                map.set(key,value - 1);
            }
        });
        this._edgeMatrix.splice(idx,1);
        this._edgeMatrix.forEach(function(edgeArr:number[]){
            edgeArr.splice(idx,1);
        });
    }
    print(space:number = 8): void {
        let names = Array.from(this._vertexIdxMap.keys()),
            edgeCount = 0;
        names.sort((a:VertexName,b:VertexName)=>{
            return this._vertexIdxMap.get(a) - this._vertexIdxMap.get(b);
        });
        let arr:string[] = [utils.spaceFill('\\',space)];
        names.forEach((n:VertexName)=>arr.push(utils.spaceFill(n,space)));
        arr.push('\n');
        names.forEach((n:VertexName,idx:number)=>{
            arr.push(utils.spaceFill(n,space));
            let wArr = this._edgeMatrix[idx];
            names.forEach(function(n2:VertexName,idx2:number){
                let w = wArr[idx2];
                if(idx2 == idx){
                    arr.push(utils.spaceFill(0,space));
                }
                else if(w === undefined){
                    arr.push(utils.spaceFill('MAX',space));
                }
                else{
                    arr.push(utils.spaceFill(w,space));
                    edgeCount++;
                }
            });
            arr.push('\n');
        });
        console.log('Matrix Graph VertexCount =',names.length,'EdgeCount =',edgeCount);
        console.log(arr.join(''));
    }
    connect(startVertexName: VertexName, endVertaxName: VertexName, directed: boolean = false, weight:number=1): MatrixGraph<T> {
        if(weight < 1){
            throw new Error('Weight must greater than 0');
        }
        let startIdx = this.getVertexIdxByName(startVertexName),
            endIdx = this.getVertexIdxByName(endVertaxName);
        this._edgeMatrix[startIdx][endIdx] = weight;
        if(!directed){
            this._edgeMatrix[endIdx][startIdx] = weight;
        }
        return this;
    }
    protected doClone(onlyInstance:boolean = false):MatrixGraph<T>{
        let c = new MatrixGraph<T>();
        if(onlyInstance)return c;
        utils.cloneMap(this._vertexIdxMap,c._vertexIdxMap);
        if(this._dataMap){
            c._dataMap = utils.cloneMap(this._dataMap);
        }
        c._edgeMatrix = this._edgeMatrix.map(function(wArr:number[]){
            return wArr.map((n:number)=>n);
        });
        return c;
    }
    private getVertexIdxByName(name:VertexName):number{
        let idx = this._vertexIdxMap.get(name);
        if(idx === undefined){
            throw new Error(`No vertex named "${name}"`);
        }
        return idx;
    }
}
/**
 * 链表图
 */
//export class LinkedGraph<T> implements Graph<T>{ }