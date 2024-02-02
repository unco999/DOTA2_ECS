import { useState, useEffect, useRef } from "react";
import { useNetTableKey } from "react-panorama-x";
import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { useLocalEvent } from "../utils/event-bus";
import { useXstate } from "../hooks/useXstate";


export const CreateButton = ({opacity}:{opacity:number}) =>{
    
    const [check_ui,xstate_send] = useXstate("ui_main","ui_main_role","ui_main_role","role_create")

    //上一步
    const last_step = () =>{
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:"是否确定返回角色选择?",
            type:"ui=>ui_main_role=>back",
            uuid:Math.random().toFixed(6),
        })
    }

    //确定创造角色
    const create_role = () =>{
        GameUI.CustomUIConfig().EventBus?.emit("create_role",{})
    }

    return <> 
        {check_ui && <Panel style={{flowChildren:"right",align:"right bottom",opacity:opacity?.toString() ?? "0"}}>
            <Panel onactivate={create_role} style={{width:"100px",height:"60px",backgroundColor:"rgba(200,200,200,0.5)"}}>
                <Label text={"创建"} style={{fontSize:"40px",color:"black",align:"center center"}}/>
            </Panel>
            <Panel onactivate={last_step} style={{width:"200px",marginLeft:"40px",height:"60px",backgroundColor:"rgba(200,200,200,0.5)"}}>
                <Label  text={"上一步"} style={{fontSize:"40px",color:"black",align:"center center"}}/>
            </Panel>
        </Panel>}
        </>
}