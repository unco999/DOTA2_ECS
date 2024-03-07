import { CreateUpDown, FindNullTagInfoTarget, InfoTargetTagEvery, NearbyObstacles, PickArrayNumString2D, RemoveParticleCallBack, SetObstacles, TriggerBigWolrdTile, create_city_road_wfc, ecsGetKV, entity_distance, has, has_mask, interval } from "../../fp";
import { findFarthestFivePoints, matchObject, pairElements } from "../../funcional";
import { Behaviortree } from "../../lib/Behavioraltree/Behaviortree";
import { BtNode } from "../../lib/Behavioraltree/BtNode";
import { CustomIcondition } from "../../lib/Behavioraltree/CustomIcondition";
import { ConditionSequence } from "../../lib/Behavioraltree/ICondition/ConditionSequence ";
import { Selector } from "../../lib/Behavioraltree/Selector";
import { BuildBaseBehaviortree } from "../../lib/Behavioraltree/base_behaviortree";
import { Entity } from "../../lib/ecs/Entity";
import { System } from "../../lib/ecs/System";
import { reloadable } from "../../utils/tstl-utils";
import { Config } from "../Config";
import { LevelCacheInfo, LevelInfo } from "../component/dungeon";



@reloadable
export class player_init_system extends System {

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.GameLoopEvent, (event) => {
            for (let i = 0; i < 24; i++) {
                const player = PlayerResource.GetPlayer(i as PlayerID)
                if (player) {
                    const hero = player.GetAssignedHero()
                    const player_ent = new Entity()
                    const hero_ent = new Entity()
                    const info_comp = new c.dungeon.PlayerInfoComp(
                        player.entindex(),
                        i,
                        player.GetAssignedHero().entindex(),
                        hero_ent.id,
                        PlayerResource.GetSteamAccountID(i as PlayerID),
                        ConnectionState.CONNECTED
                    )

                    const hero_comp = new c.dungeon.HeroInfoComp(
                        hero.GetUnitName(),
                        player_ent.id,
                        hero.entindex()
                    )

                    player_ent.add(info_comp)
                    hero_ent.add(hero_comp)

                    this.engine.addEntity(player_ent)
                    this.engine.addEntity(hero_ent)
                    print(`[ecs] 接收game_start事件 创建${i}号玩家的英雄与玩家ecs实体`)
                }
            }
        })
    }
}

//@ts-ignore 所有玩家读取信息完毕 做的处理
@reloadable
export class player_all_reload_system extends System {
    public onAddedToEngine(): void {
        let player_count = PlayerResource.GetPlayerCount()
        GameRules.enquence_delay_call(() => {
            if (player_count == 0) {
                print("[ecs] 初始化完毕 创建所有玩家实体 发送game_start事件")
                const root_ent = new Entity()
                const game_loop_state_comp = new c.dungeon.GameLoopStateComp(GameLoopState.game_start, GameLoopState.game_start)
                root_ent.add(game_loop_state_comp)
                this.engine.addEntity(root_ent)
                this.engine.dispatch(new GameRules.event.GameLoopEvent(GameLoopState.game_start))
                return
            }
            for (let i = 0; i < 24; i++) {
                const player = PlayerResource.GetPlayer(i as PlayerID)
                if (player && player.GetAssignedHero()?.IsRealHero()) {
                    player_count--
                }
            }
            return "update"
        }, undefined, 800)
    }
}

/**初始化引导系统 */
@reloadable
export class Initialize_boot_system extends System {

    /**创造总关卡实体 */
    create_level_ent_system() {

        /**初始化的关卡是-1开始 然后开始计算后+1 所以所有的位置要-1操作 */
        const over_all_level_Info_comp = new c.dungeon.overAlllevelInfo(
            undefined,
            null,
            [],
        )

        this.sharedConfig.add(over_all_level_Info_comp)

        this.engine.dispatch(new GameRules.event.NextLevelEvent())
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.GameLoopEvent, (ins) => {
            if (ins.event == GameLoopState.game_start) {
                this.create_level_ent_system()
            }
        })
    }
}

@reloadable
export class root_system extends System {
    public onAddedToEngine(): void {
        GameRules.world.addSystem(new Initialize_boot_system())
        GameRules.world.addSystem(new player_init_system())
        GameRules.world.addSystem(new player_all_reload_system())
    }
}


@reloadable
export class dungeon_level_system extends System {

    /**踩机关随机关卡 */
    step_on_the_mechanism() {
        print("开始创造机关关卡")
        const dungenon_ent = GameRules.QSet.cur_dungenon_cache.first
        const cur_dungenon_cache = dungenon_ent.get(c.dungeon.DunGenonCache)
        // const random_array = findFarthestFivePoints(
        //     cur_dungenon_cache.link_info_targets.filter(elm=>{
        //         return elm != cur_dungenon_cache.next && !cur_dungenon_cache.portal.every(s=>s == elm)
        //     }).map(elm=>elm.GetOrigin())
        // )
        const pick_array = table.random_some(cur_dungenon_cache.link_info_targets, 5)

        const sequence = table.shuffle([1, 2, 3, 4, 5])

        const step_opthe_macherismif = new c.dungeon.StepOntheMechanismif(
            [],
            false,
            GameRules.GetGameTime(),
            99999,
            sequence,
            sequence[0],
        )
        print("适合做机关的数组长度", pick_array.length)
        pick_array.forEach((elm, index) => {
            print(elm.GetAbsOrigin(), "创造了机关")

            const trigger_entix = CreateUpDown(elm.GetOrigin(), () => {
                print(`踩到了${index}机关`)
                const model = EntIndexToHScript(trigger_entix) as CBaseModelEntity
                const sign = model.GetIntAttr("index")
                if (sign != step_opthe_macherismif.next_down_button) {
                    print("没有按顺序踩踏机关")
                    TriggerBigWolrdTile("没有按顺序开启机关,机关全部弹起来了!!!", [0, 0, 0])
                    step_opthe_macherismif.organ.forEach(elm => {
                        const _model = EntIndexToHScript(elm) as CDOTA_BaseNPC_Hero
                        _model.SetSequence("ancient_trigger001_up")
                        GameRules.enquence_delay_call(() => {
                            _model.SetSequence("ancient_trigger001_idle")
                        }, undefined, 800)
                    })
                    return
                }
                step_opthe_macherismif.next_down_button++

            }, ["index", step_opthe_macherismif.sequence[index]]).entindex()

            step_opthe_macherismif.organ.push(trigger_entix)
        })

    }

