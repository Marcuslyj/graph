import utils from '../utils';
import {Queue,Weight,Tree,UnionFind} from './collection';
import {ArrayHeap} from './heap';
import {BinarySearchTree} from './binary_search_tree';
import {ArrayUnionFind,Maze} from './union_find';
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

let testMaze = function(){
    const SIZE = 15;
    let maze:Maze = new Maze(SIZE*2,SIZE);
    maze.init();
    maze.print();
}

//let init = testBST;
//let init = testUnionFind;
let init = testMaze;
init();