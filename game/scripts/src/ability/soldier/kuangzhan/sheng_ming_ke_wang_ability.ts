import { matchObject } from "../../../funcional";
import { BaseAbility, registerAbility } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerAbility()
export class sheng_ming_ke_wang_ability extends BaseAbility{


    OnSpellStart(): boolean {
        return matchObject("开始执行生命渴望的modifier",this,[
            {
                test:"判断服务器与血量高于4 并执行",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() > 3,
                then:(buff)=>{
                    print("新重载")
                    let findunit = FindUnitsInRadius(buff.GetCaster().GetTeamNumber(),buff.GetCaster().GetAbsOrigin(),null,800,UnitTargetTeam.ENEMY,UnitTargetType.HERO | UnitTargetType.CREEP,UnitTargetFlags.NONE,FindOrder.ANY,false)
                                     .filter(elm=>elm.HasModifier("dao_di_modifier"))

                    buff.GetCaster().AddNewModifier(buff.GetCaster(),buff,"sheng_ming_ke_wang_modifier_me",{duration:2})

                
                    findunit.forEach(target=>{
                        target.AddNewModifier(buff.GetCaster(),buff,"sheng_ming_ke_wang_modifier_target",{duration:-1})
                        target.FindModifierByName("dao_di_modifier").SetDuration(-1,true)
                    })

                    GameRules.enquence_delay_call(()=>{
                        findunit.forEach(target=>{
                            const id = ParticleManager.CreateParticle("particles/kuangzhanshi/bloodstone_damage_2.vpcf",ParticleAttachment.CENTER_FOLLOW,buff.GetCaster())
                            ParticleManager.SetParticleControlEnt(id,0,buff.GetCaster(),ParticleAttachment.CENTER_FOLLOW,"",Vector(0,0,0),true)
                            ParticleManager.SetParticleControlEnt(id,1,target,ParticleAttachment.CENTER_FOLLOW,"",Vector(0,0,0),true)
                            GameRules.enquence_delay_call(()=>{
                                const id2 = ParticleManager.CreateParticle("particles/econ/items/lifestealer/ls_ti9_immortal/ls_ti9_open_wounds_impact.vpcf",ParticleAttachment.WORLDORIGIN,buff.GetCaster())
                                ParticleManager.SetParticleControl(id2,0,target.GetOrigin());;;


                                [id2,id].forEach(id=>{
                                    ParticleManager.DestroyParticle(id,false)
                                    ParticleManager.ReleaseParticleIndex(id)
                                })
                                target.RemoveModifierByName("sheng_ming_ke_wang_modifier_target")
                                target.RemoveModifierByName("dao_di_modifier")
                            },undefined,1000)
                        })
                    },undefined,1000)
                    return true
                }
                
            },
            {
                test:"判断服务器与血量低于3 禁止施法",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() <= 3,
                then:(buff)=>{return false}
            }
        ])
    }
}