    level = [
        this.step_on_the_mechanism,
    ]

    public onAddedToEngine(): void {
        GameRules.QSet.cur_dungenon_cache.onEntityAdded.connect(snap => {
            const pick_call = table.random(this.level)
            pick_call()
        })
    }
}



/**
 * 渲染普通关卡
 */
@reloadable
export class default_level_system extends System {
    /**创造传送点 */
    create_portal(origin: Vector, target: Vector,level_ent:Entity) {
        const id = ParticleManager.CreateParticle(
            "particles/econ/items/underlord/underlord_2021_immortal/underlord_2021_immortal_portal_crimson.vpcf",
            ParticleAttachment.WORLDORIGIN,
            null
        )
        ParticleManager.SetParticleControl(id, 0, origin)
        DebugDrawLine(origin, target, 0, 255, 255, true, 999)
        DebugDrawText(origin, "传送点", true, 999)
        const volume_name = DoUniqueString("volume")
        const trigger = SpawnEntityFromTableSynchronous("trigger_dota", {
            targetname: volume_name,
            origin: origin,
            angles: "0 0 0",
            scales: `1 1 1`,
            model: GameRules.trigger_base.GetModelName(),
            every_unit: true,
        }) as CBaseTrigger
        trigger.RedirectOutput('OnTrigger', 'startTouchHandler', trigger)
        trigger.Enable()
        trigger['startTouchHandler'] = (event: any) => {
            const hero = event.activator as CDOTA_BaseNPC_Hero
            if (target) {
                hero.SetOrigin(target)
            }
        }
        return {particleids:id,trigger}
    }



