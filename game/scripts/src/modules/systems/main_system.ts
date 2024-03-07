import {  NONE, NUM_WAIT, PickArrayNumString2D, STRING_WAIT, TABLE_WAIT, WAIT,  to_debug  } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { QueryBuilder } from "../../lib/ecs/Query";
import { System } from "../../lib/ecs/System";
import { OpenAPI } from "../../server/core/OpenAPI";
import { request } from "../../server/core/request";
import { back_main_xstate, back_xstate, next_xstate, spawn_xstate } from "./xstate";
import * as map_json from "../../json/game_big_world_map_init_city.json"




class ProgressSystem extends System{

    ['send_progree_start'](ent:Entity){
        
    }

    ['send_progree_end'](ent:Entity){
        
    }

    public onAddedToEngine(): void {
        GameRules.QSet.progress_query.onEntityAdded.connect((snap)=>{
            this.send_progree_start(snap.current)
        })
    }
}


export const unco_gamestate_enum = {
    none:"none",
    pre_start:"pre_start",
    in_role_panel:"in_role_panel",
    in_game_big_map:"in_game_big_map",
}


export class game_loop_system extends System{

    public start(){
        this.sharedConfig.add(new c.base.UiCache({}));
        const game_state_main = spawn_xstate("game_state_main",{
            id:"game_state_main",
            initial:"none",
            states:{
                none:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"game_start"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                game_start:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"game_comp_loading_http"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                game_comp_loading_http:{
                    on:{
                        back:{
                            target:"game_start"
                        },
                        next:{
                            target:"big_world"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                big_world:{
                    on:{
                        back:{
                            target:"game_comp_loading_http"
                        },
                        next:{
                            target:"big_world"
                        },
                        main:{
                            target:"none"
                        }
                    }
                }
            }
        })

        const main_ui_id = spawn_xstate("ui_main",{
            id:"ui_main",
            initial:"none",
            states:{
                none:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"ui_main_role"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_main_role:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"ui_load_role_data"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_load_role_data:{
                    on:{
                        back:{
                            target:"ui_main_role"
                        },
                        next:{
                            target:"ui_main_map"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_main_map:{
                    on:{
                        back:{
                            target:"ui_load_role_data"
                        },
                        next:{
                            target:"ui_tileset_map"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_tileset_map:{
                    on:{
                        back:{
                            target:"ui_main_map"
                        },
                        next:{
                            target:"ui_close"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_city:{
                    on:{
                        back:{
                            target:"ui_tileset_map"
                        },
                        next:{
                            target:"ui_close"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_close:{
                    on:{
                        back:{
                            target:"ui_main_map"
                        },
                        next:{
                            target:"ui_close"
                        },
                        main:{
                            target:"none"
                        }
                    }
                }
            }
        })

        const ui_main_role_id = spawn_xstate("ui_main_role",{
            id:"ui_main_role",
            initial:"role_select",
            states:{
                role_select:{
                    on:{
                        back:{
                            target:"role_select"
                        },
                        next:{
                            target:"role_create"
                        },
                        main:{
                            target:"role_select"
                        }
                    }
                },
                role_create:{
                    on:{
                        back:{
                            target:"role_select"
                        },
                        next:{
                            target:"role_select"
                        },
                        main:{
                            target:"role_create"
                        }
                    }
                }
            }
        })

        const ui_tileset_map = spawn_xstate("ui_tileset_map",{
            id:"ui_tileset_map",
            initial:"none",
            states:{
                none:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"ui_tileset_map_loading"
                        },
                        main:{
                            target:"none"
                        }
                }},
                ui_tileset_map_loading:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"ui_tileset_map_init"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                ui_tileset_map_init:{
                    on:{
                        back:{
                            target:"ui_tileset_map_loading"
                        },
                        next:{
                            target:"ui_tileset_map_init"
                        },
                        main:{
                            target:"none"
                        }
                    }
                }
            }
        })

        const ui_city = spawn_xstate("ui_city",{
            id:"ui_city",
            initial:"none",
            states:{
                none:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"loading"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                loading:{
                    on:{
                        back:{
                            target:"none"
                        },
                        next:{
                            target:"in"
                        },
                        main:{
                            target:"none"
                        }
                    }
                },
                in:{
                    on:{
                        back:{
                            target:"loading"
                        },
                        next:{
                            target:"in"
                        },
                        main:{
                            target:"none"
                        }
                    }
                }
            }
        })

        const ui_main_map = spawn_xstate("ui_main_map",{
            id:"ui_main_map",
            initial:"map_init",
            states:{
                map_init:{
                    on:{
                        back:{
                            target:"map_init"
                        },
                        next:{
                            target:"role_create"
                        },
                        main:{
                            target:"map_init"
                        }
                    }
                },
                in_small_map:{
                    on:{
                        back:{
                            target:"map_init"
                        },
                        next:{
                            target:"role_select"
                        },
                        main:{
                            target:"map_init"
                        }
                    }
                }
            }
        })

        next_xstate(game_state_main)
        next_xstate(main_ui_id)
        

    }
    
    public onAddedToEngine(): void {
        this.sharedConfig.add("none")
        ListenToGameEvent("game_rules_state_change",(event)=>{
            const state = GameRules.State_Get()
            if(state == GameState.PRE_GAME){
                this.start()
            }
        },[])
    }

}


export class game_init_system extends System{

    async init(){
        for(let i = 0 ; i < 24 ; i++){
            const Player = PlayerResource.GetPlayer(i as PlayerID)
            if(Player == null) continue;
            const test_entity = new Entity(); 
            this.engine.addEntity(test_entity);
            
            print("steamid_",PlayerResource.GetSteamID(Player.GetPlayerID()))
            const player_comp = new c.base.PLAYER(PlayerResource.GetSteamID(Player.GetPlayerID()).ToHexString(),Player.GetPlayerID())
            test_entity.add(player_comp)
                       .add(new c.role.RoleSlot(WAIT,WAIT,WAIT,WAIT))
                       .add(new c.role.PlayerGold(WAIT,WAIT,WAIT,WAIT,WAIT,WAIT,WAIT))

            let login = await request(OpenAPI,{
                        method:"POST",
                        url:"/user_first_login",
                        body:{
                            "steam_id":PlayerResource.GetSteamID(Player.GetPlayerID()).ToHexString(),
                        }
                   }) as any
           login = JSON.decode(login) as {result:{[key in string]:any}}
           print("login")
           
           DeepPrintTable(login)
           const roleslot = test_entity.get(c.role.RoleSlot)
           roleslot.slot1 = login?.result['RoleSlot']?.[1] ?? NONE
           roleslot.slot2 = login?.result['RoleSlot']?.[2] ?? NONE
           roleslot.slot3 = login?.result['RoleSlot']?.[3] ?? NONE
           roleslot.slot4 = login?.result['RoleSlot']?.[4] ?? NONE
           for(let i = 1 ; i <= 4 ; i++){
                if(roleslot["slot" + i] == NONE){
                    continue;
                }
                const role_ent = new Entity()
                role_ent.add(player_comp)
                
                // test_entity.append(new c.base.Link("slot" + i,role_ent))

                role_ent.add(new c.role.CurrentScene("default","default",c.tag.scene.大地图))
                this.engine.addEntity(role_ent)
                role_ent
                    .add(test_entity.get(c.base.PLAYER))
                    .add(new c.role.RoleInfo(
                        login.result?.['RoleInfo']?.[i].born_map,
                        login.result?.['RoleInfo']?.[i].born_hero,
                        login.result?.['RoleInfo']?.[i].create_time,
                        login.result?.['RoleInfo']?.[i].is_dead))
                    .add(new c.role.PlayerGold(
                        login.result?.['PlayerGold']?.[i].gold_1,
                        login.result?.['PlayerGold']?.[i].gold_2,
                        login.result?.['PlayerGold']?.[i].gold_3,
                        login.result?.['PlayerGold']?.[i].gold_4,
                        login.result?.['PlayerGold']?.[i].gold_5,
                        login.result?.['PlayerGold']?.[i].gold_6,
                        login.result?.['PlayerGold']?.[i].novice_gold,
                    ))
           }
        }

        // for(let i = 0 ; i < 500 ; i ++){
        //     const ent = new Entity()
        //     ent.add(new Move(math.random(),math.random()))
        //     this.engine.addEntity(ent)
        // }

    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.xstateChangeEvent,(event)=>{
            if(event.state.includes("game_state_main=>game_start") && event.xstateid == "game_state_main"){
                this.init()
            }
        })
    }
}


export class ok_panel_to_event_system extends System{

    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_ok_register",(_,event)=>{
            const uuid_event = CustomGameEventManager.RegisterListener(event.uuid,(_,event)=>{
                 GameRules.world.dispatch(new GameRules.event.OkEvent(event.uuid,event.type,event.click,event.PlayerID,event.data))
                 CustomGameEventManager.UnregisterListener(uuid_event)
             })
         })
    }
}

interface CHECK_CREATE_ROLE_DATA{
    attribute_table:{[key in keyof GrowUp]:{val:number,max:number}},
    hero_name:string,
    origin_hero_name:string,
    map_name:string
}

const ATTIRBUTE_TABLE_SCALAR = {
    strength_up : 1,
    intelligence_up : 1,
    dexterity_up : 1,
    attack_damage_up : 1,
    magic_resistance_up : 1,
    flame_attack_up : 1,
    ice_attack_up : 1,
    lightning_attack_up : 1,
    shadow_attack_up : 1,
    fire_resistance_up : 1,
    frost_resistance_up : 1,
    lightning_resistance_up : 1,
    storm_resistance_up :1
}

export class remove_role_system extends System{
    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OkEvent,(event)=>{
            if(event.type == "remove_role" && event.click == "ok"){
            const steam_id = GameRules.QSet.player_query.find(p=>p.get(c.base.PLAYER)?.PlayerID == event.PlayerID)?.get(c.base.PLAYER)?.steam_id


            request(OpenAPI,{
             method:"POST",
             url:"/data/v1/action/updateMany",
             body:{
                 "dataSource": "mongodb-atlas",
                 "database": "dota-test",
                 "collection": "user",
                 "filter": {
                     "_id": steam_id,
                 },
                    "update": {
                        "$pull": {
                          "RoleSlot": {
                             uuid: event.data.uuid
                          },
                          "GrowUp": {
                             uuid: event.data.uuid
                          },
                        }
                    }
                }}).then(val=>{
                    const player_ent = GameRules.QSet.player_query.find(p=>p.get(c.base.PLAYER)?.PlayerID == event.PlayerID)
                    player_ent.get(c.role.RoleSlot)["slot" + event.data.slot] = NONE
                    print("slot" + event.data.slot,"被删除了")
                    //把玩家的RoleSlot全部向前移动到头 确保没有空位
                    for(let i = event.data.slot ; i < 4 ; i++){
                        if(player_ent.get(c.role.RoleSlot)["slot" + (i + 1)] == null){ return }
                        player_ent.get(c.role.RoleSlot)["slot" + i] = player_ent.get(c.role.RoleSlot)["slot" + (i + 1)]
                    }

                    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(event.PlayerID),"LargePopupBox",{tag_name:"删除角色成功",player_id:event.PlayerID})
                })
            }})
    }
}

export class role_in_game_ok_system extends System{

    /**创造玩家仓库背包 */
    private _create_warehouse_inventory(){
        const role = GameRules.QSet.is_select_role.first
        const comp = new c.role.WarehouseInventory(0,{},false)
        role.appendComponent(comp)
        for(let i = 1 ; i <= 11 ; i++){
            const comp = new c.role.WarehouseInventory(i,{},true)
            role.appendComponent(comp)
        }
    }

    public load(event:InstanceType<typeof GameRules.event.OkEvent>){
        //让UI进入下一个阶段
        next_xstate("ui_main")
        const player_ent = GameRules.QSet.player_query.find(p=>p.get(c.base.PLAYER)?.PlayerID == event.PlayerID)
        const select_uuid = event.data.uuid;
        const select_slot = event.data.slot;
        if(select_uuid == null || select_slot == null){
            Warning("没找到适配角色 uuid 不存在 或者select_index不存在")
        }

        // player_ent.iterate(c.base.Link,(comp)=>{
        //     if(comp.type == "slot" + select_slot){
        //         print(`[ecs]:${"slot" + select_slot}的玩家插槽被选择`)
        //         const select_ent = comp.entity;
        //         select_ent.add(player_ent.get(c.base.PLAYER))
        //         const inventory_comp = new c.quipment.Inventory({} as any)
        //         inventory_comp.slots.slot_0 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_1 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_2 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_3 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_4 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_5 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_6 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_7 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}
        //         inventory_comp.slots.slot_8 = {ecs_entity_index:-1,dota_entity:-1 as EntityIndex}

        //         const equipmentState = new c.quipment.EquipmentState(
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Headwear},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Weapon},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Clothes},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Necklace},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Back},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Shoulder},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Hand},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Hand},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Ring},
        //             {ecs_entity_index:-1,dota_entity:-1 as EntityIndex,type:c.quipment.EQUIPMENT_TYPE.Ring},
        //         )

        //         const allModifierAndAttributeComps = new c.role.AllModifierAndAttributeComps(
        //             {},
        //             []
        //         )

        //         const PlayerID = player_ent.get(c.base.PLAYER).PlayerID
        //         const hero =  HeroList.GetAllHeroes().find(hero=>hero.GetPlayerOwnerID() == PlayerID)

        //         const hero_comp = new c.base.HERO(hero.GetUnitName(),hero.entindex())
        //         select_ent.add(hero_comp)
        //         select_ent.add(new c.quipment.RbxBoxElement({}))
        //         select_ent.add(inventory_comp)
        //         select_ent.add(equipmentState)
        //         select_ent.addTag(GameRules.tag.is_game_select_role)
        //         select_ent.add(allModifierAndAttributeComps)
        //         select_ent.add(new c.role.RoleWorldMapData(
        //             STRING_WAIT("",(instance:RoleWorldMapData)=>{
        //             //初始化 如果没有这个表 那么我们读取创造角色时候的地图
        //             return select_ent.get(c.role.RoleInfo)?.born_map
        //         }),STRING_WAIT("",(instance:any)=>{
        //             //初始化 如果单位没有初始化城市 那么这个就用json数据表里的记载来初始化角色位置
        //             return map_json[select_ent.get(c.role.RoleInfo)?.born_map as keyof typeof map_json].create_role_init_map_mark
        //         }),TABLE_WAIT({},()=>{
        //             return {map_index:"none",landmark_index:"none",schedule:0}
        //         })))

        //         this._create_warehouse_inventory()
        //         return;
        //     }
        // })
        // next_xstate("game_state_main")
        // Timers.CreateTimer(()=>{
        //     if( container.http_comp_decorator_container_with_init.size == 0 ){
        //         next_xstate("game_state_main")
        //         next_xstate("ui_main")
        //         return
        //     }
        //     return 0.5
        // })
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OkEvent,(event)=>{
            if(event.click == "ok" && event.type == "in_game"){
                this.load(event)
            }
        })
    }
}

