import * as xstate from "../../utils/xstate/types";
import * as x from "../../utils/xstate/xstate-dota";



export const xstate_container:Map<XstateID,xstate.StateMachine.AnyService> = new Map()

export function spawn_xstate<
    TContext extends object,
    TEvent extends xstate.EventObject = xstate.EventObject,
    TState extends xstate.Typestate<TContext> = { value: any; context: TContext }
>(
    xstateid:XstateID,
    fsmConfig: xstate.StateMachine.Config<TContext, TEvent, TState>,
    implementations: {
        actions?: xstate.StateMachine.ActionMap<TContext, TEvent>;
    } = {},
    parent?:XstateID
): XstateID {
    const config = x.createMachine(fsmConfig,implementations)
    const serve = x.interpret(config).start()

    serve.subscribe((state)=>{
        const last_xstate = CustomNetTables.GetTableValue("xstate",xstateid)
        const parent_xstate = parent ? CustomNetTables.GetTableValue("xstate",parent) : null
        CustomNetTables.SetTableValue("xstate",xstateid,{cur_name:xstateid,parent_name:parent,cur_state:state.value,last_state:last_xstate?.cur_state,parent_state:parent_xstate?.cur_state})
        GameRules.world.dispatch(new GameRules.event.xstateChangeEvent(`${parent ?? "none"}=>${parent_xstate?.cur_state?? "none"}=>${xstateid}=>${state.value}`,xstateid))
    })

    const last_xstate = CustomNetTables.GetTableValue("xstate",xstateid)
    const parent_xstate = parent ? CustomNetTables.GetTableValue("xstate",parent) : null
    CustomNetTables.SetTableValue("xstate",xstateid,{cur_name:xstateid,parent_name:parent,cur_state:serve.getState().value,last_state:last_xstate?.cur_state,parent_state:parent_xstate?.cur_state})
    GameRules.world.dispatch(new GameRules.event.xstateChangeEvent(`${parent ?? "none"}=>${parent_xstate?.cur_state?? "none"}=>${xstateid}=>${serve.getState().value}`,xstateid))

    
    xstate_container.set(xstateid,serve)
    return xstateid
}

export function get_xstate_cur_state(xstateid:XstateID){
    return xstate_container.get(xstateid).getState().value
}

export function next_xstate(xstateid:XstateID){
    xstate_container.get(xstateid)?.send("next")
}

export function back_xstate(xstateid:XstateID){
    xstate_container.get(xstateid)?.send("back")
}

export function back_main_xstate(xstateid:XstateID){
    xstate_container.get(xstateid)?.send("main")
}