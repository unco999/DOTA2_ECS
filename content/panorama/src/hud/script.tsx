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
import { AnchorPanel, PointSub, TilePanel, _flattenArrayOfTuples, applySigmoidToPoint, averageHausdorffDistance, calculateAngleBetweenVectors2D, calculateCentroid, calculateSlope, circle, cosineSimilarity, cosineSimilarityStrictlyPositive, dir, dotProduct, euclideanDistance, findMinimumHausdorffDistanceOptimized, hausdorffDistance, isPointsLikeACircle, line, luaToJsArray, normalizeData, normalizeDistances, normalizePoint, setHexOpacity, shapeDiff, splitArrayByIndex, toFixedPoint, triangle, x } from '../base';
import { Point, WorldPoint, distance } from '../utils/lib';
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

const CanVas = () =>{
    const canvas = useRef<any>()
    const cur_shape = useRef<Point[]>([])
    const brush_transition = useRef<Point[]>([])
    const switch_input = useRef<boolean>()
    const transition_index = useRef<number[]>([])
    const not_move = useRef<number>(0)
    const [str,setste] = useState<string>("当前没有输入")


    

    useInterval(3,()=>{
        if(!GameUI.IsMouseDown(0) && cur_shape.current.length > 3 ){
            not_move.current += 0.2
        }
        if(cur_shape.current.length > 3 && !GameUI.IsMouseDown(0) && distance(cur_shape.current[cur_shape.current.length - 1],GameUI.GetCursorPosition()) < 30){
            not_move.current += 0.1
        }
        if(cur_shape.current?.length > 80 || not_move.current > 10){
            const newdata = splitArrayByIndex(cur_shape.current,transition_index.current) as Point[][]
            // newdata.forEach(point => {
            //     const iff =  shapeDiff(point,liu_jiao_xing as Point[])
            //     $.Msg(iff)
            //     if(iff < 0.3){
            //           $.Msg("liu_jiao_xing")
            //     }else{
            //           $.Msg("没有liu_jiao_xing")
            //     }
            // })
            let merge_spell_data_dir:Point[] = []
            const fowrad = PointSub(cur_shape.current[1],cur_shape.current[0])!
            const center = calculateCentroid(cur_shape.current) as [number,number]
            let weight = {
                "直线":0,
                "圆形":0,
                "三角形":0,
                "x":0
            }
            let last:Point[] = []
            for(let i = 0 ; i < cur_shape.current.length ; i++){
                let point = toFixedPoint(PointSub(cur_shape.current[i],center),3)
                last.push(point)
            }
            let dirs:Point[] = []
            for(let i = 0 ; i < cur_shape.current.length; i++){
                if( cur_shape.current[i + 1]){
                    const dir_v = PointSub(cur_shape.current[i + 1], cur_shape.current[i])
                    dirs.push(dir_v)
                }
            }
            let rate:number[] = []
            for(let i = 0 ; i < dirs.length; i++){  
                if( dirs[i + 1]){ 
                    const dot = 180 - calculateAngleBetweenVectors2D(dirs[i],dirs[i + 1])
                     const crossProduct = dirs[i][0] * dirs[i + 1][1] - dirs[i][1] * dirs[i + 1][0];  
                     if (crossProduct < 0) {  
                         // 逆时针方向  
                        if(isNaN(dot!)) {
                            continue;
                        }
                        rate.push(dot)
                     } else if (crossProduct > 0) {  
                         // 顺时针方向  
                        if(isNaN(dot!)) {
                            continue;
                        }
                        rate.push(-dot)
                     } else {  
                        // rate.push(180)
                     }  
                    // const slope = calculateSlope(fowrad,dirs[i])!
                    // if(isNaN(slope!)) {
                    //     $.Msg("一样")
                    //     rate.push(0)
                    //     continue;
                    // }
                    // $.Msg("斜率sin",Math.sin(slope))
                    // rate.push(Math.sin(Math.abs(slope)))
                     // 根据向量叉积判断方向  
            
                    
                }
            }
            last = normalizeData(last)
            const deg = rate.reduce((pre,cur)=>pre+cur) / rate.length
            $.Msg(deg)
            // $.Msg("最大变化值",max_rate)
            // $.Msg("最小变化值",min_rate)
            // $.Msg("平均值",max_rate - min_rate)

            const distance1 = averageHausdorffDistance(last,circle) - deg * 0.001         
            const distance2 = averageHausdorffDistance(last,triangle) - deg * 0.001
            const distance3 = averageHausdorffDistance(last,x) - deg * 0.001
            const distance4 = averageHausdorffDistance(last,line) + deg * 0.001
            
            $.Msg("圆型得分",distance1)
            $.Msg("三角形得分",distance2)
            $.Msg("叉得分",distance3)
            $.Msg("直线得分",distance4)

            const a = [{distance:distance1,name:"圆环咒语"},{distance:distance2,name:"三角形咒语"},{distance:distance3,name:"X咒语"},{distance:distance4,name:"直线咒语"}]
            const zuidifen = a.sort((a,b)=> b.distance- a.distance).pop()
            setste(zuidifen?.name!)
            // $.Msg(diff)
            // spell_data.forEach((elm,index,array)=>{
            //     if(elm.type == "圆圈点位"){
            //         $.Msg("开启了圆圈点位")
            //         elm.points.forEach(point=>{
            //           const id = Particles.CreateParticle("particles/econ/items/shredder/hero_shredder_icefx/shredder_chakram_ice.vpcf",ParticleAttachment_t.PATTACH_WORLDORIGIN,Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
            //           Particles.SetParticleControl(id,0,[Number(point[0]),Number(point[1]),256])
            //         })
            //     }
            //     if(elm.type == "线点位"){
            //         const id = Particles.CreateParticle("particles/units/heroes/hero_jakiro/jakiro_macropyre_ice_edgeb.vpcf",ParticleAttachment_t.PATTACH_WORLDORIGIN,Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
            //         elm.points.forEach((point,index,array)=>{
            //             Particles.SetParticleControl(id,1,[Number(point[0]),Number(point[1]),256])
            //             Particles.SetParticleControl(id,0,[Number(array[0][0]),Number(array[0][1]),256])
            //         })
            //     }
            // })
            // const data = cur_shape.current.map(elm=>{
            //     const world = Game.ScreenXYToWorld(elm[0],elm[1])
            //     return {x:world[0].toFixed(),y:world[1].toFixed()}
            // })
            // GameUI.CustomUIConfig().EventBus?.emit("proxy",{data})
            cur_shape.current = []
            brush_transition.current = []
            switch_input.current = false
            canvas.current?.ClearJS("rgba(0,0,0,0)")
            transition_index.current = []
            not_move.current = 0
            return
        }
        if(GameUI.IsMouseDown(0)){
            not_move.current = 0
            cur_shape.current.push(GameUI.GetCursorPosition())
            for(let i = 0 ; i < cur_shape.current.length - 1 ; i++){
                if(transition_index.current.includes(i) || transition_index.current.includes(i + 1)){
                    continue;
                }
                canvas.current?.DrawSoftLinePointsJS(2, _flattenArrayOfTuples([cur_shape.current[i],cur_shape.current[i + 1]]), 3,6, "#FFD700")
            }
            switch_input.current = false
        }else if(!switch_input.current && !GameUI.IsMouseDown(0) && cur_shape.current.length < 80){
            switch_input.current = true
            brush_transition.current.push(GameUI.GetCursorPosition().map(elm=>([Number(elm.toFixed(0)),Number(elm.toFixed(1))])) as unknown as [number,number])
            transition_index.current.push(cur_shape.current.length)
        }
    },undefined)

    return  <>
        <Label text={str} style={{fontSize:"40px",color:"gold",textShadow:"2px 2px 8px 3.0 #333333b0",align:"center center"}}/>
        <GenericPanel hittest={false}  style={{width:"100%",height:"100%"}} ref={p=>canvas.current = p!} id="canvas1" type='UICanvas' />
    </>
    
}


