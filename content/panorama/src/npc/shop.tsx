import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useGameEvent, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer, useCompWithSystem } from '../hooks/useComp';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { Portrait } from './script';
import { useTypeInput } from '../hooks/useTypeInput';
import * as map_json from "../json/game_big_world_map.json"
import * as ye_wai from "../json/ye_wai.json"
import * as dota_tems from "../json/items_list_1.json" 
import { Kline, YellowButton } from '../base';


export const Shop = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [index,setindex] = useState(3)
    const ui_state = useNetTableKey("player_comps","player"+Players.GetLocalPlayer()) as compc_map
    const [ye_wai_state,set_yewai_state] = useState<string>("none")
    const [ji_shi_select_item,set_ji_shi_select_item] = useState<string>()
    const [npc_comp,update] = useCompWithSystem("npc")
    const [extra_price,set_extra_price] = useState<number>(100)
    const [PlayerGold,PlayerGoldUpdate] = useCompWithPlayer("PlayerGold",Players.GetLocalPlayer())


    useEffect(()=>{
        if(ui_state?.CurrentScene?.scene_type == 2){
            next_state("center")
        }
    },[ui_state?.CurrentScene?.parent_scene,ui_state?.CurrentScene?.scene_name,ui_state?.CurrentScene?.scene_type])

     /**更换状态只能用这个接口 */
     const next_state = (key:string) => {
         set_last_state(state)
         setState(key)
     }



     const next_index = ()=>{    
        setindex(v=>Math.min(shop_item.length - 3,v + 1))
        GameUI.CustomUIConfig().EventBus?.emit("next_shop")
     }

    const back_index = ()=>{
        setindex(v=>Math.max(3,v - 1))
    }

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
            marginTop:0
        },
        "center":{
            width: 1920,
            height: 1080,
            opacity: 1,
            marginTop:0
        },
    }

    const shop_item = [
        {item_name:"item_abyssal_blade",index:0,price:43},
        {item_name:"item_aegis",index:1,price:232},
        {item_name:"item_aether_lens",index:2,price:12},
        {item_name:"item_ancient_janggo",index:3,price:32},
        {item_name:"item_arcane_boots",index:4,price:44},
        {item_name:"item_armlet",index:5,price:33},
        {item_name:"item_assault",index:6,price:21},
        {item_name:"item_banana",index:7,price:23},
        {item_name:"item_basher",index:8,price:23},
        {item_name:"item_belt_of_strength",index:9,price:12},
        {item_name:"item_bfury",index:10,price:44},
        {item_name:"item_black_king_bar",index:11,price:55},
        {item_name:"item_blade_mail",index:12,price:11},
        {item_name:"item_blade_of_alacrity",index:13,price:232},
        {item_name:"item_blades_of_attack",index:14,price:122},
        {item_name:"item_blight_stone",index:15,price:324},
        {item_name:"item_blink",index:16,price:523},
        {item_name:"item_bloodstone",index:17,price:74},
        {item_name:"item_bloodthorn",index:18,price:34},
        {item_name:"item_boots",index:19,price:12},
        {item_name:"item_boots_of_elves",index:20,price:33},
    ]

    const exit = () =>{
        next_state("init")
        GameEvents.SendCustomGameEventToServer("shop_exit",{})
    }

    const imgpxy = useMemo(() =>{
        const {x,y} = map_json[ui_state?.CurrentScene.parent_scene! as keyof typeof map_json] ?? {x:0,y:0}
        return {x:x / 3840 * Game.GetScreenWidth() / 1920 * 100 + 10,y:y / 2144 * Game.GetScreenHeight() / 1080 * 100 + 20}
    },[ui_state?.CurrentScene.parent_scene])

    const click_ye_wai = (ye_wai_parent_name:string) =>{
        set_yewai_state(str=>
            str == "none" ? ye_wai_parent_name : str == ye_wai_parent_name ? "none" : ye_wai_parent_name)
    }

    //生成一个十日价格走势数组 直接写数组
     const get_kline_data = useMemo(() =>{
        const data = []
        for(let i = 0 ; i < 10 ; i++){
            data.push(Number((Math.random() * 10).toFixed(0)))
        }
        return data
    },[ji_shi_select_item])

    const cur_onwed_items = useMemo(()=>{
        const list:string[] = []
        for(let i = 0 ; i < 9 ; i++){
            const item = Entities.GetItemInSlot(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()),i)
            if(Abilities.GetAbilityName(item) != ""){
                list.push(Abilities.GetAbilityName(item))
            }
        }
        return list
    },[])



    const shop_switch_component = useMemo(()=>{
        switch(ui_state?.CurrentScene.scene_name){
            case "modules_npc_yao_dian_role":{
                return <> 
                <Next next_index={next_index}/>
                <Back back_index={back_index}/>
                <Panel style={{align:"center center",marginTop:"480px",marginLeft:"40px",width:"1480px",height:"800px"}}>
                {shop_item.slice(index-3,index + 2).map((elm,index)=><Item price={elm.price} item_name={elm.item_name} key={"item_shop" + elm.index} index={index}/>)}
                <ShopInventery/>
                </Panel>
                </>
            }
            case "modules_npc_ji_shi_role":{
                const golds = Object.entries(PlayerGold ?? {})
                return  <Motion key={"Shop_item" + "jishi"} defaultStyle={{width:0,height:0}} style={{
                    width: spring(500),
                    height: spring(1000),
                }}> 
                {(style:any)=>
                <>
                <Panel style={{flowChildren:"right-wrap",width:style.width.toFixed(4) + "px",height:style.height.toFixed(4) + "px",backgroundColor:"rgba(0,0,0,0.7)",align:"center center",marginLeft:"900px"}}>
                    <Label style={{width:"100%",color:"white",textShadow:"0px 0px 0px 2.0 #333333b0",fontSize:"25px"}} text={"接受服务器价格的浮动范围为(百分比%)"}/>
                    <Panel style={{flowChildren:"right-wrap"}}>
                        {golds.map(([gold_name,gold_num])=>{
                            if(gold_name.includes("gold")){
                                return <Label key={gold_name +"gold"} style={{color:"white",textShadow:"2px 2px 8px 3.0 #333333b0",fontSize:"22px",marginLeft:"20px"}} text={`#${gold_name}:${gold_num}`}/>
                            }
                        })}
                    </Panel>
                    <TextEntry text='100' ontextentrychange={(p)=>{set_extra_price(parseInt(p.text))}} textmode={"numeric"} style={{width:"100%",color:"yellow"}}/>
                    {Object.keys(dota_tems).map((key:any)=>{
                         if(dota_tems[key as keyof typeof dota_tems].shopNpc == "modules_npc_ji_shi_role"){
                            return <JiShiItem extra_price={extra_price ?? 0} npc_comp={npc_comp as npc<any>} onwed={cur_onwed_items.includes(ji_shi_select_item ?? "")} selectfn={set_ji_shi_select_item} key={dota_tems[key as keyof typeof dota_tems]._name + "jishiitem" } item_data={dota_tems[key as keyof typeof dota_tems]}/>
                         }
                    })}
                </Panel>
                  <Panel style={{flowChildren:"right-wrap",width:style.width.toFixed(4)+ "px",height:style.height.toFixed(4) + "px",backgroundColor:"rgba(0,0,0,0.7)",align:"center center",marginLeft:"-500px"}}>
                        <Kline key={ji_shi_select_item + "kline"} tile={"十日价格报表" + ji_shi_select_item} data={get_kline_data}/>
                  </Panel>
                </>
                }
                </Motion>            
            }
            case "modules_npc_ma_fu_role":{
                const cur = Object.values(ye_wai).filter(elm=>elm.parent == ui_state?.CurrentScene.parent_scene)
                let ye_wai_children = cur.find(elm=>elm.name == ye_wai_state)?.child
                return  <>
                        <Panel className='mask' style={{backgroundImage:"url('file://{images}/custom_game/map/big_map/32.png')",backgroundPosition:`${imgpxy.x}% ${imgpxy.y}%`,backgroundSize:"500% 500%",marginLeft:"-300px",align:"center center",width:"900px",height:"600px",borderRadius:"15px",opacity:"0.9"}}>
                    <Panel  hittest={true} style={{borderRadius:"50px",x:imgpxy.x + "%",y:imgpxy.y + "%",width:"64px",height:"64px",backgroundColor:"white"}}>
                    </Panel>
                     <Label style={{x:imgpxy.x + "%",y:imgpxy.y + "%",fontSize:"30px",color:"yellow",textShadow:"1px 1px 1px 3.0 #333333b0"}} text={$.Localize("#"+ ui_state?.CurrentScene.parent_scene)} />
                    {cur.map((elm,index)=><YeWai openfn={click_ye_wai} key={"YeWai" + index} x={imgpxy.x + elm.x / 3840 * 100} y={imgpxy.y + elm.y / 2144 * 100} name={elm.name}/>)}
                </Panel>
                <Motion key={"Shop_item" + ye_wai_state} defaultStyle={{width:ye_wai_state ? 0 : 500,height:ye_wai_state ? 0 : 500}} style={{
                    width: spring(ye_wai_state ? 500 : 0),
                    height: spring(ye_wai_state ? 500 : 0),
                }}> 
                {(style:any)=><Panel style={{flowChildren:"right-wrap",width:style.width.toFixed(4) + "px",height:style.height.toFixed(4) + "px",backgroundColor:"rgba(0,0,0,0.7)",align:"center center",marginLeft:"700px"}}>
                    { ye_wai_children && ye_wai_state != "none" && Object.values(ye_wai_children!).map(name=>{
                        return <YeWaiChildren open={1} tile={name} level={3}/>
                    })
                    }
                </Panel>}
                </Motion>
                </>
            }
        }
        return <></>
    },[PlayerGold,PlayerGoldUpdate,ui_state?.CurrentScene?.scene_name,ye_wai_state,ji_shi_select_item,update,npc_comp,extra_price])

    return <Motion key={"Shop" + state} defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
        marginTop:spring(main_style[state].marginTop),
    }}> 
        {(style:any)=>
            <Image src={`file://{images}/custom_game/ui/npc/${ui_state?.CurrentScene.scene_name}.png`} style={{width:style.width + "px",height:style.height + "px",marginTop:style.marginTop + "px",align:"center center",borderRadius:"20px"}}>
                <Portrait  camera={ui_state?.CurrentScene.scene_name!} key={"Portrait" + ui_state?.CurrentScene.scene_name}/>
                {shop_switch_component}
                <Panel onactivate={exit} style={{width:"120px",height:"60px",backgroundColor:"black"}}/>
            </Image>
        }
    </Motion>
}

