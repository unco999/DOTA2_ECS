import { isValidElement, useEffect, useMemo, useRef, useState } from "react"
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { render, useGameEvent } from "react-panorama-x"
import { useCompWithEntityID, useCompWithPlayer } from "../../../hooks/useComp"
import { luaToJsArray } from "../../../base"





// DOTAItemImage.prototype.AbilityButtonMouseOver = function() {
//     if (this.customTooltip) {
//         const hudRoot = $.GetContextPanel()
//         .GetParent()!
//         .GetParent()!
//         .GetParent()!;
//         $.DispatchEvent( "DOTAShowAbilityTooltipForEntityIndex",
//             this.abilityButton,
//             this.abilityName,
//             this.queryUnit
//         );
//         var extraText = this.customTooltip
//         $.Schedule(0, function() {
//             var labelPanel = hudRoot?.FindChildTraverse("DOTAAbilityTooltip")?.FindChildTraverse("AbilityDescriptionContainer")?.Children()[0] as LabelPanel
//             if(labelPanel){
//                 labelPanel.text = labelPanel.text.slice(0, -4) + extraText; // -4 clears out extra <br/> in description
//             }
//         })
//     } else {
//         $.DispatchEvent( "DOTAShowAbilityTooltipForEntityIndex",
//             this.abilityButton,
//             this.abilityName,
//             this.queryUnit
//         );
//     }
// }

export enum EQUIPMENT_TYPE{
    Weapon,
    Headwear,
    Back,
    Shoulder,
    Ring,
    Hand,
    Necklace,
    Clothes,
}

const get_base_attribute_html = (tile:string,num:number) => `<li>${$.Localize("#"+tile)}<font color="#99CCFF">[+<font color="#66CCFF">${num}</font>]</font></li>`

const get_item_level_html = (level:number) => `  <h2><font color="#CCCCFF">※物品等级※</font><img src="s2r://panorama/images/icon_star_shadow_hi.psd"><img src="s2r://panorama/images/icon_star_shadow_hi.psd"><img src="s2r://panorama/images/icon_star_shadow_hi.psd"><h2><br>`


const get_state_attribute_html = (tile:string,val:number|string) => `
<li><font color='#00CCFF'>${$.Localize("#"+tile)}<font color="#99CCFF">[<font color="#66CCFF">${typeof val == "number" ? `${val}/100` : val}</font>]</font></li>`


