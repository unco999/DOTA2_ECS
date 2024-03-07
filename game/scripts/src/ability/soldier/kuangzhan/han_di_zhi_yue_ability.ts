import { matchObject } from "../../../funcional";
import { BaseAbility, registerAbility } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerAbility()
export class han_di_zhi_yue_ability extends BaseAbility{



    OnSpellStart(): boolean {
        
        return matchObject("开始执行撼敌之跃的判断",this,[
            {
                test:"判断服务器与血量高于3 并执行",
                when:(elm)=> IsServer() && elm.GetCaster().GetHealthPercent() > 3,
                then:(elm)=>{
                    const id = ParticleManager.CreateParticle("particles/econ/items/sand_king/sandking_ti7_arms/sandking_ti7_caustic_finale_explode.vpcf",ParticleAttachment.CENTER_FOLLOW,elm.GetCaster())
                    ParticleManager.SetParticleControlEnt(id,0,elm.GetCaster(),ParticleAttachment.CENTER_FOLLOW,"follow_origin",elm.GetCaster().GetAbsOrigin(),true)
                    ApplyDamage({
                        "ability":elm,
                        "attacker":elm.GetCaster(),
                        "damage":elm.GetCaster().GetMaxHealth() * 0.02,
                        "damage_type":DamageTypes.PURE,
                        "victim":elm.GetCaster()
                    })
                    const {x,y,z} = elm.GetCursorPosition()
                    elm.GetCaster().AddNewModifier(elm.GetCaster(),null,"modifier_han_di_zhi_yue_jump",{duration:3,x,y,z})
                    return true
                }
            },
            {
                test:"判断服务器与血量低于3 禁止施法",
                when:(elm)=> IsServer() && elm.GetCaster().GetHealthPercent() <= 3,
                then:(elm)=>{return false}
            },
        ])

    }

    GetAOERadius(): number {
        return 400
    }
}