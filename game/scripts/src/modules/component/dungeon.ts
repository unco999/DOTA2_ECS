import { doc, to_client_event, to_player_net_table } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { ILinkedComponent } from "../../lib/ecs/LinkedComponent";
import { Config } from "../Config";

export class DunGenonCache{
    constructor(
        public link_info_targets:CBaseEntity[],
        public portal:CBaseEntity[],
        public next:CBaseEntity
    ){
        
    }
}

/**
 * 踩机关通关条件
 */
@doc.watch("none",to_client_event("player"))
export class StepOntheMechanismif{
    constructor(
        public organ:EntityIndex[],
        public is_ok:boolean,
        public start_time:number,
        public end_time:number,
        public sequence:number[],
        public next_down_button:number
    ){

    }
}


/**
 * 当前总闯关信息
 */
export class overAlllevelInfo{
    constructor(
        public curlevelStack:LevelStack,
        public cur_level_level_ecs_entity:Entity,
        /**历史闯关信息的ecsid的情况 过关只删除缓存不删除ent */
        public history:Entity[],
    ){

    }
}

/**
 * 当前地下城信息info
 */
export class LevelInfo{
    constructor(
        public dungeon_info:[string,Partial<typeof Config.default_level[keyof typeof Config.default_level] &
       
        typeof Config.boss_level[keyof typeof Config.boss_level]>,
    ],
        public entry_point:Vector,
        public level_behaivor:LEVEL_BEHAIVOR,
        public creep_count?:number
    ){

    }
}

/**
 * 商店关卡信息
 */
export class ShopLevelInfo{
    constructor(
        public level_stack:LevelStack,
        public entry_point:Vector
    ){

    }
}

/**
 * 关卡缓存信息
 */
export class LevelCacheInfo{
    constructor(
        public name:string,
        public vmap_cache:SpawnGroupHandle[],
        public particle_ids:ParticleID[],
        public dota_enties:CBaseEntity[],
        /**没有连接的位置 */
        public no_link_info_target:CBaseEntity[],
        /**放雕像的位置 */
        public statue_info_target:CBaseEntity[],
        /**所有的info_target */
        public all_info_target:CBaseEntity[],
        /**出口info */
        public out_put_info_target:CBaseEntity[],

        public portal:{ParticleIDs:ParticleID,trigger:CBaseTrigger}[],
        
        public statues:CBaseEntity[],

        public unit:CDOTA_BaseNPC[],
    ){

    }
}



/**
 * 当某个状态发生改变 马上发送全局事件
 */
@doc.watch("none",to_client_event("system"))
export class GameLoopStateComp{
    constructor(
        public cur_loop_state:GameLoopState,
        public back_loop_state:GameLoopState
    ){

    }
}

/**
 * 玩家基本信息
 */
@doc.watch("none",to_client_event("system"))
export class PlayerInfoComp{
    constructor(
        public player_entity_index:EntityIndex,
        public player_num:number,
        public plyaer_hero_entity_index:EntityIndex,
        public player_hero_ecs_ent_id:ECSID,
        public steam_id:number,
        public connect_state:ConnectionState
    ){

    }
}

export class HeroInfoComp{
    constructor(
        public hero_name:string,
        public player_ecs_ent_id:ECSID,
        public hero_dota_ent_id:EntityIndex,
    ){

    }
}


/**
 * 仇恨值comp
 */
export class AggroComp{
    constructor(
        public data:AggroPair[]
    ){

    }
}

/**
 * 过关条件
 */
@doc.watch("none",to_client_event("system"))
export class LevelBehaivorCheck{
    constructor(
        public level_behaivor:LEVEL_BEHAIVOR,
        public cur:number,
        public check_max:number,
    ){

    }
}

/**
 * boss原生抽取数据
 */
export class BossDataRaw{
    constructor(
        public BossData:BossData
    ){
        
    }
}

/**
 * boss的衍生实体缓存 比如召唤物之类的
 */
export class BossDerivative{
    constructor(
        public npc:Record<string,CDOTA_BaseNPC>,
        public prop:Record<string,CBaseAnimatingActivity>,
    ){
        
    }
}


/**
 * 卡牌数据
 */
@doc.LinkComp()
@doc.watch("none",to_client_event("player"))
export class Card implements ILinkedComponent{
    constructor(
        public id:string,
        public next:none,
        public uid:string,
        public card_name:string,
        public card:BaseCardType,
        public index:number,
        public merge_sequence:BaseCardType[],
        public image:CardImage
    ){

    }
}