const MagicCardMain = () =>{
    const [update,set_update] = useState(false)
    const cursor_position = useRef<[number,number]>([0,0])
    const compise = useRef<boolean>(false)

    const [select_card_table,set_select_card_table] = useState<Record<number,string|undefined>>({})
    const [merge,setmerge] = useState<boolean>(false)

    const [card_comp,card_link_comp_update] = useLinkComps("Card",(a,b)=>a?.index - b?.index) as [Card[],number]
    const effect_main = useRef<ScenePanel>()

    useInterval(Game.GetGameFrameTime(),()=>{
        if(GameUI.IsMouseDown(1)){
            const cur = GameUI.GetCursorPosition()
            if(distance(cur,start_check_point) < 222){
                compise.current = true
                cursor_position.current = cur
            }
        }
        else{
            if(compise.current == false) return;
            const end_point = GameUI.GetCursorPosition()
            if(compise.current && distance(end_point,end_check_point) < 222 && Object.keys(select_card_table).length > 1){
                compise.current = false
                cursor_position.current = [0,0]
                setmerge(true)
            }
        }
    },undefined,select_card_table)

    useEffect(()=>{
        if(merge == true){
            GameEvents.SendCustomGameEventToServer("c2s_card_event",{container_behavior:4,merge_data:select_card_table})
            set_select_card_table({})
            effect_main.current?.ReloadScene()
            setmerge(false)
        }
    },[merge])


    

    return <Panel hittest={false} style={{width:"1000px",height:"400px",align:"right bottom"}}>
        {card_comp?.map((elm,index)=><Card index={elm.index} merge={merge} dispatich={set_select_card_table} key={"Card"+elm?.uid }  card_data={elm}/>)}
        <DOTAScenePanel hittest={false} ref={p=>effect_main.current = p!}  style={{width:"100%",height:"100%"}} map={"magic_card_particle"} particleonly={true}/>
    </Panel>
}