export class ui_system extends System{
    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OkEvent,(event)=>{
            if(event.click == "ok"){
                 const cache = this.sharedConfig.get(c.base.UiCache)
                 if(cache.ui_cache.OkPanel == null){
                     cache.ui_cache.OkPanel = {}
                 }
                 if(event?.data){
                    for(let key in event?.data){
                       cache.ui_cache.OkPanel[key] = event.data[key]
                    }
                 }
                 const strs = event.type.split("=>")
                 if(strs[0] == "ui" ){
                    const ui_id = strs[1]                 
                    const op = strs[2]
                    if(op == "back"){
                        back_xstate(ui_id as XstateID)   
                    } 
                    if(op == "next"){
                        next_xstate(ui_id as XstateID)
                    }
                    if(op == "main"){
                        back_main_xstate(ui_id as XstateID)
                    }
                 }
            }
        })
    }
}

export class create_role_system extends System{

    public check_name(name:string):boolean{
        return true
    }

    public check_map(map_name:string):boolean{
        return true
    }

    public check(data:CHECK_CREATE_ROLE_DATA,PlayerID:PlayerID){
        const attribute_table = data.attribute_table
        const hero_name = data.hero_name
        const origin_hero_name = data.origin_hero_name
        const map_name = data.map_name
        
        //测试地图
        data.map_name = "zhong_bu_di_qu"

       let total = 0;
       for(let key in attribute_table){
           print
           total += attribute_table[key].val * ATTIRBUTE_TABLE_SCALAR[key]
       }


       print("检测的playerid",PlayerID)
       if(100 - total != 0){
            print("属性点不合法")
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"属性点不合法",player_id:PlayerID})
            return
        }

       if(!this.check_name(hero_name)){
            //提示英雄不合法
            print("英雄名字不合法")
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"英雄名字不合法",player_id:PlayerID})
            return

       }

       if(!this.check_name(map_name)){
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"地图名字不合法",player_id:PlayerID})
            //提示地图名字不合法   
            print("地图名字不合法")
            return

       }

       if(!this.check_name(origin_hero_name)){
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"起名不合法",player_id:PlayerID})
            //提示玩家名字不合法
            print("玩家名字不合法")
            return
       }

       const steam_id = GameRules.QSet.player_query.find(p=>p.get(c.base.PLAYER)?.PlayerID == PlayerID)?.get(c.base.PLAYER)?.steam_id

       const grow_up = {} as any

       Object.keys(attribute_table).forEach(key=>{
          grow_up[key] = attribute_table[key].val
       })
    
       const uicache = this.sharedConfig.get(c.base.UiCache)
       const slot = uicache.ui_cache["OkPanel"]['slot']
       

       const uuid = DoUniqueString(RandomInt(0,1000000).toString())+DoUniqueString(RandomInt(0,1000000).toString())
       request(OpenAPI,{
        method:"POST",
        url:"/data/v1/action/updateMany",
        body:{
            "dataSource": "mongodb-atlas",
            "database": "dota-test",
            "collection": "user",
            "filter": {
                "_id": steam_id,
            },
            "update": {
                 $push: { 
                    RoleInfo:{ $each: [{is_dead:false,born_hero:hero_name,create_time:GetSystemDate(),born_map:data.map_name,uuid:uuid}] ,$position: slot },
                    GrowUp: { $each: [ {...grow_up,uuid:uuid} ], $position: slot },
                    RoleSlot: { $each: [ { "hero_name" : hero_name, "origin_name" : origin_hero_name ,uuid:uuid} ], $position: slot } ,
                    PlayerGold: { $each: [ {gold_1: 0, gold_2: 0, gold_3: 0, gold_4: 0, gold_5: 0, gold_6: 0, novice_gold: 300} ], $position: slot } ,
            }
        }
        }
    }).then(res=>{
        try{
            const player_ent = GameRules.QSet.player_query.find(p=>p.get(c.base.PLAYER)?.PlayerID == PlayerID)

            player_ent.get(c.role.RoleSlot)["slot" + slot] = {hero_name,origin_name:origin_hero_name,uuid}

            const role_ent = new Entity()

            role_ent.add(player_ent.get(c.base.PLAYER));

            role_ent.add(new c.role.RoleInfo(data.map_name,hero_name,GetSystemDate(),false))

            const grow_up_comp = new c.role.GrowUp(grow_up.strength_up,grow_up.intelligence_up,grow_up.dexterity_up,grow_up.attack_damage_up,grow_up.magic_resistance_up,grow_up.flame_attack_up,grow_up.ice_attack_up,grow_up.lightning_attack_up,grow_up.shadow_attack_up,grow_up.fire_resistance_up,grow_up.frost_resistance_up,grow_up.lightning_resistance_up,grow_up.storm_resistance_up,uuid)
           
            role_ent.add(grow_up_comp)
            
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(PlayerID),"LargePopupBox",{tag_name:"成功创建角色",player_id:PlayerID})
           
            const player_gold_comp = new c.role.PlayerGold(0,0,0,0,0,0,300);

            role_ent.add(player_gold_comp)

            back_xstate("ui_main_role")
        }
        catch(err){
            print("错误情况",err)
        }
    }).catch(err=>{
        print("哪里错误了",err)
    })
    

    //    request(OpenAPI,{
    //          method:"POST",
    //          url:"/data/v1/action/insertOne",
    //          body:{
    //              "dataSource": "mongodb-atlas",
    //              "database": "dota-test",
    //              "collection": "user",
    //              "document":
    //              {
    //                 "#comp":"GrowUp",
    //                 "steam_id":steam_id,
    //              }
    //          }
    //     }).then(res=>{
    //         DeepPrintTable(res)
    //     }).catch(err=>{
    //         print(err)
    //     })
    }


    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OkEvent,(event)=>{
            if(event.type == "check_create_role" && event.click == "ok"){
                print("打印传入")
                DeepPrintTable(event)
                this.check(event.data,event.PlayerID)
            }
        })
    }
}


