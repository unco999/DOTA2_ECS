import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer } from '../hooks/useComp';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { Shop } from './shop';

const NpcMain = () => {
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("center")
    const [shop_type,set_shop_type] = useState(0) 

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
            marginTop:0
        },
        "center":{
            width: 888,
            height: 333,
            opacity: 1,
            marginTop:0
        },
        "down":{
            width: 888,
            height: 333,
            opacity: 1,
            marginTop:350
        },
    }
    
    /**更换状态只能用这个接口 */
    const next_state = (key:string,shop_type:number) => {
        set_last_state(state)
        setState(key)
        set_shop_type(shop_type)
    }

    return  <Panel style={{width:"100%",height:"100%"}}>
        <Motion key={"big_world" + state} defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
        marginTop:spring(main_style[state].marginTop),
    }}> 
        {(style:any)=>
        <>
        {/* <Image src={"file://{images}/custom_game/ui/npc/jiben_duihua.png"} style={{width:style.width + "px",height:style.height + "px",marginTop:style.marginTop + "px",align:"center center",flowChildren:"down",borderRadius:"20px"}}> */}
        <Image style={{backgroundColor:"rgba(0,0,0,0.2)",width:style.width + "px",height:style.height + "px",marginTop:style.marginTop + "px",align:"center center",flowChildren:"down",borderRadius:"20px"}}>
        <Dialog/>
        <Option next_state={next_state}/>
        </Image>
        </>
        }
    </Motion>
    </Panel>
}

/**对话框选择 */
const Option = ({next_state}:{next_state:Function}) =>{

    const wrap_option = (shop_type:number) => () => {
        next_state("down",shop_type)
    }

    const option = [{tile:"购买商品",goto:wrap_option(0)},{tile:"维修装备",goto:wrap_option(1)},{tile:"附近有什么",goto:wrap_option(2)}]


    return <Panel style={{marginTop:"-110px",align:"center center",flowChildren:"right"}}>{option.map(elm=><Label onactivate={elm.goto} className={"hit"} key={elm.tile + "Option"} style={{marginLeft:"10px",textShadow:"0px 0px 0px 2.5 #333333b0",color:"#FFFFE0"}} text={elm.tile}/>)}</Panel>
}

/**基本对话 */
const Dialog = () =>{
    const t = `在现实认知观的基础上，对其描写成非常态性现象。是文学体裁的一种，
    侧重于事件发展过程的描述。强调情节的生动性和连贯性，较适于口头讲述。已经发生事。或者想象
    故事。故事一般都和原始人类的生产生活有密切关系，他们迫切地希望认识自然，于是便以自`

    return <Label style={{maxWidth:"777px",align:"center center",marginTop:"100px",textShadow:"0px 0px 0px 2.5 #333333b0",color:"#FFD700"}} text={t}/>
}



export const Portrait = ({camera}:{camera:string}) =>{
    const main = useRef<ScenePanel>()

    onLocalEvent("next_shop",(event)=>{
        main.current?.FireEntityInput("tileset3","SetAnimation",`greeting`)

    })

    onLocalEvent("back_shop",(event)=>{
        main.current?.FireEntityInput("tileset3","SetAnimation",`greeting`)
    })

    return <DOTAScenePanel ref={p=>main.current = p!} key={"Portrait" + camera} antialias={true} style={{saturation:"0.5",width:"1920px",height:"1080px"}} map={"prefabs/npc"} camera={camera} particleonly={false} light={"light1"} />
}


render(<Shop/>,$.GetContextPanel())