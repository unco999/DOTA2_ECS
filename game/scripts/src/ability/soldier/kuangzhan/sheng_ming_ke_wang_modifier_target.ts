import { GenerateParabolaZHeight, easing, parabola} from "../../../fp";
import { BaseModifierMotionBoth, BaseModifierMotionVertical, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerModifier()
export class sheng_ming_ke_wang_modifier_target extends BaseModifierMotionVertical {
    OnCreated(kv: any) {
        if (IsServer()) {
            if ( this.ApplyVerticalMotionController() == false) {
                this.Destroy();
                return;
            }
        }
    }

    OnDestroy() {
        if (IsServer()) {
            this.GetParent().RemoveVerticalMotionController(this);
        }
    }

    OnVerticalMotionInterrupted() {
        this.Destroy();
    }


    CheckState() {
        return {
            [ModifierState.STUNNED]: true,
            [ModifierState.UNSELECTABLE]: true,
        };
    }

    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (IsServer()) {
            const time = this.GetElapsedTime() / this.GetDuration() * dt * 3
            const speed = easing.outExpo(time) * 2
            if(me.GetOrigin().z > 222){
                return
            }
            me.SetAbsOrigin(me.GetAbsOrigin().__add( Vector(0,0,-speed)));
        }
    }
}