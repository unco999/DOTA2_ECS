import { Behaviortree } from "../Behaviortree";
import { BtNode, Result } from "../BtNode";
import { CustomIcondition } from "../CustomIcondition";
import { Selector } from "../Selector";
import { Sequence } from "../Sequence";
import { WeightSelector } from "../WeightSelector";
import { WeightSquence } from "../WeightSquence";

export namespace BaseBehaviortree{

    export class BaseMove extends BtNode{
        constructor(t:Behaviortree){
            super(t,"BaseMove")
        }
        
        public Evaluate(): Promise<Result> {
            return new Promise((res,rej)=>{
                let time = 0
                const _m = this.behaviorTree.m_npc
                const target_point = _m.GetOrigin().__add(RandomVector(RandomInt(-300,300)))
                this.behaviorTree.m_npc.SetCustomHealthLabel("开始四处游走",255,255,255)
                _m.MoveToPosition(target_point)
                GameRules.enquence_delay_call(()=>{
                    time += 333
                    if(target_point.__sub(_m.GetAbsOrigin()).Length2D() < 50){
                        res(Result.成功)
                        return
                    }
                    if(time > 3333){
                        res(Result.失败)
                        return
                    }
                    return "update"
                },undefined,333)
            })
        }
    }

    export class MoveToAggroMaxTarget extends BtNode{
        constructor(t:Behaviortree){
            super(t,"BaseMove")
        }
        
        public Evaluate(): Promise<Result> {
            return new Promise((res,rej)=>{
                this.behaviorTree.m_npc.SetCustomHealthLabel("开始移动到仇恨最高的单位",255,255,255)
                let time = 0
                const dota_ent = this.behaviorTree.m_npc
                const m_ecs_ent = this.behaviorTree.m_npc.Entity
                const aggro_comp  =m_ecs_ent.get(c.dungeon.AggroComp)
                const target_point = EntIndexToHScript(aggro_comp.data[0].target_entity_index).GetAbsOrigin()
                dota_ent.MoveToPosition(target_point)

                GameRules.enquence_delay_call(()=>{
                    time += 333
                    if(target_point.__sub(dota_ent.GetAbsOrigin()).Length2D() < dota_ent.GetBaseAttackRange()){
                        res(Result.成功)
                        return
                    }
                    if(time > 3333){
                        res(Result.失败)
                        return
                    }
                    return "update"
                },undefined,333)
            })
        }
    }
    

        /**移动到仇恨值最高玩家的位置 */
        export class AttackAggroMaxTarget extends BtNode{
            constructor(t:Behaviortree){
                super(t,"BaseMove")
            }
            
            public Evaluate(): Promise<Result> {
                return new Promise((res,rej)=>{
                 this.behaviorTree.m_npc.SetCustomHealthLabel("开始攻击仇恨最高的单位",255,255,255)

                    let time = 0
                    const dota_ent = this.behaviorTree.m_npc
                    const m_ecs_ent = this.behaviorTree.m_npc.Entity
                    const aggro_comp  =m_ecs_ent.get(c.dungeon.AggroComp)
                    
                    const target_point = 
                    aggro_comp.data[0]?.target_entity_index ?
                    EntIndexToHScript(aggro_comp.data[0].target_entity_index) as CDOTA_BaseNPC
                    : FindUnitsInRadius(DotaTeam.BADGUYS,this.behaviorTree.m_npc.GetOrigin(),null,10000,UnitTargetTeam.ENEMY,UnitTargetType.HERO,UnitTargetFlags.NONE,FindOrder.ANY,false).pop()
                    
                    if(target_point == null){
                        res(Result.失败)
                    }
                    
                    dota_ent.MoveToTargetToAttack(target_point)
                    

                    GameRules.enquence_delay_call(()=>{
                        time += 100
                        if(!dota_ent.IsAttacking()){
                            res(Result.成功)
                            return 
                        }
                        if(time > 1000){
                            res(Result.失败)
                        }
                        return "update"
                    },undefined,100)
                })
            }
        }
}

export namespace BuildBaseBehaviortree{

    export function buildAllbase(t:Behaviortree){
        const sequence = new Selector(t,"base_behaviortree")
        const node1 = buildBaseMove(t)
        node1.condition = new CustomIcondition(()=>{
            return RollPercentage(5)
        })
        const node2 = MoveToAggroMaxTarget(t)
        node2.condition = new CustomIcondition(()=>{
            return RollPercentage(5)
        })
        const node3 = AttackAggroMaxTarget(t)
        sequence.addChild(node1,node2,node3)
        return sequence
    }

    export function buildBaseMove(t:Behaviortree){
        return new BaseBehaviortree.BaseMove(t)
    }

    export function MoveToAggroMaxTarget(t:Behaviortree){
        return new BaseBehaviortree.MoveToAggroMaxTarget(t)
    }
    export function AttackAggroMaxTarget(t:Behaviortree){
        return new BaseBehaviortree.AttackAggroMaxTarget(t)
    }

}