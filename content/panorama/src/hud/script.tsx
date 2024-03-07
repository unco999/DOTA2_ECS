import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useGameEvent, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer, useCompWithSystem, useLinkComps } from '../hooks/useComp';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { LocalEvent } from '../def/local_event_def';
import { AnchorPanel, TilePanel, luaToJsArray } from '../base';
import { distance } from '../utils/lib';
import { useInterval } from '../hooks/useInterval';

const main_style= {
    "init": {
        opacity: 0,
        scale:0,
    },
    "spawn":{
        opacity: 1,
        scale:1,
    },
}



const start_check_point:[number,number] = [945,1000]
const end_check_point:[number,number] = [1419,982]


const MagicCardMain = () =>{
    const [update,set_update] = useState(false)
    const cursor_position = useRef<[number,number]>([0,0])
    const compise = useRef<boolean>(false)

    const [select_card_table,set_select_card_table] = useState<Record<number,string|undefined>>({})
    const [merge,setmerge] = useState<boolean>(false)

    const [card_comp,card_link_comp_update] = useLinkComps("Card",(a,b)=>a?.index - b?.index) as [Card[],number]

    $.Msg(card_comp)

    // useInterval(Game.GetGameFrameTime(),()=>{
    //     if(GameUI.IsMouseDown(0)){
    //         const cur = GameUI.GetCursorPosition()
    //         if(distance(cur,start_check_point) < 222){
    //             compise.current = true
    //             cursor_position.current = cur
    //         }
    //     }
    //     else{
    //         if(compise.current == false) return;
    //         const end_point = GameUI.GetCursorPosition()
    //         if(compise.current && distance(end_point,end_check_point) < 222 && Object.keys(select_card_table).length > 1){
    //             compise.current = false
    //             cursor_position.current = [0,0]
    //             setmerge(true)
    //         }
    //     }
    // },undefined,select_card_table)

    useEffect(()=>{
        if(merge == true){
            set_select_card_table({})
            setmerge(false)
        }
    },[merge])


    

    return <Panel style={{width:"1000px",height:"400px",border:"1px solid red",align:"right bottom"}}>
        {card_comp?.map((elm,index)=><Card index={elm.index} merge={merge} dispatich={set_select_card_table} key={"Card"+elm?.uid + elm.index}  card_data={elm}/>)}
    </Panel>
}

const Card = ({card_data,dispatich,merge,index}:{card_data:Card,index:number,merge:boolean,dispatich:React.Dispatch<React.SetStateAction<Record<number, string|undefined>>>}) =>{
    const main = useRef<Panel>()
    const dummy = useRef<Panel>()
    const card_label = useRef<Panel>()
    const is_select = useRef<boolean>()

    useEffect(()=>{
        main.current?.AddClass(`car_index_${index}`)
        dummy.current?.AddClass(`dummy_index_${index}`)
    },[index])

    const translate = (p?:Panel) =>{
        p?.RemoveClass(`init`)
        p?.AddClass(`card_index_${index}`)
    }

    // useEffect(()=>{
    //     translate(main.current)
    //     translate(dummy.current)

    //     return () =>{
    //         main.current?.RemoveClass(`card_index_${card_data.index}`)
    //     }
    // },[card_data.index])
    useEffect(()=>{
        if(merge && is_select.current == true){
            main.current?.AddClass("merge")
            main.current?.RemoveClass("select")
            main.current?.RemoveClass("mouseover")
            main.current?.RemoveClass(`card_index_${index}`)
        }
    },[merge])

    const onmouseover = (p:Panel) =>{
        if(is_select.current == true) return
        main.current?.AddClass("mouseover")
    }
    
    const onmouseout = (p:Panel) =>{
        main.current?.RemoveClass("mouseover")
    }

    const dclick = (p:Panel) =>{
        is_select.current = !is_select.current 
        main.current?.ToggleClass("select")
        if(is_select.current == true){
            dispatich(elm=> ({...elm,[index]:card_data.card_name}))
        }else{
            dispatich(elm=> ({...elm,[index]:undefined}))
        }
    }

    const ondrag = (p:Panel) => {
        const abilityindex = Entities.GetAbility(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()),0)
        const a = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
        Abilities.ExecuteAbility(abilityindex,a,false)
    } 
 
    const dbclieck = (p:Panel) =>{
        $.Msg("dbclieck",card_data.uid)
        GameEvents.SendCustomGameEventToServer("c2s_card_event",{container_behavior:16,merge_data:{1:card_data.uid}})
    }

    return <>
            <Panel onload={translate} hittest={false} ref={p=>main.current=p!} className={`card`}>
             <Label hittest={false} text={card_data?.uid} ref={p=>card_label.current = p!} className={`card_label`}/>
            </Panel>
            <Panel ondblclick={dbclieck} onactivate={ondrag} oncontextmenu={dclick} hittest={true} ref={p=>dummy.current = p!} onmouseover={onmouseover} onmouseout={onmouseout} className={`card_dummy`}/>
        </>
}


