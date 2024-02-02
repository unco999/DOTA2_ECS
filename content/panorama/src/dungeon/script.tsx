import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer } from '../hooks/useComp';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { useXstate } from '../hooks/useXstate';


const TileSet = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [tileset,tileset_update] = useCompWithPlayer("RoleTileSetInfo",Players.GetLocalPlayer());
    const [xstate,send_xstatet] = useXstate("ui_main","ui_tileset_map","ui_tileset_map","ui_tileset_map_init")

    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

    

    useEffect(()=>{
        $.Msg(xstate)
        if(xstate){
            next_state("spawn")
        }else{
            next_state("init")
        }
    },[xstate])

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
        },
        "spawn":{
            width: 100,
            height: 100,
            opacity: 1,
        },
    }

        return <Motion key={state + "TileSet"} defaultStyle={{...main_style[last_state],x:0,y:0}} style={
        {
            width: spring(main_style[state].width),
            height: spring(main_style[state].height),
            opacity: spring(main_style[state].opacity),
        }
        }>
            {(style:any) =>
                <Panel style={{
                  width: style.width + "%",
                  height: style.height + "%",
                  opacity: style.opacity?.toString(),
                  backgroundColor: "white",
                  align:"center center",}}>
                    <Label text={"进入TileSet" + tileset?.tileset_name} style={{align:"center center",fontSize:"80px",color:"black"}}/>
                </Panel>
            }    
        </Motion>
}


const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
  "init": {
      width: 0,
      height: 0,
      opacity: 0,
  },
  "spawn":{
      width: 100,
      height: 100,
      opacity: 1,
  },
}

const Test: FC = () => {
    const tag = useNetTableKey("player_tag","player" + Players.GetLocalPlayer())
    const [surrounding_comp,surrounding_comp_update] = useCompWithPlayer("SurroundingMaps",Players.GetLocalPlayer());
    const [move_comp,move_comp_update] = useCompWithPlayer("Move",Players.GetLocalPlayer());

    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")

    const [move_lock,set_move_lock] = useState<boolean>(false)
    const [move_block_animation,set_move_block_animation] = useState({x:5,y:5})


    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

    useEffect(()=>{
        if(tag?.Dungeon == 1){
            next_state("spawn")
            return
        }
    },[tag?.Dungeon])

    useEffect(()=>{
         /* 如果玩家进入了3d场景 那么直接关闭这个UI */
        if(tag?.In3DScene == 1){
            next_state("init")
            return
        }
        if(tag?.In3DScene != 1 && tag?.Dungeon == 1){
            next_state("spawn")
            return
        }
    },[tag?.In3DScene])



    return <Motion key={state + "main_map"} defaultStyle={{...main_style[last_state],x:0,y:0}} style={
        {
            width: spring(main_style[state].width),
            height: spring(main_style[state].height),
            opacity: spring(main_style[state].opacity),
            x:spring(move_block_animation.x),
            y:spring(move_block_animation.y)
        }
        }>
         {(style:any) => 
             <Panel style={{
                  width: style.width + "%",
                  height: style.height + "%",
                  opacity: style.opacity?.toString(),
                  backgroundColor: "white",
                  align:"center center",
             }}>

             <Panel style={{
                  width:"100%",
                  height:"90%",
                  backgroundColor:"#0d1c22ff",
                  x:Math.ceil(style.x * 3) + "px",
                  y:Math.ceil(style.y * 3) + "px",
                  align:"center center"
             }}>
                <Panel style={{
                  x:Math.ceil(style.x * 4) + "px",
                  y:Math.ceil(style.y * 4) + "px",
                  width:"66%",
                  height:"66%",
                  backgroundColor:"WHITE",
                  align:"center center"
                 }}>
                {   Object.keys(surrounding_comp!.maps_ent).map((key:keyof compc_surrounding_maps['maps_ent'],index)=>{
                        return <MapBlock move_block_animation={move_block_animation} set_move_block_animation={set_move_block_animation}  move_lock={move_lock} set_move_lock={set_move_lock} key={"surrounding_comp!.maps_ent" + index} data={surrounding_comp!.maps_ent[key]} role_move_comp={move_comp!}/>
                    })
                }
                {
                    <Role key={"Role"} role_move_comp={move_comp!}/>
                }
                </Panel>
             </Panel>
            </Panel>
         }
  </Motion>
};