    /**
     * 创造出口
     */
    create_output(origin: Vector,level_ent:Entity) {
        const volume_name = DoUniqueString("volume")

        const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic", {
            targetname: "temp",
            origin: `${origin.x} ${origin.y} ${origin.z}`,
            angles: `0 ${RandomInt(0, 360)} 0`,
            scales: `${1} ${1} ${1}`,
            DefaultAnim: "ACT_DOTA_IDLE",
            model: "models/props_gameplay/team_portal/team_portal.vmdl",
        }) as CBaseAnimatingActivity

        const trigger = SpawnEntityFromTableSynchronous("trigger_dota", {
            targetname: volume_name,
            origin: origin,
            angles: "0 0 0",
            scales: `1 1 1`,
            model: GameRules.trigger_base.GetModelName(),
            every_unit: true,
        }) as CBaseTrigger
        trigger.RedirectOutput('OnTrigger', 'startTouchHandler', trigger)
        trigger.Enable()
        trigger['startTouchHandler'] = (event: any) => {
            const alllevel = this.sharedConfig.get(c.dungeon.overAlllevelInfo)
            const cur_level = alllevel.cur_level_level_ecs_entity
            const check_comp = cur_level.get(c.dungeon.LevelBehaivorCheck)
            const hero = event.activator as CDOTA_BaseNPC_Hero

            if(!hero.IsRealHero()){
                return;
            }

            if(check_comp.cur < check_comp.check_max){
                CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(hero.GetPlayerID()), "OkPanel", {
                    title: `还差${check_comp.check_max - check_comp.cur}个机关没有开启无法进入下一层`,
                    uuid: DoUniqueString("random"),
                    type: "in_mark_system",
                    data: { mark_name: event.mark_name },
                })
                return
            }
            ParticleManager.CreateParticle("particles/econ/events/killbanners/screen_killbanner_compendium14_rampage_shake.vpcf",ParticleAttachment.MAIN_VIEW,null)
            const pid = ParticleManager.CreateParticle("particles/econ/items/earthshaker/deep_magma/deep_magma_10th/deep_magma_10th_echoslam_start.vpcf",ParticleAttachment.WORLDORIGIN,null)
            prop_dynamic.SetSequence("team_portal_channel_big")
            const uid = DoUniqueString("random")
            CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(hero.GetPlayerID()), "OkPanel", {
                title: `是否进入${event.mark_name}?`,
                uuid: uid,
                type: "in_mark_system",
                data: { mark_name: event.mark_name },
            })
            const id = CustomGameEventManager.RegisterListener(uid,(_,event)=>{
                if(event.click == "ok"){
                    GameRules.enquence_delay_call(()=>{
                        ParticleManager.DestroyParticle(pid,true)
                        ParticleManager.ReleaseParticleIndex(pid)
                        prop_dynamic.RemoveSelf()
                        GameRules.world.dispatch(new GameRules.event.NextLevelEvent())
                    },undefined,1)
                }
                CustomGameEventManager.UnregisterListener(id)
            })

        }
        const cache = level_ent.get(c.dungeon.LevelCacheInfo)
        cache.dota_enties.push(prop_dynamic)
        cache.dota_enties.push(trigger)
        return {particleids:-1,trigger}
    }

    /**创造装饰物 */
    create_ornament(origin: Vector,level_ent:Entity) {
        const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic", {
            targetname: "temp",
            origin: `${origin.x} ${origin.y} ${origin.z - 200}`,
            angles: `0 ${RandomInt(0, 360)} 0`,
            scales: `${5} ${5} ${5}`,
            DefaultAnim: "ACT_DOTA_IDLE",
            model: "models/architecture/crypt/crypt_statue_01.vmdl",
        }) as CBaseEntity
        const id = ParticleManager.CreateParticle("particles/map_cloud.vpcf", ParticleAttachment.WORLDORIGIN, null)
        ParticleManager.SetParticleControl(id, 0, prop_dynamic.GetAbsOrigin())

        const cache = level_ent.get(c.dungeon.LevelCacheInfo)
        cache.statues.push(prop_dynamic)
        return prop_dynamic
    }



    async render(level_ent: Entity) {
        /**首先拿到当前level_ent的地下城信息 */
        try{

        const info = level_ent.get(c.dungeon.LevelInfo)
        const info_obj = info.dungeon_info[1]

        const cache = level_ent.get(c.dungeon.LevelCacheInfo)

        /**这个地方应该刷新客户端lodingui */
        math.randomseed(RandomInt(0,65535))
        const data = await create_city_road_wfc(info_obj.json, info_obj.width, info_obj.height)
        let count = 0
        for (let y = 0; y < info_obj.height; y++) {
            for (let x = 0; x < info_obj.width; x++) {
                let vmap_name = data[count] as string;
                count++
                if(vmap_name == "crass_0"){
                    continue;
                }
                const spawn_id = DOTA_SpawnMapAtPosition(`${info_obj.prevmap}${vmap_name.replace("crass", info_obj.prename)}`, Vector(x * 2048, -y * 2048, 0), false, null, null, undefined);
                cache.vmap_cache.push(spawn_id)
            }
        }

        await interval(3)


        const all_connect = Entities.FindAllByName("connect")


        let out_info_target = undefined;
        let step = 0
        while(!out_info_target){
            step++
            const pick = table.random(all_connect)
            const iff = Entities.FindAllByClassnameWithin("info_target",pick.GetAbsOrigin(),3000).every(elm=>InfoTargetTagEvery(elm,INFO_TARGET_TAG.organ,INFO_TARGET_TAG.portal,INFO_TARGET_TAG.not_connect))
            if(iff){
                print("[ecs] 添加了传送下层机关")
                out_info_target = pick
                pick.SetIntAttr(INFO_TARGET_TAG.portal,1)
            }
            if(step >999){
                print(['[ecs] 当前传送下层机关创建失败'])
            }
        }

        const not_connect_list: CBaseEntity[] = []
        all_connect.forEach(conecnt_ent => {
            const conenct_find = Entities.FindAllByNameWithin("connect", conecnt_ent.GetAbsOrigin(), 500).filter(elm => elm != conecnt_ent).pop()
            matchObject("检查当前地下城接口点是否可连接", conenct_find, [
                {
                    test: "当前点寻找有2个实体 我们先渲染测试代码",
                    when: (elm) => elm?.GetName() == "connect",
                    then: (elm) => {
                        DebugDrawText(elm.GetAbsOrigin(), "当前是正常连接点", true, 9999)
                    }
                },
                {
                    test: "当前点是无连接点 我们先渲染测试代码",
                    when: (elm) => elm == undefined,
                    then: (elm) => {
                        DebugDrawText(conecnt_ent.GetAbsOrigin(), "无连接点", true, 9999)
                        not_connect_list.push(conecnt_ent)
                        conecnt_ent.SetIntAttr(INFO_TARGET_TAG.not_connect,1)
                    }
                }
            ])

        })

        const dungenon_info = level_ent.get(c.dungeon.LevelInfo)


        const input = table.random(not_connect_list)
        not_connect_list.forEach(elm=>{
            elm.SetIntAttr(INFO_TARGET_TAG.portal,1)
        })
        dungenon_info.entry_point = input.GetAbsOrigin()


        const ent_links = not_connect_list.map(elm=>{
            if(elm.GetIntAttr("is_portal_connect") == 0){
                const elm2 = not_connect_list.find(far=> far.GetIntAttr("is_portal_connect") == 0
                && !GridNav.CanFindPath(elm.GetOrigin(),far.GetOrigin()))
                if(elm2){
                    elm.SetIntAttr("is_portal_connect",1)
                    elm2.SetIntAttr("is_portal_connect",1)
                }
                return [elm,elm2]
            }
            return []
        }) as [CBaseEntity,CBaseEntity][]

        // const ent_links = pairElements(not_connect_list) as [CBaseEntity, CBaseEntity][]
        print("[ecs] 可连接数量未",ent_links.length)
        ent_links.forEach((elm) => {
            if(elm[0] && elm[1]){
                const portal1 = this.create_portal(elm[0].GetAbsOrigin(), elm[1].GetAbsOrigin(),level_ent)
                const portal2 = this.create_portal(elm[1].GetAbsOrigin(), elm[0].GetAbsOrigin(),level_ent)
                cache.portal.push({ParticleIDs:portal1.particleids,trigger:portal1.trigger})
                cache.portal.push({ParticleIDs:portal2.particleids,trigger:portal2.trigger})
            }
        })

        const all_statue = Entities.FindAllByName("statue")
        print("all_statue.length", all_statue.length)
        // const all_statue_vec = all_statue.map(elm=>elm.GetOrigin())
        const pick_statue_info: CBaseEntity[] = []

        //找到所有的装饰info_target
        while (pick_statue_info.length != 40) {
            const pick_ent_orn = table.random(all_statue)
            if (!NearbyObstacles(pick_ent_orn.GetAbsOrigin(), 400)) {
                SetObstacles(pick_ent_orn)
                const val = this.create_ornament(pick_ent_orn.GetAbsOrigin(),level_ent)

                pick_statue_info.push(pick_ent_orn)
                
            }
        }

        this.create_output(out_info_target.GetOrigin(),level_ent)

        cache.all_info_target = all_connect
        cache.no_link_info_target = not_connect_list
        cache.statue_info_target = all_statue
        cache.out_put_info_target.push(out_info_target)}
        catch(err){
            print(err)
        }

        return { level_type: LevelType.default }
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent, (event) => {
            if (event.level_state != LevelState.clear_ok || event.level_type != LevelType.default) return
            this.render(event.level_ecs_ent).then(elm=>{
                this.engine.dispatch(new GameRules.event.LevelEvent(
                    LevelState.render_ok,
                    LevelType.default,
                    event.level_ecs_ent
                ))
            })
        })
    }
}

