import { QueryBuilder } from "../../lib/ecs/Query";

export namespace Qset{

    export const player_query = new QueryBuilder()
    .contains(c.base.PLAYER)
    .build();

    export const map_cache = new QueryBuilder()
    .contains(c.map.MapCacheResouce)
    .build();



    export const progress_query = new QueryBuilder()
    .contains(c.special.Progress)
    .build()



    export const with_hero_query = new QueryBuilder()
    .contains(c.base.HERO)
    .build()

    export const is_select_role = new QueryBuilder()
    .contains(GameRules.tag.is_game_select_role)
    .build()

    export const is_big_world_move = new QueryBuilder()
    .contains(GameRules.tag.is_big_world_move)
    .build()
    
    export const is_in_chengshi = new QueryBuilder()
    .contains(GameRules.tag.is_in_chengshi)
    .build()

    export const Cache = new QueryBuilder()
    .contains(c.base.MarkCache)
    .build()

    export const is_cur_deleta_cache = new QueryBuilder()
    .contains(GameRules.tag.delete_cache)
    .build()

    export const is_in_kuang_dong = new QueryBuilder()
    .contains(GameRules.tag.is_in_kuang_dong)
    .build()

    export const has_npc = new QueryBuilder()
    .contains(c.npc.npc)
    .build()

    export const cur_in_city_map_ent = new QueryBuilder()
    .contains(GameRules.tag.is_cur_in_city_map_ent)
    .build()

    export const cur_is_euqipments_ent = new QueryBuilder()
    .contains(GameRules.tag.is_cur_euqipment_tag)
    .build()
}