/**
 * 集市上的商品
 */
const JiShiItem = ({extra_price,npc_comp,item_data,selectfn,onwed}:{extra_price:number,npc_comp:npc<any>,onwed:boolean,item_data:typeof dota_tems[keyof typeof dota_tems],selectfn:(elm:string)=>void}) =>{
 
    const click = () =>{
        selectfn(item_data._name)
    }


    const buy = () =>{
        const uuid = Math.random().toFixed(6)
        GameEvents.SendCustomGameEventToServer("c2s_number_input_ok_register",{uuid})
        GameUI.CustomUIConfig().EventBus?.emit("OkNumberInputPanel",{
            title:`需要买进多少个${item_data._name}?`,
            type:"ji_shi_buy_item",
            uuid:Math.random().toFixed(9),
            data:{price:cost() * (extra_price) / 100,item_name:item_data._name,npc_name:npc_comp.npc_name,city_name:npc_comp.city},
            call_back:(input:any)=> {GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
                title:`买入总价是${Math.ceil(input * cost() * (extra_price) / 100)},当前接受价格浮动为${extra_price}%?`,
                type:"ji_shi_buy_item",
                uuid:Math.random().toFixed(6),
                data:{total:input * cost() * (extra_price) / 100,price:cost() * (extra_price) / 100,item_name:item_data._name,npc_name:npc_comp.npc_name,city_name:npc_comp.city,count:input},
            })}
        })
    }

    const sell = () =>{
        const uuid = Math.random().toFixed(6)
        GameEvents.SendCustomGameEventToServer("c2s_number_input_ok_register",{uuid})
        $.Msg({price:cost(),item_name:item_data._name,npc_name:npc_comp.npc_name,city_name:npc_comp.city})
        GameUI.CustomUIConfig().EventBus?.emit("OkNumberInputPanel",{
            title:`需要卖出多少个${item_data._name}?`,
            type:"ji_shi_sell_item",
            uuid:Math.random().toFixed(9),
            data:{price:cost(),item_name:item_data._name,npc_name:npc_comp.npc_name,city_name:npc_comp.city},
            call_back:(input:any)=> {GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
                title:`出售总价是${Math.ceil(input * cost() * (extra_price) / 100)},当前接受价格浮动为${extra_price}%?`,
                type:"ji_shi_sell_item",
                uuid:Math.random().toFixed(6),
                data:{total:input * cost() * (extra_price) / 100,price:cost() * ( extra_price) / 100,item_name:item_data._name,npc_name:npc_comp.npc_name,city_name:npc_comp.city,count:input},
            })}
        })
    }    
    
    const cost = () =>{
        return npc_comp?.ui_data?.[item_data._name]?.toFixed(3) ?? "读取中"
    }

    const count = () =>{
        return npc_comp?.ui_data?.[item_data._name + "_count"] ?? "读取中"
    }

    return <Panel style={{flowChildren:"down",width:"80px",height:"140px",border:" 1px solid #111111FF"}}>
        <DOTAItemImage hittest={true} itemname={item_data._name} onactivate={click}>
            <Label text={count()} style={{fontSize:"25px",color:"white",textShadow:"0px 0px 0px 2.0 #333333b0"}}/>
        </DOTAItemImage>
        <Label style={{width:"100%",backgroundColor:"black",horizontalAlign:"center",color:"gold"}} text={"￥" + cost()}/>
        <YellowButton owned={onwed} click={sell} wash={"green"} height={25} button_text='出售' />
        <YellowButton owned={true} click={buy} wash='red' height={25} button_text='买进' />
    </Panel>
}


