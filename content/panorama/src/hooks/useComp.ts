import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onLocalEvent } from "../utils/event-bus";



export function useCompWithPlayer<T extends keyof compc_map>(compName:T,PlayerID:PlayerID):[compc_map[T],number] {
    const [comp,change_comp] = useState<compc_map[T]>();
    const last_update_time = useRef<number>(0)

    useEffect(()=>{
         if(last_update_time.current == 0 && GameUI.CustomUIConfig().comp_data_with_date_time_cache[compName] ){
             change_comp(GameUI.CustomUIConfig().comp_data_with_date_time_cache[compName] as compc_map[T])
         }
    },[])

    useLayoutEffect(()=>{
        const id = GameEvents.Subscribe(compName + PlayerID + "player",(data)=>{
            change_comp(data as compc_map[T])
            last_update_time.current =  new Date().getTime()
            GameUI.CustomUIConfig().comp_data_with_date_time_cache[compName] = data as compc_map[T]
        })
        return ()=>GameEvents.Unsubscribe(id)
    },[])


    return [comp!,last_update_time.current];
}

export function useCompWithSystem<T extends keyof compc_map,V extends Partial<compc_map[T]>>(compName:keyof compc_map,deep?:V,defualt?:compc_map[T]) {
    let [comp,change_comp] = useState<compc_map[T]>();
    const last_update_time = useRef<number>(0)

    useEffect(()=>{
        if(last_update_time.current == 0 && GameUI.CustomUIConfig().comp_data_with_date_time_cache[compName] ){
            change_comp(GameUI.CustomUIConfig().comp_data_with_date_time_cache[compName] as compc_map[T])
        }
   },[])

    useLayoutEffect(()=>{
        const id = GameEvents.Subscribe(compName,(data)=>{
            change_comp(data as compc_map[T])
            last_update_time.current =  new Date().getTime()
            GameUI.CustomUIConfig().comp_data_with_date_time_cache[compName] = data as compc_map[T]
        })
        return ()=>GameEvents.Unsubscribe(id)
    },[])

    return [comp!,last_update_time.current];
}

export function useCompWithHeroAndPlayer<T extends keyof compc_map,V extends Partial<compc_map[T]>>(compName:keyof compc_map,PlayerID:PlayerID,hero_idx:EntityIndex,deep?:V,defualt?:compc_map[T]):compc_map[T] | undefined {
    let [comp,change_comp] = useState<compc_map[T]>();

    useLayoutEffect(()=>{
        const id =GameEvents.Subscribe(compName + PlayerID + hero_idx + "player_hero",(data)=>{
            change_comp(data as compc_map[T])
        })
        return ()=>GameEvents.Unsubscribe(id)
    },[])

    return comp?? defualt
}

export function useCompWithHero<T extends keyof compc_map,V extends Partial<compc_map[T]>>(compName:keyof compc_map,edx:EntityIndex,deep?:V,defualt?:compc_map[typeof compName]) {
    let [comp,change_comp] = useState<compc_map[T]>();

    useLayoutEffect(()=>{
        const id = GameEvents.Subscribe(compName + edx + "hero",(data)=>{
            change_comp(data as compc_map[T])
        })
        return ()=>GameEvents.Unsubscribe(id)
    },[])

    return comp?? defualt
}
