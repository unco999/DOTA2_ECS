
declare interface Compid { $$$$entity: number }

declare type Comp = Record<string, any> & Compid

declare type CompName = { comp_name: string }

declare type CompSend = Comp & CompName;

declare type OwnerComp = { hero_idx?: EntityIndex, player_id?: PlayerID }

declare type Mask = number

declare type MapBlockType = Mask

declare type numString = string

declare type compc_MapBaseBlock = { "MapBaseBlock": { "image_name": string, "rotation": number, $$$$entity: number, "x": number, "y": number, "block_type": number } }
declare type compc_Move = { x: numString, y: numString }

declare function newproxy(this: void, v: boolean): LuaUserdata

declare interface RoleSlot {
    slot1?: { hero_name: string; origin_name: string; uuid: string };
    slot2?: { hero_name: string; origin_name: string; uuid: string };
    slot3?: { hero_name: string; origin_name: string; uuid: string };
    slot4?: { hero_name: string; origin_name: string; uuid: string };
}

//写一个类型 把里面所有value都变成"wait" 要泛型 并且可能等于他自己的类型
declare type WAIT_TYPE<T> = {
    [key in keyof T]: T[key] & { wait?: "wait" } & { none?: "none" }
}

declare interface Creep {
    "Creep": {
        x: number;
        y: number;
        type: string;
        name: string;
    }
}

declare interface Progress {
    uuid: string;
    max: number;
    cur: number;
    item_name: string;
    is_over: 0 | 1
}


declare interface Event {
    "Event": {
        x: number;
        y: number;
        type: string;
        name: string;
    }
}


declare type compc_surrounding_maps = {
    "maps_ent": Record<numString, {} & compc_MapBaseBlock & Partial<Creep> & Partial<Event>>
}

declare interface CurrentScene {
    parent_scene: string
    scene_name: string;
    scene_type: number;
}

declare interface RbxBoxElement {
    element:Record<number,{item_name:string,num:number}>
}



declare type event_player = { PlayerID: PlayerID }
declare type compc_map = {
    SurroundingMaps: compc_surrounding_maps
    Move: compc_Move
    Progress: Progress
    SystemProgress: Progress
    RoleSlot: WAIT_TYPE<RoleSlot>
    GrowUp: GrowUp
    RoleWorldMapData: RoleWorldMapData
    RoleTileSetInfo: RoleTileSetInfo
    CurrentScene: CurrentScene
    npc: npc<any>
    PlayerGold: PlayerGold
    Inventory:Inventory
    EquipmentState:EquipmentStateExntendsComps
    EquipMentAttribute:EquipMentAttribute
    WarehouseInventory:WarehouseInventory
    RbxBoxElement:RbxBoxElement
    LevelBehaivorCheck:LevelBehaivorCheck
    LevelInfo:LevelInfo
    Card:Card
}

declare interface CustomGameEventDeclarations {
    LargePopupBox: {
        tag_name: string;
        player_id: PlayerID
    };

    s2c_big_world_tile:{position:[number,number,number],tile:string}

    c2s_test_event: {};
    s2c_comp_send: CompSend;
    c2s_dungeon_move_to_xy: { x: number, y: number }
    c2s_ok_register: { uuid: string }
    c2s_number_input_ok_register: { uuid: string }
    c2s_click_ok: { uuid: string, type: string }
    c2s_xstate_change: { id: XstateID, change: UIXstateOnChange }
    s2c_debug_comp: { comp_name: string, entity: number, data: any, $_update_time: number, is_link_component?: string }
    c2s_debug_comp_change_value: { comp_name: string, key: string, entity: number, op: "inc" | "dec" | "set", data: any }
    c2s_eval: { code: string }
    OkPanel: {
        title: string;
        type: string;
        uuid: string;
        data: any;
    }
    c2s_equit_item: { slot: number, item_entindex: EntityIndex }
    c2s_equit_down_item: { slot: number, item_entindex: EntityIndex }
    shop_exit: {}
    s2c_bind_dota_entity_to_ecs_entity: { dota_entity: EntityIndex, ecs_entity_id: number }
    s2c_comp_to_event: { class_name:string, ecs_entity_index: EntityIndex, comp:Partial<compc_map[keyof compc_map]> }
    s2c_link_comp_to_event: { uid:string,class_name:string, ecs_entity_index: EntityIndex, comp:Partial<compc_map[keyof compc_map]> }
    s2c_link_remove : {class_name:string,uid:string}
    c2s_item_to_warehouse_inventory:{dota_entity_id:EntityIndex,to_index_inventory:number,to_slot:number}
    c2s_warehouse_inventory_to_raw:{dota_entity_id:EntityIndex,to_index_inventory:number,to_slot:number}
    c2s_card_event:{merge_data:Record<number,string|undefined>,container_behavior:CardContainerBehavior}
    [key: string]: any
}

