




GameEvents.Subscribe("LargePopupBox",(event)=>{
    GameUI.CustomUIConfig().EventBus?.emit("LargePopupBox",event)
})
if(!GameUI.CustomUIConfig().reload){
    GameUI.CustomUIConfig().comp_data_with_date_time_cache = {} as any
    GameUI.CustomUIConfig().reload = true;
    const timer = () => {$.Schedule(1,()=>{
    if(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != -1){
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


  
    
