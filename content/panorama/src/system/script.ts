


const hudRoot = $.GetContextPanel()
.GetParent()!
.GetParent()!
.GetParent()!;
if(GameUI.CustomUIConfig().reload == true){
    for(let i = 0; i < 1000; i++){
        
        GameEvents.Unsubscribe(i as any)    
    }
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
            $.Msg("加上事件")
            $.Msg(elm)
            if(elm == null) return;
            elm.SetPanelEvent("onmouseover",()=>{
                GameUI.CustomUIConfig().EventBus?.emit("tooltipitem",{switch:true,x,y})
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

if(!GameUI.CustomUIConfig().reload){
    GameUI.CustomUIConfig().comp_data_with_date_time_cache = {} as any
    GameUI.CustomUIConfig().comp_data_with_dota_entity = {} as any
    GameUI.CustomUIConfig().with_entity_comp_cache = {}
    const timer = () => {$.Schedule(Game.GetGameFrameTime(),()=>{
    if(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != -1){
        GameUI.CustomUIConfig().reload = true;
        GameUI.SetCameraDistance(1900)
        GameUI.SetCameraYaw(45)
        GameUI.SetCameraPitchMin(55)
        GameUI.SetCameraPitchMax(55)
        GameUI.SetCameraTarget(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
        


        const hudRoot = $.GetContextPanel()
        .GetParent()!
        .GetParent()!
        .GetParent()!;
        function HideHudElements(name: string) {
        var element = hudRoot.FindChildTraverse(name);
        if (element != null) {
            element.style.visibility = "collapse";
        }}

        const center_with_stats = hudRoot.FindChildTraverse("center_with_stats")
        center_with_stats!.style.marginLeft = "600px"
        
        
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
}


  
    