declare interface RoleWorldMapData {
    cur_map_index: string;
    cur_landmark_index: string;
    cur_to_map_landmark: { map_index: string; landmark_index: string; schedule: number; is_trigger_tileset: boolean; };
}

declare interface npc<T> {
    city: string;
    npc_name: string;
    ui_data: T;
    dota_entity: any;
    is_can_move: boolean;
    is_can_battle: boolean;
}


interface GrowUp {
    strength_up: number;
    intelligence_up: number;
    dexterity_up: number;
    attack_damage_up: number;
    magic_resistance_up: number;
    flame_attack_up: number;
    ice_attack_up: number;
    lightning_attack_up: number;
    shadow_attack_up: number;
    fire_resistance_up: number;
    frost_resistance_up: number;
    lightning_resistance_up: number;
    storm_resistance_up: number;
    uuid: string
}

interface RoleTileSetInfo {
    tileset_name: string;
    tileset_index: string;
}

declare type XstateID = keyof {
    "ui_main": "ui_main", //这个是主状态名字 然后nettable 里面要有主状态的名字 和主状态的节点名字 和子状态的名字 还有子状态的节点名字
    "ui_main_role": "ui_main_role",
    "game_state_main": "game_state_main",
    "ui_main_map": "ui_main_map"
    "ui_tileset_map": "ui_tileset_map"
    "ui_city": "ui_city"
}

declare type UIXstateOnChange = "next" | "back" | "main"

declare type JSON_NAME = string

declare type OBJECT_ID = string

declare type OBJECT_ID_LIST = OBJECT_ID[]


declare type MONGODB_SYSTEM_KEY = keyof {
    "qing_xue_cheng",
}

declare interface MapMarkBuildJSON {
    model: string;
    origin: { x: number, y: number, z: number };
    scale: number;
    angle: { x: number, y: number, z: number };
    name: string
}

declare interface MapMarkBuildJSONInstance {
    point: Vector
    data: MapMarkBuildJSON[]
}



declare type MAP_BUILD_COMPOMENT_TYPE = keyof {
    down, left, right, top, obstruction, corner_01, corner_02, corner_03, corner_04
}

declare type PlayerGold = {
    gold_1: number,
    gold_2: number,
    gold_3: number,
    gold_4: number,
    gold_5: number,
    gold_6: number,
    novice_gold: number
}

declare type KF<T> = keyof T

