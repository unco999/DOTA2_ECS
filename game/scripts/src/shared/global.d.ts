

declare const enum GameLoopState{
    "none",
    "game_start",
    "dungeon",
    "load",
    "boss"
}

declare type ECSID = number

declare type LevelStack = number | undefined


/**
 * 关卡细节阶段
 */
declare const enum LevelState{
    "info_ok",
    "clear_ok",
    "render_ok",
    "map_ok",
}

/**关卡类型 */
declare const enum LevelType{
    shop,
    default,
    boss
}

/**
 * 所有boss关卡
 */
declare const enum bossType{
    /**海底boss */
    "hai_di_boss"
}

/**
 * 所有的普通级别的地下城类别
 */
declare const enum defaultDungenonType{
    /**水仙花平原 */
    "shui_xian_hua_ping_yuan",
    /**沙漠遗迹 */
    "sha_mo_yi_ji",
}

/**
 * 所有普通地下城的最大可选择数量
 */
declare const defaultDungennonCount = 2


/**
 * 仇恨值键值对
 */
declare type AggroPair = {target_entity_index:EntityIndex,target_ecs_entity_index:ECSID,damage_count:number,cur_aggro:number}


/**
 * 可能性行为表 这个是关乎BOSS战斗的机制 从权重种抽取某些行为
 * 其实是和技能相匹配的
 */
declare interface PossibilityBehaviorData {
    weight:number, //抽取权重
    bt_node: (t:any) => InstanceType<any>
}



/**
 * boss data 数据申明
 */

declare type BossData = {
    name:string
    model:string,
    possibility_behavior_data:PossibilityBehaviorData[],  
    derivative:{path:string,idlesequence:string,hitsequence:string,deathsequence:string,scale:0.3,render_color:Vector},
    minions:string[],
}

declare interface IBehaviortree {
    m_npc: any;
    BLACKBOARD: any;
    root: any;
    currentNode: string;
    loop: any;
    /**
     * 开始一个计时器
     */
    StartTimer(delay: number, cb: ()=>number|null): void;
    Set_BLACKBOARD_V(BLACKBOARD_KEY: string, value: any): void;
    Get_BLACKBOARD_V(BLACKBOARD_KEY: string): any;
    init(): void;
    yield(time: number): any;
    Start(): any;
}


declare type Class<T> = {
    new(...args: any[]): T;
  };
  
declare const enum LEVEL_BEHAIVOR{
    none,
    cai_ji_guan,   //需要把所有的机关踩了
    ji_bai_mi_gong_suo_you_guai_wu, //击败迷宫所有怪物
}

declare const enum LEVEL_BEHAIVOR_MAX { max = 2 }


declare const enum INFO_TARGET_TAG{
    "statue" = "statue",
    "not_connect" = "not_connect",
    "organ" = "organ",
    "portal" = "portal"
}

declare const enum CREEP_TAG{
    "level_creep" = "level_creep",
    "damaged" = "damaged",

    /**boss机制 */
    "80over" = "80over",
    "60over" = "80over",
    "40over" = "80over",
    "20over" = "80over",

}

declare const enum CardContainerBehavior{
    添加牌=0x1,洗牌=0x2,合成=0x4,丢弃=0x8,使用=0x10,合成光=0x20,合成暗=0x40,普通合成=0x80
}

declare const enum BaseCardType{
    风=0x1,火=0x2,雷=0x4,水=0x8,木=0x10,土=0x20,光=0x40,暗=0x80
}

declare const none = "none"

declare type none = typeof none;


declare interface Card{
    uid:string,
    card_name:string,
    card:BaseCardType,
    index:number,
    merge_sequence:BaseCardType[]
    image:string
}

declare interface CardContainer{
    slots:Record<number,Card>
    discard:Record<number,Card>
}

declare type CardImage = string

declare const enum SpellType{
    "圆圈点位",
    "线点位"
}