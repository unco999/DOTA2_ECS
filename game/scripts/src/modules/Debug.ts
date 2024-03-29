import { TRACE, _replace$2obj, create_city_road_wfc, easing, sigmoid, to_client_event, to_debug } from '../fp';
import { OpenAPI } from '../server/core/OpenAPI';
import { request } from '../server/core/request';
import { reloadable } from '../utils/tstl-utils';
import * as map_test_json from "../modules/map_json/test.json"
import * as qiang from "../modules/map_json/qiang.json"
import { http_base } from './systems/base';
import { attribute_modifier } from './modifiers/base/attribute_modifier';
import { matrix} from '../lib/math/martrix';
import { rubic_box } from './systems/rubic_box';
import './modifiers/base/test_modifier'
import { FN } from './attribute/FN';
import { Entity } from '../lib/ecs/Entity';

let cache = new Map()


@reloadable
export class Debug {
    DebugEnabled = false;
    // 在线测试白名单
    OnlineDebugWhiteList = [
        86815341, // Xavier
    ];

    constructor() {
        // 工具模式下开启调试
        this.DebugEnabled = IsInToolsMode();
        ListenToGameEvent(`player_chat`, keys => this.OnPlayerChat(keys), this);
    }

    OnPlayerChat(keys: GameEventProvidedProperties & PlayerChatEvent): void {
        const strs = keys.text.split(' ');
        const cmd = strs[0];
        const args = strs.slice(1);
        const steamid = PlayerResource.GetSteamAccountID(keys.playerid);

        if (cmd === '-debug') {
            if (this.OnlineDebugWhiteList.includes(steamid)) {
                this.DebugEnabled = !this.DebugEnabled;
            }
        }

        // 只在允许调试的时候才执行以下指令
        // commands that only work in debug mode below:
        if (!this.DebugEnabled) return;

        // 其他的测试指令写在下面
        if (cmd === 'get_key_v3') {
            const version = args[0];
            const key = GetDedicatedServerKeyV3(version);
            Say(HeroList.GetHero(0), `${version}: ${key}`, true);
        }

        if (cmd === 'get_key_v2') {
            const version = args[0];
            const key = GetDedicatedServerKeyV2(version);
            Say(HeroList.GetHero(0), `${version}: ${key}`, true);
        }

        if(cmd == "move"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            hero.SetOrigin(Vector(Number(args[0]),Number(args[1]),Number(args[2])))
        }

        if (cmd == "huishou") {
            collectgarbage("collect");
        }

        if(cmd == "test"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            const foward = hero.GetForwardVector().__mul(1000).__add(hero.GetOrigin())



            const c = CreateModifierThinker(hero,undefined,"",{},foward,hero.GetTeamNumber(),false)

            let g;
            let model = hero.GetChildren()
           for(let i = 0 ; i < model.length ; i++){
              if(model[i].GetModelName().includes("weapon")){
                  const a  = model[i] as CBaseModelEntity
                  print("隐藏了")
                  a.AddEffects(EntityEffects.EF_NODRAW)
                  g = a;
                }} 
            SendToConsole("dota_combine_models 0")
            ProjectileManager.CreateTrackingProjectile({
                Ability:null,
                "Target":c,
                "Source":hero,
                "EffectName":"particles/kuangzhanshi/troll_warlord__2whirling_axe_ranged.vpcf",
                "iMoveSpeed":1000,
            })

            GameRules.enquence_delay_call(()=>{
                c.SetModel(g.GetModelName())
                c.SetOriginalModel(g.GetModelName())
                c.SetModelScale(1.5)
                c.SetAbsAngles(180,0,180) 
                c.SetOrigin(c.GetOrigin().__add(Vector(0,0,256)))
                const id = ParticleManager.CreateParticle("particles/ecmon/items/huskar/huskar_2022_immortal/huskar_2022_immortal_life_break.vpcf",ParticleAttachment.WORLDORIGIN,hero)
                ParticleManager.SetParticleControl(id,0,c.GetOrigin())
            },undefined,1000)

            GameRules.enquence_delay_call(()=>{
                ProjectileManager.CreateTrackingProjectile({
                    Ability:null,
                    "Target":hero,
                    "Source":c,
                    "EffectName":"particles/kuangzhanshi/troll_warlord__2whirling_axe_ranged.vpcf",
                    "iMoveSpeed":500,
                })
                c.RemoveSelf()
                // a.RemoveEffects(EntityEffects.EF_NODRAW)
                GameRules.enquence_delay_call(()=>{
                    g.RemoveEffects(EntityEffects.EF_NODRAW)
                },undefined,1000)
            },undefined,3000)


            // const id =  ParticleManager.CreateParticle("particles/kuangzhanshi/troll_warlord__2whirling_axe_ranged.vpcf",ParticleAttachment.ABSORIGIN,hero)
            // ParticleManager.SetParticleControl(id,1,foward)
            // ParticleManager.SetParticleControlEnt(id,9,hero,ParticleAttachment.CUSTOMORIGIN,null,Vector(0),true)
            // GameRules.enquence_delay_call(()=>{
            //     ParticleManager.SetParticleControlFallback(id,1,hero.GetOrigin())
            // },undefined,3000)
        }
        if(cmd == "modifier"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            const foward = hero.GetForwardVector().__mul(1000).__add(hero.GetOrigin())
            const modifier = hero.AddNewModifier(hero,null,"modifier_han_di_zhi_yue_jump",{duration:3,x:foward.x,y:foward.y,z:foward.z})
        }
        if(cmd == "reload"){
            container.to_client_event_container.forEach(val=>{
                to_client_event("player")(val)
                to_debug()(val)
            })
        }
        if(cmd == "debug"){
            if(GameRules.world.sharedConfig.hasTag("debug")){
                GameRules.world.sharedConfig.removeTag("debug")
            }else{
                GameRules.world.sharedConfig.add("debug")
            }
        }
        if(cmd == "animation"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            hero.StartGestureWithPlaybackRate(GameActivity.DOTA_DIE,999);
            GameRules.enquence_delay_call(()=>{
                hero.AddNewModifier(hero,null,"dao_di_modifier",{duration:3})
            },undefined,200)
        }
        if(cmd == "eval"){
            if(GameRules.world.sharedConfig.hasTag("eval")){
                GameRules.world.sharedConfig.removeTag("eval")
            }else{
                GameRules.world.sharedConfig.add("eval")
            }
        }
        if(cmd == "deg"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            hero.RemoveEffects(EntityEffects.EF_NODRAW)
            let model = hero.GetChildren()
           for(let i = 0 ; i < model.length ; i++){
              if(model[i].GetModelName().includes("weapon")){
                  const a  = model[i] as CBaseModelEntity
                  const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
                    targetname:"lisi",
                    origin:`${a.GetOrigin().x} ${a.GetOrigin().y} ${a.GetOrigin().z}`,
                    angles:`${a.GetAngles().x} ${a.GetAngles().y} ${a.GetAngles().z}`,
                    scales : `${1.1} ${1.1} ${1.}`,
                    model :"models/heroes/axe/axe_weapon.vmdl",
                    lightmapstatic:"1",
                    renderfx:"kRenderFxPulseFast",
                    solid:"0",
                }) as CBaseModelEntity

                let b = 0; 
                GameRules.enquence_delay_call(()=>{
                    const dir = GameRules.GetGameFrameTime() * easing.inOutCirc(1 - b / 1000) * 550
                    prop_dynamic.SetOrigin(prop_dynamic.GetOrigin().__add(prop_dynamic.GetForwardVector().__mul(dir)))
                    if(b < 1000){
                        b++
                        return "update"
                    }
                },undefined,10)

                  print(DeepPrintTable(getmetatable(a)))
              }

           }
        }
        
        // if(cmd == "test"){

        //     let t = newproxy(true)


        //     const origin = {zhangsan:args[0]}
            
        //    const mt = getmetatable(t)
        //    mt.__gc = ()=>{print(origin.zhangsan,"被删除")};
        //    mt.__metatable = {
        //      __index:origin,
        //      __metatable:origin,
        //      __mode:"kv",
        //      __gc:()=>{print(origin.zhangsan,"被删除")},
        //    }

        //     const b = t
        //     // origin.zhangsan = null
        //     t = null;
            

        //     collectgarbage("collect")
        // }

        if(cmd == "gc"){
            collectgarbage
        }
        if(cmd == "t"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            const model = CreateRune(hero.GetOrigin().__add(RandomVector(100)),RuneType.ARCANE)
            model.SetModel("models/items/rubick/first_movement_of_magic_back/first_movement_of_magic_back.vmdl")
            // hero.RemoveModifierByName("testm")
            // const buff = hero.AddNewModifier(hero,null,"testm",{duration:-1})
            // buff.SendBuffRefreshToClients()
        }
        if(cmd == "skin"){
            cache.forEach((elm:CBaseModelEntity)=>{
                if(elm.GetClassname()?.includes("prop_dynamic"))
                elm?.SetSkin?.(Number(args[0]))
            })
        }
        if(cmd == "fp"){

        }  
        if(cmd =="json"){
            // const t = {}
            // const type = Entities.FindAllByName("*").filter(elm=>elm.GetName().includes("type_"))
            // .map(key=> key.GetName().replace("type_",""))
            const t = {}
            const center_t = {}
            const center = Entities.FindAllByName("tileset_*_center") 
            center.forEach(elm=>{
                center_t[elm.GetName()] =  elm.GetOrigin()
            })

            center.forEach(ent=>{
                Entities.FindAllInSphere(ent.GetAbsOrigin(),512)
                .forEach(elm=>{
                    if(elm.GetName() != "" && !elm.GetName().includes("center") && elm.GetName().includes("tileset")){
                        print(elm.GetName())
                        const anglex = elm.GetLocalAngles().x
                        const angley = elm.GetLocalAngles().y
                        const anglez = elm.GetLocalAngles().z
                        if(t[elm.GetName()] == null){
                            t[elm.GetName()] = []
                        }
                        let num = string.match(elm.GetName(), "%d+")[0]
                        print("找到的数字",num)
                        if(Number(num) < 10){
                            num = "0"+num
                        }
                        const npc = elm.HasAttribute("npc")
                        if(npc){
                            print("找到了npc",npc)
                        }
                        const name = elm.GetClassname().includes("npc_dota_mango_tree") ? elm.GetName() + "tree" :  elm.GetName()
                        const center = center_t[`tileset_${num}_center`] as Vector
                        const point = center?.__sub(elm.GetAbsOrigin()) ?? elm.GetAbsOrigin();
                        (t[elm.GetName()] as Array<any>).push( {name,model:elm.GetModelName(),origin:{x:point.x,y:point.y,z:point.z},scale:elm.GetLocalScale(),angle:{x:anglex,y:angley,z:anglez},}); 
                    }
                })
            })

            Entities.FindAllByName("tileset*")
            .forEach(elm=>{
                if(!elm.GetName().includes("center")){
                    const anglex = elm.GetLocalAngles().x
                    const angley = elm.GetLocalAngles().y
                    const anglez = elm.GetLocalAngles().z
                    if(t[elm.GetName()] == null){
                        t[elm.GetName()] = []
                    }
                    let num = string.match(elm.GetName(), "%d+")[0]
                    print("找到的数字",num)
                    if(Number(num) < 10){
                        num = "0"+num
                    }
                    const center = center_t[`tileset_${num}_center`] as Vector
                    const point = center?.__sub(elm.GetAbsOrigin()) ?? elm.GetAbsOrigin();
                    (t[elm.GetName()] as Array<any>).push( {name:elm.GetName(),model:elm.GetModelName(),origin:{x:point.x,y:point.y,z:point.z},scale:elm.GetLocalScale(),angle:{x:anglex,y:angley,z:anglez},}); 
                }
            })

            DeepPrintTable(t)

            // DeepPrintTable(t)




            // const json = entities.map(elm=>{
            //     const {x,y,z} = elm.GetAbsOrigin()
            //     const anglex = elm.GetAngles().x
            //     const angley = elm.GetAngles().y
            //     const anglez = elm.GetAngles().z
            //     const name = elm.GetName()
            //     return {name,model:elm.GetModelName(),origin:{x,y,z},scale:elm.GetLocalScale(),angle:{x:anglex,y:angley,z:anglez},}
            // })
            const json_str = JSON.encode(t)
            // print(json_str)
            const http = CreateHTTPRequest("POST","http://localhost:3123/")
            http.SetHTTPRequestRawPostBody("application/json",json_str)
            http.Send((res)=>{})


        }
        if(cmd == "ii"){
            const point = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            const origin = point.GetOrigin()
            DebugDrawCircle(origin,Vector(255,255,255),10,100,true,11)
            DebugDrawText(origin,`${origin}`,true,11)
            print(origin)

            const id = ParticleManager.CreateParticle("particles/post.vpcf",ParticleAttachment.WORLDORIGIN,undefined)
            ParticleManager.SetParticleControl(id,0,origin);
        }
        if(cmd == "build"){
            // const data = map_test_json as MapMarkBuildJSON[]
            // data.forEach(elm=>{
            //     print(elm.origin.y)
            // })
            Entities.FindAllByName("*").forEach(elm=>{
                print(elm.GetSpawnGroupHandle())
                print(elm.IsPlayerController())
            })
            

            // Entities.FindAllByName("*").forEach(elm=>{
            //      if(elm.GetName().includes("axe")){
            //           elm.RemoveSelf()
            //      }
            // })

            
            // duibi.forEach(elm=>{
            //     print("sdsdsdsd")
            //     print(elm)
            // })
            // let jieguo = new Set<string>()
            // print("===========================asas============================")
            // Entities.FindAllByName("*").forEach(elm=>{
            //     jieguo.add(elm.GetName())
            // })

            // jieguo.forEach(elm=>{
            //     print(elm)
            // })
            
        }

        // if(cmd == "test"){
        //     Entities.FindAllByName("*").forEach(elm=>{
        //         if(elm.GetName().includes("corner")){
        //             print(elm.GetName())
        //         }
        //     })
        // }
        if(cmd == "hero"){
            
            
    
            // Entities.FindAllByName("*").forEach(elm=>{
            //     if(elm.GetName() == "GameManager"){
            //         DeepPrintTable(getmetatable(elm).__index)
            //         print(elm.GetClassname())
            //     }
                // print("sdsdsdsd")
                // const hero = CreateHeroForPlayer("npc_dota_hero_luna",elm.GetRootMoveParent() as any)
                // if(hero){
                //     print("移动了")
                //     hero.SetOrigin(RandomVector(RandomInt(-500,500)))
                // }
            const kv = LoadKeyValues("scripts/npc/npc_heroes.txt")
            // DeepPrintTable(kv['npc_dota_hero_axe'])

            // const prop_dynamic = SpawnEntityFromTableSynchronous("npc_dota_hero_axe",kv['npc_dota_hero_axe']) as CDOTA_BaseNPC_Hero
            // // prop_dynamic.SetOrigin(Vector(0,0,0))

            const prop_dynamic = SpawnEntityFromTableSynchronous("npc_dota_hero_antimage",kv['npc_dota_hero_antimage']) as CDOTA_BaseNPC_Hero
            prop_dynamic.SetOrigin(Vector(333,0,555))
    

            GameRules.GetGameModeEntity().SetOverrideSelectionEntity(prop_dynamic)
            prop_dynamic.SetOwner(PlayerResource.GetPlayer(keys.playerid))
            prop_dynamic.SetControllableByPlayer(keys.playerid,false)
            prop_dynamic.SetBaseMaxHealth(500)
            prop_dynamic.SetHealth(500)
            prop_dynamic.SetMoveCapability(UnitMoveCapability.GROUND)
            prop_dynamic.SetPrimaryAttribute(Attributes.ALL)
            prop_dynamic.SetHullRadius(99)
            if(prop_dynamic.IsAlive()){
                print("活着的")
            }

            GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_1,2)

            
            // const 

            // const unit = CreateUnitByName("npc_dota_neutral_kobold",Vector(666,222,128),false,null,null,DotaTeam.BADGUYS);
            // unit.SetOwner(PlayerResource.GetPlayer(keys.playerid))
            // unit.SetControllableByPlayer(keys.playerid,true)
            // unit.SetMoveCapability(UnitMoveCapability.GROUND)
            // unit.SetTeam(DotaTeam.GOODGUYS)
            // GameRules.ResetPlayer(keys.playerid)
            // DeepPrintTable(prop_dynamic)
        }
        if(cmd == "ecsitem"){
            c.quipment.testCreateRandomItem(args[0])
        }
        if(cmd == "camera"){
            CustomGameEventManager.Send_ServerToAllClients("send_camera_sequcen",[
                {Easing:"inOutExpo",await:1,duration:1,position:{x:6666,y:6666,z:128},call_back_event_name:DoUniqueString("event"),height:1000},
                {Easing:"inOutExpo",await:1,duration:1,position:{x:3333,y:3333,z:128},call_back_event_name:DoUniqueString("event"),height:7000},
                {Easing:"inOutExpo",await:1,duration:1,position:{x:111,y:11,z:128},call_back_event_name:DoUniqueString("event"),height:1300}
            ])
        }
        if(cmd == "dropitem"){
        // request(OpenAPI,{
        //     method:"POST",
        //     url:"/data/v1/action/findOne",
        //     body:{
        //         "dataSource": "mongodb-atlas",
        //         "database": "dota-test",
        //         "collection": "npc",
        //         "filter":{
        //             "city": "qing_xue_cheng",
        //             "npc_name": "modules_npc_ji_shi_role"

        //         }
        //     }
        //      }).then(elm=>{
        //          DeepPrintTable(elm)
        //      }).catch(err=>{
        //          print(err)
        //      })
            Object.keys(LoadKeyValues("scripts/npc/items_list_1.txt")).forEach(elm=>{
                if(LoadKeyValues("scripts/npc/items_list_1.txt")[elm].shopNpc == "modules_npc_ji_shi_role"){
                    print(elm)
                }
                // const item = CreateItem(elm,null,null)   
                // const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
                // CreateItemOnPositionSync( hero.GetOrigin(), item )
                // const vec = RandomVector(200)
                // vec.z = 0
                // item.LaunchLoot(false,200,0.75,hero.GetOrigin().__add(vec),hero)
            })
        }

        if(cmd == "cache"){
            const cache = GameRules.world.entities.map(ent=>{
                print(ent)
                return ent.getComponents().map(elm=>{
                    if(container.to_save_container.has(elm.constructor.name)){
                        return Object.assign(_replace$2obj(elm),{$$$$class_name:elm.constructor.name})
                    }
                })
            })
            DeepPrintTable(cache)
            const json_str = JSON.encode(cache)
            // print(json_str)
            const http = CreateHTTPRequest("POST","http://localhost:3123/")
            http.SetHTTPRequestRawPostBody("application/json",json_str)
            http.Send((res)=>{})
        }

        if(cmd == "mat"){
            const a = rubic_box.item_ruo_he_li_jin_gu_shi()
            const b = matrix.normf(a)
            DeepPrintTable(a) 
            print("矩阵大小",b)
        }

        if(cmd =="testboss"){
            GameRules.dota_spawn_cache.forEach(elm=>{
                UnloadSpawnGroupByHandle(elm)
            })
            GameRules.dota_spawn_cache = []
            Timers.CreateTimer(2,()=>{
                const spawn_id =  DOTA_SpawnMapAtPosition(`migong/boss/hai_di_boss`,Vector(0,0,0),false,null,null,undefined);
                GameRules.dota_spawn_cache.push(spawn_id)
            })
        }

        if(cmd == "nextlevel"){
            GameRules.world.dispatch(new GameRules.event.NextLevelEvent())
        }

        if(cmd == "testbuild"){

            // Timers.CreateTimer(()=>{
            //     const unit = CreateUnitByName("npc_dota_creep_badguys_melee",RandomVector(1000),true,null,null,DotaTeam.BADGUYS)
            //     unit.SetBaseMoveSpeed(400)
            //     unit.SetOriginalModel("models/creeps/lane_creeps/creep_bad_melee/creep_bad_melee_crystal.vmdl")
            //     unit.SetModel("models/creeps/lane_creeps/creep_bad_melee/creep_bad_melee_crystal.vmdl")
            //     unit.SetBaseMaxHealth(1000)
            //     unit.MoveToTargetToAttack(hero)
            //     return 5
            // })
        }
        if(cmd == "testdelete"){
            cache.forEach(elm=>{
                print("删除了所有")
                elm.RemoveSelf()
            })
            cache.clear()
        }
        if(cmd == "a"){
            //@ts-ignore
            print(ModifierFunction['ON_ATTACKED'])
        }
        if(cmd == "log"){
        
        }
        if(cmd == "staticbuild"){
            // const a = new generator_mark_build()
            // a.create_with_static_table("qing_xue_cheng",cache)
            // a.create_npc_with_static("qing_xue_cheng")
        }
        if(cmd == "npcjson"){
            const a = []
            Entities.FindAllByName("modules_npc*").forEach(elm=>{
                a.push({name:elm.GetName(),model:elm.GetModelName(),angles:{x:elm.GetAngles().x,y:elm.GetAngles().y,z:elm.GetAngles().z},origin:{x:elm.GetAbsOrigin().x,y:elm.GetAbsOrigin().y,z:elm.GetAbsOrigin().z}})
            })
            const json_str = JSON.encode(a)
            // print(json_str)
            const http = CreateHTTPRequest("POST","http://localhost:3123/")
            http.SetHTTPRequestRawPostBody("application/json",json_str)
            http.Send((res)=>{})
        }
        if(cmd == "createnpc"){
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            const forward = hero.GetAngles()
            const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
                name:"modules_npc_" + args[1],
                origin:`${hero.GetOrigin().x} ${hero.GetOrigin().y} ${hero.GetOrigin().z}`,
                angles:`${forward.x} ${forward.y} ${forward.z}`,
                scales : `${1} ${1} ${1}`,
                model :args[0],
                lightmapstatic:"1",
                renderfx:"kRenderFxPulseFast",
                solid:"0",
                DefaultAnim:"ACT_DOTA_IDLE"
            }) as CDOTA_BaseNPC_Hero

            prop_dynamic.SetEntityName("modules_npc_" + args[1])
        }
        if(cmd == "local"){
            let csv = ""
            const a = Object.values(FN).map((elm:any)=>{
                if(typeof elm != 'function'){
                    if(elm.标识 && elm.test){
                        const line1 = `${elm.标识}_name,english,${elm.名字},\n`
                        const line2 = `${elm.标识}_description,english,${elm.test},\n`
                        csv += line1;
                        csv += line2;
                     }
                }
            })
            print(csv)
        }
        if(cmd == "rule"){
            print("操")
            const hero = PlayerResource.GetPlayer(keys.playerid).GetAssignedHero()
            CreateRune(hero.GetAbsOrigin(),RuneType.XP)

        }
        if(cmd == "ability"){
            const kv = LoadKeyValues("scripts/npc/npc_heroes.txt")
            Object.entries(kv).forEach(([hero_name,val])=>{
                if(typeof val == "object"){
                    let a = hero_name
                    for(let i = 1 ; i < 16 ; i ++){
                        a += "," + val['Ability' + i]
                    }
                    a += "\n"
                    print(a)
                }

            })
        }
        if(cmd == "http"){
            print("触发这个")
            const path = args[0];
            const http = CreateHTTPRequestScriptVM("POST","https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-dxtin/endpoint/data/v1/test")
        
            http.SetHTTPRequestRawPostBody("application/json",JSON.encode({
                    "dataSource": "mongodb-atlas",
                    "database": "dota-test",
                    "collection": "user",
                    "document": {

                            "_id": "645404f4ee8583002fc5a77e",
                            "steam_id":"asdasdsadjkljlk123l21",
                
                    }
                }))
            http.SetHTTPRequestHeaderValue("Content-Type","application/ejson")
            http.SetHTTPRequestHeaderValue("apiKey","HIZH7rzmt2JBpVNIqY9jyJ87t7yytJT1UWxcWM4znErbAGXjtRlDoddiqamvASYz")
            // http.SetHTTPRequestHeaderValue("api-Key","HIZH7rzmt2JBpVNIqY9jyJ87t7yytJT1UWxcWM4znErbAGXjtRlDoddiqamvASYz")
            // http.SetHTTPRequestHeaderValue("Content-Type","application/json")
            http.SetHTTPRequestHeaderValue("Accept","application/json")
            http.Send((res)=>{
                DeepPrintTable(res)
            })

       
            
        }
    }
}
