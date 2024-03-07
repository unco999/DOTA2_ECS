import { Behaviortree } from "./Behaviortree";
import { BtNode, Result } from "./BtNode";

export class Decorrator extends BtNode{
    
    private _child : BtNode;
    public get child() : BtNode {
        return this._child;
    }
    public set child(v : BtNode) {
        this._child = v;
    }
    

    constructor(t:Behaviortree,name:string){
        super(t,name)
    }
    
    public Evaluate(): Promise<Result>  {
        throw new Error("Method not implemented.");
    }

}