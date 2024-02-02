import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer } from '../hooks/useComp';
import { FC, useEffect, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { LocalEvent } from '../def/local_event_def';
import { useXstate } from '../hooks/useXstate';
import { Login } from '../hud/script';
    
export const Load = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("spawn")

     const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
            x:0
        },
        "spawn":{
            width: 100,
            height: 100,
            opacity: 1,
            x:0
        },
    }

    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }
    
    const [check_ui,xstate_send] = useXstate("ui_main","ui_load_role_data",null,null,
        (on:boolean,cur_xstate,cur_state)=>{
            if(on){
                next_state("spawn")
                return
            }else{
                 next_state("init")
                 return
            }
        }
    )

    return <Motion key={"Load" + Math.random()} defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
    }}> 
        {(style:any)=>
            <Panel style={{
                width:style.width.toFixed(6) + "%",
                height:style.height.toFixed(6) + "%",
                opacity:style.opacity.toFixed(6),
                align:"center center",
                backgroundColor:"white",
                zIndex:1
            }}>
                <Panel style={{align:"center center",width:"100%",height:"140px",border:" 2px solid #111111FF"}}>
                </Panel>
            </Panel>
        }
    </Motion>
}