declare type npc_sell_list = {
    item_an_yuan_su?: number;
    item_an_yuan_su_count?: number;
    item_bian_ti_mo_fang?: number;
    item_bian_ti_mo_fang_count?: number;
    item_bing_yuan_su?: number;
    item_bing_yuan_su_count?: number;
    item_chao_xi_zhi_li?: number;
    item_chao_xi_zhi_li_count?: number;
    item_dian_ci_li_jin_gu_shi?: number;
    item_dian_ci_li_jin_gu_shi_count?: number;
    item_dian_kuang_zhi_yue_sui_pian?: number;
    item_dian_kuang_zhi_yue_sui_pian_count?: number;
    item_guai_shou_he_xin?: number;
    item_guai_shou_he_xin_count?: number;
    item_hong_se_cao_yao?: number;
    item_hong_se_cao_yao_count?: number;
    item_huan_qiang_fen_mo?: number;
    item_huan_qiang_fen_mo_count?: number;
    item_huang_se_cao_yao?: number;
    item_huang_se_cao_yao_count?: number;
    item_huo_yuan_su?: number;
    item_huo_yuan_su_count?: number;
    item_lei_yuan_su?: number;
    item_lei_yuan_su_count?: number;
    item_long_zu_zhi_xue?: number;
    item_long_zu_zhi_xue_count?: number;
    item_lv_se_cao_yao?: number;
    item_lv_se_cao_yao_count?: number;
    item_ni_ta_sha_ye_zhi_shi?: number;
    item_ni_ta_sha_ye_zhi_shi_count?: number;
    item_qiang_he_li_jin_gu_shi?: number;
    item_qiang_he_li_jin_gu_shi_count?: number;
    item_quan_neng_shen_de_zhu_fu?: number;
    item_quan_neng_shen_de_zhu_fu_count?: number;
    item_ruo_he_li_jin_gu_shi?: number;
    item_ruo_he_li_jin_gu_shi_count?: number;
    item_sai_li_meng_ni_de_yue_shi?: number;
    item_sai_li_meng_ni_de_yue_shi_count?: number;
    item_si_kui_ao_ke_de_nu_huo?: number;
    item_si_kui_ao_ke_de_nu_huo_count?: number;
    item_tian_hui_sui_pian?: number;
    item_tian_hui_sui_pian_count?: number;
    item_wei_luo_di_xi_ya_sheng_ming_zhi_shi?: number;
    item_wei_luo_di_xi_ya_sheng_ming_zhi_shi_count?: number;
    item_xu_kong_jing_hua?: number;
    item_xu_kong_jing_hua_count?: number;
    item_ye_yan_sui_pian?: number;
    item_ye_yan_sui_pian_count?: number;
    item_yin_li_sui_pian?: number;
    item_yin_li_sui_pian_count?: number;
    item_yuan_chu_yi_shi?: number;
    item_yuan_chu_yi_shi_count?: number;
    item_yuan_gu_wu_zhi_sui_pian?: number;
    item_yuan_gu_wu_zhi_sui_pian_count?: number;
    item_zhen_shi_bao_shi?: number;
    item_zhen_shi_bao_shi_count?: number;
    item_zi_se_cao_yao?: number;
    item_zi_se_cao_yao_count?: number;
};

declare type Matrix = number[][]

declare interface Inventory {
    slots: { slot_1: { dota_entity: any; ecs_entity_index: number; }; slot_2: { dota_entity: any; ecs_entity_index: number; }; slot_3: { dota_entity: any; ecs_entity_index: number; }; slot_4: { dota_entity: any; ecs_entity_index: number; }; slot_5: { dota_entity: any; ecs_entity_index: number; }; slot_6: { dota_entity: any; ecs_entity_index: number; }; slot_7: { dota_entity: any; ecs_entity_index: number; }; slot_8: { dota_entity: any; ecs_entity_index: number; }; slot_9: { dota_entity: any; ecs_entity_index: number; }; };
}

declare type ECSEntityID = number

declare interface WarehouseInventory {
    slot_index: number;
    ItemSlots: Record<number,EntityIndex>;
    is_lock: boolean;
}

declare interface EquipmentState {
    slot_0?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_1?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_2?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_3?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_4?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_5?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_6?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_7?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_8?: { type: number; dota_entity: any; ecs_entity_index: number; };
    slot_9?: { type: number; dota_entity: any; ecs_entity_index: number; };
}

declare interface EquipmentStateExntendsComps extends EquipmentState{
    slot_0_comps?:Record<number,Record<string,any>>,
    slot_1_comps?:Record<number,Record<string,any>>,
    slot_2_comps?:Record<number,Record<string,any>>,
    slot_3_comps?:Record<number,Record<string,any>>,
    slot_4_comps?:Record<number,Record<string,any>>,
    slot_5_comps?:Record<number,Record<string,any>>,
    slot_6_comps?:Record<number,Record<string,any>>,
    slot_7_comps?:Record<number,Record<string,any>>,
    slot_8_comps?:Record<number,Record<string,any>>,
    slot_9_comps?:Record<number,Record<string,any>>,
}

