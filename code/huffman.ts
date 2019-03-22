/**
 * 霍夫曼编码的ts版本
 * 主要用来演示霍夫曼编码的思想，而非追求编解码的效率
 * 因此采用较多的面向对象写法，方便理解
 * 同事压缩后的编码应该采用位存储，但为了方便调试和理解，这里采用字符串存储
 */
/**
 * 用函数把代码包裹起来，方便后面用这段代码（codeWrapper.toString()）进行压缩测试
 */
let codeWrapper = function(){
    /**
     * 比较函数
     */
    type CompareFn = (a:any,b:any)=>number;
    /**
     * kv字典
     */
    type Dic = {
        [index:string] : string;
    };
    /**
     * 排序数组
     * 根据比较函数，每次push的时候对元素进行排序
     */
    class SortedArray<T> extends Array{
        private compareFn:CompareFn;
        constructor(compareFn:CompareFn){
            super();
            this.compareFn = compareFn || function(a:any,b:any){
                return a-b
            };
        }
        /**
         * 对Array.prototype.push进行重写，保证数组有序
         * 只能通过push函数添加元素
         */
        push(...items:T[]):number{
            items.forEach((item:T)=>{
                let i=0;
                for(;i<this.length;i++){
                    let posItem = this[i];
                    if(this.compareFn(posItem,item) > 0){
                        break;
                    }
                }
                this.splice(i,0,item);
            });
            return this.length;
        }
    }
    /**
     * 对接点的封装，通过接点构建霍夫曼树
     */
    class NodeItem{
        /**
         * 节点的比较函数，比较权重值
         */
        static compare(a:NodeItem,b:NodeItem):number {
            return a.getWeight() - b.getWeight();
        };
        /**
         * 节点内容
         */
        public content:string;
        /**
         * 节点权重
         */
        public weight:number;
        /**
         * 左子节点
         */
        private leftSub:NodeItem;
        /**
         * 又子节点
         */
        private rightSub:NodeItem;
        /**
         * 父节点
         */
        private parentNode:NodeItem;
        /**
         * 虚拟节点缓存权重结果
         */
        private calcWeight:number;
        constructor(weight:number = 0,content:any = null){
            this.content = content;
            this.weight = weight;
        }
        setLeft(leftSub:NodeItem){
            this.leftSub = leftSub;
            leftSub.parentNode = this;
        }
        setRight(rightSub:NodeItem){
            this.rightSub = rightSub;
            rightSub.parentNode = this;
        }
        /**
         * 计算权重，如果是内容节点，则直接返回权重值
         * 否则是两个子节点的权重值求和
         */
        getWeight():number{
            if(this.content !== null){
                return this.weight;
            }
            if(this.calcWeight){
                return this.calcWeight;
            }
            let w = 0;
            if(this.leftSub){
                w += this.leftSub.getWeight();
            }
            if(this.rightSub){
                w += this.rightSub.getWeight();
            }
            this.calcWeight = w;
            return w;
        }
        /**
         * 计算路径的值，根据霍夫曼编码的描述，如果是左节点，返回0，否则返回1
         */
        getValue():number{
            if(this.parentNode == null){
                return -1;
            }
            if(this == this.parentNode.leftSub){
                return 0;
            }
            return 1;
        }
        /**
         * 计算最终值，从根节点到当前节点的路径以此求值然后合并
         */
        getValues():number[]{
            let values:number[] = [];
            let cur:NodeItem = this;
            while(cur){
                let v = cur.getValue();
                if(v != -1){
                    values.unshift(v)
                }
                cur = cur.parentNode;
            }
            return values;
        }
        toString():string{
            return `N{${this.getWeight()}${this.content?`:${this.content}`:'V'}}`;
        }
    }

    /**
     * 计算要编码的字符串中每个字符的权重
     * @param str 要编码的字符串
     * @returns 返回按权重排序后的节点列表
     */
    let calcWeight = function(str:string):SortedArray<NodeItem>{
        let countMap:{[i:string]:number} = {};
        //计算每个字符的出现顺序
        for(let i=0,len=str.length;i<len;i++){
            let c = str.charAt(i);
            if(countMap[c]){
                countMap[c] ++;
            }
            else{
                countMap[c] = 1;
            }
        }
        let sortedArray = new SortedArray<NodeItem>(NodeItem.compare);
        for(let key in countMap){
            sortedArray.push(new NodeItem(countMap[key],key));
        }
        return sortedArray;
    }

    /**
     * 根据排序后的节点列表构建kv字典
     * key为字符串 value为二进制编码的字符串表示
     * @param sortedArray 排序后的节点列表
     */
    let buildDic = function(sortedArray:SortedArray<NodeItem>):Dic{
        let dic:Dic = {};
        let rootNode:NodeItem;
        //复制一份叶子节点列表
        let items = sortedArray.map(i=>i);
        //循环执行构建树的逻辑
        while(sortedArray.length){
            //取出最小的两个节点
            let aNode = sortedArray.shift(),
                bNode = sortedArray.shift(),
                leftNode = aNode,
                rightNode = bNode;
            //权重小的为左节点
            if(NodeItem.compare(aNode,bNode) > 0){
                leftNode = bNode;
                rightNode = aNode;
            }
            //构建父节点，
            let pNode = new NodeItem();
            pNode.setLeft(leftNode);
            pNode.setRight(rightNode);
            //如果列表中还有节点，就将父节点放入列表，准备下一次循环
            if(sortedArray.length > 0){
                sortedArray.push(pNode);
            }
            rootNode = pNode;
        }
        items.forEach(function(i:NodeItem){
            dic[i.content] = i.getValues().join('');
        });
        return dic;
    }

    /**
     * 根据字典进行编码
     */
    let encode = function(str:string,dic:Dic){
        let result:string[] = [];
        for(let i=0,len=str.length;i<len;i++){
            let c = str.charAt(i);
            result.push(dic[c]);
        }
        return result.join('');
    }

    /**
     * 根据字典进行解码
     */
    let decode = function(code:string,dic:Dic){
        let reserveDic:Dic = {};
        //将字典的key和value反转
        for(let key in dic){
            reserveDic[dic[key]] = key;
        }
        //逐位（这里是字符）读取编码，跟反转后的字典对比，如果匹配则输出字符
        let startIdx = 0,
            result:string[] = [];
        for(let i=0,len=code.length;i<len;i++){
            let codeFreg = code.substring(startIdx,i+1);
            if(reserveDic[codeFreg]){
                result.push(reserveDic[codeFreg]);
                startIdx = i+1;
            }
        }
        return result.join('');
    }
    /**
     * 简单计算字符串位长度，charCode > 255按16计算，否则算8
     */
    let strBitLength = function(str:string){
        let result = 0;
        for(let i=0,len=str.length;i<len;i++){
            result += str.charCodeAt(i) > 255 ? 16 : 8;
        }
        return result;
    }
    let main = function(){
        //用任意字符串作为输入，重复的字符串越多压缩效率越高
        //let str = 'abcdefghijklmnopqrstaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        //引用文章中的示例
        //let str = 'CAEBDBCAAACBABD'
        //当前的代码作为输入，模拟一般的代码文本压缩
        let str = codeWrapper.toString();
        let sortedArray = calcWeight(str);
        let dic = buildDic(sortedArray);
        let code = encode(str,dic);
        //console.log('code =',code);//要查看压缩后的编码，打开这个注释
        let bitLen = strBitLength(str)
        console.log(`bytes length ${bitLen}=>${code.length}, compressed ${(1-code.length/bitLen).toFixed(2)}%`);
        let result = decode(code,dic);
        console.log('decode success =',result == str);
        //console.log('result =',result);//要查看解码后的内容，打开这个注释
    }
    return main;
}

codeWrapper()();