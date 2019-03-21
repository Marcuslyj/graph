class SortedArray extends Array{
    constructor(compareFn){
        super();
        this.compareFn = compareFn || function(a,b){return a-b};
    }
    push(item){
        let i=0;
        for(;i<this.length;i++){
            let posItem = this[i];
            if(this.compareFn(posItem,item) > 0){
                break;
            }
        }
        this.splice(i,0,item);
    }
}
class Item {
    constructor(content,weight){
        this._weight = weight;
        this._content = content;
    }

    getWeight(){
        return this._weight;
    }

    isNode(){
        return false;
    }
    
    toString(){
        return `{${this._content}=${this._weight}}`;
    }
}
class Node extends Item{
    constructor(content = null,weight = 0){
        super(content,weight);
        this._leftSub = null;
        this._rightSub = null;
    }

    isVirtual(){
        return this._content === null;
    }

    isNode(){
        return true;
    }

    getWeight(){
        if(this._content !== null){
            return this._weight;
        }
        if(this._calcWeight){
            return this._calcWeight;
        }
        let w = 0;
        if(this._leftSub){
            w += this._leftSub.getWeight();
        }
        if(this._rightSub){
            w += this._rightSub.getWeight();
        }
        this._calcWeight = w;
        return w;
    }
}

let calcWeight = function(str){
    let countMap = {};
    for(let i=0,len=str.length;i<len;i++){
        let c = str.charAt(i);
        if(countMap[c]){
            countMap[c]++;
        }
        else{
            countMap[c] = 1;
        }
    }
    return countMap;
}

let main = function(){
    let str = 'abcdefjsimsndhakjasdnjashduibkajnsdjhkalksjiowensmsjtusiskltoioijskdfjkhiusdnnbdfjyiwerkjhkasflaksjdoi';
    let weightResult = calcWeight(str);
    let sortedArray = new SortedArray(function(a,b){
        return a.getWeight() - b.getWeight();
    });
    for(let k in weightResult){
        let item = new Item(k,weightResult[k]);
        sortedArray.push(item);
    }
    console.log(sortedArray.join(','));
}
main();