/**
 * 卡尔商店系统
 */
@reloadable
export class shop_level_system extends System {

    /**渲染卡尔商店 */
    async render(level_ent: Entity) {
        /**这个地方应该刷新客户端lodingui */
        const cache = level_ent.get(c.dungeon.LevelCacheInfo)
        const spawn_id = DOTA_SpawnMapAtPosition(`shop_level`, Vector(-10240, -12800, 0), false, null, null, undefined);
        const id = ParticleManager.CreateParticle("particles/shop_level_effect.vpcf", ParticleAttachment.WORLDORIGIN, null)
        ParticleManager.SetParticleControl(id, 1, Vector(-10240, -12800, 0))

        /**添加缓存 */
        cache.vmap_cache.push(spawn_id)
        cache.particle_ids.push(id)
        await interval(2)


        return { spawn_id, level_type: LevelType.shop }
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent, (event) => {
            if (event.level_type != LevelType.shop || event.level_state != LevelState.clear_ok) return;
            this.render(event.level_ecs_ent).then(handle => {
                //发送渲染完毕事件
                print("[ecs] 渲染卡尔商店完毕 发送LevelState.render_ok")
                this.engine.dispatch(new GameRules.event.LevelEvent(LevelState.render_ok, LevelType.shop, event.level_ecs_ent))
            })
        })
    }
}

@reloadable
export class remove_level_cache_system extends System {

    clear_back_cache(cache: LevelCacheInfo) {
        cache?.dota_enties.forEach(elm => {
            if(elm && IsValidEntity(elm)){
                UTIL_RemoveImmediate(elm)
            }
        })
        cache.portal.forEach(elm=>{
            ParticleManager.DestroyParticle(elm.ParticleIDs,true)
            ParticleManager.ReleaseParticleIndex(elm.ParticleIDs)
            elm.trigger.Destroy()
        })
        cache.statues.forEach(elm=>{
            if(elm){
                UTIL_RemoveImmediate(elm)
            }
        })
        cache?.particle_ids.forEach(elm=>{
            ParticleManager.DestroyParticle(elm,true)
            ParticleManager.ReleaseParticleIndex(elm)
        })
        cache?.unit.forEach(elm=>{
            UTIL_RemoveImmediate(elm)
            // elm.SetOrigin(Vector(32768,32768,-200))
        })
        cache?.vmap_cache.forEach(elm => {
            if(elm != null){
                print(`[ecs] 准备删除${elm} 号地形`)
                UnloadSpawnGroupByHandle(elm)
                print(`[ecs]准备删除${elm} 号地形 成功`)
            }
        })
        collectgarbage("collect")
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent, (event) => {
            if (event.level_state != LevelState.info_ok) return
            print("[ecs] 开始清除缓存")
            const all_level = this.sharedConfig.get(c.dungeon.overAlllevelInfo)

            const back_level = all_level.history[all_level.history.length - 1]
        
            print("[ecs] 上一个缓存关卡的id",back_level?.id)
            if(back_level == null) {
                this.engine.dispatch(new GameRules.event.LevelEvent(
                    LevelState.clear_ok,
                    event.level_type,
                    event.level_ecs_ent
                ))
                return;
            }
            
            const cache = back_level?.get(c.dungeon.LevelCacheInfo)
            print(`[ecs] 上个关卡的名字是${cache?.name}`)
            
            assert(cache,`[ecs] 上一个缓存不存在 但是组件存在 出现问题`)
            this.clear_back_cache(cache)

           GameRules.enquence_delay_call(()=>{
            print(`[ecs] 清除上个地图缓存成功 发送clear_ok事件`)
            this.engine.dispatch(new GameRules.event.LevelEvent(
                LevelState.clear_ok,
                event.level_type,
                event.level_ecs_ent
            ))
            },undefined,2000)
        })
    }
}



/**
 * 关卡抉择 监听NextLevelEvent事件 首先对info做处理
 */
@reloadable
export class level_strategy_system extends System {

