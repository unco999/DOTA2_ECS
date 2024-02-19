import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onLocalEvent } from "../utils/event-bus";
import { useGameEvent } from "react-panorama-x";

export function useLinkComps<T extends keyof compc_map>(compsName:T,sort:(a:compc_map[T],b:compc_map[T])=>number){
    const [comps,change_comps] = useState<compc_map[T][]>()
    const [last_update_time,set_last_update_time] = useState<number>(0)
    
    useGameEvent("s2c_link_comp_to_event",()=>{
        set_last_update_time(new Date().getTime())
    },[])

    useEffect(()=>{
        if(GameUI.CustomUIConfig().with_link_comp_cache[compsName]){
            const data = GameUI.CustomUIConfig().with_link_comp_cache[compsName]
            const list:compc_map[T][] = []
            data?.forEach(elm=>{
                list.push(elm.comp)
            })
            change_comps(list.sort(sort))
        }
   },[last_update_time])

   return [comps,last_update_time]
}



export function useCompWithEntityID(dota_entity_id:EntityIndex){
    const [comps,change_comps] = useState<any>()
    const [last_update_time,set_last_update_time] = useState<number>(0)
    
    useGameEvent("s2c_bind_dota_entity_to_ecs_entity",()=>{
        set_last_update_time(new Date().getTime())
    },[])

    useEffect(()=>{
        $.Msg("我的dota_entity_id",dota_entity_id)
        $.Msg("获取到的ecs",GameUI.CustomUIConfig().comp_data_with_dota_entity[dota_entity_id])
        const ecs_entity_id = GameUI.CustomUIConfig().comp_data_with_dota_entity[dota_entity_id]
        if(ecs_entity_id == null) return
        if(GameUI.CustomUIConfig().with_entity_comp_cache[ecs_entity_id] ){
           $.Msg("获取到了根据ecs_entity_id拿到的东西",(GameUI.CustomUIConfig().with_entity_comp_cache[ecs_entity_id]))
           change_comps(GameUI.CustomUIConfig().with_entity_comp_cache[ecs_entity_id])
        }
   },[last_update_time])

   return [comps,last_update_time]
}


export function useCompWithPlayer<T extends keyof compc_map>(compName:T,PlayerID:PlayerID):[compc_map[T],number] {
    const [comp,change_comp] = useState<compc_map[T]>();
    const last_update_time = useRef<number>(0)

    useLayoutEffect(()=>{
         if(last_update_time.current == 0 && GameUI.CustomUIConfig().with_entity_comp_cache ){
            for(let entinx in GameUI.CustomUIConfig().with_entity_comp_cache){
                for(let comp_name in GameUI.CustomUIConfig().with_entity_comp_cache[Number(entinx) as EntityIndex]){
                    if(comp_name == compName){
                        const cache = GameUI.CustomUIConfig().with_entity_comp_cache[Number(entinx) as EntityIndex]?.[compName]
                        if(Number(cache["$$$$player_id"]) == PlayerID){
                            change_comp(cache)
                            last_update_time.current = new Date().getTime()
                            return
                        }
                    }
                }
            }
         }
    },[])

    useEffect(()=>{
        const id = GameEvents.Subscribe("s2c_comp_to_event",(data:any)=>{
            last_update_time.current = new Date().getTime()
            if(data.class_name == compName && data.comp["$$$$player_id"] == PlayerID){
                change_comp(data.comp as compc_map[T])
            }
        })
        return ()=>GameEvents.Unsubscribe(id)
    },[])


    return [comp!,last_update_time.current!];
}

export function useCompWithSystem<T extends keyof compc_map,V extends Partial<compc_map[T]>>(compName:keyof compc_map,deep?:V,defualt?:compc_map[T]) {
    let [comp,change_comp] = useState<compc_map[T]>();
    const [last_update_time,set_last_update_time] = useState<number>(0)

    useEffect(()=>{
        if(last_update_time == 0 && GameUI.CustomUIConfig().with_entity_comp_cache ){
           for(let entinx in GameUI.CustomUIConfig().with_entity_comp_cache){
               for(let comp_name in GameUI.CustomUIConfig().with_entity_comp_cache[Number(entinx) as EntityIndex]){
                   if(comp_name == compName){
                       const cache = GameUI.CustomUIConfig().with_entity_comp_cache[Number(entinx) as EntityIndex]?.[compName]
                       change_comp(cache)
                       return
                   }
               }
           }
        }
   },[last_update_time])

   useLayoutEffect(()=>{
        const id = GameEvents.Subscribe("s2c_comp_to_event",(data:any)=>{
            set_last_update_time(new Date().getTime())
            if(data.class_name == compName){
                change_comp(data.comp as compc_map[T])
            }
        })
        return ()=>GameEvents.Unsubscribe(id)
    },[])


    return [comp!,last_update_time];
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
