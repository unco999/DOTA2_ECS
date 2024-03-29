import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useGameEvent, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { emitLocalEvent, onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer, useCompWithSystem, useLinkComps } from '../hooks/useComp';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { LocalEvent } from '../def/local_event_def';
import { AnchorPanel, PointSub, TilePanel, _flattenArrayOfTuples, applySigmoidToPoint,getRandomHexColor, averageHausdorffDistance, calculateAngleBetweenVectors2D, calculateCentroid, calculateSlope, circle, cosineSimilarity, cosineSimilarityStrictlyPositive, dir, dotProduct, euclideanDistance, findMinimumHausdorffDistanceOptimized, hausdorffDistance, isPointsLikeACircle, line, luaToJsArray, normalizeData, normalizeDistances, normalizePoint, setHexOpacity, splitArrayByIndex, toFixedPoint, triangle1,triangle2, x, WindowsAdapter, xline, toFixed4, toFixed4String, shake, groupByKey, areSegmentsParallel, sigmoid, chunk, angleBetweenPoints, groupByPredicate, crossProduct2D } from '../base';
import { Point, WorldPoint, check, distance, val } from '../utils/lib';
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

const CanVas = ({merge_card}:{merge_card:Record<number,string|null>}) =>{
    const canvas = useRef<any>()
    const cur_shape = useRef<Point[]>([])
    const brush_transition = useRef<Point[]>([])
    const switch_input = useRef<boolean>()
    const transition_index = useRef<number[]>([])
    const not_move = useRef<number>(0)
    const [str,setste] = useState<string>("当前没有输入")
    const effect = useRef<ScenePanel>()


    const clear = () =>{
        cur_shape.current = []
        brush_transition.current = []
        switch_input.current = false
        canvas.current?.ClearJS("rgba(0,0,0,0)")
        transition_index.current = []
        not_move.current = 0
        effect.current!.FireEntityInput("cursor","SetControlPoint",`3:0 0 0 `)
    }


    const check_radius = (points:Point[],center:Point) => {
        let radius = 0
        points.forEach(elm=>{
            const temp = distance(elm,center)
            if(temp > radius){
                radius = temp
            }
        })
        return toFixed4(radius)
    }

    const to_world = (min:SpellCardData,elm:Point[],center:Point) =>{ 
        if(min ==null || elm == null){
            return
        }
        // min!.screen_center = center
        const world_center = Game.ScreenXYToWorld(min!.center![0],min!.center![1]).map(elm=>toFixed4(elm)) as [number,number,number]
        const world_vexter = min?.vertex?.map(elm=>{
            const world_point = Game.ScreenXYToWorld(...elm)
            return [toFixed4(world_point[0]),toFixed4(world_point[1]),256]
        }) 
        switch(min?.name){
            case "circle":{
                min.center = world_center
                min.radius = check_radius(elm,center)
                break;
            }
            case "triangle":{
                min.center = world_center
                min.radius = check_radius(elm,center)
                break;
            }
            case "x":{
                min.center = world_center
                min.radius = check_radius(elm,center)
                break;
            }
            case "line":{
                min.center =  world_center 
                min.vertex = world_vexter as any
                break;   
            }
            case "xline":{
                min.center = world_center
                min.vertex = world_vexter as any
                break;    
            }
        }
        return min
    }


    const input = () =>{
        const newdata = splitArrayByIndex(cur_shape.current,transition_index.current) as Point[][]
        const input_list = newdata.map(elm=>{
            const center = calculateCentroid(elm) as Point

            // const center = toFixedPoint(calculateCentroid(elm) as Point,4) as [number,number]
            let last:Point[] = []

            let left = 99999
            let right = -99999
            let top = -99999
            let bottom = 99999
            for(let i = 0 ; i < elm.length ; i++){
                const sub = PointSub(elm[i],elm[0])
                last.push(sub)
                if(sub[0] < left){
                    left = sub[0]
                }
                if(sub[0] > right){
                    right = sub[0]
                }
                if(sub[1] < bottom){
                    bottom = sub[1]
                }
                if(sub[1] > top){
                    top = sub[1]
                }
            }

            const normalizewidth = Math.abs(right - left)
            const normalizeheight = Math.abs(bottom - top)
            last = last.map(elm=> ([ toFixed4(elm[0] / normalizewidth),toFixed4(elm[1] / normalizeheight)]))

            let degs = 0
            let maxdeg = -999999
            let mindeg = 999999
            let reduce:number[] = []
            for(let i = 1 ; i < last.length ; i ++){
                if(last[i + 1]){
                    const orign = crossProduct2D([0.001,0.001],last[i + 1])
                    reduce.push(Number((orign * 10000).toFixed(0)))
                    const deg = crossProduct2D(last[i],last[i + 1]) + orign
                    if(maxdeg < deg){
                        maxdeg = deg
                    }
                    if(mindeg > deg){
                        mindeg = deg
                    }
                    degs += deg
                }
            }
            degs = degs - maxdeg + mindeg

            let rate = 0
            for(let i = 0 ; i < reduce.length ; i++){
                const left = reduce[i]
                const right = reduce[i + 1]
                if(left && right){
                    rate += toFixed4(left / right)
                }
            }
            if(rate < 20){
                return to_world({name:"line",score:0,vertex:elm,center:elm[0] as any},elm,center)
            }
            let score:SpellCardData[] = [
                {name:"circle",score:averageHausdorffDistance(last,circle),vertex:elm,center:center},
                {name:"triangle1",score:averageHausdorffDistance(last,triangle1),vertex:elm,center:center},
                {name:"triangle2",score:averageHausdorffDistance(last,triangle2),vertex:elm,center:center},
                {name:"x",score:averageHausdorffDistance(last,x),vertex:elm,center:center},
                {name:"xline",score:0.500001 + (rate * -0.007),vertex:elm,center:elm[0] as any},
            ]
            // score.forEach(elm=>{
            //     elm.score! += weight(toFixed4(Math.abs(degs)))[elm.name!]
            // })
            const min = score.sort((a,b)=> b.score! - a.score!).pop()
            if(min!.score! > 0.35){
                return {name:"fail",score:0,vertex:[],center:undefined}
            }
            

            // // score.forEach(elm=>{
            // //     $.Msg("原始距离",elm.score)
            // //     // elm.score! += deg_weight[elm.name! as keyof typeof deg_weight]
            // //     // $.Msg(elm.name,`加分平均角度`, deg_weight[elm.name! as keyof typeof deg_weight])
            // //     // elm.score! += max_deg_weight[elm.name! as keyof typeof max_deg_weight]
            // //     // $.Msg(elm.name,`最大角度`, max_deg_weight[elm.name! as keyof typeof deg_weight])
            // //     // elm.score! += zero_wegiht[elm.name! as keyof typeof zero_wegiht]
            // //     // $.Msg(elm.name,`0角度`, zero_wegiht[elm.name! as keyof typeof deg_weight])
            // //     elm.score! += cos90[elm.name! as keyof typeof cos90]
            // //     $.Msg(elm.name,`加分平均角度`, cos90[elm.name! as keyof typeof deg_weight])
            // //     elm.score! += high_cos[elm.name as keyof typeof high_cos]
            // //     $.Msg(elm.name,`转角频率`, high_cos[elm.name! as keyof typeof deg_weight])
            // //     elm.score! += cross_3_max[elm.name! as keyof typeof cross_3_max]
            // //     $.Msg(elm.name,`跨点检测`, cross_3_max[elm.name! as keyof typeof cross_3_max])
            // // })
            // // $.Msg("当前角度",deg)
            // const poplist = score.sort((a,b)=>b.score! - a.score!)
            // // $.Msg(poplist);
            // const fail = score.map(elm=>elm.score).every(elm=> elm! > 0.5 )
            // if(fail){
            //     return {name:"fail",score:averageHausdorffDistance(last,xline),vertex:[],center:undefined}
            // }

            // const min = poplist.pop()
            // min!.screen = elm;
            return to_world(min!,elm,center)
        })

        return input_list as SpellCardData[]
    }

    const special_check = (input:SpellCardData[]) => {
        const check_table = groupByKey(input,"name")
        if(check_table['triangle1']?.length == 1 && check_table['triangle2']?.length == 1 && Object.keys(check_table).length == 2){
            /**特殊图形检测   六芒星 */
            const point1 = check_table['triangle1'][0].screen_center
            const point2 = check_table['triangle2'][0].screen_center
            if(distance(point1!,point2!) < 100){
                return "liu_mang_xing"
            }
        }
        if(check_table['line']?.length == 3){
            /**特殊图形检测   三竖线 */
            const line1length = check_table['line'][0].screen?.length!
            const line2length = check_table['line'][1].screen?.length!
            const line3length = check_table['line'][2].screen?.length!
            const line1start = check_table['line'][0].screen![0]!
            const line2start = check_table['line'][1].screen![0]!
            const line3start = check_table['line'][2].screen![0]!
            const line1end = check_table['line'][0].screen![line1length - 1]!
            const line2end = check_table['line'][1].screen![line2length - 1]!
            const line3end = check_table['line'][2].screen![line3length - 1]!
            const dir1 = PointSub(line1end,line1start)
            const dir2 = PointSub(line2end,line2start)
            const dir3 = PointSub(line3end,line3start)
            const areAllParallel = (  
                calculateAngleBetweenVectors2D(dir1, dir2) < 5 &&  
                calculateAngleBetweenVectors2D(dir2, dir3) < 5 &&
                calculateAngleBetweenVectors2D(dir1, dir3) < 5
            );
            if(areAllParallel){
                return "san_shu_xian"
            }
        }
        if(check_table['line']?.length == 2){
            /**特殊图形检测   三竖线 */
            const line1length = check_table['line'][0].screen?.length!
            const line2length = check_table['line'][1].screen?.length!
            const line1start = check_table['line'][0].screen![0]!
            const line2start = check_table['line'][1].screen![0]!
            const line1end = check_table['line'][0].screen![line1length - 1]!
            const line2end = check_table['line'][1].screen![line2length - 1]!
            const dir1 = PointSub(line1end,line1start)
            const dir2 = PointSub(line2end,line2start)
            const areAllParallel = (  
                calculateAngleBetweenVectors2D(dir1, dir2) < 5 
            );
            if(areAllParallel){
                return "liang_shu_xian"
            }
        }
        if(check_table['xline']?.length == 3){
            /**特殊图形检测   三曲线 */
            return "san_qu_xian"
        }
    }

    /**关于图形的平均叉积判断 */
    const weight = (deg:number):Record<string,number> =>{
        if(deg > 1.35){
            return {circle:-0.035,triangle1:5,triangle2:5,x:5,xline:5,line:5}
        }
        if(deg > 0.99 && deg < 1.2){
            return {circle:-0.01,triangle1:-0.01,triangle2:-0.01,x:0,xline:-0.01,line:5}
        }
        if(deg > 0.5 && deg < 0.8){
            return {circle:-0.01,triangle1:-0.01,triangle2:-0.01,x:-0.01,xline:-0.01,line:0}
        }
        if(deg > 0.15 && deg < 0.5){
            return {circle:-0.01,triangle1:-0.01,triangle2:-0.01,x:-0.01,xline:-0.01,line:-0.01}
        }
        return {circle:5,triangle1:-0.05,triangle2:-0.05,x:0,xline:-0.05,line:-0.01}
    }


    useInterval(3,()=>{
        // const if_merge_card = Object.values(merge_card).length
        // // $.Msg(if_merge_card)
        // if(if_merge_card == 0){
        //     timer_open = false
        //     clear()
        //     return
        // }
        if(effect.current){
            let [x,y] = GameUI.GetCursorPosition()
            // x = Game.GetScreenWidth() / 1920 * x
            // y = Game.GetScreenHeight() / 1080 * y
            effect.current.FireEntityInput("cursor","SetControlPoint",`0:${x} ${y} ${0}`)
            effect.current.FireEntityInput("cursor","SetControlPoint",`3:1 0 0 `)
        }
        if(!GameUI.IsMouseDown(0) && cur_shape.current.length > 15 ){
            not_move.current += 0.2
        }
        if(cur_shape.current.length > 15 && !GameUI.IsMouseDown(0) && distance(cur_shape.current[cur_shape.current.length - 1],GameUI.GetCursorPosition()) < 30){
            not_move.current += 0.1
        }
        if(cur_shape.current?.length > 150 || not_move.current > 10){
            const data = input()
            const special = special_check(data)
            
            if(special){
                setste($.Localize("#" + special))
            }else{
                setste(data.map(elm=>$.Localize("#" + elm.name)).toString())
            }
            shake()
            // GameEvents.SendCustomGameEventToServer("c2s_card_event",{
            //     container_behavior:16,
            //     merge_data:merge_card,
            //     spell_data:data
            // })
            clear()
            return
        }
        if(GameUI.IsMouseDown(0)){
            not_move.current = 0
            cur_shape.current.push(GameUI.GetCursorPosition())
            for(let i = 0 ; i < cur_shape.current.length - 1 ; i++){
                if(transition_index.current.includes(i) || transition_index.current.includes(i + 1)){
                    continue;
                }
                canvas.current?.DrawSoftLinePointsJS(2, _flattenArrayOfTuples([cur_shape.current[i],cur_shape.current[i + 1]]), cur_shape.current.length / i + 5,20, "#FFFFFF")
            }
            switch_input.current = false
        }else if(!switch_input.current && !GameUI.IsMouseDown(0) && cur_shape.current.length < 80){
            switch_input.current = true
            brush_transition.current.push(GameUI.GetCursorPosition().map(elm=>([Number(elm.toFixed(0)),Number(elm.toFixed(1))])) as unknown as [number,number])
            transition_index.current.push(cur_shape.current.length)
        }
    },Object.values(merge_card).length > 0,
    clear,
    [merge_card])

    return  <>
        <Label text={str} style={{fontSize:"40px",color:"gold",textShadow:"2px 2px 8px 3.0 #333333b0",align:"center center"}}/>
        <GenericPanel hittest={false}  style={{width:"100%",height:"100%"}} ref={p=>canvas.current = p!} id="canvas1" type='UICanvas' />
        <DOTAScenePanel hittest={false} ref={p=>effect.current = p!}  style={{width:"100%",height:"100%"}} map={"cursor"} particleonly={true}/>
    </>
    
}