    /**挑选其中一个关卡过关条件 */
    random_pick_level_behaivor(){
        return RandomInt(0,LEVEL_BEHAIVOR_MAX.max)
    }


    /**挑选普通关卡 */
    pick_default_cur_level_object() {
        return table.random(Object.entries(Config.default_level))
    }

    /**
     * 挑选boss关卡
     */
    pick_boss_cur_level_object(){
        return table.random(Object.entries(Config.boss_level))
    }

    /**必须创造缓存实例 以便进行清理 */
    default_create_cache_comp(level_ent: Entity,name:string) {
        const cache = new c.dungeon.LevelCacheInfo(name,[], [], [], [], [],[],[],[],[],[])
        level_ent.add(cache)
        return cache
    }

    /**创造卡尔商店关卡实例 */
    create_shop_level_ent() {
        const cur_shop_level_ent = new Entity()
        this.default_create_cache_comp(cur_shop_level_ent,"卡尔商店")
        const shop_level_comp = new c.dungeon.ShopLevelInfo(this.sharedConfig.get(c.dungeon.overAlllevelInfo).curlevelStack,Vector())
        cur_shop_level_ent.add(shop_level_comp)
        
        this.engine.addEntity(cur_shop_level_ent)
        return cur_shop_level_ent
    }

    /**创造普通关卡实例 */
    create_defualt_cur_level_ent() {
        const cur_level_ent = new Entity()
        const pick_object = this.pick_default_cur_level_object()
        this.default_create_cache_comp(cur_level_ent,pick_object[0])
        const level_info = new c.dungeon.LevelInfo(
            [pick_object[0], pick_object[1]],
            Vector(),
            this.random_pick_level_behaivor()
        )
        cur_level_ent.add(level_info)
        this.engine.addEntity(cur_level_ent)
        return cur_level_ent
    }

    /**创造boss战斗的实例关卡信息 */
    create_boss_level_ent() {
        const cur_level_ent = new Entity()
        const pick_object = this.pick_boss_cur_level_object()
        this.default_create_cache_comp(cur_level_ent,pick_object[0])
        const level_info = new c.dungeon.LevelInfo(
            [pick_object[0], pick_object[1]],
            Vector(),
            this.random_pick_level_behaivor()
        )
        cur_level_ent.add(level_info)
        this.engine.addEntity(cur_level_ent)
        return cur_level_ent
    }

    strategy() {
        //这里先对关卡进行+1
        const over_all_level_info = this.sharedConfig.get(c.dungeon.overAlllevelInfo)


        assert(over_all_level_info,"c.dungeon.overAlllevelInfo is null")

        if(over_all_level_info.curlevelStack == undefined){
            over_all_level_info.curlevelStack = 0
        }else{
            over_all_level_info.history.push(over_all_level_info.cur_level_level_ecs_entity)
            over_all_level_info.curlevelStack++;
        }


        matchObject("进入关卡抉择 level_strategy_system系统", over_all_level_info, [
            {
                test: "如果是关卡是-1 代表是初始化 开始进入卡尔商店",
                when: (elm) => elm.curlevelStack == 0,
                then: (elm) => {
                    /**提前把关卡设置为0 必须先设置 */
                    const cur_level_ent = this.create_shop_level_ent()
                    over_all_level_info.cur_level_level_ecs_entity = cur_level_ent
                    this.engine.dispatch(new GameRules.event.LevelEvent(LevelState.info_ok, LevelType.shop, cur_level_ent))
                }
            },
            {
                test: "如果是关卡余5=0 进入卡尔商店",
                when: (elm) => elm.curlevelStack % 5 == 0,
                then: (elm) => {
                    const cur_level_ent = this.create_shop_level_ent()
                    over_all_level_info.cur_level_level_ecs_entity = cur_level_ent
                    this.engine.dispatch(new GameRules.event.LevelEvent(LevelState.info_ok, LevelType.shop, cur_level_ent))
                }
            },
            {
                test: "如果是关卡余5=0 进入boss战地图",
                when: (elm) => elm.curlevelStack % 3 == 0,
                then: (elm) => {
                    const cur_level_ent = this.create_boss_level_ent()
                    over_all_level_info.cur_level_level_ecs_entity = cur_level_ent
                    this.engine.dispatch(new GameRules.event.LevelEvent(LevelState.info_ok, LevelType.boss, cur_level_ent))
                }
            },
            {
                test: "如果是其他情况 进入普通的关卡地图",
                when: (elm) => true,
                then: (elm) => {
                    const cur_level_ent = this.create_defualt_cur_level_ent()
                    over_all_level_info.cur_level_level_ecs_entity = cur_level_ent
                    this.engine.dispatch(new GameRules.event.LevelEvent(LevelState.info_ok, LevelType.default, cur_level_ent))
                }
            },
        ])
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.NextLevelEvent, (event) => {
            this.strategy()
        })
    }
}


@reloadable
export class level_behaivor_spawn_system extends System{