const YeWaiChildren = ({tile,open,level}:{tile:string,open:0|1,level:number}) =>{
    return <Panel style={{width:"95%",height:"40px"}}>
            <Panel style={{marginLeft:"15px",flowChildren:"right-wrap"}}>
            <Label style={{marginLeft:"15px",fontSize:"30px",color:"gold"}} text={`${$.Localize("#"+tile)}`}/>
            <Label style={{marginLeft:"15px",fontSize:"22px",color:"gold"}} text={`${open ? "已开启":"未开启"}`}/>
            <Label style={{marginLeft:"15px",fontSize:"22px",color:"black",backgroundColor:"rgb(174, 72, 72)",borderRadius:"15px"}} text={`简单`}/>
            <Label style={{marginLeft:"15px",fontSize:"22px",color:"black",backgroundColor:"rgb(72, 80, 174)",borderRadius:"15px"}} text={`噩梦`}/>
            <Label style={{marginLeft:"15px",fontSize:"22px",color:"black",backgroundColor:"rgb(174, 142, 72)",borderRadius:"15px"}} text={`地狱`}/>
            </Panel>
        </Panel>
}

const YeWai = ({x,y,name,openfn}:{x:number,y:number,name:string,openfn:Function}) =>{
    return <Panel>
        <DOTAParticleScenePanel hittest={true} onactivate={p=>openfn(name)} cameraOrigin={[0,0,130]} fov={130} rotateonhover={true} lookAt={"0 0 0"} particleName={"particles/econ/items/kunkka/divine_anchor/hero_kunkka_dafx_skills/kunkka_spell_x_spot_mark_fxset.vpcf"} style={{x:x + "%",y:y + "%",width:"100px",height:"100px",opacity:"1"}}  /> 
        <Label style={{x:x + "%",y:y + "%",fontSize:"30px",color:"yellow",textShadow:"1px 1px 1px 3.0 #333333b0"}} text={$.Localize("#"+ name)} />
    </Panel>
}

