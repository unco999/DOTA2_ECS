import { BaseModifier, registerModifier } from "../utils/dota_ts_adapter";
import { reloadable } from "../utils/tstl-utils";


@registerModifier()
@reloadable
export class dao_di_modifier extends BaseModifier{

     CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.FROZEN]: true,
            [ModifierState.STUNNED]: true
        }
     }
     
}