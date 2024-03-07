import { registerModifier, BaseModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";


@reloadable
@registerModifier()
export class sheng_ming_ke_wang_modifier_me extends BaseModifier {
    

    OnCreated(params: any): void {
    }

    DeclareFunctions() {
        return [ModifierFunction.OVERRIDE_ANIMATION,ModifierFunction.OVERRIDE_ANIMATION_RATE];
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {[ModifierState.STUNNED]:true}
    }

    
    GetOverrideAnimation() { return GameActivity.DOTA_CAST_ABILITY_1; }

    GetOverrideAnimationRate(){return 0.2}
}