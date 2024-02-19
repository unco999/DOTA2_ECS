import { isValidElement, useEffect, useMemo, useRef, useState } from "react"

import { render, useGameEvent } from "react-panorama-x"
import { useCompWithEntityID, useCompWithPlayer } from "../../../hooks/useComp"
import { TilePanel, luaToJsArray } from "../../../base"

const testtext = `
"a000013_name" "魔法师"
		"a000013_description" "如果 我方的魔法值高于x 则"
		"a000018_name" "强壮"
		"a000018_description" "那么我们增加x点临时力量给自身"
		"a000005_name" "水之"
		"a000005_description" "如果 上一个技能是释放的水元素 则"
		"a000014_name" "回春"
		"a000014_description" "如果 我方的魔法值低于x 则"
		"a000001_name" "奥法节流"
		"a000001_description" "释放法术魔法消耗是否低于x"
		"a000019_name" "混沌"
		"a000019_description" "百分之x几率触发"
		"a000006_name" "暗之"
		"a000006_description" "如果 上一个技能释放的是暗元素 则"
		"a000015_name" "化力"
		"a000015_description" "转换我力量的百分之X给"
		"a000007_name" "屠魔"
		"a000007_description" "如果 敌方的血量高于x 则"
		"a000002_name" "超载奥法"
		"a000002_description" "释放法术魔法消耗是否超过x"
		"a000021_name" "暴击之"
		"a000021_description" "暴击率"
		"a000016_name" "刺客"
		"a000016_description" "转换我敏捷的百分之X给"
		"a000022_name" "施法之"
		"a000022_description" "施法 则"
		"a000008_name" "猎杀"
		"a000008_description" "如果 敌方的血量低于x 则"
		"a000023_name" "火之"
		"a000023_description" "攻击中目标 则"
		"a000011_name" "巨人"
		"a000011_description" "如果 我方的血量高于x 则"
		"a000009_name" "敌法"
		"a000009_description" "如果 敌方的魔法高于x 则"
		"a000017_name" "智者"
		"a000017_description" "转换我智力的百分之X给"`



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


