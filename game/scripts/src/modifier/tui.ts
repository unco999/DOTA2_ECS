import { easing } from "../fp";
import { BaseModifier, BaseModifierMotionHorizontal, registerModifier } from "../utils/dota_ts_adapter";
import { reloadable } from "../utils/tstl-utils";


@registerModifier()
@reloadable
export class tui_modifier extends BaseModifierMotionHorizontal{
    HorizontalSpeed = 1000 / 30;
    parent_origin:Vector

     CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.FROZEN]: true,
            [ModifierState.STUNNED]: true
        }
     }


     OnCreated(kv: any) {
        if (IsServer()) {
            this.parent_origin = this.GetCaster().GetOrigin()
            if ( this.ApplyHorizontalMotionController() == false) {
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


    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (IsServer()) {
            const time = this.GetElapsedTime() / this.GetDuration()
            const dir = this.parent_origin.__sub(me.GetAbsOrigin()).Normalized()
            const speed = dir.__mul(this.HorizontalSpeed * dt).__mul(easing.inOutCubic(1.5 - time)).__mul(-20)
            me.SetAbsOrigin(GetGroundPosition(me.GetAbsOrigin().__add( speed),me));
        }
    }
     
}