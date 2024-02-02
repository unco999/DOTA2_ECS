import type { Dispatch, SetStateAction } from 'react';
import { useState, useCallback, useEffect } from 'react';
import useIsComponentMounted from './useIsComponnetMounted';

export const useTypeInput = (str:string,open:boolean) =>{
    const [cur,setcur] = useState<number>(0)

    useEffect(()=>{
        if(open){
            const interval = setInterval(()=>{
                setcur(val=>{
                    if(val == str.length){
                        clearInterval(interval)
                        return val
                    } 
                    return val! + 1
                })
            },77)
        }else{
            setcur(0)
        }
    },[open])

    return str.slice(0,cur)
}