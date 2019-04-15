import utils from '../utils';
import {Queue,Weight,Tree,UnionFind} from './collection';
import {ArrayHeap} from './heap';
import {BinarySearchTree,RBTree} from './tree';
import {ArrayUnionFind,Maze,MapUnionFind} from './union_find';
import {JumpList} from './jump_list';
import {Graph,MatrixGraph,VertexDegType, graphUtils} from './graph';
let testArrayHeap = function(){
    let data:number[] = [31,32,26,65,68,19,21,19,14,16,13];
    let heap:Queue<Weight> = new ArrayHeap<Weight>(16);
    data.forEach(function(n:number){
        heap.add(Weight.from(n));
    });
    heap.print();
    let min:Weight;
    while(min = heap.removeMin()){
        console.log(min.toString());
    }
    console.log('_|_|\n____\n  __')
}
let testBST = function(){
    let data:number[] =
            //[8,1,4,7,3,5,11,8,3,4,5,2,6,8,9],
            utils.randNumArr(50),
        tests:number[] = [3,9],
        tree:Tree<Weight> = new BinarySearchTree<Weight>();
    data.forEach((d:number)=>{tree.add(Weight.from(d))});
    console.log(data.join(','))
    tree.print();
    tree.remove(Weight.from(4));
    tree.print();
    tests.forEach(function(d:number){
        console.log(d,tree.contains(Weight.from(d)));
    });
    console.log('max',tree.findMax().toString());
    console.log('min',tree.findMin().toString());

}

let testRBTree = function(){
    let data:number[] =
            [8,1,4,7,3,5,11,8,3,4,5,2,6,8,9],
            //utils.randNumArr(50),
        tests:number[] = [3,9],
        tree:Tree<Weight> = new RBTree<Weight>();
    data.forEach((d:number)=>{
        debugger;
        tree.add(Weight.from(d));
        tree.print();
    });
}

let testUnionFind = function(){
    let data:number[] = [1,3,5,7,2,4,6,8],
        uf:UnionFind<Weight> = new ArrayUnionFind<Weight>();
    data.forEach((d:number)=>{uf.add(Weight.from(d))});
    debugger;
    uf.union(Weight.from(1),Weight.from(3));
    uf.union(Weight.from(3),Weight.from(5));
    debugger;
    uf.union(Weight.from(5),Weight.from(7));
    console.log(uf.test(Weight.from(1),Weight.from(7)));
    console.log(uf.test(Weight.from(2),Weight.from(7)));
    uf.print();
}

let testMapUnionFind = function(){
    let uf:UnionFind<number> = new MapUnionFind();
    let data:number[] = [1,3,5,7,2,4,6,8];
    data.forEach(n=>uf.add(n));
    uf.union(1,3);
    uf.union(3,5);
    uf.union(5,7);
    uf.union(2,4);
    uf.union(4,6);
    uf.union(6,8);
    console.log(uf.test(1,3),uf.test(1,2));
    uf.union(1,2);
    console.log(uf.test(7,8),uf.test(1,4));
    uf.print();
}

let testMaze = function(){
    const SIZE = 15;
    let maze:Maze = new Maze(SIZE*2,SIZE);
    maze.init();
    maze.print();
}

let testJumpList = function(){
    const N = 100000;
    let data:number[] = //[1,3,5,7,2,4,6,8];
        utils.randNumArr(N,0,N);
        //[2,1,2];
    //console.log(data.join(','))
    let jl = new JumpList<Weight>();
    data.forEach(function(d:number){
        jl.add(Weight.from(d));
    })
    //jl.print();
    let w = Weight.from(data[0]);
    Weight.startCompareCounting();
    let d = jl.contains(w);
    Weight.endCompareCounting();
    console.log('Log(N) =',Math.log2(jl.size()))
    console.log('delete',w.toString(),d);
    //jl.print();
}

let testGraphSample = function(){
    let graph:Graph<null> = new MatrixGraph();
    graph.addVertex('a')
        .addVertex('b')
        .addVertex('c')
        .addVertex('d')
        .addVertex('e');
    graph.connect('a','b',true)
        .connect('a','c',true)
        .connect('b','d',true)
        .connect('c','d',true)
        .connect('c','e',true)
        .connect('d','e',true);
    graph.connect('e','a',true);
    graph.print();
    console.log(graph.topologicalOrderSequence());
    console.log(graph.pathLength(['a','b','d','e']));
}
let testGraphAOE = function(){
    let graph:Graph<null> = new MatrixGraph();
    graph.addVertexByNames(0,1,2,3,4,5,6,7,8);
    graph
        .connect(0,1,true,6)
        .connect(0,2,true,4)
        .connect(0,3,true,5)
        .connect(1,4,true,1)
        .connect(2,4,true,1)
        .connect(3,5,true,2)
        .connect(4,6,true,9)
        .connect(4,7,true,7)
        .connect(5,7,true,4)
        .connect(6,8,true,2)
        .connect(7,8,true,4);
    graph.print();
    console.log(graph.topologicalOrderSequence().join(','));
}

let testBuildGraphByDeg = function(){
    let degArr = [4,3,1,5,4,2,1];
    if(graphUtils.canGraph(degArr)){
        let graph:Graph<null> = graphUtils.buildGraphByDegArr(degArr);
        graph.print();
    }
    else{
        console.log('Can not graph');
    }
}

let testMST = function(){
    let graph:Graph<null> = new MatrixGraph();
    graph.addVertexByNames(1,2,3,4,5,6,7);
    graph
        .connect(1,2,false,28)
        .connect(2,3,false,16)
        .connect(3,4,false,12)
        .connect(4,5,false,22)
        .connect(5,6,false,25)
        .connect(6,1,false,10)
        .connect(2,7,false,14)
        .connect(5,7,false,24)
        .connect(4,7,false,18);
    graph.print();
    let mst = graph.miniSpannirngTree();
    mst.print();
}

let testShortestPath = function(){
    let graph:Graph<null> = new MatrixGraph();
    graph.addVertexByNames(0,1,2,3,4,5,6);
    graph
        .connect(0,1,true,2)
        .connect(0,2,true,1)
        .connect(1,3,true,1)
        .connect(2,4,true,2)
        .connect(2,5,true,1)
        .connect(3,6,true,1)
        .connect(4,6,true,2)
        .connect(5,6,true,3);
    let s = graph.shortestPath(0,6);
    console.log('Shortest:',s && s.join(','));
    graph.dft(0);
}
//let init = testBST;
//let init = testUnionFind;
//let init = testJumpList;
//let init = testGraphAOE;
//let init = testBuildGraphByDeg;
//let init = testGraphSample;
//let init = testMapUnionFind;
//let init = testMST;
let init = testShortestPath;
init();