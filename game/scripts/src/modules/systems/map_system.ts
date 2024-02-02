import { $Log, NONE, PickArrayNumString2D, TABLE_WAIT, WAIT, create_npc_with_static, create_with_static_table } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { QueryBuilder } from "../../lib/ecs/Query";
import { ReactionSystem } from "../../lib/ecs/ReactionSystem";
import { System } from "../../lib/ecs/System";
import { HERO, MarkCache, PLAYER } from "../component/base";
import { CurDungeonConfig, MapBaseBlock, MapCacheResouce } from "../component/map";
import { BeastKingMovePoint, CurrentScene, Dungeon, In3DScene, Move, MoveToCreep, NoMap, RoleSlot, RoleTileSetInfo, RoleWorldMapData, SurroundingMaps } from "../component/role";
import * as test_wfc_data from "../../lib/wfc/data.json"
import {WFC} from "../../lib/wfc/wfc2D"
import { Creep, Event } from "../component/map_decorations";
import { Progress, SystemProgress } from "../component/special";
import * as map_json from "../../json/game_big_world_map.json"
import { scene, tag } from "../component/tag";
import { reloadable } from "../../utils/tstl-utils";
import * as tileset_json from "../../json/game_tileset.json"
import { back_main_xstate, back_xstate, next_xstate } from "./xstate";
import { CurCityInfo } from "../component/city";
import * as city_json from "../map_json/city.json"
import { npc } from "../component/npc";
import * as npc_json from "../../json/npc.json"

/**开始当前地下城生成 */
export class init_cur_dungeon_map_data extends System{


    private async test_create_map_data(scene_net:Entity):Promise<Record<numString,Record<numString,Entity>>>{

        let wfc2d = new WFC.WFC2D(test_wfc_data as any)
        //设定地图尺寸
        let mapWidth = 20;
        let mapHeigth = 20;
        //计算生成 地图数据 ，返回数据类型 数组 [[string,number],.....]
        const progress_comp = new SystemProgress("生成地图",DoUniqueString("pregress"),20*20,0,"生成地图元素中....");

        scene_net.add(progress_comp)

        const next = (count:number) => progress_comp.cur = count

        let resultMap =await wfc2d.collapse(mapWidth, mapHeigth,next);

        const res:Record<numString,Record<numString,Entity>> = {}
        let count = 0
        for (let y = 0; y < mapHeigth; y++) {
         for (let x = 0; x < mapWidth; x++) {
                res[x.toString()] == undefined &&  (res[x.toString()] = {})
                let imgData = resultMap[count++];
                //图片资源名 , 类型 string
                let imgName = imgData[0];
                //图片顺时针旋转次数（每次90度）, 类型 number 
                let rotate = imgData[1];
                let ent = new Entity();
                //绘制 一个 瓦片到容器  (xxxDrawTile 替换成自己的绘制函数)
                ent.add(new MapBaseBlock(x,y,RandomInt(1,10),imgName,rotate))
                res[x.toString()][y.toString()] = ent;
                this.engine.addEntity(ent);
           }
        }

        resultMap = null;

        // for(let i = 0;i<50;i++){
        //     res[i.toString()] = {}
        //     for(let j = 0;j<50;j++){
        //         let ent = new Entity();
        //         ent.add(new MapBaseBlock(i,j,RandomInt(1,10)))
        //         this.engine.addEntity(ent);
        //         res[i.toString()][j.toString()] = ent;
        //     }
        // }
        return res;
    }


    async ['build_dungeon_map'](){
        const ent = new Entity()

        const res = new MapCacheResouce("dungeon",{})

        res.map_data = await this.test_create_map_data(ent);

        ent.add(res);

        /**创造地图配置 */
        ent.add(new CurDungeonConfig(
            "dungeon",
            0,
            0,
            12,
            12,
            20,
            20
        ))
        

        GameRules.QSet.player_query.entities.forEach(ent=>{
            ent.addTag(Dungeon)
        })

        this.engine.addEntity(ent);

        this.dispatch(new GameRules.event.MapEvent(
            "dungeon",
            "map_init"
        ))
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.BuildSystemEvent,(event)=>{
            try{
                this[event.BuildfncName]?.();
            }catch(err){
                print("错误情况",err);
            }
        })
    }
}

/**
 * 地下城随机生成怪物系统
 */
export class create_creep_system extends System{

