import { QueryBuilder } from "../../lib/ecs/Query";
import { HERO, MarkCache, PLAYER } from "../component/base";
import { MapCacheResouce } from "../component/map";
import { npc } from "../component/npc";
import { Dungeon, Move, MoveToCreep } from "../component/role";
import { Progress } from "../component/special";

export namespace Qset{

    export const player_query = new QueryBuilder()
    .contains(PLAYER)
    .build();

    export const map_cache = new QueryBuilder()
    .contains(MapCacheResouce)
    .build();

    export const dungeon_player_move_entity = new QueryBuilder()
    .contains(Dungeon)
    .contains(PLAYER)
    .contains(Move)
    .build()


    export const progress_query = new QueryBuilder()
    .contains(Progress)
    .build()


    export const map_hit_creep_tag = new QueryBuilder()
    .contains(MoveToCreep)
    .build()


    export const with_hero_query = new QueryBuilder()
    .contains(HERO)
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
    .contains(MarkCache)
    .build()

    export const is_cur_deleta_cache = new QueryBuilder()
    .contains(GameRules.tag.delete_cache)
    .build()

    export const is_in_kuang_dong = new QueryBuilder()
    .contains(GameRules.tag.is_in_kuang_dong)
    .build()

    export const has_npc = new QueryBuilder()
    .contains(npc)
    .build()

    export const cur_in_city_map_ent = new QueryBuilder()
    .contains(GameRules.tag.is_cur_in_city_map_ent)
    .build()

}


