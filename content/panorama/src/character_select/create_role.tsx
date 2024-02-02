import { useState, useEffect, useRef } from "react";
import { useNetTableKey } from "react-panorama-x";
import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { useLocalEvent } from "../utils/event-bus";
import { CreateButton } from "./create_end";
import { useXstate } from "../hooks/useXstate";


const ATTIRBUTE_TABLE = {
    strength_up : "strength_up",
    intelligence_up : "intelligence_up",
    dexterity_up : "dexterity_up",
    attack_damage_up : "attack_damage_up",
    magic_resistance_up : "magic_resistance_up",
    flame_attack_up : "flame_attack_up",
    ice_attack_up : "ice_attack_up",
    lightning_attack_up : "lightning_attack_up",
    shadow_attack_up : "shadow_attack_up",
    fire_resistance_up : "fire_resistance_up",
    frost_resistance_up : "frost_resistance_up",
    lightning_resistance_up : "lightning_resistance_up",
    storm_resistance_up : "storm_resistance_up"
}

const ATTIRBUTE_TABLE_SCALAR = {
    strength_up : 1,
    intelligence_up : 1,
    dexterity_up : 1,
    attack_damage_up : 1,
    magic_resistance_up : 1,
    flame_attack_up : 1,
    ice_attack_up : 1,
    lightning_attack_up : 1,
    shadow_attack_up : 1,
    fire_resistance_up : 1,
    frost_resistance_up : 1,
    lightning_resistance_up : 1,
    storm_resistance_up :1
}

export const CreateRoleMain = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [name,set_name] = useState<string>()
    const [create_hero,set_create_hero] = useState<string>()
    
    const [check_ui,xstate_send] = useXstate("ui_main","ui_main_role","ui_main_role","role_create",
        (on:boolean)=>{
            if(on){
                next_state("spawn")
            }else{
                next_state("init")
            }
        }
    )

    const clear = () =>{
        set_name(undefined)
        set_create_hero(undefined)
    }

    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

    useLocalEvent("create_name",(event)=>{
        set_name(event)
    })
    

    useLocalEvent("create_hero",(event)=>{
        $.Msg("接受到换英雄的事件",event)
        set_create_hero(event)
    })

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 100,
            height: 100,
            opacity: 0,
            x:1920
        },
        "spawn":{
            width: 100,
            height: 100,
            opacity: 1,
            x:0
        },
        "exit":{
            width: 100,
            height: 100,
            opacity: 0,
            x:-1920,
        },
    }


    return  <Motion key={"CreateRoleMain" + state} defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
        x: spring(main_style[state].x),
    }}> 
        {(style:any) =>
        <>
            <Panel
            hittest={false}
          style={{x:style.x.toFixed(3) + "px",opacity:style.opacity.toFixed(3),width:style.width.toFixed(3) + "%",height:style.height.toFixed(3) + "%",backgroundColor:"#E9E9E9"}}
          >
            <Panel className="create_role" style={{width:"100%",height:"100%"}}>
                <DOTAScenePanel key={"CreateRoleMain" + create_hero}  hittest={false} style={{width:"100%",height:"100%"}} map="ui/dota_hud_loadout_2022" camera="hero_camera" light="hero_light" antialias={true} particleonly={false} unit={create_hero ?? "npc_dota_hero_rubick"}/>
                <SelectAttriubute name={create_hero!} origin_hero_name={name!}/>
            </Panel>
          </Panel>
         <CreateButton opacity={style.opacity.toFixed(3)}/>
         </> 
        }
     </Motion>
}

type TOTAL_DISPATH = (val: number, scalar: number, attribute_name:string)=>void

