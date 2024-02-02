import { tag } from "../modules/component/tag"

/**@noSelf */
function bian_yuan(sEvent,trigger){
    const uuid = DoUniqueString("药水店")
    const ent = trigger.activator as CDOTA_BaseNPC_Hero
    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(ent.GetPlayerOwnerID()),"OkPanel",{
        title:`是否进入离开城市?`,
        uuid:uuid,
        type:"exit_city",
        data:{}
  })
  const id = CustomGameEventManager.RegisterListener(uuid,(_,panel_event)=>{
      if(panel_event.click == "ok" ){
          GameRules.QSet.is_select_role.first.remove(tag.is_in_chengshi)
      }
      CustomGameEventManager.UnregisterListener(id)
  })
}

_G['global_bian_yuan'] = bian_yuan