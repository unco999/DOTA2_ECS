import { RemoveParticleCallBack, rolltable, rollweight } from "../../../fp";
import { matchObject } from "../../../funcional";
import { BaseAbility, registerAbility } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerAbility()
export class jian_shu_hao_jiao_ability extends BaseAbility{



    OnSpellStart(): boolean {
        return matchObject("开始执行尖啸吼叫的ability",this,[
            {
                test:"判断服务器与血量高于8 并执行",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() > 8,
                then:(buff)=>{
                    ApplyDamage({
                        "ability":buff,
                        "attacker":buff.GetCaster(),
                        "damage":buff.GetCaster().GetMaxHealth() * 0.08,
                        "damage_type":DamageTypes.PURE,
                        "victim":buff.GetCaster()
                    })

                    const id = ParticleManager.CreateParticle("particles/kuangzhanshi/beastmaster_primal_roar_2.vpcf",ParticleAttachment.WORLDORIGIN,buff.GetCaster())
                    ParticleManager.SetParticleControl(id,0,buff.GetCaster().GetAbsOrigin())
                    ParticleManager.SetParticleControl(id,1,buff.GetCaster().GetAbsOrigin())
                    GameRules.enquence_delay_call(()=>{
                        RemoveParticleCallBack(id,true)
                    },undefined,500)

                    let findunit = FindUnitsInRadius(buff.GetCaster().GetTeamNumber(),buff.GetCaster().GetAbsOrigin(),null,1000,UnitTargetTeam.ENEMY,UnitTargetType.HERO | UnitTargetType.CREEP,UnitTargetFlags.NONE,FindOrder.ANY,false)
                    
                    findunit.forEach(target=>{
                        target.AddNewModifier(buff.GetCaster(),buff,"tui_modifier",{duration:0.75})
                        rollweight([
                            {weight:2,aciton:()=>{
                                target.AddNewModifier(buff.GetCaster(),buff,"modifier_stunned",{duration:3})
                            }},
                            {weight:2,aciton:()=>{
                                target.AddNewModifier(buff.GetCaster(),buff,"modifier_disarmed",{duration:3})
                            }},
                            {weight:1,aciton:()=>{
                                target.StartGestureWithPlaybackRate(GameActivity.DOTA_DIE,3)
                                GameRules.enquence_delay_call(()=>{
                                    target.AddNewModifier(buff.GetCaster(),null,"dao_di_modifier",{duration:4})
                                },undefined,200)

                            }}                          
                        ])

                    })

                    return true
                }
                
            },
            {
                test:"判断服务器与血量低于3 禁止施法",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() <= 8,
                then:(buff)=>{return false}
            }
        ])
    }

    GetCastAnimation(): GameActivity {
        return GameActivity.DOTA_CAST_ABILITY_1
    }

    GetCastPoint(): number {
        return 0.75
    }
    
}