import { SatisfyFn, cache_remove, clear_event, to_client_event, to_player_net_table, to_system_net_table, doc } from "../../fp";

@doc.watch("none",to_player_net_table(),SatisfyFn<Progress>((e)=>e.cur == e.max && e.is_over == false,(comp)=>
{
    comp.is_over = true;
    GameRules.world.dispatch(new GameRules.event.ProgressEvent("end",comp.uuid))
}
))

export class Progress{
    constructor(
        public uuid:string,
        public max:number,
        public cur:number,
        public item_name:string,
        public is_over:boolean = false,
        public data?:any,
    ){
        
    }
}

@clear_event(cache_remove)
@doc.watch("none",to_system_net_table(),SatisfyFn<SystemProgress>((e)=>e.cur == e.max && e.is_over == false,(comp:SystemProgress)=>
{
    comp.is_over = true;
    GameRules.world.dispatch(new GameRules.event.ProgressEvent(comp.type,comp.uuid,comp.data))
}   
))
export class SystemProgress{
    constructor(
        public type:string,
        public uuid:string,
        public max:number,
        public cur:number,
        public item_name:string,
        public is_over:boolean = false,
        public data?:any,
    ){
        
    }
}

@doc.watch("none")
export class OkPanel{
    constructor(
        public title:string,
        public uuid:string,
        public Ok:boolean
    ){

    }
}