    /**踩机关关卡 
     * 创造6个机关 需要全部踩到 踩完以后传送点会允许玩家进入下一层
     * 在此之前 踩下一次层传送点 提示没有响应
     * 机关的创造规则是 3000码内不能有2个机关
    */
    [LEVEL_BEHAIVOR.cai_ji_guan](level_ent:Entity){
        /**
         * 创造过关条件
         */
        const organ_count = 4
        const level_behaivor_check = new c.dungeon.LevelBehaivorCheck(LEVEL_BEHAIVOR.cai_ji_guan,0,organ_count)
        level_ent.add(level_behaivor_check)
        const player = GameRules.QSet.is_player_ent.first.get(c.dungeon.PlayerInfoComp)
        const hero = EntIndexToHScript(player.player_entity_index) as CDOTAPlayerController
        const cache = level_ent.get(c.dungeon.LevelCacheInfo)
        const all_targets = cache.all_info_target.filter(elm=> elm.GetIntAttr(INFO_TARGET_TAG.not_connect) == 0)
        let pick_targets:CBaseEntity[] = []
        let step = 0
        print(`[ecs] 开始随机创造机关 当前所有info${all_targets.length}`)
        while(pick_targets.length != organ_count || step > 999){
            step++
            const pick = table.random(all_targets)
            const iff = Entities.FindAllByClassnameWithin("info_target",pick.GetAbsOrigin(),3000).every(elm=>InfoTargetTagEvery(elm,INFO_TARGET_TAG.organ,INFO_TARGET_TAG.portal,INFO_TARGET_TAG.not_connect))
            if(pick.GetIntAttr(INFO_TARGET_TAG.organ) === 0 && iff){
                print("[ecs] 添加了机关进pick")
                pick_targets.push(pick)
                pick.SetIntAttr(INFO_TARGET_TAG.organ,1)
            }
            if(step >999){
                print(['[ecs] 当前创造机关失败'])
            }
        }
        pick_targets.forEach(elm=>{
            const origin = GetGroundPosition(elm.GetAbsOrigin().__add(RandomVector(RandomInt(-300,300))),hero.GetAssignedHero())
            print(`[ecs] 机关地点${origin}`)
            const trigger_model = CreateUpDown(origin,()=>{

                const model = trigger_model as CDOTA_BaseNPC

                if(trigger_model.GetIntAttr("is_down") == 1){
                    print(`[ecs] 这个机关已经踩过了`)
                    return;
                }
                print(`[ecs] 第一次踩这个机关`)

                trigger_model.SetIntAttr("is_down",1)

                model.SetSequence("ancient_trigger001_down")
                GameRules.enquence_delay_call(()=>{
                    model.SetSequence("ancient_trigger001_down_idle")
                },undefined,700)

                CustomGameEventManager.Send_ServerToAllClients("LargePopupBox",{tag_name:"传送门的光更亮了...",player_id:-1})

                level_behaivor_check.cur++
                if(level_behaivor_check.cur >= level_behaivor_check.check_max){
                    //过关成功
                   CustomGameEventManager.Send_ServerToAllClients("LargePopupBox",{tag_name:"传送门发生了震动,快去看看....",player_id:-1})
                }
            })
        })
    }
    /**击败迷宫所有怪物 */
    [LEVEL_BEHAIVOR.ji_bai_mi_gong_suo_you_guai_wu](level_ent:Entity){
        const level_info = level_ent.get(c.dungeon.LevelInfo)
        const level_behaivor_check = new c.dungeon.LevelBehaivorCheck(LEVEL_BEHAIVOR.ji_bai_mi_gong_suo_you_guai_wu,0,level_info.creep_count)
        level_ent.add(level_behaivor_check)
        ListenToGameEvent("entity_killed",(event)=>{
            const npc = EntIndexToHScript(event.entindex_killed)
            if(npc.GetIntAttr(CREEP_TAG.level_creep) == 1){
                level_behaivor_check.cur++
            }
        },null)
    }


    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent,(event)=>{
            if(event.level_state == LevelState.render_ok && event.level_type == LevelType.default){
                print(`[ecs] 触发了机关创造系统`)
                const comp = event.level_ecs_ent.get(c.dungeon.LevelInfo)
                assert(this[comp.level_behaivor],"[ecs] level_behaivor_spawn_system当前没有这个关卡");
                (this[comp.level_behaivor] as Function)(event.level_ecs_ent) 
            }
        })
    }
}

/**关卡出生点设定 */
@reloadable
export class level_entry_point_spawn_system extends System {

    in_shop(level_ent: Entity) {
        const level_comp = level_ent.get(c.dungeon.ShopLevelInfo)
        level_comp.entry_point = Vector(-10240, -12800, 0)
    }

    create_spawn_point(level_ent: Entity) {
        const level_comp = level_ent.get(c.dungeon.LevelInfo)
        const level_cache = level_ent.get(c.dungeon.LevelCacheInfo)
        const farthest_some = level_cache.no_link_info_target.sort(
            (a,b)=>
            a.GetOrigin().__sub(level_cache.out_put_info_target[0].GetAbsOrigin()).Length2D() -
            b.GetOrigin().__sub(level_cache.out_put_info_target[0].GetAbsOrigin()).Length2D()
        )
        level_comp.entry_point = farthest_some[farthest_some.length - 1].GetAbsOrigin()
    }

    in_boss(level_ent:Entity){
        const level_comp = level_ent.get(c.dungeon.LevelInfo)
        level_comp.entry_point = Vector(8192,8192,128)
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent, (event) => {
            if (event.level_state != LevelState.render_ok) return
            print(`[ecs] 创造关卡入口点成功 事件情况 ==>`)
            DeepPrintTable([event.level_state,event.level_type])
            if (event.level_type == LevelType.default) {
                this.create_spawn_point(event.level_ecs_ent)
                print("[ecs] 创造普通战斗关卡入口成功")
            }
            if (event.level_type == LevelType.shop) {
                try{
                    this.in_shop(event.level_ecs_ent)
                }catch(err){
                    print("[ecs] 创建错误",err)
                }
                print("[ecs] 创造卡尔商店入口成功")
            }
            if(event.level_type == LevelType.boss){
                this.in_boss(event.level_ecs_ent)
            }
            print(`[ecs] level_entry_point_spawn_system发送事件成功 ${event.level_type}`)
            this.engine.dispatch(new GameRules.event.LevelEvent(
                LevelState.map_ok,
                event.level_type,
                event.level_ecs_ent
            ))
        })
    }
}


