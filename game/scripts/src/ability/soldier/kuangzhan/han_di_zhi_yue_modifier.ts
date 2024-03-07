import { GenerateParabolaZHeight, easing, parabola} from "../../../fp";
import { BaseModifierMotionBoth, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerModifier()
export class modifier_han_di_zhi_yue_jump extends BaseModifierMotionBoth {
    StartPosition: Vector;
    TargetPosition: Vector;
    Direction: Vector;
    HorizontalSpeed = 1000 / 30;
    Distance: number;

    OnCreated(kv: any) {
        if (IsServer()) {
            if (this.ApplyHorizontalMotionController() == false || this.ApplyVerticalMotionController() == false) {
                this.Destroy();
                return;
            }
            this.StartPosition = this.GetParent().GetAbsOrigin();
            this.TargetPosition = GetGroundPosition(Vector(kv.x, kv.y, kv.z), this.GetParent());
            this.Direction = ((this.TargetPosition - this.StartPosition) as Vector).Normalized();
            this.Distance = ((this.TargetPosition - this.StartPosition) as Vector).Length2D();
            this.HorizontalSpeed = kv.speed || 2000;
        }
    }

    OnDestroy() {
        if (IsServer()) {
            this.GetParent().RemoveHorizontalMotionController(this);
            this.GetParent().RemoveVerticalMotionController(this);
        }
    }

    OnHorizontalMotionInterrupted() {
        this.Destroy();
    }
    OnVerticalMotionInterrupted() {
        this.Destroy();
    }

    DeclareFunctions() {
        return [ModifierFunction.OVERRIDE_ANIMATION];
    }

    CheckState() {
        return {
            [ModifierState.STUNNED]: true,
            [ModifierState.UNSELECTABLE]: true,
        };
    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (IsServer()) {
            if (((me.GetAbsOrigin().__sub(this.TargetPosition))).Length2D() > this.HorizontalSpeed * dt) {
                const time = this.GetElapsedTime() / this.GetDuration()
                const speed = this.Direction.__mul(this.HorizontalSpeed * dt).__mul(easing.outExpo(time) * 2)
                me.SetAbsOrigin(me.GetAbsOrigin().__add( speed));
            } else {
                me.SetAbsOrigin(this.TargetPosition);
                me.InterruptMotionControllers(true);
                me.Stop();
                me.FaceTowards(this.TargetPosition);
                ParticleManager.CreateParticle("particles/econ/events/killbanners/screen_killbanner_compendium14_rampage_shake.vpcf",ParticleAttachment.MAIN_VIEW,this.GetCaster())
                const id = ParticleManager.CreateParticle("particles/econ/items/earthshaker/deep_magma/deep_magma_10th/deep_magma_10th_echoslam_start.vpcf",ParticleAttachment.WORLDORIGIN,this.GetCaster())
                ParticleManager.SetParticleControl(id,0,this.GetCaster().GetOrigin())
                const find = FindUnitsInRadius(
                    this.GetParent().GetTeamNumber(),
                    this.GetParent().GetOrigin(),
                    undefined,
                    300,
                    UnitTargetTeam.ENEMY,
                    UnitTargetType.CREEP | UnitTargetType.HERO,
                    UnitTargetFlags.NONE,
                    FindOrder.ANY,false
                )
                const hero = this.GetParent()

                find.forEach(unit=>{
                    unit.StartGestureWithPlaybackRate(GameActivity.DOTA_DIE,3)
                })

                GameRules.enquence_delay_call(()=>{
                    find.forEach((unit)=>{
                        unit.AddNewModifier(hero,null,"dao_di_modifier",{duration:4})
                    })
                },undefined,200)



                this.Destroy();
            }
        }
    }

    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (IsServer()) {
            if (this.Distance > 300) {
                let distanceTravelled = ((this.StartPosition - me.GetAbsOrigin()) as Vector).Length2D();
                let z = math.sin(distanceTravelled / this.Distance * 3.1415926) * 6.1415926 * this.Distance / 3.1415926;
                const between = easing.outExpo(this.GetElapsedTime() / this.GetDuration()) * z
                me.SetAbsOrigin(GetGroundPosition(me.GetAbsOrigin(), me).__add(Vector(0, 0, between / 2)));
            }
        }
    }


    GetOverrideAnimation() { return GameActivity.DOTA_ATTACK; }

    IsHidden() { return true; }
    IsPurgable() { return false; }
    RemoveOnDeath() { return false; }
}