/**过关条件UI */
const LevelCheckHud = () =>{
    const [level_behaivor_check,level_behaivor_checkupdate] = useCompWithSystem("LevelBehaivorCheck") as [LevelBehaivorCheck,number]

    return <Panel hittest={false} style={{width:"100%",height:"100%"}}>
        <Label style={{color:"white",textShadow:"2px 2px 8px 3.0 #333333b0",fontSize:"35px",align:"center top",marginTop:"30px"}} 
        text={`当前过关条件 #level_behaivor_${level_behaivor_check?.level_behaivor} 需要数量${level_behaivor_check?.check_max} 完成数量${level_behaivor_check?.cur}`}/>
    </Panel>
}

const BaseAttribute = ({icon,num}:{icon:string,num:number}) => {
    return <Panel hittest={false} style={{flowChildren:"down"}}>
        <Image hittest={false} style={{width:"32px",height:"32px"}} src={`s2r://panorama/images/control_icons/${icon}.png`}/>
        <Label  hittest={false} style={{horizontalAlign:"center",marginLeft:"9px",fontSize:"16px",color:"white"}} text={num.toString()}/>
    </Panel>
}



const ItemToolTip = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [event,set_event] = useState<LocalEvent['tooltipitem']>({"switch":false,x:0,y:0,comps:undefined as any})
   

    const base_attribute_serialize = (data:Record<number, string>) =>{
        if(data == null) return;
        const out:Record<string,number> = {}
        Object.values(data).forEach(elm=>{
            out[elm[0]] = Number(elm.slice(1,elm.length))
        })
        return out
    }

    const state_attribute_serialize = (data:Record<number, string>) =>{
        if(data == null) return;
        const out:Record<string,number> = {}
        Object.values(data).forEach(elm=>{
            out[elm[0]] = Number(elm.slice(1,elm.length))
        })
        return out
    }

    const special_attribute_serialize = (data:Record<number, Record<number, 记载>>) => {
        const out:{name:string,description:string}[] = []
        let special_array = luaToJsArray(data) as Record<number,包含动态值的记载>[]
        $.Msg("special_arrayspecial_arrayspecial_array",data)
        let special_name = special_array.map(elm=>{
            return Object.values(elm).map(val=>{
               return $.Localize("#" + val.标识 + "_name")
            }).join("")
        })
        let special_description = special_array.map(elm=>{
            return Object.values(elm).map(val=>{
               return $.Localize("#" + val.标识 + "_description").replace("x",val?.动态值?.arg1?.toString() ?? "0")
            }).join("")
        })
        special_name.forEach((elm,index)=>{
            out.push({name:elm,description:special_description[index]})
        })
        return out
    }

    const serialize = useMemo(()=>{
        if(event.comps == null) return 
        $.Msg("(event.comps(event.comps(event.comps(event.comps(event.comps",event.comps)
        const comps = event.comps.EquipMentAttribute
        comps.speicel_attribute
        const texture_index = comps.texture_index
        const item_name = comps.item_name
        const base_attribute = base_attribute_serialize(comps.base_attribute)
        const state_attribute = state_attribute_serialize(comps.state_attribute)
        const special_attribute = special_attribute_serialize(comps.speicel_attribute)
        return {texture_index,item_name,base_attribute,state_attribute,special_attribute}
    },[event?.comps])

    const special_jsx_list = useMemo(()=>{
        if(serialize?.special_attribute){
            $.Msg("渲染了特殊值",serialize?.special_attribute)
            return serialize.special_attribute.map((elm,index)=>{
                return <TilePanel key={"item_special_des" + index} tile={elm.name} width="250px">
                <Label style={{color:"gold",fontSize:"15px",textShadow:"2px 2px 8px 3.0 #333333b0"}} text={elm.description}/>
           </TilePanel>
            })
        }
    },[serialize])

    const xy = useMemo(()=>{
        return {x:!isFinite(event.x) ? 0 : event.x,y:!isFinite(event.y) ? 0 : event.y}
    },[event.x,event.y])

    useLocalEvent("tooltipitem",(_event)=>{
        if(_event.switch == false){
            next_state("init")
            return;
        }
        set_event(_event)
        next_state(_event.switch ? "spawn" : "init")
    })

    const next_state = (key:keyof typeof main_style) => {
        set_last_state(state)
        setState(key)
    }


    return <Motion hittest={false} key={"CustomToolTip"} defaultStyle={main_style[last_state]} style={{
        opacity: spring(main_style[state].opacity),
        scale: spring(main_style[state].scale),
    }}> 
        {(style:any) => 
             <Panel
                ref={p=> p && AnchorPanel(event.x,event.y,p)}
                hittest={false} style={{
                opacity:style.opacity.toFixed(3)
                ,preTransformScale2d:style.scale.toFixed(3),
                flowChildren:"down",
                borderRadius:"8px",
                x:xy.x + "px",
                y:xy.y + "px",
                zIndex:100,
             }}>
                 <Image hittest={false} src="s2r://panorama/images/hud/item_tooltip_passive.psd"/>
                 <Panel hittest={false}  style={{flowChildren:"down",backgroundSize:"100% 100%",minWidth:"335px",backgroundImage:"url('s2r://panorama/images/hud/international_bg.psd')"}}>
                     <Panel hittest={false} style={{flowChildren:"right"}}>
                        <Image style={{marginLeft:"20px"}} src={`raw://resource/flash3/images/items/${serialize?.texture_index ?? "owl_01"}.png`}/>
                        <Panel style={{flowChildren:"down"}}>
                            <Label style={{marginLeft:"20px",marginTop:"10px",color:"gold",fontSize:"15px",textShadow:"2px 2px 8px 3.0 #333333b0"}} text={serialize?.item_name ?? "读取中"}/>
                            <Label style={{marginLeft:"20px",color:"gold",fontSize:"15px",textShadow:"2px 2px 8px 3.0 #333333b0"}} text={"耐久:30/10"}/>
                            <Label style={{marginLeft:"20px",color:"gold",fontSize:"15px",textShadow:"2px 2px 8px 3.0 #333333b0"}} text={"制作人:unco"}/>
                        </Panel>
                    </Panel>
                    <TilePanel tile={"基础属性"} width="250px">
                        <Panel hittest={false} style={{margin:"8px",horizontalAlign:"center",flowChildren:"right-wrap"}}>
                        <BaseAttribute icon={"filter_crater_2021"} num={32}/>
                        <BaseAttribute icon={"filter_cavern_ti2020"} num={16}/>
                        <BaseAttribute icon={"filter_cavern_2022"} num={11}/>
                        <BaseAttribute icon={"filter_cavern_bp2_2021"} num={44}/>
                        <BaseAttribute icon={"filter_compendium"} num={44}/>
                        <BaseAttribute icon={"filter_complexity"} num={44}/>
                        <BaseAttribute icon={"filter_crater_2021"} num={44}/>
                        <BaseAttribute icon={"filter_disabler"} num={44}/>
                        <BaseAttribute icon={"filter_durable"} num={44}/>
                        <BaseAttribute icon={"filter_escape"} num={44}/>
                        <BaseAttribute icon={"filter_initiator"} num={44}/>
                        <BaseAttribute icon={"filter_ranges"} num={44}/>
                        <BaseAttribute icon={"filter_support"} num={44}/>
                        <BaseAttribute icon={"filter_ti2019_friends"} num={44}/>
                        </Panel>
                    </TilePanel>
                    {special_jsx_list}
                 </Panel>
             </Panel>
        }
    </Motion>
    
}

