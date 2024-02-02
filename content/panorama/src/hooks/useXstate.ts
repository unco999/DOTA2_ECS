import { useCallback, useEffect, useState } from "react";
import { useNetTableKey } from "react-panorama-x";

export function useXstate(
    check_parent:XstateID,
    check_parent_state:string,
    check_cur?:XstateID | null,
    check_state?:string | null,
    check_call_back?:(on:boolean,cur_xstate:XstateID|undefined,cur_state:string|undefined)=>void,
):[on:boolean,send:(message:UIXstateOnChange)=>void]{
    const main_xstate = useNetTableKey("xstate",check_parent);
    const children_xstate = check_cur ? useNetTableKey("xstate",check_cur) : null
    const [on,seton] = useState(false)


    useEffect(()=>{
        if(check_state == null && check_cur == null){
            if(main_xstate?.cur_state === check_parent_state){
                seton(true)
            }else{
                seton(false)
            }
            return
        }
        if(main_xstate && children_xstate){
            if(main_xstate?.cur_state === check_parent_state && children_xstate.cur_state === check_state){
                seton(true)
            }else{
                seton(false)
            }
        }else{
            seton(false)
        }
    },[main_xstate,children_xstate])

    const send = useCallback((message:UIXstateOnChange)=>{
        check_cur && GameEvents.SendCustomGameEventToClient("c2s_xstate_change",Players.GetLocalPlayer(),{id:check_cur!,change:message})
    },[main_xstate,children_xstate])

    useEffect(()=>{
        on ? check_call_back?.(true,children_xstate?.cur_name,children_xstate?.cur_state) : check_call_back?.(false,children_xstate?.cur_name,children_xstate?.cur_state)
    },[on])


    return on ? [true,send]:[false,send]
}