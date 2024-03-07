import { Behaviortree } from "../Behaviortree";
import { ConditionComposite } from "./ConditionComposite";
import { ICondition } from "./ICondition";

export class InverterCondition implements ICondition{
    $$$$Disposable = false;
    Condition:ICondition

    constructor(Icondition:ICondition){
        this.Condition = Icondition
    }

    setCondition(Icondition:ICondition){
        this.Condition = Icondition
    }

    execute(t:Behaviortree): boolean {
        return !this.Condition.execute(t)
    }
}