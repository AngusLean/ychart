class quene{
    constructor(maxsize = 50){
        this._quene = [];
        this.maxsize = maxsize;
        this.top = 1;
    }
    push(ele){
        this.top += 1;
        this._quene.length < this.maxsize ?
            this._quene.push(ele):
            (this._quene.shift() && this._quene.push(ele));
    }
    get(ele){
        return this._quene[ele];
    }
    last(){
        return this._quene[this.top];
    }
}

export default quene;
