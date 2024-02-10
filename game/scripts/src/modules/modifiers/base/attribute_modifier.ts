import { BaseModifier, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";
import * as euqipment_json from "../../../json/equipment.json"
import { RemoveParticleCallBack, TriggerBigWolrdTile, _replace$2KeytoArray, _replace$2obj } from "../../../fp";
import type { AllModifierAndAttributeComps } from "../../component/role";

type FUC_ARGS<T extends keyof typeof euqipment_json > =  Partial<typeof euqipment_json[T]['AbilityValues']>
@reloadable
export class euqipment_spcial_fuc{

    lian_suo_shan_dian(this:attribute_modifier,m_args:FUC_ARGS<"lian_suo_shan_dian_gong_ji">,event:ModifierAttackEvent){
        if(event.attacker == this.GetCaster()){
            const pos = this.GetCaster().GetOrigin()
            if(true){
                let set:CDOTA_BaseNPC[] = []
                let target = event.target
                let cur = Number(10)
                const find = (position:Vector,last?:CDOTA_BaseNPC) => FindUnitsInRadius(this.GetCaster().GetTeam(),position,last ?? target,1000,UnitTargetTeam.ENEMY,UnitTargetType.CREEP | UnitTargetType.HERO,UnitTargetFlags.NONE,FindOrder.CLOSEST,true).filter(elm=>!set.includes(elm)).pop()
                const next = () => GameRules.enquence_delay_call(()=>{
                        ApplyDamage({
                            attacker: this.GetCaster(),
                            victim: target,
                            damage: Number(m_args.trigger_damage),
                            damage_type: DamageTypes.MAGICAL,
                            ability: this.GetAbility()
                        })
                        const last = target
                        target = find(target.GetOrigin(),last)
                        const id = ParticleManager.CreateParticle("particles/econ/items/faceless_void/faceless_void_arcana/faceless_void_arcana_maelstrom_v2_item.vpcf",ParticleAttachment.POINT,this.GetCaster());
                        ParticleManager.SetParticleControlEnt(id,1,last,ParticleAttachment.POINT,"attach_hitloc",Vector(),true)
                        ParticleManager.SetParticleControlEnt(id,0,target,ParticleAttachment.POINT,"attach_hitloc",Vector(),true)
                        if(target && cur-- > 0){
                            set.push(target)
                            print(cur)
                            next()
                        }else{
                            set = undefined;
                            cur = undefined;
                            target = undefined;
                        }
                        GameRules.enquence_delay_call(
                            RemoveParticleCallBack(id,true)
                        ,undefined,1000)  
                },undefined,200)
                next()
           }

        }
    }

    /**攻击时触发敌人产生modifier效果 有持续时间 没有debuff 一般用于短时间触发和立即触发*/
    attack_trigger_target_freez(this:attribute_modifier,m_args:FUC_ARGS<"bing_shuang_gong_ji_dong_jie">,event: ModifierAttackEvent){
        if(event.attacker == this.GetCaster()){
            const pos = this.GetCaster().GetOrigin()
            if(true){
                // ApplyDamage({
                //     attacker: this.GetCaster(),
                //     victim: event.target,
                //     damage: Number(m_args.damage),
                //     damage_type: DamageTypes.MAGICAL,
                //     ability: this.GetAbility()
                // })
                print("强行触发冰霜攻击")
                const id = ParticleManager.CreateParticle("particles/units/heroes/hero_crystalmaiden/maiden_crystal_nova.vpcf",ParticleAttachment.WORLDORIGIN,this.GetCaster());
                ParticleManager.SetParticleControl(id,0,event.target.GetOrigin())
            }
        }
    }
}


@reloadable
@registerModifier()
export class attribute_modifier extends BaseModifier{
    IsHidden(): boolean {
        return false;
    }


    private _flattening_fuc(fuc_names:string[]){
        return fuc_names.map(fuc_name=>{
            print(`ecs transfrom fnc ${fuc_name}`)
            return (GameRules.euqipment_spcial_fuc[fuc_name] as Function)?.bind(this) as Function
        })
    }

    /**把记载表变成可以执行的函数 */
    private _flattening(comp:AllModifierAndAttributeComps){
        const special = comp?.special
        print("elll")
        DeepPrintTable(special)
        if(special == null) return
        const all_call_map:Map<number,{fuc:(this:void,args1:any,arg2,arg3,arg4)=>void,ModifierFunctionName:string}> = new Map()
        special.forEach(elm=>{
            const equiment_spcial_args = {}
            Object.values(elm.AbilityValues).forEach(elm=>Object.assign(equiment_spcial_args,elm))
            
            const link_maigc_fuc = this._flattening_fuc(elm.call_fuc)
            if(all_call_map.has(elm.enum_modifier_function)){
                const last_function = all_call_map.get(elm.enum_modifier_function).fuc
                const create_new_func = (args1:any,args2,args3) => {
                    link_maigc_fuc.forEach(link_fuc=>{
                        link_fuc(equiment_spcial_args,args1,args2,args3)
                    })
                    last_function(equiment_spcial_args,args1,args2,args3)
                }
                all_call_map.set(elm.enum_modifier_function,{fuc:create_new_func,ModifierFunctionName:elm.raw_modifier_function_name})
            }else{
                const create_new_func = (args1:any,args2,args3) => {
                    link_maigc_fuc.forEach(link_fuc=>{
                        link_fuc(equiment_spcial_args,args1,args2,args3)
                    })
                }
                all_call_map.set(elm.enum_modifier_function,{fuc:create_new_func,ModifierFunctionName:elm.raw_modifier_function_name})
            }
        })
        return all_call_map
    }
    
    DeclareFunctions(): ModifierFunction[] {
        if(GameRules.QSet == null){
            return;
        }
        const role_ent = GameRules.QSet.is_select_role.first
        let all_call_map:Map<number,{fuc:Function,ModifierFunctionName:string}>;
        const call_map_to_modifier_name_array = []
        if(role_ent){
            const all_attribute = role_ent.get(c.role.AllModifierAndAttributeComps)
            _replace$2KeytoArray(all_attribute).forEach(key=>{
                const json_deep = Object.values(euqipment_json).find(elm=>elm.attribute_sign == key)
                if(json_deep){
                    const fnc_name = json_deep.dota_attribute_modifier_name
                    if(fnc_name != "none" && json_deep.type == 0){
                        this[fnc_name] = () => all_attribute[json_deep.attribute_sign as keyof typeof all_attribute]
                    }
                }
            })

            all_call_map = this._flattening(_replace$2obj(all_attribute) as AllModifierAndAttributeComps)
            
            for(const [key,val] of all_call_map){
                print("equipment is special regisger on modifier event",key)
                this[val.ModifierFunctionName] = val.fuc.bind(this)
                print(val.ModifierFunctionName)
                call_map_to_modifier_name_array.push(Number(key))
            }
            

            return [ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
                ModifierFunction.PREATTACK_BONUS_DAMAGE,
                ModifierFunction.MOVESPEED_BONUS_CONSTANT,  
                ModifierFunction.MANA_REGEN_CONSTANT,
                ModifierFunction.PHYSICAL_ARMOR_BONUS,
                ModifierFunction.IGNORE_PHYSICAL_ARMOR,
                ModifierFunction.STATUS_RESISTANCE,
                ModifierFunction.MAGICAL_RESISTANCE_BONUS,
                ModifierFunction.EXTRA_HEALTH_BONUS,
                ModifierFunction.HEALTH_REGEN_CONSTANT,
                ModifierFunction.EXTRA_MANA_BONUS,
                ModifierFunction.MISS_PERCENTAGE,
                ,...call_map_to_modifier_name_array]
        }

    }
}