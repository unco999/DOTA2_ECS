import { BaseModifier, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerModifier()
export class collision_modifier extends BaseModifier{


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_UNIT_MOVED]
    }

    OnUnitMoved(event: ModifierUnitEvent): void {
        if(event.unit == this.GetParent()){
            const _m = this.GetParent()
            const collision = Entities.FindAllByClassnameWithin("prop_dynamic",_m.GetOrigin().__add(_m.GetForwardVector().__mul(20)),10).filter(elm=>!elm.GetModelName().includes("tileset") && !elm.GetModelName().includes("mines_tracks"))
            const npc = Entities.FindAllByClassnameWithin("prop_dynamic",_m.GetOrigin().__add(_m.GetForwardVector().__mul(30)),80).filter(elm=> elm.GetName().includes("role"))
            if(npc.length > 0){
                    const near_npc = npc.pop() as CDOTA_BaseNPC_Hero
                    near_npc.SetForwardVector(_m.GetOrigin().__sub(near_npc.GetOrigin()))
                    const uuid = DoUniqueString("药水店")
                    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(this.GetCaster().GetPlayerOwnerID()),"OkPanel",{
                        title:`是否进入${near_npc.GetName()}`,
                        uuid:uuid,
                        type:"in_shop",
                        data:{shop_type:near_npc.GetName()}
                  })
                  const id = CustomGameEventManager.RegisterListener(uuid,(_,panel_event)=>{
                      if(panel_event.click == "ok" ){
                          const cur_scene_comp = GameRules.QSet.is_select_role.first.get(c.role.CurrentScene)
                          cur_scene_comp.scene_name = near_npc.GetName()
                          cur_scene_comp.scene_type = c.tag.scene.NPC
                          GameRules.world.dispatch(new GameRules.event.OpenNpcUiEvent(
                               near_npc.GetName(),
                          ))
                      }
                      CustomGameEventManager.UnregisterListener(id)
                  })
            }
            if(collision.length > 0){
                _m.SetAbsOrigin(_m.GetAbsOrigin().__sub(_m.GetForwardVector().__mul(10)))
                _m.Stop()
            }
        }
    }
}