declare interface EquipMentAttribute {
    item_name: string;
    texture_index: string;
    base_attribute: Record<number,string>;
    state_attribute: Record<number,string>;
    speicel_attribute: Record<number,Record<number,包含动态值的记载>>;
}


declare const enum ABILITY_ELEMENT{
    雷元素 = 0x000001,
    火元素 = 0x000002,
    水元素 = 0x000004,
    暗元素 = 0x000008,
}

/**游戏里的职业分类代号 */
declare const enum PROFESSION{
    圣职者,
    战士,
    法师,
    弓箭手
}

declare const enum EQUIPMENT_LEVEL{
    白色 = "a",
    粉色 = "b",
    蓝色 = "c",
    绿色 = "d",
    橙色 = "e",
    红色 = "f",
}

declare const enum EQUIPMENT_FRACTION{
    白色 = 50,
    粉色 = 100,
    蓝色 = 200,
    绿色 = 500,
    橙色 = 900,
    红色 = 2000,
}

declare const enum ATTRIBUTE{
    白色 = "a",
    粉色 = "b",
    蓝色 = "c",
    绿色 = "d",
    橙色 = "e",
    红色 = "f",
}

declare const enum ATTRIBUTE{
   物理攻击 = "a",
   魔法攻击 = "b",
   攻击速度 = "c",
   移动速度 = "d",
   魔法恢复 = "e",
   护甲 = "f",
   物理抗性 = "g",
   魔法抗性 = "h",
   状态抗性 = "i",
   闪避 = "j",
   生命恢复 = "k",
   暴击率 = "l",
   暴击加深 = "m",
   魔法值 = "p",
   生命值 = "q",
   力量 = "r",
   敏捷 = "s",
   智力 = "t",
}

declare interface 记载{
    消费分数:number,
    输入:数据流类型,
    输出:数据流类型,
    标识:string,
    函数:Function,
    test:string,
    名字:string,
    权重:Record<PROFESSION,number>,
    绑定参数生成:(input:number)=>{fn:(this:ModifierAtomicBind)=>输入数据<any>,消耗得分:number,bind:ModifierAtomicBind} | undefined,
}

declare type ModifierAtomicBind = Partial<{arg1:any,arg2:any,arg3:any}>
     
declare interface 包含动态值的记载 extends 记载{
    动态值:ModifierAtomicBind,
    绑定后的函数:(this:ModifierAtomicBind,input:输入数据<any>)=>输入数据<any>
}

declare interface 修饰器记载 extends 记载{
    必要前置:记载[],
    是修饰器:boolean,
    修饰器名字:string,
    枚举影响:ModifierFunction
}

declare interface 可连接最终输出的记载 extends 记载{
    最终得分转换率:number
}

declare type 输入数据<T> = Partial<{
    修饰器:CDOTA_Modifier_Lua,
    事件:T,
    数据流:Partial<{[key in 数据流类型]: any}>;
}>;

declare type 记载序列 = Record<number,Record<number,记载>>

/**
 * 数据流导入可以有多个 但是一旦写了就是必须要传入的INPUT 不然会报错
 */
declare const enum 数据流类型{
    属性字段 = 0x0000001,
    布尔值 = 0x0000002,
    敌方 = 0x0000004,
    技能 = 0x0000008,
    判断数值 = 0x0000010,
    直接单位操作 = 0x0000020,
    我方 = 0x0000040,
    元素影响 = 0x0000080,
    元素分裂 = 0x0000100,
    无 = 0,
}



declare interface LevelBehaivorCheck {
    cur: number;
    check_max: number;
    level_behaivor:number
}

/**
 * 当前地下城信息info
 */
declare interface LevelInfo {
    dungeon_info: [string, any];
    entry_point: any;
    level_behaivor: any;
    creep_count?: number;
}