    ["spawn"](){
        const scene_ent = GameRules.QSet.map_cache.first
        const cache_comp = scene_ent.get(MapCacheResouce)
        const config = scene_ent.get(CurDungeonConfig)

        let cur_creep_count = config.creep_max
        let cur_event_count = config.event_max

        print("当前spawn数据",cur_creep_count,cur_event_count)

        function _create_creep(){
            let cur_x = RandomInt(0,config.map_width);                                                                                                                                       
            let cur_y = RandomInt(0,config.map_height);
            const target_ent = cache_comp.map_data[cur_x.toString()]?.[cur_y.toString()]
            if(target_ent && !target_ent.hasAny(Creep,Event)){
                target_ent.add(new Creep(
                    cur_x,
                    cur_y,
                    DoUniqueString("type"),
                    DoUniqueString("event_name"),
                    RandomInt(0,1),
                    RandomFloat(5,7),
                    "models/creeps/ice_biome/frostbitten/n_creep_frostbitten_swollen01.vmdl",
                    1
                ))
                print(`${cur_x} , ${cur_y} 创造了怪物`,`还需要创造${cur_creep_count}`)
                cur_creep_count--
            }
        }

        function _create_event(){
            let cur_x = RandomInt(0,config.map_width);
            let cur_y = RandomInt(0,config.map_height);
            const target_ent = cache_comp.map_data[cur_x.toString()]?.[cur_y.toString()]
            if(target_ent && !target_ent.hasAny(Creep,Event)){
                target_ent.add(new Event(
                    cur_x,
                    cur_y,
                    DoUniqueString("type"),
                    DoUniqueString("event_name"),
                ))
                print(`${cur_x} , ${cur_y} 创造了事件`)
                cur_event_count--
            }
        }

        while(cur_event_count != 0 || cur_creep_count != 0){
            cur_creep_count!=0 && _create_creep()
            cur_event_count!=0 && _create_event()
            print("当前cur_event_count",cur_event_count)
            print("cur_creep_count",cur_creep_count)
        }

        config.creep_count = config.creep_max
        config.event_count = config.event_max
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.MapEvent,(event)=>{
            this.spawn()
        })
    }
}

/**
 * 地下城遇怪处理
 */
export class player_move_to_dungeon_creep extends System{

    /**处理玩家进入遇怪事件 */
    ['in_battle'](event:InstanceType<typeof GameRules.event.PlayerMapEvent>){
        GameRules.QSet.dungeon_player_move_entity.filter(p=>p.get(PLAYER).PlayerID == event.PlayerID)
        .filter(elm=>{
            const move_comp = elm.get(Move)
            const cur_cache_data = GameRules.QSet.map_cache.first.get(MapCacheResouce)
            const creep = cur_cache_data.map_data[move_comp.x.toString()]?.[move_comp.y.toString()]?.get(Creep)
            if(creep){
                return creep
            }
        })
        .map(elm=>{
            elm.add(MoveToCreep)
            elm.add(NoMap)

            // CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(elm.get(PLAYER).PlayerID),"LargePopupBox",{message:"测试"})
            return elm
        })
        .map(ent=>{
            
        })
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.PlayerMapEvent,(event)=>{
            this.in_battle(event)
        })
    }
}

/**
 * 实际进入城市的系统
 */
export class in_city_system extends System{

    create_npc(){
        
    }
    
