import { Behaviortree } from "./Behaviortree";
import { BtNode, Result } from "./BtNode";

export class Composite extends BtNode{
    
    private _childs : BtNode[] = [];
    public get childs() : BtNode[] {
        return this._childs;
    }
    public set childs(v : BtNode[]) {
        this._childs = v;
    }
    

    constructor(t:Behaviortree,name:string){
        super(t,name)
    }

    addChild(...args:BtNode[]){
        args.forEach(value=>{
            this.childs.push(value)
        })
    }

    removeChildren(child:BtNode){
        this._childs = this.childs.filter(elm=>elm != child)
    }

    NextRemove(){
        this._childs = this.childs.filter(elm=>elm["next_remove"] != true)
    }

    public Evaluate(): Promise<Result> {
        throw new Error("Method not implemented.");
    }

}