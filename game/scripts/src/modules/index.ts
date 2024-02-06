import { Engine } from '../lib/ecs/Engine';
import { Debug } from './Debug';
import { GameConfig } from './GameConfig';
import { create_role_system, eval_debug_system, game_init_system, game_loop_system, ok_panel_to_event_system, remove_role_system, role_in_game_ok_system, ui_system, unco_debug_system } from './systems/main_system';
import { big_world_map_move_system, big_world_map_trigger_tileset, in_city_system, in_mark_system, shop_system, tileset_create_system } from './systems/map_system';
import type * as  Qset  from './systems/query';
import { XNetTable } from './xnet-table';
import "../lib/utils/table"
import { steam_id_http_init_system } from './systems/http_system';
import type * as event from './systems/event';
import type * as tag from './component/tag';
import "./modifiers/base/collision_modifier"
import { enquence_delay_call } from '../fp';
import { http_get_npc_sell_list_system, npc_buy_system } from './systems/npc';
import type { Entity } from '../lib/ecs/Entity';
import type { OkPanel } from './component/special';
import type comp from "./component/index"
import { sutep_system } from "./reload"
import { Class } from '../lib/utils/Class';

interface DotaHttpContainerData {
    dataSource:string,
    database:string,
    collection:string,
    stage:string,
    instance:InstanceType<any>
}

interface SystemHttoContainerData extends DotaHttpContainerData{
    system_key:(instance:InstanceType<any>) => Promise<MONGODB_SYSTEM_KEY>
}



declare global {
    const c:typeof comp;
    interface CDOTA_Item{
        Entity:Entity
    }

    interface CDOTAGameRules {
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
        world: Engine;
        QSet:typeof Qset['Qset'];
        event:typeof event['event'];
        tag:typeof tag['tag'];
        entityId:number;
        componentClassId:number;
        enquence_delay_call:(fn:Function,name?:string,) =>boolean|void;
        reload:boolean
    }
    function DeepToString(this:void,AnyTable);
    function TriggerOkPanel(this:void,tile:string,uid_name:string,type:string,data:AnyTable,call_back:(panel_event:OkPanel)=>void):void

    let container:{
        comp_container:Set<string>;
        comp_decorator_clear_container:Map<string,Function[]>;
        to_client_event_container:Set<InstanceType<any>>;
        to_debug_container:Map<string,Class<any>>;
        to_save_container:Set<string>
        
        http_comp_decorator_container:Map<string,DotaHttpContainerData>
        http_comp_decorator_container_with_init:Map<string,DotaHttpContainerData>
        http_with_user_container:Map<string,DotaHttpContainerData> 
        http_with_system_container:Map<string,SystemHttoContainerData>
        is_has_http_comp:Map<string,DotaHttpContainerData>
    }

}



/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        container = {} as any
        container.comp_container = new Set()
        container.comp_decorator_clear_container = new Map()
        container.to_client_event_container = new Set()
        container.to_debug_container = new Map()
        container.to_save_container = new Set()
        container.http_comp_decorator_container = new Map()
        container.http_comp_decorator_container_with_init = new Map()
        container.http_with_user_container= new Map();
        container.http_with_system_container = new Map();
        container.is_has_http_comp = new Map()
        CustomGameEventManager.Send_ServerToAllClients("unco_game_init",{})
        // Object.entries(require('./component/index').default).forEach(elm=>{
        //    for(const key in elm[1] as any){
        //       _G[key] = elm[1][key]
        //       print("全局环境",key,"===",elm[1][key]) 
        //    }
        // })
        //@ts-ignore 
        _G['c'] = require("./component/index").default
        GameRules.entityId = 1;
        GameRules.componentClassId = 1;
        // 初始化所有的GameRules模块
        //加载顺序 首先加载tag event 然后是query
        GameRules.enquence_delay_call = enquence_delay_call()
        GameRules.tag = (require("./component/tag") as typeof tag).tag
        GameRules.event = (require("./systems/event") as typeof event).event
        GameRules.QSet = (require("./systems/query") as typeof Qset).Qset

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


        ListenToGameEvent("npc_spawned",(event)=>{
            const hero = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC_Hero
            if(hero.IsHero()){
                print("添加了modifier")
                hero.AddNewModifier(hero,null,"collision_modifier",{duration:99999})
                hero.AddAbility("ability_test")
                hero.AddAbility("ability_test")
                hero.AddAbility("ability_test")
                hero.AddAbility("ability_test")
                hero.AddAbility("ability_test")
                hero.AddAbility("ability_test")
                hero.AddAbility("ability_test")
                //必须要先建立init
            }             
        },[])




        sutep_system()


        GameRules.reload = true;

        
    }
}

