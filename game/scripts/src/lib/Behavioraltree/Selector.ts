import { Behaviortree } from "./Behaviortree";
import { BtNode, Result } from "./BtNode";
import { Composite } from "./Composite";

export class Selector extends Composite{

    
    constructor(t:Behaviortree,name:string){
        super(t,name)
    }
    public async Evaluate(): Promise<Result>  {
        for await( const node of this.childs){
            switch(await node.tick()){
                case Result.失败:{
                    break
                }
                case Result.成功:{
                    this.nodeState = Result.成功
                    return this.nodeState
                }
                default:{
                    break;
                }
            }
        }
        this.nodeState = Result.失败
        return this.nodeState
    }
}