export const EquipmentSlot = ({item_data,slot_type,slot_index,entity_id}:{entity_id:AbilityEntityIndex,slot_type:EQUIPMENT_TYPE,slot_index:number,item_data:any}) =>{
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

    const register = (elm:ImagePanel) =>{
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

    return <Image className={"rect_mask"} ondblclick={dbclick} ref={register} draggable={true} style={{margin:"10px",marginLeft:"15px",backgroundColor:"rgba(0,0,0,0.9)",width:"89px",height:"64px"}}>
            <Label text={slot_index} style={{align:"center center",color:"white",fontSize:"22px"}}/>
            <DOTAItemImage hittest={true} showtooltip={false} onmouseout={onmouseout} onmouseover={onmouseover} itemname={item_name}/>
    </Image>
}

const BaseAttribute = ({icon,num,des}:{icon:string,num:number,des:string}) => {
    return <Panel  hittest={false} style={{marginTop:"10px",flowChildren:"right-wrap"}}>
        <Image style={{width:"46px",height:"46px"}} src={`s2r://panorama/images/control_icons/${icon}.png`}/>
        <Label style={{horizontalAlign:"center",marginLeft:"9px",fontSize:"16px",color:"white"}} text={ $.Localize("#"+des) + num.toString()}/>
    </Panel>
}

export const EquipmentMain = ({page}:{page:number}) =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [equipment_comp,equipment_comp_update] = useCompWithPlayer("EquipmentState",Players.GetLocalPlayer())
    const main = useRef<Panel>()
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

     /**更换状态只能用这个接口 */
     const next_state = (key:string) => {
         set_last_state(state)
         setState(key)
     }


     useEffect(()=>{
        main.current?.RemoveClass?.("back")
        main.current?.RemoveClass?.("next")
        main.current?.RemoveClass?.("spawn")
        if(page > 1 ){
            main.current?.AddClass?.("back")
        }
        if(page < 1  ){
            main.current?.AddClass?.("next")
        }
        if(page == 1){
            main.current?.AddClass?.("spawn")
        }
     },[page])
        

    const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
        "init": {
            opacity: 0,
        },
        "spawn":{
            opacity: 1,
        },
        "back":{
            opacity: 0,
        },
        "next":{
            opacity: 0,
        },
    }

    return  <Panel className={"base"} ref={p=>main.current = p!} hittest={false}  style={{
                zIndex:2,
                  width: "100%",
                  height: "100%",
                  align:"center center",
                  marginLeft:"0px",
                  marginTop:"0px"   
             }}>
              
               {/* 这个是左边拥有的所有的特殊词条 */}
               <Image  src={"s2r://panorama/images/leaf_pages/debut_kid_invoker/paper-bg.png"} style={{width:"470px",height:"651px",x:"100px",y:"200px"}}>
                    <Panel style={{"overflow":"scroll",width:"90%",height:"90%",align:"center center"}}>
                        <Label text={
                            testtext
                        }/>
                    </Panel>
                </Image>
                <DOTAScenePanel style={{align:"center center",width:"50%",height:"80%"}} id="customPreview3DItems" unit={"npc_dota_hero_axe"}  camera="hero_camera" light="hero_light"  map={"ui/dota_hud_loadout_2022"} particleonly={false} />
                <Panel style={{x:"854px",y:"327px"}}>
                <TilePanel width="250px" height="450px" tile="装备栏">
                <Panel style={{flowChildren:"right-wrap"}}>
                <EquipmentSlot entity_id={equipment_comp?.slot_0?.dota_entity} key={equipment_comp?.slot_0?.dota_entity + "EquipmentSlot0"}   slot_index={0} slot_type={EQUIPMENT_TYPE.Headwear} item_data={equipment_comp?.slot_0_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_1?.dota_entity} key={equipment_comp?.slot_1?.dota_entity + "EquipmentSlot1"}  slot_index={1} slot_type={EQUIPMENT_TYPE.Weapon} item_data={equipment_comp?.slot_1_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_2?.dota_entity} key={equipment_comp?.slot_2?.dota_entity + "EquipmentSlot2"}  slot_index={2} slot_type={EQUIPMENT_TYPE.Clothes} item_data={equipment_comp?.slot_2_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_3?.dota_entity} key={equipment_comp?.slot_3?.dota_entity + "EquipmentSlot3"}   slot_index={3} slot_type={EQUIPMENT_TYPE.Necklace} item_data={equipment_comp?.slot_3_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_4?.dota_entity} key={equipment_comp?.slot_4?.dota_entity + "EquipmentSlot4"}   slot_index={4} slot_type={EQUIPMENT_TYPE.Back} item_data={equipment_comp?.slot_4_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_5?.dota_entity} key={equipment_comp?.slot_5?.dota_entity + "EquipmentSlot5"}   slot_index={5} slot_type={EQUIPMENT_TYPE.Shoulder} item_data={equipment_comp?.slot_5_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_6?.dota_entity} key={equipment_comp?.slot_6?.dota_entity + "EquipmentSlot6"}   slot_index={6} slot_type={EQUIPMENT_TYPE.Hand} item_data={equipment_comp?.slot_6_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_7?.dota_entity} key={equipment_comp?.slot_7?.dota_entity + "EquipmentSlot7"}  slot_index={7} slot_type={EQUIPMENT_TYPE.Hand} item_data={equipment_comp?.slot_7_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_8?.dota_entity} key={equipment_comp?.slot_8?.dota_entity + "EquipmentSlot8"}  slot_index={8} slot_type={EQUIPMENT_TYPE.Ring} item_data={equipment_comp?.slot_8_comps}/>
                <EquipmentSlot entity_id={equipment_comp?.slot_9?.dota_entity} key={equipment_comp?.slot_9?.dota_entity + "EquipmentSlot9"}  slot_index={9} slot_type={EQUIPMENT_TYPE.Ring} item_data={equipment_comp?.slot_9_comps}/>
                </Panel>
                </TilePanel>
                </Panel>
                <Panel style={{flowChildren:"down",align:"right center",width:"748px",height:"840px",backgroundColor:"rgba(0,0,0,0.3)"}}>
                <BaseAttribute des={"filter_crater_2021"} icon={"filter_crater_2021"} num={32}/>
                        <BaseAttribute des={"filter_cavern_ti2020"} icon={"filter_cavern_ti2020"} num={16}/>
                        <BaseAttribute des={"filter_cavern_2022"}  icon={"filter_cavern_2022"} num={11}/>
                        <BaseAttribute des={"filter_cavern_bp2_2021"} icon={"filter_cavern_bp2_2021"} num={44}/>
                        <BaseAttribute des={"filter_compendium"} icon={"filter_compendium"} num={44}/>
                        <BaseAttribute des={"filter_complexity"}  icon={"filter_complexity"} num={44}/>
                        <BaseAttribute des={"filter_crater_2021"}  icon={"filter_crater_2021"} num={44}/>
                        <BaseAttribute des={"filter_disabler"} icon={"filter_disabler"} num={44}/>
                        <BaseAttribute des={"filter_durable"} icon={"filter_durable"} num={44}/>
                        <BaseAttribute des={"filter_escape"}  icon={"filter_escape"} num={44}/>
                        <BaseAttribute des={"filter_initiator"} icon={"filter_initiator"} num={44}/>
                        <BaseAttribute des={"filter_ranges"}  icon={"filter_ranges"} num={44}/>
                        <BaseAttribute des={"filter_support"}  icon={"filter_support"} num={44}/>
                        <BaseAttribute des={"filter_ti2019_friends"} icon={"filter_ti2019_friends"} num={44}/>
                </Panel>
            </Panel>
}

// // dota_item_drag_begin: object;
// // dota_item_drag_end: object;
// GameEvents.Subscribe()