import { GenerateParabolaZHeight, easing, parabola} from "../../../fp";
import { BaseModifier, BaseModifierMotionBoth, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerModifier()
export class shou_lue_kuang_modifier extends BaseModifier {
    
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACKED]
    }
    
    OnAttacked(event:ModifierAttackEvent){
        if(event.target == this.GetParent() && event.target.GetOrigin().__sub(event.attacker.GetOrigin()).Length2D() < 300){
            print("触发了",event.attacker);
            const attack_speed = this.GetParent().GetBaseAttackTime();
            this.GetParent().SetBaseAttackTime(0)
            DoCleaveAttack(this.GetParent(),event.attacker,this.GetAbility(),100,100,500,500,"particles/econ/items/sven/sven_ti7_sword/sven_ti7_sword_spell_great_cleave_gods_strength.vpcf")
            this.GetParent().SetBaseAttackTime(attack_speed)
            // DoCleaveAttack(this.GetParent(),event.attacker,this.GetAbility(),event.damage,100,100,100,"particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf")
        }
    }
}