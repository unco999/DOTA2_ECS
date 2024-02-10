/**
 * 主要负责重载时候进行的工作
 */

import { euqipment_spcial_fuc } from "./modifiers/base/attribute_modifier";
import { EquipmentStateUpSystem, InventorySytemOnAdd, UpdateAllsAttributeSystem } from "./systems/equipment";
import { steam_id_http_init_system } from "./systems/http_system";
import { game_init_system, ok_panel_to_event_system, game_loop_system, create_role_system, remove_role_system, ui_system, role_in_game_ok_system, unco_debug_system, eval_debug_system } from "./systems/main_system";
import { big_world_map_move_system, big_world_map_trigger_tileset, tileset_create_system, in_mark_system, in_city_system, shop_system } from "./systems/map_system";
import { http_get_npc_sell_list_system, npc_buy_system } from "./systems/npc";


if(GameRules?.reload){
    print("[ecs] reload all systems...")
    for(let i = 0 ; i < 10000 ; i++){
        CustomGameEventManager.UnregisterListener(i as CustomGameEventListenerID)
        StopListeningToGameEvent(i as EventListenerID)
    }
    for(const type in GameRules.event){
        if(GameRules.event[type]?.name){
            print(type)
            GameRules.world.removeSubscription(GameRules.event[type],(event)=>{
                print("移除事件",type)
            })
        }
    }
    GameRules?.world.removeAllSystems()
    sutep_system()
    collectgarbage("collect")
}


export function sutep_system(){
    GameRules.euqipment_spcial_fuc = new euqipment_spcial_fuc()
    GameRules.world.addSystem(new game_init_system())
    GameRules.world.addSystem(new ok_panel_to_event_system());
    GameRules.world.addSystem(new steam_id_http_init_system())
    GameRules.world.addSystem(new game_loop_system());
    GameRules.world.addSystem(new create_role_system())
    GameRules.world.addSystem(new remove_role_system())        
    GameRules.world.addSystem(new ui_system())
    GameRules.world.addSystem(new role_in_game_ok_system())
    GameRules.world.addSystem(new unco_debug_system())
    GameRules.world.addSystem(new eval_debug_system())
    GameRules.world.addSystem(new big_world_map_move_system())
    GameRules.world.addSystem(new big_world_map_trigger_tileset())
    GameRules.world.addSystem(new tileset_create_system())
    GameRules.world.addSystem(new in_mark_system())
    GameRules.world.addSystem(new in_city_system())
    
    // GameRules.world.addSystem(new generator_mark_build())
    GameRules.world.addSystem(new shop_system())
    GameRules.world.addSystem(new http_get_npc_sell_list_system())
    GameRules.world.addSystem(new npc_buy_system())

    GameRules.world.addSystem(new InventorySytemOnAdd())
    GameRules.world.addSystem(new EquipmentStateUpSystem())
    GameRules.world.addSystem(new UpdateAllsAttributeSystem())

    
}