    in_city(role_ent:Entity,spawn_point:{x:number,y:number}){
        const hero = PlayerResource.GetPlayer(role_ent.get(PLAYER).PlayerID).GetAssignedHero() as CDOTA_BaseNPC_Hero
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

        const cur_cityinfo = role_ent.get(CurCityInfo)
        if(cur_cityinfo == null) {print("not find city_name with CurCityInfo");return}

        const uuid = DoUniqueString("mark_cache")
        const map_ent = new Entity();
        this.engine.addEntity(map_ent)
        map_ent.add(GameRules.tag.is_cur_in_city_map_ent)
        const map_cache = new MarkCache(uuid,new Map(),false,true)
        map_ent.add(map_cache)
        // let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
        const progress = new SystemProgress("mark_loading_build_over",uuid,8 * 8,0,"正在生成中...",false,cur_cityinfo.city_name)

        city_json[cur_cityinfo.city_name as keyof typeof city_json].npcs.forEach(elm=>{
            if(elm.name.includes('role')){
                const npc_component = new npc(
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
        role_ent.removeTag(tag.is_in_mark)
        back_main_xstate("ui_city")
        back_xstate("ui_main")

        print("有单位离开了城市")
        GameRules.QSet.cur_in_city_map_ent.first.removeTag(GameRules.tag.is_cur_in_city_map_ent)
        GameRules.QSet.Cache.entities.forEach(ent=>{
            const map_cache = ent.get(MarkCache)
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
                const scene_comp = GameRules.QSet.is_select_role.first.get(CurrentScene)
                scene_comp.parent_scene = event.data
                scene_comp.scene_type = scene.城市里
            }
        })
    }
}


/**
 * 加载实际场景进入系统
 */
export class load_player_in_3d_scene extends System{


    attribute(unit:CDOTA_BaseNPC,...args:number[]){
        unit.SetBaseMaxHealth(100 * args.reduce((a,b)=>a*b,1) * 5);
        unit.SetBaseDamageMin(20 * args.reduce((a,b)=>a*b,1) * 1);
        unit.SetBaseDamageMax(20 * args.reduce((a,b)=>a*b,1) * 1);
    }

    load(player_ent:Entity){

        const pro_press_comp = new Progress(DoUniqueString("propress"),100,0,"加载地图元素中...");
        player_ent.add(pro_press_comp)  


        const p_move_comp = player_ent.get(Move)
        const scene_ent = GameRules.QSet.map_cache.first
        const cache_comp = scene_ent.get(MapCacheResouce)
        const cur_block_ent = cache_comp.map_data[p_move_comp.x.toString()][p_move_comp.y.toString()]
        const creep_comp = cur_block_ent.get(Creep);

        


        Timers.CreateTimer(()=>{
            pro_press_comp.cur+= 5;
            if(pro_press_comp.cur == pro_press_comp.max){
                return;
            }
            return 0.3;
        },this)

        let cache:any[] = [];

        

        const terrain_mesh = SpawnEntityFromTableSynchronous("prop_dynamic",{
            model:"models/terrain_base.vmdl",
            origin:"0 0 0",
            scales:"1 1 1",
        })

        cache.push(terrain_mesh);
        
            const player_id = player_ent.get(PLAYER).PlayerID
            const hero = PlayerResource.GetPlayer(player_id).GetAssignedHero()
            hero.SetAbsOrigin(Vector(0,0,0));

            const unit = CreateUnitByName("npc_dota_neutral_kobold",Vector(444,222,128),false,null,null,DotaTeam.BADGUYS);
            unit.SetOriginalModel(creep_comp.model)
            unit.SetModel(creep_comp.model)

            this.attribute(unit,creep_comp.random_scale,creep_comp.decrypt_level);

            const event_id = ListenToGameEvent("entity_killed",(event)=>{
                if(event.entindex_killed == unit.entindex()){
                    StopListeningToGameEvent(event_id)
                    cur_block_ent.remove(Creep)
                    const cur_cache_data = PickArrayNumString2D(cache_comp.map_data,p_move_comp.x,p_move_comp.y,8,4);
                    player_ent.get(SurroundingMaps).maps_ent = cur_cache_data
                    player_ent.removeTag(MoveToCreep)
                    player_ent.removeTag(NoMap)
                    player_ent.removeTag(In3DScene)
                    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_id),"LargePopupBox",{tag_name:"奖励....",player_id:player_id});
                   
                    cache.forEach(elm=>{
                        UTIL_Remove(elm);
                    })

                    cache = null;
                }
            },this)
            

        this.engine.subscribe(GameRules.event.ProgressEvent,event=>{
            if(event.state == "end" && event.uuid == pro_press_comp.uuid){
                player_ent.add(In3DScene)
            }
        })
    }

    public onAddedToEngine(): void {
        GameRules.QSet.map_hit_creep_tag.onEntityAdded.connect((snap)=>{
            this.load(snap.current)
        })
    }
}


/**
 * 地下城行走规则
 */

export class player_dungeon_move extends System{

    ['rule'](move:Move){
        return true
    }

    ["update_surrounding"](move:Move,surrounding:SurroundingMaps){
        const Qset = GameRules.QSet;
        const map_cache_data = Qset.map_cache.first.get(MapCacheResouce).map_data;
        const cur_cache_data = PickArrayNumString2D(map_cache_data,move.x,move.y,8,4);
        surrounding.maps_ent = cur_cache_data
    }


