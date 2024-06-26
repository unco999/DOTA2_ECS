import { useState, useEffect, useRef } from "react";
import { useNetTableKey } from "react-panorama-x";
import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { useLocalEvent } from "../utils/event-bus";


export const CreateMap = () =>{

    const map = useRef<string>()
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [cur_state,setState] = useState<keyof typeof main_style>("init")

    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(cur_state)
        setState(key as keyof typeof main_style)
    }


    const main_style = {
        "init": {
            scale: 5,
            op: 0,
        },
        "spawn":{
            scale: 1,
            op: 1,
        },
    }

    useLocalEvent("OpenCreateMap",()=>{
        next_state("spawn")
    })
    

    const click = () =>{
        GameUI.CustomUIConfig().EventBus?.emit("create_map",map.current);
        next_state("init")
    }

    const un_click = () =>{
        next_state("init")
    }

    return <Motion key={"CreateName" + cur_state} defaultStyle={main_style[last_state]} style={{scale:spring(main_style[cur_state].scale),op:spring(main_style[cur_state].op)}}>
        { (style:any) => 
        <Panel onactivate={un_click} style={{preTransformScale2d:style.scale.toFixed(7),opacity:style.op.toFixed(7),width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.9)"}}>
        <Panel style={{align:"center center",height:"50%",width:"100%",backgroundColor:"rgba(255,255,255,0.5)"}}>
            <Panel style={{flowChildren:"down",align:"center center"}}>
             <Label text="请选择地图" style={{color:"black",align:"center center",fontSize:"40px"}} />
             <Label onactivate={click} text="确认" style={{backgroundColor:"yellow",color:"black",align:"center center",fontSize:"23px"}} />
            </Panel>
        </Panel>
    </Panel>
    }
    </Motion>
}