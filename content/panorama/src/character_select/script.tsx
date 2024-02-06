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
import { CreateRoleMain } from './create_role';
import { CreateName } from './create_name';
import { CreateMap } from './create_map';
import { CreateHero } from './create_hero';
import { useXstate } from '../hooks/useXstate';
import { Login } from '../hud/script';
import { Loading } from '../base';

const Main = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("spawn")
    const [state,setState] = useState<keyof typeof main_style>("spawn")
    const [role_data,update] = useCompWithPlayer("RoleSlot",Players.GetLocalPlayer());
    const sun = useRef<ScenePanel>()
    const main = useRef<ImagePanel>()

    const [check_ui,xstate_send] = useXstate("ui_main","ui_main_role","ui_main_role","role_select",
        (on:boolean,cur_xstate,cur_state)=>{
            if(on){
                next_state("spawn")
                return
            }else if(cur_state == "role_create"){
                next_state("create_role")
                return
            }else{
                 next_state("init")
                 return
            }
        }
    )





    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }


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
        "create_role":{
            width: 100,
            height: 100,
            opacity: 0,
            x:-1920,
        },
    }


    return  <Motion defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
        x: spring(main_style[state].x),
    }}> 
        {(style:any) => 
         <Panel
          style={{x:style.x.toFixed(3) + "px",opacity:style.opacity.toFixed(3),width:style.width.toFixed(3) + "%",height:style.height.toFixed(3) + "%",backgroundColor:"#E9E9E9"}}
          >
            <Image ref={p=>main.current = p!} hittest={false} src="file://{images}/custom_game/ui/main_role_select.png" style={{width:"100%",height:"100%"}}>
                <CanSelectRole role_data={role_data} index={1}/>
                <CanSelectRole role_data={role_data} index={2}/>
                <CanSelectRole role_data={role_data} index={3}/>
                <CanSelectRole role_data={role_data} index={4}/>
                <SelectPanel role_data={role_data} index={1}/>
                <SelectPanel role_data={role_data} index={2}/>
                <SelectPanel role_data={role_data} index={3}/>
                <SelectPanel role_data={role_data} index={4}/>
            </Image>
          </Panel>
        }
     </Motion>
}


const CanSelectRole = ({index,role_data}:{index:number,role_data:WAIT_TYPE<RoleSlot>|undefined}) => {
    const data = role_data?.[("slot" + index) as keyof typeof role_data]

    

    return <Panel style={{width:"300px",height:"500px",flowChildren:'down',x:(index - 1) * 459 + 160 + "px",y:"230px",borderRadius:"15px"}}>
        {data?.wait == "wait" &&  <Loading offsety={-120}/>}
        {data && <DOTAHeroMovie heroname={data?.hero_name} style={{marginTop:"20px",borderRadius:"15px",horizontalAlign:"center"}}/>}
    </Panel>
}

const SelectPanel = ({index,role_data}:{index:number,role_data:WAIT_TYPE<RoleSlot>|undefined}) => {

    const remove_role = () =>{
        if(role_data?.[("slot" + index) as keyof typeof role_data]?.hero_name == null){
            GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                tag_name:"没找到角色 无法删除!",
                player_id:Players.GetLocalPlayer(),
            })
            return
        }
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:"是否确定删除角色?",
            type:"remove_role",
            uuid:Math.random().toFixed(6),
            data:{uuid:role_data?.[("slot" + index) as keyof typeof role_data]?.uuid,slot:index},
        })
    }

    const create_role = () =>{
        const data = role_data?.[("slot" + index) as keyof typeof role_data] 
        if(data?.hero_name != null){
            GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                tag_name:"这个位置已经有角色了",
                player_id:Players.GetLocalPlayer(),
            })
            return
        }
        for(let i = 1;i <= 4;i++){
            if(i == index && role_data?.[("slot" + i) as keyof typeof role_data]?.hero_name == null){
                GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
                    title:"是否开始创造角色?",
                    type:"ui=>ui_main_role=>next",
                    uuid:Math.random().toFixed(6),
                    data:{slot:index}
                })
                return;
            }
            if(role_data?.[("slot" + i) as keyof typeof role_data]?.hero_name == null){
                GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                    tag_name:"请在空位上创建角色,比如第" + i + "个位置",
                    player_id:Players.GetLocalPlayer(),
                })
                $.Msg("发送了事件")
                return
            }
        }
    }

    const in_game = () =>{ 
        if(role_data?.[("slot" + index) as keyof typeof role_data]?.hero_name == null){
            GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                tag_name:"没找到角色 无法进入游戏!",
                player_id:Players.GetLocalPlayer(),
            })
            return
        }
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:`是否选择${role_data?.[("slot" + index) as keyof typeof role_data]?.origin_name}是否进入游戏?`,
            type:"in_game",
            uuid:Math.random().toFixed(6),
            data:{uuid:role_data?.[("slot" + index) as keyof typeof role_data]?.uuid,slot:index}
        })
    }

    const data = role_data?.[("slot" + index) as keyof typeof role_data]

    const x = (index - 1) * 459 + 165 + "px"

    return  <>
             <Panel onactivate={()=>in_game()} style={{x,y:"580px",width:"290px",height:"30px",marginTop:"20px", }}>
            <Label text={"进入游戏"} style={{align:"center center",color:"black",textShadow:"0px 0px 0px 1.0 #333333b0"}}/>
        </Panel>
        <Panel onactivate={()=>create_role()} hittest={true} style={{x,y:"850px",width:"290px",height:"30px",marginTop:"20px", }}>
            <Label text={"创建角色"} style={{align:"center center",color:"black",textShadow:"0px 0px 0px 1.0 #333333b0"}}/>
        </Panel>
        <Panel onactivate={remove_role} hittest={true} style={{x,y:"894px",width:"290px",height:"30px",marginTop:"20px", }}>
            <Label text={"删除角色"}  style={{align:"center center",color:"black",textShadow:"0px 0px 0px 1.0 #333333b0"}}/>
        </Panel>
        {data && <Label text={data?.origin_name} style={{x:(index - 1) * 463 - 662 + "px",y:"710px",color:"Yellow",fontSize:"30px",horizontalAlign:"center"}}/>}
        </>

}



const Glow = () =>{
    const [state,setstate] = useState(false)

    useEffect(()=>{
        GameUI.SetMouseCallback((eventName:any, arg:any)=>{
            if(eventName == "pressed" || arg == 0 && !$("#clieck_effect").BHasClass("scan-effect")){
                $("#clieck_effect").TriggerClass("scan-effect")
            }
            return true
        })
    },[])

    return <>
        <DOTAParticleScenePanel hittest={false} key={"Glow" + 1} style={{zIndex:5,width:"100%",height:"100%"}} cameraOrigin={[800,-350,-300]} lookAt={[0,0,0]} particleName={"particles/ui/ui_versus_hline_lensflare.vpcf"} /> 
        <DOTAParticleScenePanel hittest={false} key={"Glow"} style={{zIndex:5,width:"100%",height:"100%"}} cameraOrigin={[100,100,100]} fov={120} lookAt={[0,0,0]} particleName={"particles/sub_line_glow.vpcf"} />
        <Image hittest={false} id="clieck_effect"  src="file://{images}/custom_game/ui/cam.png"style={{S2MixBlendMode:"screen",width:"100%",height:"100%"}}/>
        </>
}




render(<>
<CreateRoleMain/>
<CreateName/>
<CreateMap/>
<CreateHero/>
<Main/>
{/* <Glow/> */}
</>,$.GetContextPanel())