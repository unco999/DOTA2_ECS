import { Behaviortree } from "../Behaviortree";
import { ConditionComposite } from "./ConditionComposite";

export class ConditionSequence extends ConditionComposite{

    constructor(){
        super()
    }

    execute(t:Behaviortree): boolean {
        const len = this.chidren.length
        for(let i = 0 ; i < len ; i ++){
           const _node = this.chidren[i]
           if(!_node.execute(t)){
                return false
           }
        }
        return true
    }
}