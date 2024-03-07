import { Behaviortree } from "../Behaviortree";
import { ICondition } from "./ICondition";

export class ConditionComposite implements ICondition{
    $$$$Disposable = false;
    protected chidren:ICondition[] = []

    constructor(){

    }

    public addChidren(...args:ICondition[]){
        args.forEach(value=>{
            this.chidren.push(value)
        })
        return this
    }

    execute(t:Behaviortree): boolean {
        return true
    }
}