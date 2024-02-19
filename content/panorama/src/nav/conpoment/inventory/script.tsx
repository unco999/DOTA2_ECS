import { useEffect, useMemo, useRef, useState } from "react"
import { useInterval } from "../../../hooks/useInterval"
import { useCompWithPlayer, useLinkComps } from "../../../hooks/useComp"

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


export const Inventory = ({page}:{page:number}) =>{
    const [winventory,update] = useLinkComps("WarehouseInventory",(a,b)=>a.slot_index - b.slot_index) as [compc_map['WarehouseInventory'][],number]

$.Msg("winventory?.[11]",winventory?.[11])

    const main = useRef<Panel>()    

    useEffect(()=>{
        main.current?.RemoveClass?.("back")
        main.current?.RemoveClass?.("next")
        main.current?.RemoveClass?.("spawn")
        if(page > 2 ){
            main.current?.AddClass?.("back")
        }
        if(page < 2  ){
            main.current?.AddClass?.("next")
        }
        if(page == 2){
            main.current?.AddClass?.("spawn")
        }
     },[page])
     return  <Panel className={"base"} ref={p=>main.current= p!} hittest={false}  style={{
                zIndex:2,
                  width:"100%",
                  height:"100%",
                  align:"center center",
             }}>
            <Panel style={{marginLeft:"-400px",marginTop:"-100px",backgroundColor:"rgba(0,0,0,0.5)",align:"center center",flowChildren:"right-wrap",width:"1000px",height:"576px"}}>
            <InventoryContainer lock={winventory?.[0]?.is_lock} inventory_index={0}/>
            <InventoryContainer lock={winventory?.[1]?.is_lock} inventory_index={1}/>
            <InventoryContainer lock={winventory?.[2]?.is_lock} inventory_index={2}/>
            <InventoryContainer lock={winventory?.[3]?.is_lock} inventory_index={3}/>
            <InventoryContainer lock={winventory?.[4]?.is_lock} inventory_index={4}/>
            <InventoryContainer lock={winventory?.[5]?.is_lock} inventory_index={5}/>
            <InventoryContainer lock={winventory?.[6]?.is_lock} inventory_index={6}/>
            <InventoryContainer lock={winventory?.[7]?.is_lock} inventory_index={7}/>
            <InventoryContainer lock={winventory?.[8]?.is_lock} inventory_index={8}/>
            <InventoryContainer lock={winventory?.[9]?.is_lock} inventory_index={9}/>
            <InventoryContainer lock={winventory?.[10]?.is_lock} inventory_index={10}/>
            <InventoryContainer lock={winventory?.[11]?.is_lock} inventory_index={11}/>
            </Panel>
            <DebutArcanaEarthshaker/>
            <DebutArcanaEarthshakerdes/>
            <Panel style={{x:"1175px",y:"462px",maxWidth:"300px",flowChildren:"right-wrap"}}>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
                <RbxSlot/>
            </Panel>
          </Panel>

    
}

/**合成轮盘  */
const DebutArcanaEarthshaker = () =>{
	return	<DOTAParticleScenePanel hittest={false} style={{align:"center center",marginTop:"-350px",marginLeft:"450px",width:"50%",height:"80%"}} camera="hero_camera" light="hero_light" particleName="particles/rubic_box" lookAt={"0 0 0"} cameraOrigin={"111 111 111"} particleonly={true} />
}

const RbxSlot = () =>{
    return <Image className={"rbxslot"} src="s2r://panorama/images/leaf_pages/debut_arcana_rubick/cube.psd">
    </Image>
}

const DebutArcanaEarthshakerdes = () =>{
    return <Panel hittest={false} style={{flowChildren:"down",x:"1513px",y:"161px",}}>
        <Label text={"※拉比克的魔方※"} style={{width:"419px",height:"30px",borderBottom:"2px solid #cfcfcf"}}/>
        <Label text={"拉比克的魔方"} style={{marginTop:"30px",width:"410px",height:"497px",backgroundColor:"rgba(0,0,0,0.5)"}}/>
        </Panel>
}

const InventoryContainer = ({inventory_index,lock}:{inventory_index:number,lock:boolean}) =>{
    
    return  <Panel style={{washColor:lock ? "#4f4f4f" : "white",margin:"20px",width:"206px",height:"140px"}}>
    <Panel style={{width:"206px",height:"140px",align:"center center"}}>
    <Panel id="InventoryBG" style={{width:"206px",height:"140px"}} hittest={true} />
    <Panel id="HUDSkinInventoryBG" className="InventoryBackground" hittest={false} />
    <Panel id="inventory_list_container" style={{align:"center center"}} hittest={false}>
        <Panel id="inventory_list" hittest={false} >
            <ItemAtomic id={"inventory_slot_0"}/>
            <ItemAtomic id={"inventory_slot_1"}/>
            <ItemAtomic id={"inventory_slot_2"}/>
        </Panel>
        <Panel id="inventory_list2" hittest={false}>
            <ItemAtomic id={"inventory_slot_3"}/>
            <ItemAtomic id={"inventory_slot_4"}/>
            <ItemAtomic id={"inventory_slot_5"}/>
        </Panel>
    </Panel>
    <Panel id="inventory_backpack_list" hittest={false} />
    <Panel id="BackpackShadow"hittest={false}/>
    </Panel>
    <Label text={`第${inventory_index}号背包 ${lock ? "未开启" : "正常使用"}`}/>
    </Panel>
}

const ItemAtomic = ({id}:{id:string}) => {
    return 	<GenericPanel id={id} type={"DOTAAbilityPanel"} className={"InventoryItem"} hittest={false}>
    <Panel id="ButtonAndLevel" hittest={false}>
            <Panel hittest={false} id="ButtonWell">
                <Panel id="ButtonSize">
                    <GenericPanel type={"DOTAAbilityButton"} id="AbilityButton">
                        {/* <DOTAAbilityImage abilityname={"undying_decay"}  id="AbilityImage" /> */}
                        <DOTAItemImage showtooltip={false} itemname={""} id="ItemImage" scaling="stretch-to-fit-x-preserve-aspect" />
                    </GenericPanel>
                </Panel>
            </Panel>
        {/* <Panel hittest={false} id="AbilityLevelContainer" /> */}
    </Panel>
    </GenericPanel>
}