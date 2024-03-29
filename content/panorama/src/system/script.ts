import { luaToJsArray } from "../base";
import  "./camera"



const hudRoot = $.GetContextPanel()
.GetParent()!
.GetParent()!
.GetParent()!;


if(GameUI.CustomUIConfig().reload == true){
    // for(let i = 0; i < 1000; i++){
        
    //     GameEvents.Unsubscribe(i as any)    
    // }
}
for(let i = 0 ; i < 5 ; i++){
    hudRoot.FindChildTraverse("HUDElements")?.FindChildInLayoutFile("EquipmentMain")?.RemoveAndDeleteChildren()
    hudRoot.FindChildTraverse("HUDElements")?.FindChildInLayoutFile("EquipmentMain")?.DeleteAsync(0)
}   
GameEvents.Subscribe("dota_inventory_item_added",()=>ClearItemsPanelEvent())
GameEvents.Subscribe("dota_inventory_changed",()=>ClearItemsPanelEvent())

const ClearItemsPanelEvent = () => {
    $.Schedule(Game.GetGameFrameTime(),()=>{
        const panel = FindItemSlotPanel()
        if(panel == null) return;
        panel.forEach(elm=>elm.ClearPanelEvent("onmouseover"))
        panel.forEach(elm=>elm.ClearPanelEvent("onmouseout"))
        panel.forEach(elm=>{
            const x = elm.GetPositionWithinWindow().x
            const y = elm.GetPositionWithinWindow().y
            if(!isFinite(x) || !isFinite(y) ) return;
            if(elm == null) return;
            elm.SetPanelEvent("onmouseover",()=>{
                //@ts-ignore
                const dota_entity_id = elm.contextEntityIndex
                const ecs_id = GameUI.CustomUIConfig().comp_data_with_dota_entity[dota_entity_id]
                if(ecs_id){
                    const comps = GameUI.CustomUIConfig().with_entity_comp_cache[ecs_id]
                    $.Msg("组件信息情况",comps)
                    GameUI.CustomUIConfig().EventBus?.emit("tooltipitem",{switch:true,x,y,comps})
                }
            })
            elm.SetPanelEvent("onmouseout",()=>{
                GameUI.CustomUIConfig().EventBus?.emit("tooltipitem",{switch:false,x,y})
            })
            $.Msg("赋值结束")
        })
    })
}

function FindItemSlotPanel(){
    let panel_list:Panel[] = []
    let element = hudRoot.FindChildTraverse("inventory_list")
    for(let i = 0 ; i < 9 ; i ++){
        const panel = element!.FindChildTraverse(`inventory_slot_${i}`)?.FindChildTraverse("ItemImage") as ImagePanel
        const ability_panel = element!.FindChildTraverse(`inventory_slot_${i}`)?.FindChildTraverse("AbilityButton") as AbilityImage
        //@ts-ignore
        if(panel && panel?.contextEntityIndex != -1 ){
            panel_list.push(panel)
            panel_list.push(ability_panel)
        }
    }
    return panel_list
}


function reload(){
    GameEvents.Subscribe("dota_item_picked_up",(event)=>{
        const hudRoot = $.GetContextPanel()
        .GetParent()!
        .GetParent()!
        .GetParent()!;
        let element = hudRoot.FindChildTraverse("inventory_list")
        const panel = element!.FindChildTraverse(`inventory_slot_${event.ItemEntityIndex}`)
    })
    
    GameEvents.Subscribe("LargePopupBox",(event)=>{
        GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",event)
    })
    
    GameEvents.Subscribe("s2c_bind_dota_entity_to_ecs_entity",(event)=>{
        $.Msg("s2c_bind_dota_entity_to_ecs_entity",event)
        GameUI.CustomUIConfig().comp_data_with_dota_entity[event.dota_entity] = event.ecs_entity_id
        $.Msg( GameUI.CustomUIConfig().comp_data_with_dota_entity[event.dota_entity] )
    })
    
    GameEvents.Subscribe("s2c_comp_to_event",(event)=>{
        if(GameUI.CustomUIConfig().with_entity_comp_cache[event.ecs_entity_index] == null){
            GameUI.CustomUIConfig().with_entity_comp_cache[event.ecs_entity_index] = {} as any
        }
        let last_cache = GameUI.CustomUIConfig().with_entity_comp_cache[event.ecs_entity_index]![event.class_name]
    
        if(last_cache){
            last_cache = Object.assign(last_cache,event.comp)
        }else{
            GameUI.CustomUIConfig().with_entity_comp_cache[event.ecs_entity_index]![event.class_name] = event.comp
        }
        $.Msg("收到ecs同步信息",GameUI.CustomUIConfig().with_entity_comp_cache[event.ecs_entity_index])
    })
    
    GameEvents.Subscribe("s2c_link_comp_to_event",(event)=>{
        $.Msg("收到link comp 更改",event.comp)
        if(GameUI.CustomUIConfig().with_link_comp_cache[event.class_name] == null){
            GameUI.CustomUIConfig().with_link_comp_cache[event.class_name] = [] as any
        }
        const cache = GameUI.CustomUIConfig().with_link_comp_cache[event.class_name]?.find(elm=>elm.uid == event.uid)
        if(cache){
            cache.comp = event.comp
        }else{
            GameUI.CustomUIConfig().with_link_comp_cache[event.class_name]?.push({uid:event.uid,comp:event.comp})
        }
        GameUI.CustomUIConfig().EventBus?.emit("link_comp_update",event.class_name)
    })
    
    GameEvents.Subscribe("s2c_link_remove",(event)=>{
        $.Msg("删除了",event.class_name,event.uid)
        $.Msg(GameUI.CustomUIConfig().with_link_comp_cache[event.class_name])
        GameUI.CustomUIConfig().with_link_comp_cache[event.class_name] = GameUI.CustomUIConfig().with_link_comp_cache[event.class_name]?.filter(elm=>elm?.uid != undefined && elm.uid != event.uid)
        GameUI.CustomUIConfig().EventBus?.emit("link_comp_update",event.class_name)
    })
}

