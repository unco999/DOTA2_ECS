export const tag = {
    role_ent : "role_ent" ,//角色实体
    is_game_select_role : "is_select_role", //是否选中角色
    is_big_world_move:"is_big_world_move",//是否是大世界移动中
    is_big_wolrd_trigger_event:"is_big_wolrd_trigger_event",//是否是大世界触发事件
    is_is_big_wolrd_trigger_over_event:"is_is_big_wolrd_trigger_over_event",
    is_in_mark:"is_in_mark",//是否在据点中
    is_in_chengshi:"is_in_chengshi",//是否在城市中
    is_in_yewai:"is_in_yewai",//是否在野外中
    delete_cache:"delete_cache",//删除缓存
    is_in_shop:"is_in_shop",//是否在商店中
    is_in_kuang_dong:"is_in_kuang_dong",//是否在矿洞中
    is_cur_in_city_map_ent:"is_cur_in_city",//当前被进入的城市实体 或者说mark
    is_cur_euqipment_tag:"is_cur_euqipment_tag",
    is_cur_booss:"is_cur_boss", //
    is_cur_creep:"is_cur_creep"
}



export enum scene {
    大地图,
    城市里,
    NPC,
}