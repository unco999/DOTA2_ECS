import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onLocalEvent } from "../utils/event-bus";


export const useInterval = (interval:number,fn:(count?:number)=>any,check:boolean,destroy_call_back:Function,...dep:any) =>{
    const timer = useRef<number>();

    useEffect(()=>{
        if(check == false){
            timer.current && clearInterval(timer.current)
            $.Msg("check",check)
            destroy_call_back()
            return;
        }
        let i = 0 
        timer.current = setInterval(()=>{
            if(i == 999999){
                i = 0;
            }
            i++
            fn(i)
        },interval)
        return ()=>{
            clearInterval(timer.current)
        }
    },[...dep,check,destroy_call_back])
}