const MagicCardMain = () =>{
    const [update,set_update] = useState(false)
    const cursor_position = useRef<[number,number]>([0,0])
    const compise = useRef<boolean>(false)

    const [select_card_table,set_select_card_table] = useState<Record<number,string|null>>({})
    const [merge,setmerge] = useState<boolean>(false)

    const [card_comp,card_link_comp_update] = useLinkComps("Card",(a,b)=>a?.index - b?.index) as [Card[],number]
    const effect_main = useRef<ScenePanel>()


    useEffect(()=>{
        if(merge == true){
            GameEvents.SendCustomGameEventToServer("c2s_card_event",{container_behavior:4,merge_data:select_card_table})
            set_select_card_table({})
            effect_main.current?.ReloadScene()
            setmerge(false)
        }
    },[merge])


    

    return <>
        <CanVas merge_card={select_card_table}/>
        <Panel hittest={false} style={{width:"1000px",height:"400px",align:"right bottom"}}>
        {card_comp?.map((elm,index)=><Card index={elm.index} merge={merge} dispatich={set_select_card_table} key={"Card"+elm?.uid }  card_data={elm}/>)}
        <DOTAScenePanel hittest={false} ref={p=>effect_main.current = p!}  style={{width:"100%",height:"100%"}} map={"magic_card_particle"} particleonly={true}/>
    </Panel>
    </>
}

