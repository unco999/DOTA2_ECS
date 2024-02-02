import { doc, to_client_event, weak, clear_event, cache_remove, compose, NUMMAX, deep_print, replace$2obj, http, to_debug, NONE, get_entity, to_player_net_table } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { PLAYER } from "./base";
import { scene } from "./tag";





@clear_event(to_client_event("player",true),cache_remove)
@doc.watch("none",to_client_event("player"),to_debug())
export class Move {
    constructor(
        public x: number,
        public y: number,
    ){

    }
}


@clear_event(surrounding_maps_send("remove"),cache_remove)
@doc.watch("none",surrounding_maps_send())
export class SurroundingMaps{
    constructor(
       public maps_ent:Record<numString,Entity>
    ){
    }
}



//周围地图的客户端解析方式
function surrounding_maps_send(remove?:"remove"){
    return (instance:SurroundingMaps) => {
        let obj = {maps_ent:{}};
        for(let key in getmetatable(instance.maps_ent) ?? instance.maps_ent){
            const comps = GameRules.world.getEntityById(instance.maps_ent[key].id).getComponents()
            comps.forEach((comp)=>{
                if(obj.maps_ent[key] == null){
                    obj.maps_ent[key] = {}
                }
                obj.maps_ent[key][comp.constructor.name] = comp
            })
        }
        const player_id = GameRules.world.getEntityById(instance["$$$$entity"]).get(PLAYER).PlayerID
        CustomGameEventManager.Send_ServerToAllClients(instance.constructor.name + player_id + "player",remove == "remove" ? {} : obj)
    }
}

/**进入地下城的标识 */
export const Dungeon = "Dungeon"

/**遇怪的标识 */
export const MoveToCreep = "MoveToCreep"

/**无法操作地图的标识 */
export const NoMap = "NoMap"


export const In3DScene = "In3DScene"


/**玩家角色插槽entity */
export const PlayerRoleSlot = "PlayerRoleSlot"

/**成长属性 */
@doc.watch("none",to_client_event("player"))
export class GrowUp{
    constructor(
        public strength_up?:number, //力量成长
        public intelligence_up?:number, //智力成长
        public dexterity_up?:number, //敏捷成长
        public attack_damage_up?:number, //攻击力成长
        public magic_resistance_up?:number, //魔法抗性成长
        public flame_attack_up?:number, //火焰攻击成长
        public ice_attack_up?:number, //冰霜攻击成长
        public lightning_attack_up?:number, //闪电攻击成长
        public shadow_attack_up?:number, //暗影攻击成长
        public fire_resistance_up?:number, //火焰抗性成长
        public frost_resistance_up?:number,  //冰霜框型成长
        public lightning_resistance_up?:number, //闪电抗性成长
        public storm_resistance_up?:number, //暗影抗性成长
        public uuid?:string
     ){
     }
}


/**玩家的角色插槽 */
@doc.watch("deep",to_client_event("player"),to_debug())
export class RoleSlot{
    constructor(
        public slot1?:{hero_name:string,origin_name:string,uuid:string},
        public slot2?:{hero_name:string,origin_name:string,uuid:string},
        public slot3?:{hero_name:string,origin_name:string,uuid:string},
        public slot4?:{hero_name:string,origin_name:string,uuid:string},
        public slot1_entity_id?:number,
        public slot2_entity_id?:number,
        public slot3_entity_id?:number,
        public slot4_entity_id?:number,
        public uuid?:string,
    ){
        LoadKeyValues
    }
}


/**role信息 比如在哪里出生 有什么特性之类的*/
@doc.watch("none",to_debug())
export class RoleInfo{
    constructor(
        //出生地图
        public born_map:string,
        //出生英雄
        public born_hero:string,
        //创建时间
        public create_time:string,
        //是否已经死亡
        public is_dead:boolean,

    ){

    }
}



export class HeroAttribute{
    constructor(
        public attack:number,
        public armor:number,
        public hp:number,
        public mp:number,
        public speed:number,
        public attack_range:number,
        public attack_interval:number,
        public attack_type:number,
     ){
     }
}

@doc.watch("none",to_debug())
export class PlayerGold{
    constructor(
        gold_1:number,
        gold_2:number,
        gold_3:number,
        gold_4:number,
        gold_5:number,
        gold_6:number,
        novice_gold:number
    ){

    }
}



/**
 * 角色的世界地图持久化数据
 */
@doc.watch("deep",
to_debug(),
to_client_event("player"),
http("both","mongodb-atlas","dota-test","comp","game_state_main=>game_comp_loading_http"),
(context:RoleWorldMapData)=>{
    if(context.cur_to_map_landmark.schedule == 100){
        context.cur_map_index = context.cur_to_map_landmark.map_index
        context.cur_landmark_index = context.cur_to_map_landmark.landmark_index
        context.cur_to_map_landmark = NONE
        GameRules.world.dispatch(new GameRules.event.RoleChangeMapAnyEvent(context,get_entity(context)))
    }
})
export class RoleWorldMapData {
    constructor(
        public cur_map_index:string,
        public cur_landmark_index:string, //玩家所在的地标
        public cur_to_map_landmark:{map_index:string,landmark_index:string,schedule:number,is_trigger_tileset:boolean}
    ){

    }
}

@doc.watch("deep",to_client_event("player"),to_debug())
export class RoleTileSetInfo {
    constructor(
        public tileset_name:string,
        public tileset_index:string,
    ){
    }
}

@doc.watch("deep",to_player_net_table(),to_debug())
/**当前所在场景代表 泛指任何场景 */
export class CurrentScene{
    constructor(
        public parent_scene:string,
        public scene_name:string,
        public scene_type:scene,
    ){
    }
}

/**
 * 当前兽王开启的传送点
 */
@doc.watch("deep",to_client_event("player"),to_debug())
export class BeastKingMovePoint{
    constructor(
        public points:{name:string,boolean:number}[]
    ){

    }
}