import { BaseModifier, registerModifier } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";
import * as euqipment_json from "../../../json/equipment.json"
import { RemoveParticleCallBack, TRACE, TriggerBigWolrdTile, _replace$2KeytoArray, _replace$2obj, compose, flattenArray } from "../../../fp";
import type { AllModifierAndAttributeComps } from "../../component/role";
type modifier_atomic_fn = (input:输入数据<any>)=>输入数据<any>
type modifier_atomic_head_fn = (this:BaseModifier,input:输入数据<any>)=>输入数据<any>
type modifier_hook_name = string
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

/**给每个函数输入包裹需要的值 */
function _wrap_input(event:ModifierAbilityEvent & ModifierAttackEvent,bind:BaseModifier,last_out?:{[key in 数据流类型]: any}){
    const input:输入数据<ModifierAbilityEvent & ModifierAttackEvent> = {
        事件:event,
        修饰器:this,
        数据流:last_out
    }
    return input
}

/**
 * 创造一个头部函数
 * @param this 
 * @param instance 
 * @param wrap_fn 
 * @returns 
 */
function create_head_fn(instance:BaseModifier,wrap_fn:modifier_atomic_fn){
    return (event)=>{
        const init_data:输入数据<any> = {}
        init_data.事件 = event,
        init_data.修饰器 = instance
        init_data.数据流 = {
            [数据流类型.布尔值] : true,
            [数据流类型.判断数值] : 30
        }
        print("检擦头部文件传入参数")
        DeepPrintTable(init_data)
        return wrap_fn(init_data)
    }
}



function sequenceTofn(data:Record<number, 记载>,instance:BaseModifier){
    let next_fn:modifier_atomic_fn;
    let record:修饰器记载;
    print("data的情况")
    DeepPrintTable(data)
    const fns = Object.values(data).filter((elm:修饰器记载)=>{
        if(elm.是修饰器){
            record = elm
            return false
        }else{
            return true
        }
    }).map(elm=>elm.函数) as ((...args)=>any)[]

    const fn = (events) => {
        const init_data:输入数据<any> = {}
        init_data.事件 = events,
        init_data.修饰器 = instance
        init_data.数据流 = {
            [数据流类型.布尔值] : true,
            [数据流类型.判断数值] : 30
        }
        return compose<输入数据<any>>((t)=>t.数据流?.[数据流类型.布尔值] != false,...fns)(init_data).数据流[数据流类型.属性字段]
    }
    
    return {wrap:fn,record}
}
/**
 * 序列转成可执行函数
 */
function transfromAllCompsFn(coms_obj:Record<number, 记载>[][],instance:BaseModifier){
    const comps_to_fn_table = coms_obj.map(elm=>{
        return elm.map(elm=>{
            return sequenceTofn(elm,instance)
        })
    })
    return comps_to_fn_table
}

/**
 * 合并按照不同装备  装备中的不同词条  进行modifierhookname 的实际合并
 */
function sequenceFnMerge(input:ReturnType<typeof transfromAllCompsFn>){
    const out:Record<modifier_hook_name,modifier_atomic_fn> = {}
    input.forEach(euqipment_class=>{
        euqipment_class.forEach(buffer_class=>{
            if(out[buffer_class.record.修饰器名字]){
                const wrap = function(input:输入数据<any>){
                    const r = buffer_class.wrap(input)
                    if(r.数据流[数据流类型.布尔值] == false){
                        return
                    }
                    if(r.数据流[数据流类型.属性字段] != null){
                        const target_r = out[buffer_class.record.修饰器名字](input)
                        if(target_r.数据流[数据流类型.属性字段] !=null){
                            return target_r.数据流[数据流类型.属性字段] + r.数据流[数据流类型.属性字段]
                        }
                        return r.数据流[数据流类型.属性字段]
                    }

                }
                out[buffer_class.record.修饰器名字] = wrap
            }else{
                out[buffer_class.record.修饰器名字] = buffer_class.wrap
            }
        })
    })
    return out
}


/**
 * 获取当前所有影响的modifier enum 枚举
 */
function getAllModifierEnum(coms_obj:Record<number, 记载>[][]){
    const out = flattenArray(coms_obj
        .map(elm=> elm.map(pickModifierHookFN)
        .map((elm:修饰器记载)=>({hook:elm.修饰器名字,enum:elm.枚举影响}))))
    return out       
}

/**
 * 取出序列中的modifierhook的实际记载  并且返回删除后的数组
 */
function pickModifierHookFN(sequence:Record<number, 记载>){
    let out:记载 = undefined 
    for(let i in sequence){
        if( (sequence[i] as 修饰器记载)?.是修饰器 ){
            out = sequence[i]
        }
    }
    return out
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


    private _speciel_des_to_fn(special_array:AllModifierAndAttributeComps['special']){
        const raw_seuqnce_list = transfromAllCompsFn(special_array,this)
        const with_modifier_function_record = sequenceFnMerge(raw_seuqnce_list)
        DeepPrintTable(with_modifier_function_record)
        return with_modifier_function_record
    }

    

    DeclareFunctions(): ModifierFunction[] {
        if(GameRules.QSet == null){
            return;
        }
        const role_ent = GameRules.QSet.is_select_role.first
        if(role_ent){
            // const all_attribute = role_ent.get(c.role.AllModifierAndAttributeComps).attribute
            // _replace$2KeytoArray(all_attribute).forEach(key=>{
            //     const json_deep = Object.values(euqipment_json).find(elm=>elm.attribute_sign == key)
            //     if(json_deep){
            //         const fnc_name = json_deep.dota_attribute_modifier_name
            //         if(fnc_name != "none" && json_deep.type == 0){
            //             this[fnc_name] = () => all_attribute[json_deep.attribute_sign as keyof typeof all_attribute]
            //         }
            //     }
            // })

            const all_attributes = role_ent.get(c.role.AllModifierAndAttributeComps)
            // all_call_map = this._flattening(all_attributes.special)
            const call_table = this._speciel_des_to_fn(all_attributes.special)

            const cur_modifier_hook_and_enum = getAllModifierEnum(all_attributes.special)

            for(let modifier_hook_name in call_table){
                print("最终绑定的modifiname",modifier_hook_name)
                this[modifier_hook_name] = call_table[modifier_hook_name]
            }

            return [
                ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
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
                ...cur_modifier_hook_and_enum.map(elm=>elm.enum),
                ]
        }

    }
}