const BigTileWolrd = () =>{
        
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const text = useRef<string>("测试代码")
    const [position,set_position] = useState<[number,number,number]>([0,0,0])

    useLocalEvent("game_start",()=>{
        const player = Players.GetLocalPlayer()
        const hero = Players.GetPlayerHeroEntityIndex(player)
        const position = Entities.GetAbsOrigin(hero)
        set_position(position)
    })

    useEffect(()=>{
        const player = Players.GetLocalPlayer()
        const hero = Players.GetPlayerHeroEntityIndex(player)
        if(hero == -1){
            return;
        }
        const position = Entities.GetAbsOrigin(hero)
        if(position){
            set_position(position)
        }
    },[])

    useGameEvent("s2c_big_world_tile",(event)=>{
        const _pos = luaToJsArray(event.position) as [number,number,number]
        set_position(_pos)
        text.current = event.tile
        next_state("spawn")
    },[])



    /**更换状态只能用这个接口 */
    const next_state = (key:keyof typeof main_style) => {
        set_last_state(state)
        setState(key)
    }


     useEffect(()=>{
        next_state("spawn")
    },[])

    return <Motion key={position[0] + position[1] + position[2] + "bigworldtile"} defaultStyle={main_style[last_state]} style={{
        opacity: spring(main_style[state].opacity),
        scale: spring(main_style[state].scale),
    }}> 
        {(style:any) => 
        <Panel hittest={false} style={{width:"100%",height:"100%"}}>
            <Label ref={p=>$.Schedule(1,()=>next_state("init"))} key={position[0] + position[1] + position[2] + "bigworldtile"} text={text.current} style={{
            fontSize:"100px"
            ,color:"white",
            textShadow:"2px 2px 8px 3.0 #333333b0",
            preTransformScale2d:style.scale.toFixed(6),
            opacity:style.opacity.toFixed(6),
            align:"left top",
            x:Game.WorldToScreenX(position[0],position[1],position[2]) / Game.GetScreenWidth() * 1920 - 200 + "px",
            y:Game.WorldToScreenY(position[0],position[1],position[2]) / Game.GetScreenHeight() * 1080 - 100 + "px"
        }} html={true}/>
        </Panel>
        }
    </Motion>
}