export const EquipmentSlot = ({item_data,slot_type,slot_index,x,y,entity_id}:{entity_id:AbilityEntityIndex,slot_type:EQUIPMENT_TYPE,slot_index:number,item_data:any,x:string,y:string}) =>{
    const [with_dota_ent_id_comps,coms_update] = useCompWithEntityID(entity_id) 

    // /**直接序列化成可以显示到装备栏上的thml字符串 */
    // const serialization = ()=>{
    //     if(item_data == null) return
    //     let texture_index = ""
    //     let item_name = ""
    //     let base_attribute;
    //     let state_attribute;
    //     let special_name = [];
    //     let special_description = [];
    //     for(let key in item_data){
    //         if(item_data[key as keyof typeof item_data]?.["texture_index" as keyof typeof item_data]){
    //             let deep_data = item_data[key as keyof typeof item_data]
    //             texture_index = deep_data["texture_index"] as string
    //             item_name = deep_data["item_name"] as string
    //             base_attribute = deep_data["base_attribute"] as Record<string,string>
    //             state_attribute = deep_data["state_attribute"] as Record<string,string>
    //             if(deep_data?.speicel_attribute){
    //                  const special = luaToJsArray(deep_data?.speicel_attribute) as Record<number,记载>[]
    //                  special.forEach(elm=>{
    //                     const sign_spcial = luaToJsArray(elm)
    //                     const name = sign_spcial.map((elm:记载)=> $.Localize("#" + elm.标识 +"_name")).join("")
    //                     const description = sign_spcial.map((elm:记载)=> $.Localize("#" + elm.标识 +"_description")).join("") 
    //                     special_name.push(name)
    //                     special_description.push(description)
    //                 })
    //             }
              
    //         }
    //     }
    //     return {item_name,texture_index,base_attribute,state_attribute}
    // }

    const item_name = useMemo(() =>{
        if(entity_id && entity_id != -1){
            return Abilities.GetAbilityName(entity_id) 
        }
        return ""
    },[item_data,item_data?.dota_entity])

    const EquipmentSlotDragDrop =  (panelId:any, dragCallbacks:ItemImage) => {
        $.Msg("拖拽进来的dragCallbacks.contextEntityIndex",dragCallbacks.contextEntityIndex)
        GameEvents.SendCustomGameEventToServer("c2s_equit_item",{item_entindex:dragCallbacks.contextEntityIndex,slot:slot_index})
    }

    const register = (elm:Panel) =>{
        if(elm != null){
                if(elm.GetAttributeInt("is_drag_register",0) != 1){
                    elm.SetAttributeInt("is_drag_register",1)
                    $.RegisterEventHandler( 'DragEnter', elm, ()=>{$.Msg("EquipmentSlotDragEnter")} );
                    $.RegisterEventHandler( 'DragDrop', elm, EquipmentSlotDragDrop );
                    $.RegisterEventHandler( 'DragLeave', elm, ()=>{$.Msg("EquipmentSlotDragLeave")} );
                    $.RegisterEventHandler( 'DragEnd',elm, ()=>{$.Msg("EquipmentSlotDragEnd")});
                }
            }
    }

    const dbclick = () =>{
        if(with_dota_ent_id_comps == null || entity_id == null){
            return
        }
        GameEvents.SendCustomGameEventToServer("c2s_equit_down_item",{item_entindex:entity_id,slot:slot_index})
    }

    // const onmouseover = (p:ImagePanel) =>{
    //     $.Msg(item_name)
    //     if(item_name == null){
    //         $.Msg("没有找到名字")
    //         return
    //     }
    //     const hudRoot = $.GetContextPanel()
    //     .GetParent()!
    //     .GetParent()!
    //     .GetParent()!;

    //     $.DispatchEvent( "DOTAShowAbilityTooltipForEntityIndex",
    //         p,
    //         item_name,
    //         Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
    //      );
    //     const data = serialization()
    //     $.Schedule(Game.GetGameFrameTime(), function() {
    //         const root = hudRoot.FindChildTraverse("DOTAAbilityTooltip")
    //         const img = root?.FindChildTraverse("Header")?.FindChildTraverse("ItemImage") as ItemImage
    //         const name = root?.FindChildTraverse("Header")?.FindChildTraverse("AbilityName") as LabelPanel
    //         var labelPanel1 = hudRoot.FindChildTraverse("DOTAAbilityTooltip")?.FindChildTraverse("AbilityDescriptionContainer")?.Children()[0] as LabelPanel
    //         var labelPanel2 = hudRoot.FindChildTraverse("DOTAAbilityTooltip")?.FindChildTraverse("AbilityDescriptionContainer")?.Children()[1] as LabelPanel
    //     if(labelPanel2){
    //         labelPanel2.html = true;
    //         labelPanel2.text = data?.desc ?? ""
    //         img.SetImage(`raw://resource/flash3/images/items/${data?.texture_index}.png`)
    //         name.text = data?.item_name ?? ""
    //         root?.TriggerClass("TooltipContainer")
    //     }
    //     })

    // }

    const onmouseover = (elm:Panel) =>{
        if(with_dota_ent_id_comps == null) return
        const x = elm.GetPositionWithinWindow().x
        const y = elm.GetPositionWithinWindow().y
        GameUI.CustomUIConfig().EventBus?.emit("tooltipitem",{switch:true,x,y,comps:with_dota_ent_id_comps})
    }

    const onmouseout = (elm:Panel) =>{
        if(with_dota_ent_id_comps == null) return
        const x = elm.GetPositionWithinWindow()?.x
        const y = elm.GetPositionWithinWindow()?.y
        if(isFinite(x) || isFinite(y)){
            GameUI.CustomUIConfig().EventBus?.emit("tooltipitem",{switch:false,x,y,comps:with_dota_ent_id_comps})
            return
        }
        GameUI.CustomUIConfig().EventBus?.emit("tooltipitem",{switch:false,x:0,y:0,comps:with_dota_ent_id_comps})
    }

    return <Panel ondblclick={dbclick} ref={register} draggable={true} style={{x,y,width:"89px",height:"64px",border:"1px solid white"}}>
            <Label text={slot_index} style={{color:"white",fontSize:"22px"}}/>
            <DOTAItemImage hittest={true} showtooltip={false} onmouseout={onmouseout} onmouseover={onmouseover} itemname={item_name}/>
    </Panel>
}

