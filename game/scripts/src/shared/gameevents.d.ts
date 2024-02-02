declare interface Compid { $$$$entity:number }

declare type Comp = Record<string,any> & Compid 

declare type CompName = { comp_name: string }

declare type CompSend = Comp & CompName;

declare type OwnerComp = { hero_idx?:EntityIndex,player_id?:PlayerID }

declare type Mask = number

declare type MapBlockType = Mask

declare type numString = string

declare type compc_MapBaseBlock = {"MapBaseBlock":{"image_name":string,"rotation":number,$$$$entity:number,"x":number,"y":number,"block_type":number}}
declare type compc_Move = {x:numString,y:numString}

declare function newproxy(this:void,v:boolean):LuaUserdata

declare interface RoleSlot {
    slot1?: { hero_name: string; origin_name: string; uuid:string };
    slot2?: { hero_name: string; origin_name: string; uuid:string };
    slot3?: { hero_name: string; origin_name: string; uuid:string };
    slot4?: { hero_name: string; origin_name: string; uuid:string };
}

//写一个类型 把里面所有value都变成"wait" 要泛型 并且可能等于他自己的类型
declare type WAIT_TYPE<T> = {
    [key in keyof T]:T[key] &  {wait?:"wait"} & {none?:"none"}
}

declare interface Creep {
    "Creep":{
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
    item_name:string;
    is_over:0|1
}


declare interface Event {
    "Event":{
        x: number;
        y: number;
        type: string;
        name: string;
    }
}


declare type compc_surrounding_maps = {
    "maps_ent":Record<numString,{} & compc_MapBaseBlock & Partial<Creep> & Partial<Event>>
}

declare interface CurrentScene {
    parent_scene:string
    scene_name: string;
    scene_type: number;
}


declare type event_player = {PlayerID:PlayerID}
declare type compc_map = {
    SurroundingMaps:compc_surrounding_maps
    Move:compc_Move
    Progress:Progress
    SystemProgress:Progress
    RoleSlot:WAIT_TYPE<RoleSlot>
    GrowUp:GrowUp
    RoleWorldMapData:RoleWorldMapData
    RoleTileSetInfo:RoleTileSetInfo
    CurrentScene:CurrentScene
    npc:npc<any>
}

declare interface CustomGameEventDeclarations {
    LargePopupBox:{
        tag_name:string;
        player_id:PlayerID};
        
    c2s_test_event: {};
    s2c_comp_send:CompSend;
    c2s_dungeon_move_to_xy:{x:number,y:number}
    c2s_ok_register:{uuid:string}
    c2s_number_input_ok_register:{uuid:string}
    c2s_click_ok:{uuid:string,type:string}
    c2s_xstate_change:{id:XstateID,change:UIXstateOnChange}
    s2c_debug_comp:{comp_name:string,entity:number,data:any,$_update_time:number,is_link_component?:string}
    c2s_debug_comp_change_value:{comp_name:string,key:string,entity:number,op:"inc"|"dec"|"set",data:any}
    c2s_eval:{code:string}
    OkPanel:{
        title:string;
        type:string;
        uuid:string;
        data:any;
    }
    shop_exit:{}
    [key:string]:any
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
    uuid:string
}

interface RoleTileSetInfo {
    tileset_name: string;
    tileset_index: string;
}

declare type XstateID = keyof {
    "ui_main":"ui_main", //这个是主状态名字 然后nettable 里面要有主状态的名字 和主状态的节点名字 和子状态的名字 还有子状态的节点名字
    "ui_main_role":"ui_main_role",
    "game_state_main":"game_state_main",
    "ui_main_map":"ui_main_map"
    "ui_tileset_map":"ui_tileset_map"
    "ui_city":"ui_city"
}

declare type UIXstateOnChange = "next" | "back" | "main"

declare type JSON_NAME = string

declare type OBJECT_ID = string

declare type OBJECT_ID_LIST = OBJECT_ID[]


declare type MONGODB_SYSTEM_KEY = keyof {
    "qing_xue_cheng",
}

declare interface MapMarkBuildJSON {
    model:string;
    origin:{x:number,y:number,z:number};
    scale:number;
    angle:{x:number,y:number,z:number};
    name:string
}

declare interface MapMarkBuildJSONInstance{
    point:Vector
    data:MapMarkBuildJSON[]
}



declare type MAP_BUILD_COMPOMENT_TYPE = keyof {
    down,left,right,top,obstruction,corner_01,corner_02,corner_03,corner_04
}


declare type KF<T> = keyof T