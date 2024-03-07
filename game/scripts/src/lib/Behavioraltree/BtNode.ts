import { Behaviortree } from "./Behaviortree";
import { ICondition } from "./ICondition/ICondition";

export enum Result {
    运行,
    成功,
    失败
}

export abstract class BtNode{
    private name:string

    private timeOut:number = 60

    private next_remove = false
    
    
    private _interval : number = 3;

    public get interval() : number {
        return this._interval;
    }

    public set interval(v : number) {
        this._interval = v;
    }
    
    
    private _behaviorTree : Behaviortree;
    public get behaviorTree() : Behaviortree {
        return this._behaviorTree;
    }
    public set behaviorTree(v : Behaviortree) {
        this._behaviorTree = v;
    }
    

    private _nodeState : Result;

    public get nodeState() : Result {
        return this._nodeState;
    }
    public set nodeState(v : Result) {
        this._nodeState = v;
    }

    
    private _weight : number;
    public get weight() : number {
        return this._weight;
    }
    public set weight(v : number) {
        this._weight = v;
    }
    
    /**
     * 进入条件  满足条件才允许运行
     */
    private _condition : ICondition;
    public get condition() : ICondition {
        return this._condition;
    }
    public set condition(v : ICondition) {
        this._condition = v;
    }
    
    /**退出条件 
     * 退出条件指的是运行完动作才会检测的条件  当条件满足  马上退出  不再次循环
    */
    private _exitcondition : ICondition;
    public get exitcondition() : ICondition {
        return this._exitcondition;
    }
    public set exitcondition(v : ICondition) {
        this._exitcondition = v;
    }

    /**中断条件 
     * 中断条件是单独的一个计时器 一旦条件满足  马上中断该节点promise所有操作
     * */    
    private _stopcondition : ICondition;
    public get stopcondition() : ICondition {
        return this._stopcondition;
    }
    public set stopcondition(v : ICondition) {
        this._stopcondition = v;
    }

    /**异步中断器 检查是否条件已经达到*/
    asyncStop():Promise<Result>{
        return new Promise((res,rej)=>{
            if(this._stopcondition)
            this._behaviorTree.StartTimer(0,()=>{
                if(this.stopcondition.execute(this._behaviorTree)){
                    print("检测到失败了")
                    res(Result.失败)
                    return 
                }
                return 0.5
            })
        })
    }
    
    

    private preCondition(){
        if(this.condition){
            if(this.condition.$$$$Disposable == true){
                this.next_remove = true
            }
            return this.condition.execute(this.behaviorTree)
        }
        return true
    }

    public async tick(){
        print(`[btnode] ${this.name} tick`)
        if(!this.preCondition()){
            return Result.失败
        }
        return await this.Evaluate()
    }

    public Evaluate():Promise<Result>{
        return ;
    };

    constructor(t:Behaviortree,name:string){
        this.behaviorTree = t
        this.name = name
    }
    
}