const NpcDialog = ({str}:{str:string}) =>{
    return <Panel style={{marginLeft:"40px",marginTop:"20px",width:"200px",height:"100px"}}>
        <Label text={$.Localize("#"+str)} style={{textShadow:"0px 0px 0px 2.5 #333333b0",color:"#FFFFE0"}}/>
    </Panel>
}

const Item = ({index,item_name,price}:{index:number,item_name:string,price:number}) => {  
    const [last_state,set_last_state] = useState<keyof typeof main_style>(0)
    const [state,setState] = useState<keyof typeof main_style>(0)

    const click = () =>{
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:`是否要买入${$.Localize(item_name)}?`,
            type:"sell_item",
            uuid:Math.random().toFixed(6),
            data:{}
        })
    } 

    /**更换状态只能用这个接口 */
    const next_state = (key:number) => {
        set_last_state(state)
        setState(key)
    }

    useEffect(()=>{
        next_state(index)
    },[index])

    const main_style:Record<number,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        0: {
            x: 0 * 220 + 200
        },
        1:{
            x: 1 * 220 + 200
        },
        2:{
            x: 2 * 220 + 200
        },
        3:{
            x: 3 * 220 + 200
        },
        4:{
            x: 4 * 220 + 200
        },
    }


    return <Motion key={"Shop_item" + state} defaultStyle={main_style[last_state]} style={{
        x: spring(main_style[state].x),
    }}> 
    { (style:any)=>
    <> 
    <Panel hittest={true} onactivate={click} className='scan-effect' style={{x:style.x.toFixed(3) + "px",marginTop:`${index * -30 + 300}px`,width:"80px",height:"58px"}}>
        <DOTAItemImage itemname={item_name} showtooltip={false}/>
    </Panel>
    <Label text={price+"金"} className='updateupdwon' style={{color:"gold",fontSize:"40px",x:style.x + 30 + "px",marginTop:`${index * - 30 + 270}px`,width:"100px",height:"64px"}} />
    </>
    }
    </Motion>
}

