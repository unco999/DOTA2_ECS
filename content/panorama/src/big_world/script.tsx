import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer } from '../hooks/useComp';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { LocalEvent } from '../def/local_event_def';
import { useXstate } from '../hooks/useXstate';
import { Load } from './load';
import { Point, check, curveToBezier, getPointsOnBezierCurveWithSplitting, lerp, pointsOnBezierCurves, roundDecimal, val } from '../utils/lib';
import * as map_json from "../json/game_big_world_map.json"
import { useInterval } from '../hooks/useInterval';
import { _flattenArrayOfTuples } from '../base';

const link = (dota:ScenePanel,config:{index:number,start:string,end:string}[])=>{
    config.forEach(elm=>{
         dota?.FireEntityInput(`main${elm.index}`,'SetControlPoint',`3:${elm.start}`)
         dota?.FireEntityInput(`main${elm.index}`,'SetControlPoint',`4:${elm.end}`)    
    })    
}

export const HeroMain = ({x,y}:{x:string,y:string}) =>{

    return <Panel  style={{x,y}} >
        <DOTAHeroImage style={{width:"90px",height:"90px"}} heroimagestyle="icon" heroid={33 as HeroID}/>
    </Panel>
}

export const BigMapMain = () =>{
    const main = useRef<Panel>()
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [focus_position,set_focus_position] = useState<[number,number]>([0,0])
    const curtimer = useRef<ScheduleID>()
    const map_data = useRef<typeof map_json["bing_dong_wang_guo"][]>()
    const line_data = useRef<{from:string,to:string,line:Point[]}[]>([])
    const canvas = useRef<any>()

    const [hero_data,hero_update] = useCompWithPlayer("RoleWorldMapData",Players.GetLocalPlayer())



    const cur_data = useMemo(()=>{
        if(!check(hero_data?.cur_map_index)){
            return [0,0]
        }
        const from_mask = hero_data?.cur_landmark_index;
        const to_mask = hero_data?.cur_to_map_landmark.landmark_index;
        if(check(from_mask) && check(to_mask) && check(hero_data?.cur_to_map_landmark.landmark_index)){
            const {x,y} =  map_json[from_mask as keyof typeof map_json]
            const {x:to_x,y:to_y} =  map_json[to_mask as keyof typeof map_json]
            const mid = lerp([x,y],[to_x,to_y],hero_data!.cur_to_map_landmark.schedule)
            return mid
        }
        if(check(from_mask)){
            const _json_data =  map_json[from_mask as keyof typeof map_json]
            if(_json_data?.x == null){
                return [0,0]
            }
            const x = _json_data.x
            const y = _json_data.y
            return [x,y]
        }
    },[hero_update,hero_data])

    useEffect(()=>{
        const data = Object.keys(map_json).map((key)=>{
            if(map_json[key as keyof typeof map_json].map_index == 32){
                return map_json[key as keyof typeof map_json]
            }
        }) as typeof map_json["bing_dong_wang_guo"][]
        map_data.current = data
    },[])

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

    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }
    
    const [check_ui,xstate_send] = useXstate("ui_main","ui_main_map","ui_main_map","map_init",
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

    const [check_in_city,check_in_city_send] = useXstate("ui_main","ui_city","ui_city","in",
    (on:boolean,cur_xstate,cur_state)=>{
        if(on){
            next_state("init")
            return
        }
    }
)

    type map_json_key = keyof typeof map_json

    useEffect(()=>{     
        let linkhas:string[] = []
        map_data.current?.forEach((elm)=>{
            if(elm){
                for(let key in elm.map_mark_link_array){
                    if(linkhas.includes(elm.mask_name + elm.map_mark_link_array[key as keyof typeof elm.map_mark_link_array])) continue
                    if(linkhas.includes(elm.map_mark_link_array[key as keyof typeof elm.map_mark_link_array] + elm.mask_name)) continue
                    const to_name = elm.map_mark_link_array[key as keyof typeof elm.map_mark_link_array]
                    const from_elm = map_json[elm.mask_name as map_json_key]
                    const to_elm = map_json[to_name as map_json_key]
                    const from_point = [from_elm.x,from_elm.y] as Point
                    const to_point = [to_elm.x,to_elm.y] as Point
                    const mid = lerp(from_point,to_point,0.5)
                    mid[0] += Math.random() > 0.5 ? Math.random() * 32 : Math.random() * -32
                    mid[0] += Math.random() > 0.5 ? Math.random() * 32 : Math.random() * -32
                    line_data.current.push({from:elm.mask_name,to:to_name,line:[[from_elm.x + 32,from_elm.y + 32 ],mid,[to_elm.x + 32,to_elm.y + 32]]})
                    if(!linkhas.includes(from_elm.mask_name + to_name)){
                        linkhas.push(from_elm.mask_name + to_name)
                        linkhas.push(to_name + from_elm.mask_name)
                    }
                
                    if(!linkhas.includes(to_name + from_elm.mask_name)){
                        linkhas.push(to_name + from_elm.mask_name)
                        linkhas.push(from_elm.mask_name + to_name)
                    }
                }
            }
        })
    },[map_data])

    // const moni_data = useMemo(()=>{
    //     return map_data.current?.map(elm=>{
    //         if(elm){
    //             for(let key in elm.map_mark_link_array){
    //                 $.Msg("hahhahahahahaha")
    //                 $.Msg(elm.map_mark_link_array[key as keyof typeof elm.map_mark_link_array])
    //             }
    //         }
    //     })
    // },[map_data])


    const p = (dota:ScenePanel,x:number,y:number,link_x:number,link_y:number)=>{
        dota?.FireEntityInput('main1','SetControlPoint',`3:${x} ${y} 0`)
        dota?.FireEntityInput('main1','SetControlPoint',`4:${link_x} 0`)        
    }

    useInterval(333,(panel,count)=>{
        canvas.current?.ClearJS("rgba(0,0,0,0)")
        line_data.current.forEach((elm,index)=>{
        const curve = elm.line;
        let points = curveToBezier(curve as any,12);
        points = getPointsOnBezierCurveWithSplitting(points,0,6)

       for(let i = 0 ; i < points.length - 1 ; i++){
            (i + count! ) % 2 == 0 && canvas.current?.DrawSoftLinePointsJS(2, _flattenArrayOfTuples([points[i],points[i + 1]]), 22,10, "#000000")
          }
        })
    })

    const set_focus_position_pre = (pre:[x:number,y:number]) =>{
        const width = Game.GetScreenWidth() * Game.GetScreenWidth() / 1920
        const height = Game.GetScreenHeight()* Game.GetScreenHeight() / 1080
        // pre[0] = pre[0] * 1920 / width
        // pre[1] = pre[1] * 1080 / height
        set_focus_position(([prex,prey])=>{
            const x = Math.max(-(3840* Game.GetScreenWidth() / 1920 - width),Math.min( 0,prex -  pre[0]))
            const y = Math.max(-(2114* Game.GetScreenHeight() / 1080 - height),Math.min(  0,prey - pre[1]))
            return [x,y]
        })
        curtimer.current = $.Schedule(Game.GetGameFrameTime(),()=>set_focus_position_pre(pre))
    }

    const clear_timer = () =>{
        if(curtimer.current){
            $.CancelScheduled(curtimer.current)
            curtimer.current = undefined
        }
    }

    const is_can_move = (target:keyof typeof map_json)=>{
        $.Msg(target)
        const is_conect = Object.values(map_json[hero_data.cur_landmark_index as keyof typeof map_json].map_mark_link_array).find(elm=> elm == target)
        $.Msg(is_conect)
        if(is_conect == null || is_conect == ""){
            return false
        }else{
            return true
        }
    }
    

    return  <Motion key={"big_world" + state} defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
    }}> 
        {(style:any)=> <><Panel style={{overflow:"clip",align:"center center",backgroundColor:"white",width:style.width.toFixed(6)+"%",height:style.height.toFixed(6)+"%",opacity:style.opacity.toFixed(6)}}>

                <Panel style={{backgroundImage:"url('file://{images}/custom_game/map/big_map/32.png')",backgroundSize:"100% 100%",backgroundRepeat:"no-repeat",width:"3840px",height:"2114px",x:focus_position[0] ? roundDecimal(focus_position[0],2) + "px" : "0px",y:focus_position[1] ? roundDecimal(focus_position[1],2) + "px" : "0px"}} ref={p=>main.current = p!} >
                <GenericPanel  style={{width:"100%",height:"100%",backgroundColor:"WHITE"}} ref={p=>canvas.current = p} id="zhangsan" type='UICanvas' />
                {
                    map_data.current?.map((elm,index)=>{
                        if(elm){
                            return <MapMask is_can_move={is_can_move} key={"StrongHold" + index} mask_name={elm.mask_name} x={elm['x']} y={elm['y']}/>
                        }
                    })
                }
                <HeroMain x={cur_data![0] + "px"} y={cur_data![1] + "px"}/>
                <Panel />
                </Panel>
            </Panel>
              <Panel hittest={true} onmouseover={()=>set_focus_position_pre([-10,0])} onmouseout={clear_timer} id={"left_map_dummy"} style={{width:"100px",height:"100%",horizontalAlign:"left"}}/>
              <Panel hittest={true} onmouseover={()=>set_focus_position_pre([10,0])} onmouseout={clear_timer} id={"right_map_dummy"} style={{width:"100px",height:"100%",horizontalAlign:"right"}}/>
              <Panel hittest={true} onmouseover={()=>set_focus_position_pre([0,-10])} onmouseout={clear_timer} id={"top_map_dummy"} style={{width:"100%",height:"100px",verticalAlign:"top"}}/>
              <Panel hittest={true} onmouseover={()=>set_focus_position_pre([0,10])} onmouseout={clear_timer} id={"dwon_map_dummy"} style={{width:"100%",height:"100px",verticalAlign:"bottom"}}/>
            
              </>}
    </Motion>
    
}

