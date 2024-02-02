import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onLocalEvent } from "../utils/event-bus";


export const useInterval = (interval:number,fn:(panel?:Panel,count?:number)=>any,panel?:Panel) =>{
    const timer = useRef<number>();

    useEffect(()=>{
        let i = 0 
        timer.current = setInterval(()=>{
            if(i == 999999){
                i = 0;
            }
            i++
            fn(panel,i)
        },interval)
        return ()=>{
            clearInterval(timer.current)
        }
    },[])
}