/**
 * boss战斗关卡NPC初始化
 */
@reloadable
export class level_boss_npc_init_system extends System{

    public random_pick_boss(){
        return table.random(Config.boss_data)
    }

    public strategy(level_ent:Entity){
       const cache = level_ent.get(c.dungeon.LevelCacheInfo)

       const boss_data = this.random_pick_boss()
       const spawn_point = Entities.FindAllByName("boss_spawn_point").pop()

       assert(spawn_point,`[ecs] 没找到boss的出生点`)

       const unit = CreateUnitByName(boss_data.name,spawn_point.GetAbsOrigin(),true,null,null,DotaTeam.BADGUYS)

       const unit_ent = new Entity()
       
       const aggro_comp = new c.dungeon.AggroComp([])
       const boss_derivative = new c.dungeon.BossDerivative({},{})
       unit_ent.add(aggro_comp)
       unit_ent.add(boss_derivative)
       const raw_boss_data_comp = new c.dungeon.BossDataRaw(boss_data)
       unit_ent.add(raw_boss_data_comp)
       
       unit_ent.addTag(GameRules.tag.is_cur_booss)
       unit_ent.addTag(GameRules.tag.is_cur_creep)
       unit.Entity = unit_ent

       GameRules.damage_filter_register("boss_aggro",(event)=>{
            print('[ecs] 伤害过滤器开始了')
            if(event.entindex_victim_const == unit.entindex()){
                const target_data = aggro_comp.data.find(elm=>elm.target_entity_index == event.entindex_attacker_const)
                //已经存在仇恨记录
                if(target_data){
                    target_data.damage_count += event.damage
                    target_data.cur_aggro = target_data.damage_count * Config.aggro_scalar
                }else{
                    aggro_comp.data.push({
                        cur_aggro:0,
                        damage_count:event.damage,
                        target_ecs_entity_index:-1,
                        target_entity_index:event.entindex_attacker_const
                    })
                }
                aggro_comp.data.sort((a,b)=> b.cur_aggro - a.cur_aggro)
                const one_aggro = aggro_comp.data[0]
                const _m = EntIndexToHScript(event.entindex_victim_const) as CDOTA_BaseNPC
                print(`[ecs] 最高仇恨目标${one_aggro.target_entity_index} 伤害总量为${one_aggro.damage_count} 仇恨值为${one_aggro.cur_aggro}`)

                _m.SetCustomHealthLabel(`最高仇恨目标${one_aggro.target_entity_index} 伤害总量为${one_aggro.damage_count} 仇恨值为${one_aggro.cur_aggro}`,255,255,255)
            }
            return true
       })

       /**
        * boss机制设定
        */
       const behaviortree = new Behaviortree(unit)
       const root = new Selector(behaviortree,"root")
       boss_data.possibility_behavior_data.forEach(elm=>{
            print("[ecs] 添加了一个行为树行为组件")
            const node = elm.bt_node(behaviortree) as BtNode
            const ic = new ConditionSequence()
            ic.addChidren(new CustomIcondition(()=>{
                if(unit.GetHealthPercent() < 80){
                    root.removeChildren(node)
                    return true
                }
            }))
            node.condition = ic
            root.addChild(node)
            behaviortree.root = root
       })
       root.addChild(BuildBaseBehaviortree.buildAllbase(behaviortree))
       behaviortree.Start()

       cache.dota_enties.push(unit)
       unit.SetModelScale(2)
    }
    


    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent,(event)=>{
            if(event.level_state == LevelState.render_ok && event.level_type == LevelType.boss){
                this.strategy(event.level_ecs_ent)
            }
        })
    }
}

/**
 * boss战斗关卡场景加载
 */
@reloadable
export class level_boss_scene_init_system extends System{
    
    create_boss_map(level_ent){
        const cur_level_info = level_ent.get(c.dungeon.LevelInfo) as LevelInfo
        const cur_level_cache = level_ent.get(c.dungeon.LevelCacheInfo) as LevelCacheInfo
        print("刷的boss战斗信息",cur_level_cache)
        DeepPrintTable(cur_level_info)
        const spawn_id = DOTA_SpawnMapAtPosition(cur_level_info.dungeon_info[1].vmap_path, Vector(8192, 8192, 0), false, null, null, undefined);
        cur_level_cache.vmap_cache.push(spawn_id)
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent,(event)=>{
            if(event.level_type != LevelType.boss) return
            if(event.level_state == LevelState.info_ok){
                this.create_boss_map(event.level_ecs_ent)
                GameRules.enquence_delay_call(()=>{
                    this.engine.dispatch(new GameRules.event.LevelEvent(
                        LevelState.render_ok,
                        LevelType.boss,
                        event.level_ecs_ent
                    ))
                },undefined,2000)
            }
        })
    }
}

/**
 * 关卡玩家处理初始化  当关卡渲染完毕之后要做的事情
 */
@reloadable
export class level_hero_init_system extends System {