function randomblack(): string {
    const alpha = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#00000${alpha}`;
  }

function randomGreenishHexColor() {
    var greenComponent = Math.floor(Math.random() * 256); // 0-255
    var blueComponent = Math.floor(Math.random() * 256); // 0-255
    var color = '#00' + greenComponent.toString(16) + blueComponent.toString(16);
    return color;
  }

  function randomCurvedLine(startX:number, startY:number, endX:number, endY:number, numPoints:number) {
    var controlX1 = startX + Math.random() * (endX - startX); // 随机控制点1的x坐标
    var controlY1 = startY + Math.random() * (endY - startY); // 随机控制点1的y坐标
    var controlX2 = startX + Math.random() * (endX - startX); // 随机控制点2的x坐标
    var controlY2 = startY + Math.random() * (endY - startY); // 随机控制点2的y坐标

    var points = [];
    for (var i = 0; i <= numPoints; i++) {
        var t = i / numPoints;
        var x = (1 - t) * (1 - t) * (1 - t) * startX + 3 * (1 - t) * (1 - t) * t * controlX1 + 3 * (1 - t) * t * t * controlX2 + t * t * t * endX;
        var y = (1 - t) * (1 - t) * (1 - t) * startY + 3 * (1 - t) * (1 - t) * t * controlY1 + 3 * (1 - t) * t * t * controlY2 + t * t * t * endY;
        points.push({ x: x, y: y });
    }
    return points;
}

function randomHexColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function bezierInterpolation(startX:number, startY:number, controlX:number, controlY:number, endX:number, endY:number, numPoints:number) {
    var points = [];
    for (var i = 0; i <= numPoints; i++) {
        var t = i / numPoints;
        var x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
        var y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
        points.push([x,y]);
    }
    return points;
}
function randomInterpolationCurve(startPoint: [number, number], xyData: [number[]], endPoint: [number, number], interpolationCount: number): [number, number] {
  // 确保输入数据合法
  if (!startPoint || !xyData || !endPoint) {
    throw new Error("输入数据为空或无效");
  }

  // 确保插值数量在合理范围内
  if (interpolationCount < 1 || interpolationCount > 10) {
    throw new Error("插值数量超出合理范围");
  }

  // 计算插值点个数
  const numInterpolationPoints = Math.floor((endPoint[0] - startPoint[0]) / xyData[0][0]) + 1;
  const interpolatedXYData = [];

  // 根据插值数量随机生成插值点
  for (let i = 0; i < interpolationCount; i++) {
    const x = Math.random() * (endPoint[0] - startPoint[0]) + startPoint[0];
    const y = Math.random() * (endPoint[1] - startPoint[1]) + startPoint[1];
    const index = Math.floor((x - startPoint[0]) / xyData[0][0]);
    interpolatedXYData.push([x, y]);
    if (index >= numInterpolationPoints) break;
  }

  // 根据插值点绘制曲线
  const curvePoints = interpolatedXYData.map((point) => [point[0], xyData.find((dataPoint) => dataPoint[0] === point[0]) ? point[1] : xyData[0][1]]);
  return curvePoints as any;
}



const MapMask = ({x,y,mask_name,is_can_move}:{x:number,y:number,mask_name:string,is_can_move:Function}) =>{

    const click = () =>{
        if(!is_can_move(mask_name)){
            GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",{
                tag_name:"离你太远了",
                player_id:Players.GetLocalPlayer(),
            })
            return
        }
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:`是否要移动到${$.Localize("#"+mask_name)}?`,
            type:"role_big_world_move_map_event",
            uuid:Math.random().toFixed(6),
            data:{move_map:mask_name}
        })
    }

    return <>
          <Panel hittest={true} onactivate={click} style={{borderRadius:"50px",x:x  +"px",y:y +"px",width:"64px",height:"64px",backgroundColor:"white"}}>
        </Panel>
        <Label style={{x:x - 20 +"px",y:y +"px",fontSize:"30px",color:"yellow",textShadow:"1px 1px 1px 3.0 #333333b0"}} text={$.Localize("#"+mask_name)} />
        </>
}
 

render(
<>
<BigMapMain/>
<Load/>
</>,$.GetContextPanel())