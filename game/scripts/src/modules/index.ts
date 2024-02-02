import { Engine } from '../lib/ecs/Engine';
import { Debug } from './Debug';
import { GameConfig } from './GameConfig';
import { PlayerDungeon, create_role_system, eval_debug_system, game_init_system, game_loop_system, ok_panel_to_event_system, remove_role_system, role_in_game_ok_system, ui_system, unco_debug_system } from './systems/main_system';
import { big_world_map_move_system, big_world_map_trigger_tileset, create_creep_system, in_city_system, in_mark_system, init_cur_dungeon_map_data, load_player_in_3d_scene, player_dungeon_move, player_move_to_dungeon_creep, shop_system, tileset_create_system } from './systems/map_system';
import type * as  Qset  from './systems/query';
import { TestCreateRoleSystem } from './systems/test';
import { XNetTable } from './xnet-table';
import "../lib/utils/table"
import { steam_id_http_init_system } from './systems/http_system';
import type * as event from './systems/event';
import type * as tag from './component/tag';
import "./modifiers/base/collision_modifier"
import type { OkPanel } from './component/special';
import { enquence_delay_call } from '../fp';
import { http_get_npc_sell_list_system, npc_buy_system } from './systems/npc';
import type { Entity } from '../lib/ecs/Entity';


declare global {
    interface CDOTAGameRules {
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
        world: Engine;
        QSet:typeof Qset['Qset'];
        event:typeof event['event'];
        tag:typeof tag['tag'];
        entityId:number;
        componentClassId:number;
        enquence_delay_call:(fn:Function) =>boolean|void;
    }
    function DeepToString(this:void,AnyTable);
    function TriggerOkPanel(this:void,tile:string,uid_name:string,type:string,data:AnyTable,call_back:(panel_event:OkPanel)=>void):void
}

/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        GameRules.entityId = 1;
        GameRules.componentClassId = 1;
        // 初始化所有的GameRules模块
        //加载顺序 首先加载tag event 然后是query
        GameRules.enquence_delay_call = enquence_delay_call()
        GameRules.tag = (require("./component/tag") as typeof tag).tag
        GameRules.event = (require("./systems/event") as typeof event).event
        GameRules.QSet = (require("./systems/query") as typeof Qset).Qset

        collectgarbage("restart")
        print("当前使用内存",collectgarbage("count"))

        GameRules.XNetTable = new XNetTable();
        // 如果某个模块不需要在其他地方使用，那么直接在这里使用即可
        new GameConfig();
        // 初始化测试模块xD
        new Debug();


        DOTA_SpawnMapAtPosition("prefabs/base_clip",Vector(0,0,0),false,null,null,undefined);

        GameRules.world = new Engine();
        for(let [key,value] of pairs(GameRules.QSet)){
            print(`[ecs] query ${tostring(key)} insert engine system`)
            GameRules.world.addQuery(value as any)
        }

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

        ListenToGameEvent("npc_spawned",(event)=>{
            const hero = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC_Hero
            if(hero.IsHero()){
                print("添加了modifier")
                hero.AddNewModifier(hero,null,"collision_modifier",{duration:99999})
            }
        },[])

        
        
        // GameRules.world.addSystem(new TestCreateRoleSystem());
        // GameRules.world.addSystem(new init_cur_dungeon_map_data());
        // GameRules.world.addSystem(new PlayerDungeon());
        // GameRules.world.addSystem(new player_dungeon_move())
        // GameRules.world.addSystem(new player_move_to_dungeon_creep())
        // GameRules.world.addSystem(new create_creep_system())
        // GameRules.world.addSystem(new load_player_in_3d_scene())
    }
}

