import {Graph,graphUtils, MatrixGraph} from './graph';

/**
 * 根据图的阶（order），和度的序列，判断是否可图，如果可图，构建图
 */
let e1_2 = function(){
    let test = {
        order:7,
        degList : [4,3,1,5,4,2,1]
    };
    let canGraph = graphUtils.canGraph(test.degList);
    console.log('canGraph',canGraph);
    if(canGraph){
        let graph:Graph<null> = new MatrixGraph();
        for(let i=0;i<test.order;i++){
            graph.addVertex(i);
        }
        let curIdx = 0;
        while(true){
            debugger;
            test.degList.sort(function(a,b){return b-a});
            let first = test.degList.shift();
            console.log(first,test.degList.join(','));
            for(let i=0;i<first;i++){
                console.log(curIdx,curIdx+i+1);
                graph.connect(curIdx,curIdx+i+1)
                test.degList[i]--;
            }
            if(!test.degList.find(i=>i!=0)){
                break;
            }
            curIdx++;
        }
        graph.print();
    }
}

let e = e1_2;
e();