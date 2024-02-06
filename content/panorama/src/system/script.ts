
// function is_init_comp(comp:CompSend){
//     global_container.cmp_data_cache[comp.$$$$entity] = comp;
//     global_container.cmp_data_with_type_cache[comp.comp_name] = {}
//     insert_with_type_comp(comp)
//     global_container.EventBus?.emit("",comp)
// }


// function insert_with_type_comp(comp:CompSend){
//     global_container.cmp_data_with_type_cache[comp.comp_name][comp.$$$$entity] = comp;
//     global_container.EventBus?.emit("Entity" + comp.$$$$entity,comp)
// }


GameEvents.Subscribe("LargePopupBox",(event)=>{
    GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",event)
})
if(!GameUI.CustomUIConfig().reload){
    $.Msg("重载了")
    GameUI.CustomUIConfig().comp_data_with_date_time_cache = {} as any
    GameUI.CustomUIConfig().reload = true;
    const timer = () => {$.Schedule(1,()=>{
        $.Msg("ui 初始化绑定" ,Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
    if(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != -1){
        $.Msg("12333" ,Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
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
        return;
    }else{
        timer()
    }
}) 
    }
    timer()   
}


  
    
