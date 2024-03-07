import { registerModifier, BaseModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";


@reloadable
@registerModifier()
export class tou_zhi_wu_qi_modifier_thnker extends BaseModifier {

    OnCreated(params: object): void {
        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            let findunit = FindUnitsInRadius(this.GetCaster().GetTeamNumber(),this.GetCaster().GetAbsOrigin(),null,800,UnitTargetTeam.ENEMY,UnitTargetType.HERO | UnitTargetType.CREEP,UnitTargetFlags.NONE,FindOrder.ANY,false)
            findunit.forEach(elm=>{
                elm.AddNewModifier(this.GetCaster(),this.GetAbility(),"modifier_stunned",{duration:0.9})
            })
        }
    }


    GetEffectName(): string {
        return "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_trail_circle.vpcf"
    }

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN
    }

}