const LargePopupBox: FC = () => {

    const main_style= {
        "init": {
            opacity: 0,
            scale:5,
        },
        "spawn":{
            opacity: 1,
            scale:1,
        },
      }
  
      
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const text = useRef<string>()

    useEffect(()=>{
        next_state("init")
    },[])

    /**更换状态只能用这个接口 */
    const next_state = (key:keyof typeof main_style) => {
        set_last_state(state)
        setState(key)
    }

    onLocalEvent("LargePopupBox",(event) => {
        text.current = event.tag_name
        $.Msg("接受到弹出事件",event)
        next_state("spawn")
    })

    const click = () => {
        next_state("init")
    }
    
    return <Motion key={"LargePopupBox" + state + Math.random()} defaultStyle={main_style[last_state]} style={{
        opacity: spring(main_style[state].opacity),
        scale: spring(main_style[state].scale),
    }}> 
        {(style:any) => 
             <Panel hittest={true} onactivate={click} style={{
                width:"100%",
                height:"100%",
                opacity:style.opacity.toFixed(3)
                ,backgroundColor:"rgba(0,0,0,0.9)"
                ,align:"center center"
                ,preTransformScale2d:style.scale.toFixed(3)
                }}>
            <Panel style={{align:"center center",height:"10%",width:"100%",backgroundColor:"rgba(255,255,255,0.5)"}}>
                <Label text={text.current} style={{color:"black",fontSize:"40px"}}/>
            </Panel>
             </Panel>
        }
    </Motion>
};



