import {  NONE,TABLE_WAIT, WAIT, create_npc_with_static, create_with_static_table } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { System } from "../../lib/ecs/System";
import * as map_json from "../../json/game_big_world_map.json"
import * as tileset_json from "../../json/game_tileset.json"
import { back_main_xstate, back_xstate, next_xstate } from "./xstate";
import * as city_json from "../map_json/city.json"
import * as npc_json from "../../json/npc.json"

/**
 * 实际进入城市的系统
 */
export class in_city_system extends System{

    create_npc(){
        
    }
    
    in_city(role_ent:Entity,spawn_point:{x:number,y:number}){
        const hero = PlayerResource.GetPlayer(role_ent.get(c.base.PLAYER).PlayerID).GetAssignedHero() as CDOTA_BaseNPC_Hero
        if(spawn_point){
            hero.SetOrigin(Vector(spawn_point.x,spawn_point.y,128))
        }else{
            hero.SetOrigin(Vector(0,0,128))
        }
        
        next_xstate("ui_city")
        // Timers.CreateTimer(22,()=>{
        //     role_ent.removeTag(tag.is_in_chengshi)
        //     print("删除了chengshi标签")
        // })
    }

    loading_city(role_ent:Entity){
        const ent = new Entity() // 城市实体

        const cur_cityinfo = role_ent.get(c.city.CurCityInfo)
        if(cur_cityinfo == null) {print("not find city_name with CurCityInfo");return}

        const uuid = DoUniqueString("mark_cache")
        const map_ent = new Entity();
        this.engine.addEntity(map_ent)
        map_ent.add(GameRules.tag.is_cur_in_city_map_ent)
        const map_cache = new c.base.MarkCache(uuid,new Map(),false,true)
        map_ent.add(map_cache)
        // let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
        const progress = new c.special.SystemProgress("mark_loading_build_over",uuid,8 * 8,0,"正在生成中...",false,cur_cityinfo.city_name)

        city_json[cur_cityinfo.city_name as keyof typeof city_json].npcs.forEach(elm=>{
            if(elm.name.includes('role')){
                const npc_component = new c.npc.npc(
                    cur_cityinfo.city_name,
                    elm.name,
                    WAIT,
                    -1 as EntityIndex,
                    false,
                    false,
                    npc_json[elm.name as KF<typeof npc_json>]?.http == 1
                )
                DeepPrintTable(npc_component)
                map_ent.appendComponent(npc_component)
            }
        })
        
        map_ent.add(progress)
        create_with_static_table(cur_cityinfo.city_name,progress,map_cache)
        create_npc_with_static(cur_cityinfo.city_name)
        print("is in chengshi 增加了")
        next_xstate("ui_city")

    }

    exit_city(role_ent:Entity){
        print("exit_city")
        role_ent.removeTag(c.tag.tag.is_in_mark)
        back_main_xstate("ui_city")
        back_xstate("ui_main")

        print("有单位离开了城市")
        GameRules.QSet.cur_in_city_map_ent.first.removeTag(GameRules.tag.is_cur_in_city_map_ent)
        GameRules.QSet.Cache.entities.forEach(ent=>{
            const map_cache = ent.get(c.base.MarkCache)
            if(map_cache){
                map_cache.is_build = true;
                map_cache.cache.forEach(elm=>{
                    UTIL_RemoveImmediate(elm)
                })
                print("删除了所有缓存",map_cache.cache.size)
                map_cache.cache.clear()
            }
        })
        collectgarbage()
        print("进行了垃圾回收")
    }

    public onAddedToEngine(): void {
        GameRules.QSet.is_in_chengshi.onEntityAdded.connect((snap)=>{
            this.loading_city(snap.current)
        })
        GameRules.QSet.is_in_chengshi.onEntityRemoved.connect((snap)=>{
            this.exit_city(snap.current)
        })
        this.engine.subscribe(GameRules.event.ProgressEvent,event=>{
            if(event.state == "mark_loading_build_over"){
                print("接受到事件了")
                next_xstate("ui_main")
                next_xstate("ui_main")
                this.in_city(GameRules.QSet.is_in_chengshi.first,city_json[event.data as keyof typeof city_json].spawn_point)
                const scene_comp = GameRules.QSet.is_select_role.first.get(c.role.CurrentScene)
                scene_comp.parent_scene = event.data
                scene_comp.scene_type = c.tag.scene.城市里
            }
        })
    }
}



/**
 * 触发地图事件
 */
export class big_world_map_trigger_tileset extends System{

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.RoleMoveTriggerEvent,(event)=>{
            event.trigger_entity.add(c.tag.tag.is_big_wolrd_trigger_event)
            const map_move_comp = event.trigger_entity.get(c.role.RoleWorldMapData)
            const form_map_s = map_move_comp.cur_landmark_index
            const to_map_s = map_move_comp.cur_to_map_landmark.landmark_index
            const tile_set_key = form_map_s +"_" + to_map_s as keyof typeof tileset_json
            print("ecs",`选择的tile_set_key form_maps_s:${form_map_s} to_maps_s:${to_map_s}`,tile_set_key)
            if(form_map_s == null || to_map_s == null){
                print("ecs","地图数据错误")
                return
            }

            const key = table.random_key(tileset_json[tile_set_key].tileset_array)

            event.trigger_entity.add(new c.role.RoleTileSetInfo(
                tileset_json[tile_set_key].name,
                tileset_json[tile_set_key].tileset_array[key],
            ))

            next_xstate("ui_main")
            next_xstate("ui_tileset_map")
            next_xstate("ui_tileset_map")
        })
    }
}