reload()

$("#EquipmentMain")?.RemoveAndDeleteChildren()
$("#customPreview3DItems")?.RemoveAndDeleteChildren()
const bar = hudRoot.FindChildTraverse("ButtonBar")
bar!.style.marginTop = "800px"
// hudRoot.FindChildTraverse("center_with_stats")!.FindChildTraverse("StatBranch")!.style.visibility = "collapse"

if(!GameUI.CustomUIConfig().reload){
    GameUI.CustomUIConfig().comp_data_with_date_time_cache = {} as any
    GameUI.CustomUIConfig().comp_data_with_dota_entity = {} as any
    GameUI.CustomUIConfig().with_entity_comp_cache = {}
    GameUI.CustomUIConfig().with_link_comp_cache = {}
    const timer = () => {$.Schedule(Game.GetGameFrameTime(),()=>{
    if(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != -1){
        GameUI.CustomUIConfig().reload = true;
        // GameUI.SetCameraDistance(4000)
        GameUI.SetCameraYaw(45)
        GameUI.SetCameraPitchMin(55)
        GameUI.SetCameraPitchMax(55)
        // GameUI.SetCameraTarget(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
        


        const hudRoot = $.GetContextPanel()
        .GetParent()!
        .GetParent()!
        .GetParent()!;
        hudRoot.FindChildTraverse("center_with_stats")!.FindChildTraverse("StatBranch")!.style.visibility = "collapse"
        hudRoot.FindChildTraverse("center_with_stats")!.FindChildTraverse("level_stats_frame")!.style.visibility = "collapse"
    

        hudRoot.FindChildTraverse("center_with_stats")!.FindChildTraverse("portraitHUD")!.SetPanelEvent("onactivate",()=>{
            GameUI.CustomUIConfig().EventBus?.emit("open_nav")
        })
        
        
        
        


        
        
        function HideHudElements(name: string) {
        var element = hudRoot.FindChildTraverse(name);
        if (element != null) {
            element.style.visibility = "collapse";
        }}
        $("#EquipmentMain")?.RemoveAndDeleteChildren()
        $("#customPreview3DItems")?.RemoveAndDeleteChildren()
        hudRoot.FindChildTraverse("center_with_stats")!.FindChildTraverse("AghsStatusContainer")!.style.visibility = "collapse"
        const center_with_stats = hudRoot.FindChildTraverse("center_with_stats")
        const bar = hudRoot.FindChildTraverse("ButtonBar")
        hudRoot.FindChildTraverse("center_with_stats")!.FindChildTraverse("StatBranch")!.style.visibility = "collapse"
        const buff_container = hudRoot.FindChildTraverse("BuffContainer")?.FindChildTraverse("buffs")

        center_with_stats!.style.marginLeft = "950px"
        buff_container!.style.marginRight = "500px"

        buff_container!.style.marginRight = "500px"
        buff_container!.style.marginTop = "-50px"

        
        bar!.style.marginTop = "800px"
        // center_with_stats!.style.marginLeft = "600px"
        // center_with_stats!.style.zIndex = 2
        
        
        // HideHudElements("quickstats");
        // HideHudElements("ToggleScoreboardButton");
        // HideHudElements("GlyphScanContainer");
        HideHudElements("inventory_tpscroll_container");
        HideHudElements("inventory_neutral_slot_container");
        // HideHudElements("quickstats");
        HideHudElements("KillCam");
        // HideHudElements("stash");
        // HideHudElements("stackable_side_panels");
        // HideHudElements("center_with_stats");
        HideHudElements("minimap_container");
        // HideHudElements("lower_hud");
        HideHudElements("topbar");
        HideHudElements("shop_launcher_block")
        GameUI.CustomUIConfig().EventBus?.emit("game_start")

        return;
    }else{
        timer()
    }
}) 
    }
    timer()   
}else{
    
}