const SelectAttriubute = ({name,origin_hero_name}:{name:string,origin_hero_name:string}) =>{
    /**总初始点数 */
    const [total_point,set_total_point] = useState<number>(100)
    const attribute_table = useRef<Record<string,{val:number,max:number}>>({})
    const crate_role_tag = useNetTableKey("system_tag","PLAYER_OPEN_ROLE");


    useLocalEvent("create_role",(event)=>{
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:"是否确定创建角色?",
            type:"check_create_role",
            uuid:Math.random().toFixed(6),
            data:{
                origin_hero_name,
                hero_name:name,
                attribute_table:attribute_table.current
            }
        })
    })

    useEffect(()=>{
        if(crate_role_tag?.PLAYER_OPEN_ROLE != 1){
            clear()
            return
        }
    },[])

    const clear = () =>{
        attribute_table.current = {}
        set_total_point(100)
    }

    /**所有属性组件计算总属性方法 */
    const change_total_point:TOTAL_DISPATH = (val:number,scalar:number,attribute_name:keyof typeof attribute_table.current) =>{
        const current = val * scalar
        let total= 0 

        if(total_point == 0 && current == 1){
            return;
        }

        if(attribute_table.current[attribute_name]){
            attribute_table.current[attribute_name].val += current
        }else{
            attribute_table.current[attribute_name] = {val:current,max:100}
        }

        for(let i in attribute_table.current){
            total += attribute_table.current[i].val
        }

        let sub = 100 - total;
        if(sub < 0){
            set_total_point(0)
        }else{
            set_total_point(sub)
        }
    }

    return <Panel style={{flowChildren:"down",x:"1300px",borderRadius:"15px",verticalAlign:"center",width:"600px",height:"750px",backgroundColor:"rgba(0,0,0,0.5)"}}>
        <Label text={"剩余点数:" + total_point} style={{marginTop:"30px",fontSize:"40px",color:"black",horizontalAlign:"center"}}/>
        <Panel style={{flowChildren:"right-wrap"}}>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.attack_damage_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.attack_damage_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.dexterity_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.dexterity_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.fire_resistance_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.fire_resistance_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.flame_attack_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.flame_attack_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.ice_attack_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.ice_attack_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.intelligence_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.intelligence_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.lightning_attack_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.lightning_attack_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.lightning_resistance_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.lightning_resistance_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.magic_resistance_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.magic_resistance_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.shadow_attack_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.shadow_attack_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.storm_resistance_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.storm_resistance_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.strength_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.strength_up}/>
            <Attribute m_val={attribute_table.current[ATTIRBUTE_TABLE.frost_resistance_up]} total_point={total_point} dispatch={change_total_point} tile={ATTIRBUTE_TABLE.frost_resistance_up}/>
            <SpecialAttribute open_panel_name="OpenCreateName" val={origin_hero_name} tile={"创造名字"}/>
            <SpecialAttribute open_panel_name="OpenCreateMap" tile={"选择地图"}/>
            <SpecialAttribute open_panel_name="OpenCreateHero" val={name} tile={"选择本体"}/>
            <Introduce/>
        </Panel>
    </Panel>
}

const Attribute = ({tile,dispatch,total_point,m_val}:{total_point:number,m_val:{val:number,max:number},tile:string,dispatch:TOTAL_DISPATH}) =>{

    const onvaluechanged = (val:number) =>{
        if(total_point == 0 && val == 1){
            return
        } 
        if((m_val?.val == 0 && val == -1 )|| (m_val == undefined && val == -1)){
            return
        }
        const scalar = ATTIRBUTE_TABLE_SCALAR[tile as keyof typeof ATTIRBUTE_TABLE_SCALAR]
        const last_val = scalar * val
        dispatch(last_val,scalar,tile)
    }


    return <Panel style={{margin:"20px",width:"100px",height:"90px",border:"2px solid #111111FF",flowChildren:"down"}}>
        <Label text={$.Localize("#"+tile)} style={{color:"black",fontSize:"15px",horizontalAlign:"center",marginBottom:"10px"}}/>
        <Panel style={{flowChildren:"right"}}>
        <Label onactivate={p=>onvaluechanged(1)} text={"+"} style={{align:"center center",width:"35px",height:"35px",fontSize:"40px",color:"yellow"}}/>
        <Label text={m_val?.val ?? 0} style={{color:"black",align:"center  center",fontSize:"33px"}}/>
        <Label onactivate={p=>onvaluechanged(-1)} text={"-"} style={{marginLeft:"10px",marginBottom:"20px",align:"center  center",width:"35px",height:"35px",fontSize:"40px",color:"yellow"}}/>
        </Panel>
    </Panel>
}

const SpecialAttribute = ({open_panel_name,val,tile}:{open_panel_name:string,val?:string,tile:string}) =>{

    const click = () =>{
        GameUI.CustomUIConfig().EventBus?.emit(open_panel_name);
    }


    return <Panel onactivate={click} style={{height:"90px",width:"110px",margin:"20px",border:"2px solid #111111FF",flowChildren:"down"}}>
       <Label text={tile} style={{color:"black",fontSize:"23px",align:"center center",marginBottom:"10px"}}/>
       <Label text={val} style={{color:"black",fontSize:"43px",align:"center center"}}/>
    </Panel>
}

//介绍
const Introduce = () =>{
    return <Panel style={{horizontalAlign:"center"}}>
        <Label text={"介绍"} style={{maxWidth:"500px",color:"black",fontSize:"23px"}}/>
    </Panel>
}