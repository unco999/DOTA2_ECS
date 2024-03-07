import { BtNode, Result } from "./BtNode";

export class Behaviortree {

    m_npc:CDOTA_BaseNPC
    private _root: BtNode;

    public BLACKBOARD: Record<string,any> = {} as any;

    public get root(): BtNode {
        return this._root;
    }
    public set root(v: BtNode) {
        this._root = v;
    }

    private _currentNode : string;
    public get currentNode() : string {
        return this._currentNode;
    }
    public set currentNode(v : string) {
        this._currentNode = v;
    }

    
    private _loop : Function;
    public get loop() : Function {
        return this._loop;
    }
    public set loop(v : Function) {
        this._loop = v;
    }
    

    /**开始一个计时器 */
    StartTimer(delay:number,cb:()=>number|null){
        this.m_npc.SetContextThink(DoUniqueString("timer"),cb,delay)   
    }
    

    Set_BLACKBOARD_V(BLACKBOARD_KEY:string,value:any){
        this.BLACKBOARD[BLACKBOARD_KEY] = value
    }

    Get_BLACKBOARD_V(BLACKBOARD_KEY:string):any{
        return this.BLACKBOARD[BLACKBOARD_KEY]
    }

    init(){
        this.m_npc.Stop()
    }

    yield(time:number):Promise<Result>{
        return new Promise((res,rej)=>{
            GameRules.enquence_delay_call(()=>{
                res(Result.失败)
                return null
            },undefined,time * 1000)
        })
    }

    async Start(){
        try{
        print(this.m_npc.GetName()+"开始了行为树")
        while(this.m_npc.IsAlive()){
           this.loop?.()
           await this.yield(0.5)
           await this.root.tick()
        }
        }catch(err){
            print(`[btree] error ${err}`)
        }
    }

    constructor(npc?:CDOTA_BaseNPC){ 
        print("创造了行为树")
        this.m_npc = npc
        this.init()
    }

}