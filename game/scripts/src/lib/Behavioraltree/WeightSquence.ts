import { Behaviortree } from "./Behaviortree";
import { Result } from "./BtNode";
import { Composite } from "./Composite";

export class WeightSquence extends Composite{
    
    constructor(t:Behaviortree,name:string){
        super(t,name)
    }

    public async Evaluate(): Promise<Result>  {
        const childs = this.childs.sort((a,b)=>a.weight - b.weight + RandomFloat(0,0.5))
        for await( const node of childs){
            switch(await node.tick()){
                case Result.成功:{
                    break
                }
                case Result.失败:{
                    this.nodeState = Result.失败
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