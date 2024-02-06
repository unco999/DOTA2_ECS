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
    EquipmentState:EquipmentState
}

declare interface CustomGameEventDeclarations {
    LargePopupBox: {
        tag_name: string;
        player_id: PlayerID
    };

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
    shop_exit: {}
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

declare interface Inventory {
    slots: { slot_1: { dota_entity: any; ecs_entity_index: number; }; slot_2: { dota_entity: any; ecs_entity_index: number; }; slot_3: { dota_entity: any; ecs_entity_index: number; }; slot_4: { dota_entity: any; ecs_entity_index: number; }; slot_5: { dota_entity: any; ecs_entity_index: number; }; slot_6: { dota_entity: any; ecs_entity_index: number; }; slot_7: { dota_entity: any; ecs_entity_index: number; }; slot_8: { dota_entity: any; ecs_entity_index: number; }; slot_9: { dota_entity: any; ecs_entity_index: number; }; };
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