export class tileset_create_system extends System{
    public onAddedToEngine(): void {
        //模拟走出tileset
        this.engine.subscribe(GameRules.event.RoleMoveTriggerEvent,(event)=>{
            Timers.CreateTimer(3,()=>{
                event.trigger_entity.add(c.tag.tag.is_is_big_wolrd_trigger_over_event)
                event.trigger_entity.removeTag(c.tag.tag.is_big_wolrd_trigger_event)
                back_xstate("ui_main")
                back_xstate("ui_tileset_map")
                back_xstate("ui_tileset_map")
                DeepPrintTable(CustomNetTables.GetTableValue("xstate","ui_tileset_map"))
                print("退回状态")
            })
        })
    }
}


export class in_mark_system extends System{
    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.InLandMarkEvent,(event)=>{
            const PlayerID = GameRules.QSet.is_select_role.first.get(c.base.PLAYER).PlayerID
            const uuid = DoUniqueString("")
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"OkPanel",{
                  title:`是否进入${event.mark_name}?`,
                  uuid:uuid,
                  type:"in_mark_system",
                  data:{mark_name:event.mark_name},
            })
            const id = CustomGameEventManager.RegisterListener(uuid,(_,panel_event)=>{
                print("进入城市事件")
                DeepPrintTable(panel_event)

                if(panel_event.click == "ok" && panel_event.type == "in_mark_system"){
                    const mask_type = map_json[panel_event.data.mark_name as keyof typeof map_json]?.type
                    if(mask_type == null) {print("excel里面没有type字段");return}

                    if(mask_type == "cheng_shi"){
                        event.trigger_entity.add(new c.city.CurCityInfo(
                            event.mark_name,
                            NONE,
                        ))
                        event.trigger_entity.addTag(c.tag.tag.is_in_chengshi)
                    }

                    if(mask_type == "ye_wai"){
                        event.trigger_entity.addTag(c.tag.tag.is_in_yewai)
                    }

                    event.trigger_entity.addTag(c.tag.tag.is_in_mark)
                }
                CustomGameEventManager.UnregisterListener(id)
            })
        })
    }
}


/**
 * 商店系统
 * 
 **/
export class shop_system extends System{
    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("shop_exit",(_,event)=>{
            const scene_comp = GameRules.QSet.is_select_role.first.get(c.role.CurrentScene)
            scene_comp.scene_name = "default"
            scene_comp.scene_type = c.tag.scene.城市里
        })
    }
}

/**
 * 大地图移动规则  
 */

export class big_world_map_move_system extends System{

    public start_move(role_ent:Entity,event:InstanceType<typeof GameRules.event.OkEvent>):void{

        const big_map_wolrd_map_move = role_ent.get(c.role.RoleWorldMapData)
        const from = map_json[big_map_wolrd_map_move.cur_landmark_index as keyof typeof map_json]
        const to = map_json[event.data.move_map as keyof typeof map_json]

        if(role_ent.has(c.tag.tag.is_big_world_move)){
            const PlayerID = role_ent.get(c.base.PLAYER).PlayerID
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"正在移动中请稍后...",player_id:PlayerID})
            return
        }

        GameRules.QSet.is_select_role.first.addTag(c.tag.tag.is_big_world_move)
        
        if (Object.keys(from.map_mark_link_array).find(key=>{
             to.mask_name == key 
        })){
            print("外挂移动")
            return
        }

        big_map_wolrd_map_move.cur_to_map_landmark.landmark_index = to.mask_name
        const from_vec = Vector(from.x,from.y)
        const to_vec = Vector(to.x,to.y)
        const length = from_vec.__sub(to_vec).Length2D()
        Timers.CreateTimer(()=>{
            if(!role_ent.has(c.tag.tag.is_is_big_wolrd_trigger_over_event) && big_map_wolrd_map_move.cur_to_map_landmark.schedule >= 0.5 && !role_ent.has(c.tag.tag.is_big_wolrd_trigger_event)){
                this.engine.dispatch(new GameRules.event.RoleMoveTriggerEvent(
                    role_ent
                ))
            }
            if(role_ent.has(c.tag.tag.is_big_wolrd_trigger_event)){
                return 1
            }
            if( big_map_wolrd_map_move.cur_to_map_landmark.schedule >= 1){
                /**玩家完全达到了据点的终点 */
                big_map_wolrd_map_move.cur_to_map_landmark.schedule = 0
                big_map_wolrd_map_move.cur_landmark_index = to.mask_name
                role_ent.removeTag(c.tag.tag.is_big_world_move)
                role_ent.removeTag(c.tag.tag.is_is_big_wolrd_trigger_over_event)
                this.engine.dispatch(new GameRules.event.InLandMarkEvent(role_ent,to.mask_name))
                return;
            }
            big_map_wolrd_map_move.cur_to_map_landmark.schedule += (length / 20) / length 
            return length / 2000
        })
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OkEvent,(event)=>{
            if(event.click == "ok" && event.type == "role_big_world_move_map_event"){
                const role_ent = GameRules.QSet.is_select_role.first
                if(role_ent.get(c.base.PLAYER).PlayerID != event.PlayerID) return;
                this.start_move(role_ent,event)
            }
        })
    }
}

