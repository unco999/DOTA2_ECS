import { entity_distance } from "../../../fp";
import { reloadable } from "../../../utils/tstl-utils";
import { Behaviortree } from "../Behaviortree"
import { BtNode, Result } from "../BtNode";

export namespace ECSSpecialBehavior{

    export class create_unit_with_radius extends BtNode{
         constructor(t:Behaviortree){
            super(t,"create_unit_with_radius")
         }

         Evaluate():Promise<Result>{
            return new Promise((res,rej)=>{
                this.behaviorTree.m_npc.SetCustomHealthLabel("开始在四周召唤单位",255,255,255)
                res(Result.成功)
            })
        }
    }

    @reloadable
    export class create_unit_with_boss_trigger extends BtNode{
        constructor(t:Behaviortree){
            super(t,"create_unit_with_radius")
        }

        find_boss_trigger(boss_trigger:CBaseEntity):Promise<Result>{
            return new Promise((res,rej)=>{
                const npc = this.behaviorTree.m_npc
                npc.Stop()
                GameRules.enquence_delay_call(()=>{
                    npc.MoveToPosition(boss_trigger.GetAbsOrigin())
                    if(entity_distance(npc,boss_trigger) < 200){
                        npc.Stop()
                        npc.FaceTowards(boss_trigger.GetAbsOrigin())
                        const id = ParticleManager.CreateParticle("particles/neutral_fx/satyr_hellcaller.vpcf",ParticleAttachment.CENTER_FOLLOW,npc)
                        ParticleManager.SetParticleControlEnt(id,0,npc,ParticleAttachment.CENTER_FOLLOW,"",Vector(0),true)
                        print("[btnode] 已经接近蛇蛋 开始召唤")
                        this.behaviorTree.m_npc.SetIntAttr(CREEP_TAG.damaged,0)
                        GameRules.damage_filter_register("boss_damage",(event)=>{
                            if(event.entindex_victim_const == this.behaviorTree.m_npc.entindex()){
                                const cur = this.behaviorTree.m_npc.GetIntAttr(CREEP_TAG.damaged )
                                this.behaviorTree.m_npc.SetIntAttr(CREEP_TAG.damaged,cur + event.damage)
                            }
                            return true
                        })
                        Timers.CreateTimer(5,()=>{
                            if(this.behaviorTree.m_npc.GetIntAttr(CREEP_TAG.damaged) > 100){
                                print("[btnode] 伤害达到 取消了蛇蛋")
                                this.behaviorTree.m_npc.SetIntAttr(CREEP_TAG.damaged,0) 
                                const npc_ent = npc.Entity
                                const dcomp = npc_ent.get(c.dungeon.BossDerivative)
                                const comp = npc_ent.get(c.dungeon.BossDataRaw)
                                const near_dan = Object.values(dcomp.prop).sort((a,b)=>a.GetOrigin().__sub(this.behaviorTree.m_npc.GetOrigin()).Length2D())[0]
                                near_dan.SetSequence(comp.BossData.derivative.deathsequence)
                                res(Result.失败)
                                return
                            }else{
                                print("[btnode] 伤害未达到 召唤了蛇蛋")
                                const npc_ent = npc.Entity
                                const comp = npc_ent.get(c.dungeon.BossDataRaw)
                                const dcomp = npc_ent.get(c.dungeon.BossDerivative)
                                npc.Stop()
                                npc.StartGesture(GameActivity.DOTA_CAST_ABILITY_1)
                                for(let i = 0 ; i < 3 ; i ++){
                                    CreateUnitByNameAsync("npc_dota_creep_badguys_melee",Vector(0),true,null,null,DotaTeam.BADGUYS,(unit)=>{
                                        const model = table.random(comp.BossData.minions)
                                        unit.SetBaseMoveSpeed(400)
                                        unit.SetOriginalModel(model)
                                        unit.SetModel(model)
                                        unit.SetBaseMaxHealth(1000)
                                        unit.SetModelScale(1.2)
                                        FindClearSpaceForUnit(unit,npc.GetAbsOrigin().__add(RandomVector(RandomInt(-200,200))),true)
                                        unit.SetIntAttr(CREEP_TAG.level_creep,1)
                                        dcomp.npc[unit.entindex()] = unit
                                    })
                                    
                                }
                                res(Result.成功)
                                GameRules.damage_filter_register("boss_damage",undefined,true)
                                const near_dan = Object.values(dcomp.prop).sort((a,b)=>a.GetOrigin().__sub(this.behaviorTree.m_npc.GetOrigin()).Length2D())[0]
                                near_dan.SetSequence(comp.BossData.derivative.deathsequence)
                                GameRules.enquence_delay_call(()=>{
                                    if(!Object.values(dcomp.npc).every((elm)=>IsValidEntity(elm) && elm.IsAlive())){
                                        return
                                    }
                                    for(let key in dcomp.npc){
                                        if(!(IsValidEntity(dcomp.npc[key]) && dcomp.npc[key].IsAlive())){continue;}
                                        const dota_ent = this.behaviorTree.m_npc
                                        const m_ecs_ent = this.behaviorTree.m_npc.Entity
                                        const aggro_comp  =m_ecs_ent.get(c.dungeon.AggroComp)
                                        
                                        const target = 
                                        aggro_comp.data[0]?.target_entity_index ?
                                        EntIndexToHScript(aggro_comp.data[0].target_entity_index) as CDOTA_BaseNPC
                                        : FindUnitsInRadius(DotaTeam.BADGUYS,this.behaviorTree.m_npc.GetOrigin(),null,10000,UnitTargetTeam.ENEMY,UnitTargetType.HERO,UnitTargetFlags.NONE,FindOrder.ANY,false).pop()
                                        
                                        dcomp.npc[key].MoveToTargetToAttack(target)
                                    }
                                },undefined,5000)
                                return
                            }
                        })
                            
                        return
                    }else{
                        return "update"
                    }
                },undefined,555)
            })
        }