export const Login  = ({tile,ok,fontSize}:{tile:string,ok:boolean,fontSize:number}) => {

    const main_style= {
        "init": {
            opacity: 0,
            scale:5,
        },
        "spawn":{
            opacity: 1,
            scale:1,
        },
      }
  
      
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("spawn")

    useEffect(()=>{
        ok ?  next_state("init") : next_state("spawn")
    },[ok])

    /**更换状态只能用这个接口 */
    const next_state = (key:keyof typeof main_style) => {
        set_last_state(state)
        setState(key)
    }

    
    return <Motion key={"Login" + state + Math.random()} defaultStyle={main_style[last_state]} style={{
        opacity: spring(main_style[state].opacity),
        scale: spring(main_style[state].scale),
    }}> 
        {(style:any) => 
            <Panel style={{flowChildren:"down",align:"center center",height:"100%",width:"100%",backgroundColor:"rgba(255,255,255,0.5)"}}>
                <Image style={{horizontalAlign:"center",width:"64px",height:"64px",backgroundColor:"black"}}/>
                <Label text={tile} style={{horizontalAlign:"center",color:"black",fontSize:fontSize + "px"}}/>
            </Panel>
        }
    </Motion>
};



const Progress: FC = () => {
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")

    const progress_comp = useNetTableKey("player_comps","player" + Players.GetLocalPlayer()) as compc_map

    const cur_comp = progress_comp?.['Progress']

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
        },
        "spawn":{
            width: 840,
            height: 40,
            opacity: 1,
        },
      }

    useEffect(()=>{
        if(cur_comp?.cur == null) return
        if(cur_comp?.cur >= cur_comp?.max){
            next_state("init")
            return
        }
        next_state("spawn")
    },[cur_comp?.cur])
  
      
    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

    const click = () => {
        next_state("init")
    }
    
    return <Motion defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width,{stiffness: 240, damping: 11}),
        height: spring(main_style[state].height,{stiffness: 240, damping: 11}),
        opacity: spring(main_style[state].opacity,{stiffness: 240, damping: 11}),
    }}> 
        {(style:any) => 
             <Panel hittest={true} onactivate={click} style={{
                width:style.width.toFixed(3) + "px",
                height:style.height.toFixed(3) + "px",
                opacity:style.opacity.toFixed(3)
                ,backgroundColor:"WHITE"
                ,align:"center center"
                }}>
             {cur_comp?.is_over == 0 && <Panel style={{
                width: cur_comp.cur / cur_comp.max * 100 + "%",
                height:"24px",
                align:"center center",
                backgroundColor:"Blue"
             }}>
                <Label text={cur_comp.item_name} style={{fontSize:"23px",color:"WHITE","textShadow":"2px 2px 8px 3.0 #333333b0"}}/>
             </Panel>
             }
             </Panel>
        }
    </Motion>
}


const SystemProgress: FC = () => {
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")

    const progress_comp = useNetTableKey("system_comps","SystemProgress") as compc_map


    const cur_comp = progress_comp?.["SystemProgress"]

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
        },
        "spawn":{
            width: 840,
            height: 40,
            opacity: 1,
        },
      }

    useEffect(()=>{
        if(cur_comp?.cur == null) return
        if(cur_comp?.cur >= cur_comp?.max){
            next_state("init")
            return
        }
        next_state("spawn")
    },[cur_comp?.cur])
  
      
    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

    const click = () => {
        next_state("init")
    }
    
    return <Motion defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width,{stiffness: 240, damping: 11}),
        height: spring(main_style[state].height,{stiffness: 240, damping: 11}),
        opacity: spring(main_style[state].opacity,{stiffness: 240, damping: 11}),
    }}> 
        {(style:any) => 
             <Panel hittest={true} onactivate={click} style={{
                width:style.width.toFixed(3) + "px",
                height:style.height.toFixed(3) + "px",
                opacity:style.opacity.toFixed(3)
                ,backgroundColor:"WHITE"
                ,align:"center center"
                }}>
             {cur_comp?.is_over == 0 && <Panel style={{
                width: cur_comp.cur / cur_comp.max * 100 + "%",
                height:"24px",
                align:"center center",
                backgroundColor:"Blue"
             }}>
                <Label text={cur_comp.item_name} style={{fontSize:"23px",color:"WHITE","textShadow":"2px 2px 8px 3.0 #333333b0"}}/>
               </Panel>
             }
             </Panel>
        }
    </Motion>
}