export const EquipmentMain = ({open}:{open:boolean}) =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [equipment_comp,equipment_comp_update] = useCompWithPlayer("EquipmentState",Players.GetLocalPlayer())


     /**更换状态只能用这个接口 */
     const next_state = (key:string) => {
         set_last_state(state)
         setState(key)
     }
        

    useEffect(()=>{
        next_state(open ? "spawn" : "init")
    },[open])

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            width: 0,
            height: 0,
            opacity: 0,
            x:0,
            y:0,
        },
        "spawn":{
            width: 400,
            height: 700,
            opacity: 1,
            x:700,
            y:-100
        },
    }

    return  <Motion key={state + "EquipmentMain"} defaultStyle={{...main_style[last_state]}} style={
        {
            width: spring(main_style[state].width),
            height: spring(main_style[state].height),
            opacity: spring(main_style[state].opacity),
            x: spring(main_style[state].x),
            y: spring(main_style[state].y),
        }
        }>
         {(style:any) => 
             <Panel hittest={false}  style={{
                  width: style.width.toFixed(5) + "px",
                  height: style.height.toFixed(5) + "px",
                  opacity: style.opacity.toFixed(5).toString(),
                  backgroundColor: "rgba(0,0,0,0.5)",
                  align:"center center",
                  x: style.x.toFixed(5) + "px",
                  y: style.y.toFixed(5) + "px",
             }}>
                <EquipmentSlot entity_id={equipment_comp?.slot_0?.dota_entity} key={equipment_comp?.slot_0?.dota_entity + "EquipmentSlot0"} x="200px" y="340px"  slot_index={0} slot_type={EQUIPMENT_TYPE.Headwear} item_data={equipment_comp?.slot_0_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_1?.dota_entity} key={equipment_comp?.slot_1?.dota_entity + "EquipmentSlot1"} x="233px" y="244px" slot_index={1} slot_type={EQUIPMENT_TYPE.Weapon} item_data={equipment_comp?.slot_1_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_2?.dota_entity} key={equipment_comp?.slot_2?.dota_entity + "EquipmentSlot2"} x="245px" y="584px" slot_index={2} slot_type={EQUIPMENT_TYPE.Clothes} item_data={equipment_comp?.slot_2_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_3?.dota_entity} key={equipment_comp?.slot_3?.dota_entity + "EquipmentSlot3"} x="23px" y="274px"  slot_index={3} slot_type={EQUIPMENT_TYPE.Necklace} item_data={equipment_comp?.slot_3_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_4?.dota_entity} key={equipment_comp?.slot_4?.dota_entity + "EquipmentSlot4"} x="23px" y="114px"  slot_index={4} slot_type={EQUIPMENT_TYPE.Back} item_data={equipment_comp?.slot_4_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_5?.dota_entity} key={equipment_comp?.slot_5?.dota_entity + "EquipmentSlot5"} x="23px" y="384px"  slot_index={5} slot_type={EQUIPMENT_TYPE.Shoulder} item_data={equipment_comp?.slot_5_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_6?.dota_entity} key={equipment_comp?.slot_6?.dota_entity + "EquipmentSlot6"} x="23px" y="194px"  slot_index={6} slot_type={EQUIPMENT_TYPE.Hand} item_data={equipment_comp?.slot_6_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_7?.dota_entity} key={equipment_comp?.slot_7?.dota_entity + "EquipmentSlot7"} x="23px" y="484px"  slot_index={7} slot_type={EQUIPMENT_TYPE.Hand} item_data={equipment_comp?.slot_7_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_8?.dota_entity} key={equipment_comp?.slot_8?.dota_entity + "EquipmentSlot8"} x="23px" y="584px"  slot_index={8} slot_type={EQUIPMENT_TYPE.Ring} item_data={equipment_comp?.slot_8_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_9?.dota_entity} key={equipment_comp?.slot_9?.dota_entity + "EquipmentSlot9"} x="123px" y="584px" slot_index={9} slot_type={EQUIPMENT_TYPE.Ring} item_data={equipment_comp?.slot_9_comps}/>
            </Panel>
        }
        </Motion>
}

// // dota_item_drag_begin: object;
// // dota_item_drag_end: object;
// GameEvents.Subscribe()