const Role = ({role_move_comp}:{role_move_comp:compc_Move}) => {
    const [last_state,set_last_state] = useState(role_move_comp)

    useEffect(()=>{
        $.Schedule(0.5,()=>set_last_state(role_move_comp))
    },[role_move_comp])

    return <Motion defaultStyle={{x:Number(last_state.x),y:Number(last_state.y)}} style={{x:spring(Number(role_move_comp.x)),y:spring(Number(role_move_comp.y))}}> 
    {(style:any) => {
       return <DOTAHeroImage
     style={{ 
        align:"center center",
     }}
     heroimagestyle="icon" heroid={23 as HeroID}/>
    }}
    </Motion>
}

/**
 * 地图板块
 */
const MapBlock = ({data
    ,role_move_comp
    ,set_move_lock
    ,move_lock
    ,move_block_animation
    ,set_move_block_animation
    }
    :{move_lock:boolean,
        data:compc_surrounding_maps['maps_ent'][any],
        role_move_comp:compc_Move,
        move_block_animation:{x:number,y:number},
        set_move_block_animation:React.Dispatch<React.SetStateAction<{x:number,y:number}>>
        set_move_lock:React.Dispatch<React.SetStateAction<boolean>>}) =>{

    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("spawn")




    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

    useEffect(()=>{
        next_state("spawn")
    },[])

    const get_relative_xy = useMemo(() => {
        const r_x =  (Number(data.MapBaseBlock.x) - Number(role_move_comp.x) )
        const r_y =  (Number(data.MapBaseBlock.y) - Number(role_move_comp.y) )
        return {x:r_x,y:r_y,z:0}
    },[data.MapBaseBlock.x,data.MapBaseBlock.y,role_move_comp.x,role_move_comp.y])



    const is_can_move = () => {
        if(move_lock){
            return false
        }
        if(Math.abs(get_relative_xy.x) + Math.abs(get_relative_xy.y) == 1){
            return true
        }
    }


    const click_move = () =>{
        if(!is_can_move()) return
        GameEvents.SendCustomGameEventToServer("c2s_dungeon_move_to_xy",{x:data.MapBaseBlock.x,y:data.MapBaseBlock.y})
        set_move_lock(true)
        set_move_block_animation({x:data.MapBaseBlock.x - Number(role_move_comp.x),y:data.MapBaseBlock.y - Number(role_move_comp.y)})
        $.Schedule(0.5,()=>{
            set_move_lock(false)
            set_move_block_animation({x:0,y:0})
        })
    }

    const MapBlock_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
        },
        "spawn":{
            width: 64,
            height: 64,
            opacity: 1,
        },
      }


    return  <Panel
              style={{
                x:Math.ceil(get_relative_xy.x * 63.99) + "px",
                y:Math.ceil(get_relative_xy.y * 63.99) + "px",
                align:"center center",
              }}
            >
                <Image
                src={`file://{images}/custom_game/map/test/${ data.MapBaseBlock.image_name }.png`}
                hittest={true} onactivate={click_move} style={{

                  preTransformRotate2d:data.MapBaseBlock.rotation * 90 + "deg",
                  align:"center center",
                  width: 64 + "px",
                  height: 64+ "px",
                  opacity: "1",
                  saturation: "0.8",
                  brightness:"0.8",
                }}>
                </Image>
                <Label text={ (data.Creep?.name && "怪物") ?? (data.Event?.name && "事件") ?? ``} style={{align:"center center",fontSize:"17px",color:"WHITE",textShadow:"2px 2px 8px 3.0 #333333b0"}}/>
            </Panel>
}


   
render(<TileSet />, $.GetContextPanel());

