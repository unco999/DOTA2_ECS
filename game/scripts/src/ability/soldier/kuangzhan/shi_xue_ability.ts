import { BaseAbility, registerAbility } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerAbility()
export class shi_xue_ability extends BaseAbility{

    GetCastAnimation(): GameActivity {
        return GameActivity.DOTA_OVERRIDE_ABILITY_1
    }

    GetCastPoint(): number {
        return 0.75
    }

    OnSpellStart(): boolean {
        if(IsServer()){
            print("开始了")
            if(this.GetCaster().GetHealthPercent() > 5){
                const id = ParticleManager.CreateParticle("particles/killstreak/killstreak_fire_flames_hud.vpcf",ParticleAttachment.POINT_FOLLOW,this.GetCaster())
                ParticleManager.SetParticleControlEnt(id,0,this.GetCaster(),ParticleAttachment.POINT_FOLLOW,"Thumb_plc1_R",Vector(0),true)
                ApplyDamage({
                    "ability":this,
                    "attacker":this.GetCaster(),
                    "damage":this.GetCaster().GetMaxHealth() * 0.05,
                    "damage_type":DamageTypes.PURE,
                    "victim":this.GetCaster()
                })
                const effect = this.GetCaster().AddNewModifier(this.GetCaster(),null,"modifier_shi_xue",{duration:-1,CriticalStrike:100 + this.GetCaster().GetMaxHealth() * 0.05})
                effect.AddParticle(id,false,false,0,false,false)
                return true
            }else{
                return false
            }
        }
    }

    GetAOERadius(): number {
        return 400
    }
}