const Card = ({card_data,dispatich,merge,index}:{card_data:Card,index:number,merge:boolean,dispatich:React.Dispatch<React.SetStateAction<Record<number, string|null>>>}) =>{
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
            dispatich(elm=>{
                delete elm[index] 
                return elm
            })
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

    const click = (p:Panel) =>{
        // emitLocalEvent("scans",{duration:1,parent:main.current!})
        is_select.current = !is_select.current 
        main.current?.ToggleClass("select")
        card_effect.current?.ToggleClass("select")
        if(is_select.current == true){
            dispatich(elm=> ({...elm,[index]:card_data?.uid}))
        }else{
            dispatich(elm=>{
                delete elm[index] 
                return {...elm}
            })
        }
    }

    // const ondrag = (p:Panel) => {
    //     const abilityindex = Entities.GetAbility(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()),0)
    //     const a = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
    //     Abilities.ExecuteAbility(abilityindex,a,false)
    // } 
 
    const dbclieck = (p:Panel) =>{
        GameEvents.SendCustomGameEventToServer("c2s_card_event",{container_behavior:16,merge_data:{1:card_data.uid}})
    }

    return <>
            <Image src={"file://{images}/custom_game/card/" + card_data.image + ".png"} onload={translate} hittest={false} ref={p=>main.current=p!} className={`card`}>
             <Label hittest={false} text={card_data?.card} ref={p=>card_label.current = p!} className={`card_label`}/>
            </Image>
            <DOTAScenePanel hittest={false} ref={p=>card_effect.current = p!} className={`card mask card_effect`} map={"card_effect"} particleonly={true}/>
            <Panel ondblclick={dbclieck} onactivate={click} hittest={true} ref={p=>dummy.current = p!} onmouseover={onmouseover} onmouseout={onmouseout} className={`card_dummy`}/>
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

onLocalEvent("scans",(event)=>{
    const elm = $.CreatePanel("Panel",$.GetContextPanel(),"scans")
    elm.SetParent(event.parent)
    elm.AddClass("scans")
    elm.AddClass("animation")
    $.Schedule(event.duration,()=>{
        elm.DeleteAsync(0)
    })
})

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