const Card = ({card_data,dispatich,merge,index}:{card_data:Card,index:number,merge:boolean,dispatich:React.Dispatch<React.SetStateAction<Record<number, string|undefined>>>}) =>{
    const main = useRef<Panel>()
    const dummy = useRef<Panel>()
    const card_label = useRef<Panel>()
    const card_effect = useRef<ScenePanel>()
    const is_select = useRef<boolean>(false)

    useEffect(()=>{
        main.current?.AddClass(`card_index_${index}`)
        dummy.current?.AddClass(`dummy_index_${index}`)
        card_effect.current?.AddClass(`card_index_${index}`)
        return () =>{
            main.current?.RemoveClass(`card_index_${index}`)
            dummy.current?.RemoveClass(`dummy_index_${index}`)
            card_effect.current?.RemoveClass(`card_index_${index}`)
        }
    },[index])

    const translate = (p?:Panel) =>{
        p?.RemoveClass(`init`)
        p?.AddClass(`card_index_${index}`)
    }

    useEffect(()=>{
        if(merge && is_select.current == true){
            main.current?.AddClass("merge")
            main.current?.RemoveClass("select")
            main.current?.RemoveClass("mouseover")
            main.current?.RemoveClass(`card_index_${index}`)

             card_effect.current?.AddClass("merge")
             card_effect.current?.RemoveClass("select")
             card_effect.current?.RemoveClass("mouseover")
             card_effect.current?.RemoveClass(`card_index_${index}`)
        }
    },[merge])

    const onmouseover = (p:Panel) =>{
        if(is_select.current == true) return
        main.current?.AddClass("mouseover")
        card_effect.current?.AddClass("mouseover")
    }
    
    const onmouseout = (p:Panel) =>{
        main.current?.RemoveClass("mouseover")
        card_effect.current?.RemoveClass("mouseover")
    }

    const dclick = (p:Panel) =>{
        is_select.current = !is_select.current 
        main.current?.ToggleClass("select")
        card_effect.current?.ToggleClass("select")
        if(is_select.current == true){
            dispatich(elm=> ({...elm,[index]:card_data?.uid}))
        }else{
            dispatich(elm=> ({...elm,[index]:undefined}))
        }
    }

    // const ondrag = (p:Panel) => {
    //     const abilityindex = Entities.GetAbility(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()),0)
    //     const a = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
    //     Abilities.ExecuteAbility(abilityindex,a,false)
    // } 
 
    const dbclieck = (p:Panel) =>{
        $.Msg("dbclieck",card_data.uid)
        GameEvents.SendCustomGameEventToServer("c2s_card_event",{container_behavior:16,merge_data:{1:card_data.uid}})
    }

    return <>
            <Image src={"file://{images}/custom_game/card/" + card_data.image + ".png"} onload={translate} hittest={false} ref={p=>main.current=p!} className={`card`}>
             <Label hittest={false} text={card_data?.card} ref={p=>card_label.current = p!} className={`card_label`}/>
            </Image>
            <DOTAScenePanel hittest={false} ref={p=>card_effect.current = p!} className={`card mask`} map={"card_effect"} particleonly={true}/>
            <Panel ondblclick={dbclieck} onactivate={dclick} hittest={true} ref={p=>dummy.current = p!} onmouseover={onmouseover} onmouseout={onmouseout} className={`card_dummy`}/>
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
<CanVas/>
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

