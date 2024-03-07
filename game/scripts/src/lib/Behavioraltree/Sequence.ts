import { Behaviortree } from "./Behaviortree";
import { BtNode, Result } from "./BtNode";
import { Composite } from "./Composite";

export class Sequence extends Composite{
    
    constructor(t:Behaviortree,name:string){
        super(t,name)
    }

    public async Evaluate(): Promise<Result>  {
        let isAnyNodeRuning = true
        for await( const node of this.childs){
            switch(await node.tick()){
                case Result.失败:{
                    this.nodeState = Result.失败
                    return this.nodeState
                }
                case Result.成功:{
                    continue;
                }
                default:{
                    break;
                }
            }
        }
        this.nodeState = isAnyNodeRuning ? Result.成功 : Result.失败
        return this.nodeState
    }
}