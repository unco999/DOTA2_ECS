import { registerModifier, BaseModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

 

@reloadable

    //@ts-ignore
@registerModifier()
export class testm extends BaseModifier{


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PHYSICAL_ARMOR_BONUS,ModifierFunction.AOE_BONUS_PERCENTAGE]
    }

    GetModifierAoEBonusPercentage(...args){
        DeepPrintTable(...args)
        return 100000
    }

    
    
}