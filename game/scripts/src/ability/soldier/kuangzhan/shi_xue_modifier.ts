import { GenerateParabolaZHeight, easing, parabola} from "../../../fp";
import { BaseModifier, BaseModifierMotionBoth, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerModifier()
export class modifier_shi_xue extends BaseModifier {
    
    OnCreated(params: any): void {
        this.GetModifierPreAttack_CriticalStrike = () =>{
            return params.CriticalStrike
        } 
    }
    
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PREATTACK_CRITICALSTRIKE,ModifierFunction.ON_ATTACKED]
    }    

    GetModifierPreAttack_CriticalStrike(){
        return 200
    } 

    GetStatusEffectName(): string {
        return "particles/econ/events/summer_2021/summer_2021_emblem_effect_ground_rope.vpcf"
    }

    GetEffectName(): string {
        return "particles/ability/kuangzhanshi/yu_huo_effect.vpcf"
    }

    GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.CENTER_FOLLOW
    }

    
    StatusEffectPriority(){
        return ModifierPriority.NORMAL
    }

    OnAttacked(event:ModifierAttackEvent){
        if(event.attacker == this.GetCaster() && IsServer()){
            const id = ParticleManager.CreateParticle("particles/units/heroes/hero_invoker_kid/invoker_kid_base_attack_exort_explode.vpcf",ParticleAttachment.POINT,this.GetParent())
            ParticleManager.SetParticleControlEnt(id,3,this.GetParent(),ParticleAttachment.POINT,"attach_helix",Vector(0,0,0),true)
            this.AddParticle(id,false,false,0,false,false)
            this.GetParent().RemoveModifierByName("modifier_shi_xue")
        }
    }

    OnDestroy(): void {
        
    }

}