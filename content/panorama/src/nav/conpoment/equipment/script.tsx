import { isValidElement, useEffect, useMemo, useRef, useState } from "react"
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { render, useGameEvent } from "react-panorama-x"
import { useCompWithPlayer } from "../../../hooks/useComp"

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

export const EquipmentSlot = ({item_data,slot_type,slot_index,x,y}:{slot_type:EQUIPMENT_TYPE,slot_index:number,item_data:Partial<EquipmentState[keyof EquipmentState]>,x:string,y:string}) =>{

    const drag_end = () =>{
    }

    const item_name = useMemo(() =>{
        return item_data ?  Abilities.GetAbilityName(item_data.dota_entity) : ""
    },[item_data])

    const EquipmentSlotDragDrop =  (panelId:any, dragCallbacks:ItemImage) => {
        $.Msg("拖拽的是",slot_index,"类型是",slot_type)
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
    
    return <Panel ref={register} draggable={true} style={{x,y,width:"89px",height:"64px",border:"1px solid white"}}>
            <Label text={slot_index} style={{color:"white",fontSize:"22px"}}/>
            <DOTAItemImage itemname={item_name}/>
    </Panel>
}

export const EquipmentMain = ({open}:{open:boolean}) =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [inventory_comp,inventory_update] = useCompWithPlayer("Inventory",Players.GetLocalPlayer())
    const dota_item_panel_list = useRef<ItemImage[]>([])
    const [dota_item_panel_list_update,set_dota_item_panel_list_update] = useState(false)
    const [equipment_comp,equipment_comp_update] = useCompWithPlayer("EquipmentState",Players.GetLocalPlayer())


    useEffect(()=>{
        if(inventory_comp?.slots == null){
            return;
        }
        const hudRoot = $.GetContextPanel()
        .GetParent()!
        .GetParent()!
        .GetParent()!;
        let element = hudRoot.FindChildTraverse("inventory_list");
        if(element){
            const list = Array(9).fill(0).map((elm,index)=>{
               const panel = element!.FindChildTraverse(`inventory_slot_${index - 1}`)?.FindChildTraverse("ItemImage")
               const entity_index = inventory_comp.slots[("slot_" + index) as keyof Inventory['slots']]?.dota_entity
               if(entity_index != -1 && entity_index != null){
                    $.Msg("设置了var",index,",",entity_index)
                    panel?.SetAttributeInt("entity_index",entity_index)
               }
               return panel
            })
            
            dota_item_panel_list.current = list as ItemImage[]
            set_dota_item_panel_list_update(v=>!v)
        }
    },[inventory_comp,inventory_update])


    useEffect(()=>{
        dota_item_panel_list.current.forEach(elm=>{
            if(elm != null){
                if(elm.GetAttributeInt("is_drag_register",0) != 1){
                    elm.SetAttributeInt("is_drag_register",1)
                    elm.SetDraggable(true)
                    $.RegisterEventHandler( 'DragEnter', elm, ()=>{$.Msg("DragEnter")} );
                    $.RegisterEventHandler( 'DragDrop', elm, ()=>{$.Msg("DragDrop")} );
                    $.RegisterEventHandler( 'DragLeave', elm, ()=>{$.Msg("DragLeave")} );
                    $.RegisterEventHandler( 'DragEnd',elm, ()=>{$.Msg("DragEnd")});
                }
            }
        })
    },[dota_item_panel_list_update])

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
                <EquipmentSlot x="200px" y="340px"  slot_index={0} slot_type={EQUIPMENT_TYPE.Headwear} item_data={equipment_comp?.slot_0}/>
                <EquipmentSlot x="233px" y="244px" slot_index={1} slot_type={EQUIPMENT_TYPE.Weapon} item_data={equipment_comp?.slot_1}/>
                <EquipmentSlot x="245px" y="584px" slot_index={2} slot_type={EQUIPMENT_TYPE.Clothes} item_data={equipment_comp?.slot_2}/>
                <EquipmentSlot x="23px" y="274px"  slot_index={3} slot_type={EQUIPMENT_TYPE.Necklace} item_data={equipment_comp?.slot_3}/>
                <EquipmentSlot x="23px" y="114px"  slot_index={4} slot_type={EQUIPMENT_TYPE.Back} item_data={equipment_comp?.slot_4}/>
                <EquipmentSlot x="23px" y="384px"  slot_index={5} slot_type={EQUIPMENT_TYPE.Shoulder} item_data={equipment_comp?.slot_5}/>
                <EquipmentSlot x="23px" y="194px"  slot_index={6} slot_type={EQUIPMENT_TYPE.Hand} item_data={equipment_comp?.slot_6}/>
                <EquipmentSlot x="23px" y="484px"  slot_index={7} slot_type={EQUIPMENT_TYPE.Hand} item_data={equipment_comp?.slot_7}/>
                <EquipmentSlot x="23px" y="584px"  slot_index={8} slot_type={EQUIPMENT_TYPE.Ring} item_data={equipment_comp?.slot_8}/>
                <EquipmentSlot x="123px" y="584px" slot_index={9} slot_type={EQUIPMENT_TYPE.Ring} item_data={equipment_comp?.slot_9}/>
            </Panel>
        }
        </Motion>
}

// // dota_item_drag_begin: object;
// // dota_item_drag_end: object;
// GameEvents.Subscribe()