const OkPanel: FC = () => {
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [event,set_event] = useState<LocalEvent['OkPanel']>()

    useLocalEvent("OkPanel",(event)=>{
        set_event(event)
    })

    useGameEvent("OkPanel",(event)=>{
        set_event(event)
    },[])

 
    const main_style= {
        "init": {
            opacity: 0,
            scale:5,
        },
        "spawn":{
            opacity: 1,
            scale:1,
        },
      }


    useEffect(()=>{
        if(event != null){
            GameEvents.SendCustomGameEventToServer("c2s_ok_register",{uuid:event!.uuid})
            next_state("spawn")
        }else{
            next_state("init")
        }
    },[event])


    const not_ok = () => {
        next_state("init")
        GameEvents.SendCustomGameEventToServer(event!.uuid,{uuid:event!.uuid,type:event!.type,click:"not_ok"})
    }

    
    const ok = () => {
        next_state("init")
        GameUI.CustomUIConfig().EventBus?.emit(event!.type,event!.data)
        GameEvents.SendCustomGameEventToServer(event!.uuid,{uuid:event!.uuid,type:event!.type,click:"ok",data:event!.data,PlayerID:Players.GetLocalPlayer()})
    }
      
    /**更换状态只能用这个接口 */
    const next_state = (key:any) => {
        set_last_state(state)
        setState(key)
    }
    
    return <Motion defaultStyle={main_style[last_state]} style={{
        scale: spring(main_style[state].scale),
        opacity: spring(main_style[state].opacity),
    }}> 
        {(style:any) => 
             <Panel hittest={true} style={{
                width:"100%",
                height:"100%",
                opacity:style.opacity.toFixed(3)
                ,backgroundColor:"rgba(0,0,0,0.9)"
                ,align:"center center"
                ,preTransformScale2d:style.scale.toFixed(3)
                }}>
            <Panel style={{flowChildren:"down",align:"center center",height:"10%",width:"100%",backgroundColor:"rgba(255,255,255,0.5)"}}>
               <Label text={event?.title} style={{marginTop:"20px",fontSize:"28px",align:"center center"}}/>
               <Panel style={{flowChildren:"right",align:"center center"}}>
                    <Panel  onactivate={ok} hittest={true}  style={{width:"100px",border:"2px solid #111111FF",fontSize:"28px"}}>
                         <Label text={"确定"}/>
                    </Panel>
                    <Panel  onactivate={not_ok} hittest={true} style={{width:"100px",border:"2px solid #111111FF",fontSize:"28px",marginLeft:"30px"}}>
                         <Label text={"取消"}/>
                    </Panel>
                    </Panel>
               </Panel>
               </Panel>
        }
    </Motion>
}



