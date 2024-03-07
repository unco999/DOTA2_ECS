import { Behaviortree } from "./Behaviortree";
import { Result } from "./BtNode";
import { Composite } from "./Composite";

export class WeightSelector extends Composite{
    
    constructor(t:Behaviortree,name:string){
        super(t,name)
    }

    public async Evaluate(): Promise<Result>  {
        const childs = this.childs.sort((a,b)=>a.weight - b.weight)
        for await( const node of childs){
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