    ['move'](event:CustomGameEventDeclarations['c2s_dungeon_move_to_xy'] & event_player){
        const ent = GameRules.QSet.dungeon_player_move_entity.filter(e=> e.get(PLAYER)?.PlayerID == event.PlayerID).pop()
        const move_comp = ent.get(Move)
        const surrounding_comp = ent.get(SurroundingMaps)
        if(!this.rule(move_comp)) return;

        let last = {x:move_comp.x,y:move_comp.y}
        move_comp.x = event.x
        move_comp.y = event.y

        this.update_surrounding(move_comp,surrounding_comp)

        this.engine.dispatch(new GameRules.event.PlayerMapEvent(
            last,
            {x:move_comp.x,y:move_comp.y},
            event.PlayerID,
        ))
    }

    ['register'](){
        CustomGameEventManager.RegisterListener("c2s_dungeon_move_to_xy",(_,e) => this.move(e))
    }

    public onAddedToEngine(): void {
        this.register()
    }
}


/**
 * 触发地图事件
 */
export class big_world_map_trigger_tileset extends System{

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.RoleMoveTriggerEvent,(event)=>{
            event.trigger_entity.add(tag.is_big_wolrd_trigger_event)
            const map_move_comp = event.trigger_entity.get(RoleWorldMapData)
            const form_map_s = map_move_comp.cur_landmark_index
            const to_map_s = map_move_comp.cur_to_map_landmark.landmark_index
            const tile_set_key = form_map_s +"_" + to_map_s as keyof typeof tileset_json
            print("ecs",`选择的tile_set_key form_maps_s:${form_map_s} to_maps_s:${to_map_s}`,tile_set_key)
            if(form_map_s == null || to_map_s == null){
                print("ecs","地图数据错误")
                return
            }

            const key = table.random_key(tileset_json[tile_set_key].tileset_array)

            event.trigger_entity.add(new RoleTileSetInfo(
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
                event.trigger_entity.add(tag.is_is_big_wolrd_trigger_over_event)
                event.trigger_entity.removeTag(tag.is_big_wolrd_trigger_event)
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
            const PlayerID = GameRules.QSet.is_select_role.first.get(PLAYER).PlayerID
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
                        event.trigger_entity.add(new CurCityInfo(
                            event.mark_name,
                            NONE,
                        ))
                        event.trigger_entity.addTag(tag.is_in_chengshi)
                    }

                    if(mask_type == "ye_wai"){
                        event.trigger_entity.addTag(tag.is_in_yewai)
                    }

                    event.trigger_entity.addTag(tag.is_in_mark)
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
            const scene_comp = GameRules.QSet.is_select_role.first.get(CurrentScene)
            scene_comp.scene_name = "default"
            scene_comp.scene_type = scene.城市里
        })
    }
}

/**
 * 大地图移动规则  
 */

export class big_world_map_move_system extends System{

    public start_move(role_ent:Entity,event:InstanceType<typeof GameRules.event.OkEvent>):void{

        const big_map_wolrd_map_move = role_ent.get(RoleWorldMapData)
        const from = map_json[big_map_wolrd_map_move.cur_landmark_index as keyof typeof map_json]
        const to = map_json[event.data.move_map as keyof typeof map_json]

        if(role_ent.has(tag.is_big_world_move)){
            const PlayerID = role_ent.get(PLAYER).PlayerID
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"正在移动中请稍后...",player_id:PlayerID})
            return
        }

        GameRules.QSet.is_select_role.first.addTag(tag.is_big_world_move)
        
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
            if(!role_ent.has(tag.is_is_big_wolrd_trigger_over_event) && big_map_wolrd_map_move.cur_to_map_landmark.schedule >= 0.5 && !role_ent.has(tag.is_big_wolrd_trigger_event)){
                this.engine.dispatch(new GameRules.event.RoleMoveTriggerEvent(
                    role_ent
                ))
            }
            if(role_ent.has(tag.is_big_wolrd_trigger_event)){
                return 1
            }
            if( big_map_wolrd_map_move.cur_to_map_landmark.schedule >= 1){
                /**玩家完全达到了据点的终点 */
                big_map_wolrd_map_move.cur_to_map_landmark.schedule = 0
                big_map_wolrd_map_move.cur_landmark_index = to.mask_name
                role_ent.removeTag(tag.is_big_world_move)
                role_ent.removeTag(tag.is_is_big_wolrd_trigger_over_event)
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
                if(role_ent.get(PLAYER).PlayerID != event.PlayerID) return;
                this.start_move(role_ent,event)
            }
        })
    }
}