const OkNumberInputPanel: FC = () => {
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [event,set_event] = useState<LocalEvent['OkNumberInputPanel']>()
    const entry_number_panel = useRef<TextEntry>()

    useLocalEvent("OkNumberInputPanel",(event)=>{
        $.Msg("接受到输入",event)
        set_event(event)
    })

    useGameEvent("OkNumberInputPanel",(event)=>{
        set_event(event)
    },[])

 
    const main_style= {
        "init": {
            opacity: 0,
            scale:5,
        },
        "spawn":{
            opacity: 1,
            scale:1,
        },
      }


    useEffect(()=>{
        if(event != null){
            GameEvents.SendCustomGameEventToServer("c2s_number_input_ok_register",{uuid:event!.uuid})
            next_state("spawn")
        }else{
            next_state("init")
        }
    },[event])


    const not_ok = () => {
        next_state("init")
        GameEvents.SendCustomGameEventToServer(event!.uuid,{uuid:event!.uuid,type:event!.type,click:"not_ok"})
    }

    const check = () => {
        const num = parseInt(entry_number_panel.current!.text,0)
        if(num == null || num == 0 || isNaN(num)){
            return false
        }
        return true
    }

    
    const ok = () => {
        next_state("init")

        if(event?.call_back){
            event.call_back(Number(entry_number_panel.current?.text ?? 0))
        }

        if(event?.type == "ji_shi_buy_item" && !check()){
            GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                tag_name:"你输入的数字不合法...",
                player_id:Players.GetLocalPlayer(),
            })
            return
        }
        if(event?.type == "ji_shi_sell_item" && !check()){
            GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                tag_name:"你输入的数字不合法...",
                player_id:Players.GetLocalPlayer(),
            })
            return
        }

        GameUI.CustomUIConfig().EventBus?.emit(event!.type,{input:entry_number_panel.current?.text})
        GameEvents.SendCustomGameEventToServer(event!.uuid,{uuid:event!.uuid,type:event!.type,click:"ok",data:{input:entry_number_panel.current?.text,...event},PlayerID:Players.GetLocalPlayer()})
    }
      
    /**更换状态只能用这个接口 */
    const next_state = (key:any) => {
        set_last_state(state)
        setState(key)
    }
    
    return <Motion defaultStyle={main_style[last_state]} style={{
        scale: spring(main_style[state].scale),
        opacity: spring(main_style[state].opacity),
    }}> 
        {(style:any) => 
             <Panel hittest={true} style={{
                width:"100%",
                height:"100%",
                opacity:style.opacity.toFixed(3)
                ,backgroundColor:"rgba(0,0,0,0.9)"
                ,align:"center center"
                ,preTransformScale2d:style.scale.toFixed(3)
                }}>
            <Panel style={{flowChildren:"down",align:"center center",height:"14%",width:"100%",backgroundColor:"rgba(255,255,255,0.5)"}}>
               <Label text={event?.title} style={{marginTop:"20px",fontSize:"28px",align:"center center"}}/>
               <TextEntry ref={p=>entry_number_panel.current = p!} textmode={"numeric"}  text={"输入你想购买的数量"} style={{marginTop:"10px",width:"100px",horizontalAlign:"center"}}/>
               <Panel style={{flowChildren:"right",align:"center center"}}>
                    <Panel  onactivate={ok} hittest={true}  style={{width:"100px",border:"2px solid #111111FF",fontSize:"28px"}}>
                         <Label text={"确定"}/>
                    </Panel>
                    <Panel  onactivate={not_ok} hittest={true} style={{width:"100px",border:"2px solid #111111FF",fontSize:"28px",marginLeft:"30px"}}>
                         <Label text={"取消"}/>
                    </Panel>
                    </Panel>
               </Panel>
               </Panel>
        }
    </Motion>
}
   
render(
<>
<BigTileWolrd/>
<Progress/>
<LargePopupBox />
<SystemProgress/>
<OkPanel/>
<OkNumberInputPanel/>
<ItemToolTip/>
<LevelCheckHud/>
<MagicCardMain/>
</>
, $.GetContextPanel());



GameEvents.Subscribe("test_map",(event:any)=>{
    const data = event.data
    let count = 0
    for(let y = 0 ; y < 8 ; y ++){
        for(let x = 0; x < 8 ; x++){
            count ++;
            if(data[count].modelname == "crass_0"){continue}
                const p =  $.CreatePanel("Image",$.GetContextPanel(),data[count].modelname + x +y *x)
                p.style.x = x * 64 + "px"
                p.style.y = y * 64 + "px"
                p.style.width = 64 + "px"
                p.style.height = 64 + "px"
                p.SetImage(`file://{images}/custom_game/map/3d/${data[count].modelname}.png`)
            }
        }
})


