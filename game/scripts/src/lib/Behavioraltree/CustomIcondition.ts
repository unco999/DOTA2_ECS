import { Behaviortree } from "./Behaviortree"

;
import { ICondition } from "./ICondition/ICondition";

export class CustomIcondition implements ICondition{
    $$$$Disposable = true

    constructor(execute:()=>boolean){
        this.execute = execute
    }

    execute(behaviorTree: Behaviortree): boolean {
        return true
    }
    
}
