import {Graph,graphUtils, MatrixGraph} from './graph';

/**
 * 叠图片
 * 多张图片叠在一起，判断叠放顺序
 */
let e2_9 = function(){
    const P_COUNT = 10,
        P_WIDTH = 8,
        P_HEIGHT = 8;
    class Pic{
        bitmap:string[];
        constructor(public readonly bitStr:string = null){
            this.bitmap = new Array<string>(P_WIDTH * P_HEIGHT);
            if(bitStr){
                this.randomInit();
            }
        }

        private randomInit(){
            let n = Math.max(Math.floor(this.bitmap.length * Math.random()/2),5);
            for(let i=0;i<n;i++ ){
                this.bitmap[Math.floor(this.bitmap.length * Math.random())] = this.bitStr;
            }
        }

        print(){
            let arr:string[] = ['┌'];
            for(let w=0;w<P_WIDTH;w++){
                arr.push('─');
            }
            arr.push('┐\n');
            for(let h=0;h<P_HEIGHT;h++){
                arr.push('│');
                for(let w=0;w<P_WIDTH;w++){
                    arr.push(this.bitmap[P_WIDTH*h+w]||' ');
                }
                arr.push('│\n');
            }
            arr.push('└')
            for(let w=0;w<P_WIDTH;w++){
                arr.push('─');
            }
            arr.push('┘')
 
            console.log(arr.join(''));
        }

        drawTo(pic:Pic){
            this.bitmap.forEach(function(bitStr,idx){
                if(bitStr){
                    pic.bitmap[idx] = bitStr;
                }
            });
        }
    }
    let getOrder = function(target:Pic,sources:Pic[]):any[]{
        let graph:Graph<null> = new MatrixGraph();
        sources.forEach(p=>graph.addVertex(p.bitStr));
        sources.forEach(function(p){
            p.bitmap.forEach(function(str,idx){
                let targetStr = target.bitmap[idx];
                if(str && str != targetStr){
                    graph.connect(str,targetStr,true);
                }
            });
        });
        return graph.topologicalOrderSequence();
    }
    let target = new Pic(),
        sources:Pic[] = [],
        pStrArr:string[] = [],
        trueOrder:string[] = [];
    for(let i=0;i<P_COUNT;i++){
        pStrArr.push(String.fromCharCode(i+65));
    }
    while(pStrArr.length){
        let tmp = pStrArr.splice(Math.floor(pStrArr.length*Math.random()),1);
        trueOrder.push(tmp[0])
        let p = new Pic(tmp[0]);
        sources.push(p);
        p.print();
        p.drawTo(target);
    }
    target.print();
    let guessOrder = getOrder(target,sources)
    console.log(trueOrder.join(','),'=>',guessOrder && guessOrder.join(','));
}

let e = e2_9;
e();