const Next = ({next_index}:{next_index:Function}) =>{

    const click = () => {
        next_index()
    }

    return <Image className='updateupdwon'  src="s2r://panorama/images/control_icons/chevron-sharp-right.png" hittest={true} onactivate={click} style={{washColor:"yellow",marginLeft:"1500px",marginTop:"620px"}}>
        
    </Image>
}

const Back = ({back_index}:{back_index:Function}) =>{

    const click = () => {
        back_index()
    }

    return <Image className='updateupdwon' src="s2r://panorama/images/control_icons/chevron-sharp-left.png" hittest={true} onactivate={click} style={{washColor:"yellow",marginLeft:"250px",marginTop:"780px"}}>
        
    </Image>
}


const ShopInventery = () =>{
    
    const shop_item = [
        {item_name:"item_abyssal_blade",index:0,price:43},
        {item_name:"item_aegis",index:1,price:232},
        {item_name:"item_aether_lens",index:2,price:12},
        {item_name:"item_ancient_janggo",index:3,price:32},
        {item_name:"item_arcane_boots",index:4,price:44},
        {item_name:"item_armlet",index:5,price:33},
        {item_name:"item_assault",index:6,price:21},
        {item_name:"item_banana",index:7,price:23},
        {item_name:"item_basher",index:8,price:23},
    ]

    return <Panel className='d3transfrom' style={{flowChildren:"right-wrap",width:"300px",height:"200px"}}>
        {shop_item.map(elm=><MItem key={elm.item_name} item_name={elm.item_name}/>)}
    </Panel>
}

const MItem = ({item_name}:{item_name:string}) => {
    
    const click = () =>{
        GameUI.CustomUIConfig().EventBus?.emit("OkPanel",{
            title:`是否要卖出${$.Localize(item_name)}?`,
            type:"sell_item",
            uuid:Math.random().toFixed(6),
            data:{}
        })
    } 

    return <Panel hittest={true} onactivate={click} style={{margin:"4px",width:"80px",height:"58px"}}>
          <DOTAItemImage itemname={item_name} showtooltip={false}/>
    </Panel>
}

