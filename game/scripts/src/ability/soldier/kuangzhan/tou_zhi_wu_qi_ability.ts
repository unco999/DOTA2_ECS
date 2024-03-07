import { RemoveParticleCallBack, rolltable, rollweight } from "../../../fp";
import { matchObject } from "../../../funcional";
import { BaseAbility, registerAbility } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerAbility()
export class tou_zhi_wu_qi_ability extends BaseAbility{
    weapon:CBaseModelEntity
    thinker:CDOTA_BaseNPC

    OnSpellStart(): boolean {
        return matchObject("开始执行投掷武器的ability",this,[
            {
                test:"判断服务器与血量高于3 并执行 state = 1",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() > 3 && this.Attribute_GetIntValue("state",0) == 0,
                then:(buff)=>{
                    const hero = this.GetCaster()
                    const foward = this.GetCursorPosition()
        
        
        
                    this.thinker = CreateModifierThinker(hero,undefined,"",{},foward,hero.GetTeamNumber(),false)
        
                    let model = hero.GetChildren()
                   for(let i = 0 ; i < model.length ; i++){
                      if(model[i].GetModelName().includes("weapon")){
                          const a  = model[i] as CBaseModelEntity
                          a.AddEffects(EntityEffects.EF_NODRAW)
                          this.weapon = a;
                        }} 
                    SendToConsole("dota_combine_models 0")
                    ProjectileManager.CreateTrackingProjectile({
                        Ability:null,
                        "Target":this.thinker,
                        "Source":hero,
                        "EffectName":"particles/kuangzhanshi/troll_warlord__2whirling_axe_ranged.vpcf",
                        "iMoveSpeed":1000,
                    })
        
                    this.Attribute_SetIntValue("state",2)


                    GameRules.enquence_delay_call(()=>{
                        this.thinker.SetModel(this.weapon.GetModelName())
                        this.thinker.SetOriginalModel(this.weapon.GetModelName())
                        this.thinker.SetModelScale(1.5)
                        this.thinker.SetAbsAngles(180,0,180)
                        this.thinker.SetOrigin(this.thinker.GetOrigin().__add(Vector(0,0,150)))
                        const id = ParticleManager.CreateParticle("particles/econ/items/huskar/huskar_2022_immortal/huskar_2022_immortal_life_break.vpcf",ParticleAttachment.WORLDORIGIN,hero)
                        ParticleManager.SetParticleControl(id,0,this.thinker.GetOrigin())
                        this.Attribute_SetIntValue("state",1)
                        this.EndCooldown()
                        this.thinker.AddNewModifier(this.GetCaster(),this,"tou_zhi_wu_qi_modifier_thnker",{duration:-1})
                    },undefined,1000)
                    return true
                }
                
            },
            {
                test:"判断当前是收回状态 state == 1 并执行收回操作",
                when:(buff)=> IsServer() && this.Attribute_GetIntValue("state",999) == 1,
                then:(buff)=>{
                    ProjectileManager.CreateTrackingProjectile({
                        Ability:null,
                        "Target":this.GetCaster(),
                        "Source":this.thinker,
                        "EffectName":"particles/kuangzhanshi/troll_warlord__2whirling_axe_ranged.vpcf",
                        "iMoveSpeed":1000,
                    })
                    this.thinker.RemoveSelf()
                    this.thinker = undefined;
                    // a.RemoveEffects(EntityEffects.EF_NODRAW)
                    GameRules.enquence_delay_call(()=>{
                        this.weapon.RemoveEffects(EntityEffects.EF_NODRAW)
                    },undefined,1000)
                    this.Attribute_SetIntValue("state",0)
                    this.StartCooldown(this.GetCooldown(this.GetLevel()))
                    return true
                }
            },
            {
                test:"判断当前是收回状态 state == 2 并执行错误操作",
                when:(buff)=> IsServer() && this.Attribute_GetIntValue("state",999) == 2,
                then:(buff)=>{
                    print("当前还不能收回")
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
    
    GetAOERadius(): number {
        return 600
    }
}