    entry_map(level_ent:Entity){
        GameRules.QSet.is_hero_ent.entities.forEach(hero_ent=>{
             /**如果这个组件是空证明是商店组件 */
            const level_ent_info = level_ent.get(c.dungeon.LevelInfo) ?? level_ent.get(c.dungeon.ShopLevelInfo)
            
            const hero = EntIndexToHScript(hero_ent.get(c.dungeon.HeroInfoComp).hero_dota_ent_id) as CDOTA_BaseNPC_Hero
            print(`[ecs] 移动${hero.GetUnitName()}到达 ${level_ent_info.entry_point}`)
            const last_origin = GetGroundPosition(level_ent_info.entry_point.__add(RandomVector(RandomInt(-300,300))),hero)
            hero.SetAbsOrigin(last_origin)
        })
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent,(event)=>{
            if(event.level_state != LevelState.map_ok) return
            print("[ecs] 触发了英雄关卡初始化事件")
            this.entry_map(event.level_ecs_ent)
        })
    }
}

@reloadable
export class level_spawn_creep extends System{

    public spawn_creep(level_ent:Entity){
        const cache = level_ent.get(c.dungeon.LevelCacheInfo)
        const level_info = level_ent.get(c.dungeon.LevelInfo)

        const spawn_points = cache.all_info_target.filter(elm=> elm.GetIntAttr(INFO_TARGET_TAG.not_connect) == 0)
        const creep_count = spawn_points.length

        level_info.creep_count = creep_count
        print(`[ecs] 怪物总数为`,creep_count,"info 数组为",cache.all_info_target.length)
        spawn_points.forEach(point=>{
            print(`[ecs] 开始创造怪物`)
             CreateUnitByNameAsync("npc_dota_creep_badguys_melee",Vector(0),true,null,null,DotaTeam.BADGUYS,(unit)=>{
                unit.SetBaseMoveSpeed(400)
                unit.SetOriginalModel("models/creeps/lane_creeps/creep_bad_melee/creep_bad_melee_crystal.vmdl")
                unit.SetModel("models/creeps/lane_creeps/creep_bad_melee/creep_bad_melee_crystal.vmdl")
                unit.SetBaseMaxHealth(1000)
                unit.SetModelScale(0.75)
                FindClearSpaceForUnit(unit,point.GetAbsOrigin(),true)
                cache.unit.push(unit)
                unit.SetIntAttr(CREEP_TAG.level_creep,1)
            })
        })
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.LevelEvent,(event)=>{
            print(`[ecs] level_spawn_creep 开始接收`)
            DeepPrintTable([event.level_state,event.level_type])
            if(event.level_state == LevelState.map_ok && event.level_type == LevelType.default){
                print(`[ecs] level_spawn_creep 开始接收成功`)
                this.spawn_creep(event.level_ecs_ent)
            }
        })
    }
}

/**
 * 关卡信息处理与抉择父系统 
 */
@reloadable
export class root_level_system extends System {
    public onAddedToEngine(): void {
        this.engine.addSystem(new level_strategy_system())
        this.engine.addSystem(new shop_level_system())
        this.engine.addSystem(new level_hero_init_system())
        this.engine.addSystem(new remove_level_cache_system())
        this.engine.addSystem(new default_level_system())
        this.engine.addSystem(new level_entry_point_spawn_system())
        this.engine.addSystem(new level_boss_scene_init_system())
        this.engine.addSystem(new level_boss_npc_init_system())
        this.engine.addSystem(new level_behaivor_spawn_system())
        this.engine.addSystem(new level_spawn_creep())
    }
}

@reloadable
export class card_op_system extends System{

    sort(event:InstanceType<typeof GameRules.event.CardEvent>){
        print(`[ecs] Card排序 开始`)
        let i = 1
        event.player_ent.iterate(c.dungeon.Card,(elm)=>{
            elm.index = i
            i++
            print(elm.uid,"被设置成",elm.index)
        })
    }
    
    drop(event:InstanceType<typeof GameRules.event.CardEvent>){
        print("[ecs] drop卡牌开始")

    }

    merge(event:InstanceType<typeof GameRules.event.CardEvent>){
        print("[ecs] 触发了卡牌合成")
        

    }

    play(event:InstanceType<typeof GameRules.event.CardEvent>){
        print("[ecs] 触发了卡牌效果")
    }


    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.CardEvent,(event)=>{
            if(has_mask(event.card_event,CardContainerBehavior.合成)){
                this.merge(event)
                this.sort(event)
                return
            }
            if(has_mask(event.card_event,CardContainerBehavior.丢弃)){
                this.drop(event)
                this.sort(event)
                return
            }
            if(has_mask(event.card_event,CardContainerBehavior.使用)){
                this.play(event)
                this.drop(event)
                this.sort(event)
                return
            }
            if(has_mask(event.card_event,CardContainerBehavior.添加牌)){
                this.sort(event)
                return
            }
        })
    }
}

/**
 * 关于卡牌组的基本事物 按照情况给当前堆栈排序
 */
@reloadable
export class card_event_register_system extends System{


    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_card_event",(_,event)=>{
            const PlayerID = event.PlayerID
            const p_ent = GameRules.QSet.is_player_ent.find(elm=>elm.get(c.dungeon.PlayerInfoComp).player_num == PlayerID)
            this.dispatch(new GameRules.event.CardEvent(
                event.container_behavior,
                p_ent,
                event.merge_data
            ))
        })
    }
}


@reloadable
export class card_root_system extends System{

    public onAddedToEngine(): void {
       this.engine.addSystem(new card_op_system())
       this.engine.addSystem(new card_event_register_system())
    }
}