export class eval_debug_system extends System{
    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_eval",(_,event)=>{
            const code = event.code;
            _G['next_xstate'] = next_xstate
            _G['back_main_xstate'] = back_main_xstate
            _G['back_xstate'] = back_xstate
            try{
                loadstring(code)[0]()
            }catch(err){
                print(err)
            }
        })
    }
}



export class unco_debug_system extends System{
    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_debug_comp_change_value",(_,event)=>{
            const ent = this.engine.getEntityById(event.entity)
            if(ent){
                const comp = ent.get( container.to_debug_container.get(event.comp_name) ) as InstanceType<any>
                const slice = event.key.split("::")
                const [k1,k2,k3,k4,k5] = slice

                if(comp){
                    if(event.op == "inc"){
                        slice.reduce((pre,cur,index)=>{
                            print("index",index)
                            print("slice.length - 1",slice.length - 1)
                            if(index == slice.length - 1){
                                print("最后一个值得",cur)
                                if(comp[cur] == null){
                                    comp[cur] = 0
                                }
                                comp[cur] ++
                                return
                            }
                            if(typeof comp[cur] == "object"){
                                return comp[cur]
                            }
                        },k1)
                        // if(comp[k1]?.[k2]?.[k3]?.[k4]?.[k5]){
                        //     comp[k1][k2][k3][k4][k5]++
                        // }else if(comp[k1]?.[k2]?.[k3]?.[k4]){
                        //     comp[k1][k2][k3][k4]++
                        // }else if(comp[k1]?.[k2]?.[k3]){
                        //     comp[k1][k2][k3]++
                        // }else if(comp[k1]?.[k2]){
                        //     comp[k1][k2]++
                        // }else if(comp[k1]){
                        //     comp[k1]++
                        // }
                    }
                
                    if(event.op == "dec"){
                        slice.reduce((pre,cur,index)=>{
                            print("index",index)
                            print("slice.length - 1",slice.length - 1)
                            if(index == slice.length - 1){
                                print("最后一个值得",cur)
                                if(comp[cur] == null){
                                    comp[cur] = 0
                                }
                                comp[cur]--
                                return
                            }
                            if(typeof comp[cur] == "object"){
                                return comp[cur]
                            }
                        },k1)
                    }
                
                    if(event.op == "set"){
                        slice.reduce((pre,cur,index)=>{
                            print("index",index)
                            print("slice.length - 1",slice.length - 1)
                            if(index == slice.length - 1){
                                print("最后一个值得",cur)
                                if(comp[cur] == null){
                                    comp[cur] = 0
                                }
                                const try_num = parseFloat(event.data)
                                comp[cur] = isNaN(try_num) ? event.data : try_num
                                return
                            }
                            if(typeof comp[cur] == "object"){
                                return comp[cur]
                            }
                        },k1)
                    }
                }
            }
        })
    }
}

