import { Behaviortree } from "../Behaviortree";

export interface ICondition{
    $$$$Disposable:boolean
    execute(behaviorTree:Behaviortree):boolean
}