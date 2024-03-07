import { Behaviortree } from "./Behaviortree";
import { BtNode, Result } from "./BtNode";

export class Inverter extends BtNode{
    public child:BtNode
    
    constructor(t:Behaviortree,name:string){
        super(t,name)
    }

    public async Evaluate(): Promise<Result>  {
            switch(await this.child.tick()){
                case Result.失败:{
                    this.nodeState = Result.成功
                    return this.nodeState
                }
                case Result.成功:{
                    print("逆转失败")
                    this.nodeState = Result.失败
                    return this.nodeState
                }
                default:{
                    break;
                }
            }
        return this.nodeState
    }
}