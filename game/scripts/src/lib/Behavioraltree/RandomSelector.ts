import { Behaviortree } from "./Behaviortree";
import { BtNode, Result } from "./BtNode";
import { Composite } from "./Composite";

export class RandomSelector extends Composite{

    
    constructor(t:Behaviortree,name:string){
        super(t,name)
    }
    public async Evaluate(): Promise<Result>  {
        const shuffe = table.shuffle(this.childs) as BtNode[]
        for await( const node of shuffe){
            const value = await node.tick()
            switch(value){
                case Result.失败:{
                    break;
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