        async Evaluate(){
            try{
            print(`[btnode] 开始执行生蛋操作`)
            const all_boss_trigger = Entities.FindAllByName("boss_trigger")
            const ecs_ent = this.behaviorTree.m_npc.Entity
            const comp = ecs_ent.get(c.dungeon.BossDataRaw)
            const dcomp = ecs_ent.get(c.dungeon.BossDerivative)
            this.behaviorTree.m_npc.SetIntAttr(CREEP_TAG.damaged,0)
            this.behaviorTree.m_npc.SetCustomHealthLabel("开始召唤群蛇",255,255,255)
            let i = 0;
            const all_level = GameRules.world.sharedConfig.get(c.dungeon.overAlllevelInfo)
            const ecs_entity = all_level.cur_level_level_ecs_entity
            const cache = ecs_entity.get(c.dungeon.LevelCacheInfo)
            for(const elm of all_boss_trigger){
                i++
                const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    targetname: "temp",
                    origin: `${elm.GetOrigin().x} ${elm.GetOrigin().y} ${elm.GetOrigin().z}`,
                    angles: `0 ${RandomInt(0, 360)} 0`,
                    scales: `${1} ${1} ${1}`,
                    DefaultAnim: "ACT_DOTA_IDLE",
                    model: comp.BossData.derivative.path,
                }) as CBaseAnimatingActivity
                const cache = ecs_entity.get(c.dungeon.LevelCacheInfo)
                dcomp.prop[i] = prop_dynamic
                cache.statues.push(prop_dynamic)
                prop_dynamic.SetSequence(comp.BossData.derivative.idlesequence)
                const {x,y,z} = comp.BossData.derivative.render_color
                prop_dynamic.SetRenderColor(x,y,z)
            }
            i = 0
            for await( const elm of all_boss_trigger){
                i++
                await this.find_boss_trigger(dcomp.prop[i])
            }
            return Result.成功
            
            }catch(err){
                print(`[btnode] error ${error}`)
            }
        }
    }
}

export namespace BuildECSSpecialBehavior{
    export function build_create_unit_with_radius(t:Behaviortree){
        return new ECSSpecialBehavior.create_unit_with_radius(t)
    }

    export function build_create_unit_with_boss_trigger(t:Behaviortree){
        return new ECSSpecialBehavior.create_unit_with_boss_trigger(t)
    }
}