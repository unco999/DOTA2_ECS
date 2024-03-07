import { GenerateSplitVectors, distributePercentages, has_mask } from "../../fp";
import { BaseModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import {rolltable} from "../../fp"

export namespace FN {
    
    function 释放法术魔法消耗是否低于某个值(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"释放法术魔法消耗是否超过某个值")
        input.数据流[数据流类型.布尔值] = input.事件.ability.GetManaCost(1) < this.arg1
        return input
    }

    export const 释放法术魔法消耗是否低于某个值_记载:记载 = {
        消费分数:30,
        输入:数据流类型.技能,
        输出:数据流类型.布尔值,
        标识:"a000001",
        函数:释放法术魔法消耗是否低于某个值,
        test:"释放法术魔法消耗是否低于x",
        名字:"奥法节流",
        权重:{
            [PROFESSION.圣职者]:0.5,
            [PROFESSION.法师]:0.79,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const 随机值 = RandomInt(50,200);
            const 消耗得分 = (100 - 随机值) * 30 ;
            const bind = {arg1:RandomInt(0,100)}
            return {bind,fn:释放法术魔法消耗是否低于某个值.bind(bind),消耗得分}
        }
    }

    function 释放法术魔法消耗是否超过某个值(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"释放法术魔法消耗是否超过某个值")
        input.数据流[数据流类型.布尔值] = input.事件.ability.GetManaCost(1) > this.arg1
        return input
    }

    export const 释放法术魔法消耗是否超过某个值_记载:记载 = {
        消费分数:30,
        输入:数据流类型.技能,
        输出:数据流类型.布尔值,
        标识:"a000002",
        函数:释放法术魔法消耗是否超过某个值,
        test:"释放法术魔法消耗是否超过x",
        名字:"超载奥法",
        权重:{
            [PROFESSION.圣职者]:0.5,
            [PROFESSION.法师]:0.79,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const 随机值 = RandomInt(100,300);
            const 消耗得分 = (200 - 随机值) * 30 ;
            const bind = {arg1:RandomInt(0,100)}
            return {fn:释放法术魔法消耗是否超过某个值.bind(bind),bind,消耗得分}
        }
    }

    // function 上一个技能是否释放的雷元素(input:输入数据<ModifierAbilityEvent>){
    //     assert(input.事件.ability,"上一个技能是否释放的雷元素")
    //     const role = GameRules.QSet.is_select_role.first
    //     const ability_state_comp = role.get(c.role.RoleSpellState)
    //     const bool = !has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.雷元素)
    //     input.数据流[数据流类型.布尔值] = bool
    //     return input
    // }

    // export const 上一个技能是否释放的雷元素_记载:记载 = {
    //     消费分数:30,
    //     输入:数据流类型.技能,
    //     输出:数据流类型.布尔值,
    //     标识:"a000003",
    //     函数:上一个技能是否释放的雷元素,
    //     test:"如果 上一个技能是释放的雷元素 则",
    //     名字:"雷之",
    //     权重:{
    //         [PROFESSION.圣职者]:0.6,
    //         [PROFESSION.法师]:0.6,
    //         [PROFESSION.战士]:0.2,
    //         [PROFESSION.弓箭手]:0.6,
    //     },
    //     绑定参数生成:undefined
    // }

    // function 上一个技能是否释放的火元素(input:输入数据<ModifierAbilityEvent>){
    //     assert(input.事件.ability,"上一个技能是否释放的雷元素")
    //     const role = GameRules.QSet.is_select_role.first
    //     const ability_state_comp = role.get(c.role.RoleSpellState)
    //     const bool = !has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.火元素)
    //     input.数据流[数据流类型.布尔值] = bool
    //     return true
    // }

    // export const 上一个技能是否释放的火元素_记载:记载 = {
    //     消费分数:30,
    //     输入:数据流类型.技能,
    //     输出:数据流类型.布尔值,
    //     标识:"a000004",
    //     函数:上一个技能是否释放的火元素,
    //     test:"如果 上一个技能是释放的火元素 则",
    //     名字:"火之",
    //     权重:{
    //         [PROFESSION.圣职者]:0.6,
    //         [PROFESSION.法师]:0.6,
    //         [PROFESSION.战士]:0.2,
    //         [PROFESSION.弓箭手]:0.6,
    //     },
    //     绑定参数生成:undefined
    // }

    // function 上一个技能是否释放的水元素(input:输入数据<ModifierAbilityEvent>){
    //     assert(input.事件.ability,"上一个技能是否释放的雷元素")
    //     const role = GameRules.QSet.is_select_role.first
    //     const ability_state_comp = role.get(c.role.RoleSpellState)
    //     const bool = !has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.水元素)
    //     input.数据流[数据流类型.布尔值] = bool
    //     return input
    // }

    // export const 上一个技能是否释放的水元素_记载:记载 = {
    //     消费分数:30,
    //     输入:数据流类型.技能,
    //     输出:数据流类型.布尔值,
    //     标识:"a000005",
    //     函数:上一个技能是否释放的水元素,
    //     test:"如果 上一个技能是释放的水元素 则",
    //     名字:"水之",
    //     权重:{
    //         [PROFESSION.圣职者]:0.6,
    //         [PROFESSION.法师]:0.6,
    //         [PROFESSION.战士]:0.2,
    //         [PROFESSION.弓箭手]:0.6,
    //     },
    //     绑定参数生成:undefined
    // }
    
    // function 上一个技能是否释放的暗元素(input:输入数据<ModifierAbilityEvent>){
    //     assert(input.事件.ability,"上一个技能是否释放的雷元素")
    //     const role = GameRules.QSet.is_select_role.first
    //     const ability_state_comp = role.get(c.role.RoleSpellState)
    //     const bool = !has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.暗元素)
    //     input.数据流[数据流类型.布尔值] = bool
    //     return input
    // }

    // export const 上一个技能是否释放的暗元素_记载:记载 = {
    //     消费分数:30,
    //     输入:数据流类型.技能,
    //     输出:数据流类型.布尔值,
    //     标识:"a000006",
    //     函数:上一个技能是否释放的暗元素,
    //     test:"如果 上一个技能释放的是暗元素 则",
    //     名字:"暗之",
    //     权重:{
    //         [PROFESSION.圣职者]:0.6,
    //         [PROFESSION.法师]:0.6,
    //         [PROFESSION.战士]:0.2,
    //         [PROFESSION.弓箭手]:0.6,
    //     },
    //     绑定参数生成:undefined
    // }

    function 敌方血量是否高于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否高于")
        input.数据流[数据流类型.布尔值] = target.GetHealthPercent() > this.arg1
        return input
    }

    export const 敌方血量是否高于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000007",
        函数:敌方血量是否高于,
        test:"如果 敌方的血量高于x 则",
        名字:"屠魔",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.3,
            [PROFESSION.战士]:0.9,
            [PROFESSION.弓箭手]:0.7,
        },
        绑定参数生成:()=>{
            const HealthPercent = RandomInt(10,90);
            const 消耗得分 = (45 - HealthPercent) * 30 ;
            const bind = {arg1:HealthPercent}
            return {fn:敌方血量是否高于.bind(bind),bind,消耗得分}
        }
    }

    function 敌方血量是否低于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否低于")
        input.数据流[数据流类型.布尔值] = target.GetHealthPercent() < this.arg1
        return input
    }

    export const 敌方血量是否低于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000008",
        函数:敌方血量是否低于,
        test:"如果 敌方的血量低于x 则",
        名字:"猎杀",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.3,
            [PROFESSION.战士]:0.9,
            [PROFESSION.弓箭手]:0.7,
        },
        绑定参数生成:()=>{
            const HealthPercent = RandomInt(10,90);
            const 消耗得分 = (HealthPercent - 45) * 30 ;
            const bind = {arg1:HealthPercent}
            return {fn:敌方血量是否低于.bind(bind),bind,消耗得分}
        }
    }

    function 敌方魔法值是否高于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否低于")
        input.数据流[数据流类型.布尔值] =  target.GetManaPercent() > this.arg1
        return input
    }

    export const 敌方魔法值是否高于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000009",
        函数:敌方魔法值是否高于,
        test:"如果 敌方的魔法高于x 则",
        名字:"敌法",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.5,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const manaPercent = RandomInt(10,90);
            const 消耗得分 = (manaPercent - 45) * 30 ;
            const bind = {arg1:manaPercent}
            return {fn:敌方魔法值是否高于.bind(bind),bind,消耗得分}
        }
    }

    function 敌方魔法值是否低于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否低于")
        input.数据流[数据流类型.布尔值] = target.GetManaPercent() < this.arg1
        return input
    }

    export const 敌方魔法值是否低于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000010",
        函数:敌方魔法值是否低于,
        test:"如果 敌方的魔法低于x 则",
        名字:"控法",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.5,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const manaPercent = RandomInt(10,90);
            const 消耗得分 = (45 - manaPercent) * 30 ;
            const bind = {arg1:manaPercent}
            return {fn:敌方魔法值是否低于.bind(bind),bind,消耗得分}
        }
    }

    function 我方血量是否高于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我血量是否低于")
        input.数据流[数据流类型.布尔值] =  m.GetHealthPercent() > this.arg1
        return input
    }

    export const 我方血量是否高于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000011",
        函数:我方血量是否高于,
        test:"如果 我方的血量高于x 则",
        名字:"巨人",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.9,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const HealthPercent = RandomInt(10,90);
            const 消耗得分 = (HealthPercent - 45) * 30 ;
            const bind = {arg1:HealthPercent}
            return {fn:我方血量是否高于.bind(bind),bind,消耗得分}
        }
    }

    function 我方血量是否低于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我血量是否低于")
        input.数据流[数据流类型.布尔值] = m.GetHealthPercent() < this.arg1
        return input
    }

    export const 我方血量是否低于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000012",
        函数:我方血量是否低于,
        test:"如果 我方的血量低于x 则",
        名字:"暴怒",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.9,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const HealthPercent = RandomInt(10,90);
            const 消耗得分 = (45 - HealthPercent) * 30 ;
            const bind = {arg1:HealthPercent}
            return {fn:我方血量是否低于.bind(bind),bind,消耗得分}
        }
    }

    function 我方魔法值是否高于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我方魔法值是否高于")
        print("重载了")
        input.数据流[数据流类型.布尔值] = m.GetManaPercent() > this.arg1
        return input
    }

    export const 我方魔法值是否高于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000013",
        函数:我方魔法值是否高于,
        test:"如果 我方的魔法值高于x 则",
        名字:"魔法师",
        权重:{
            [PROFESSION.圣职者]:0.7,
            [PROFESSION.法师]:0.9,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const manaPercent = RandomInt(10,90);
            const 消耗得分 = (45 - manaPercent) * 30 ;
            const bind = {arg1:manaPercent}
            return {fn:我方魔法值是否高于.bind(bind),bind,消耗得分}
        }
    }

    function 我方魔法值是否低于(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我方魔法值是否低于")
        input.数据流[数据流类型.布尔值] = m.GetManaPercent() < this.arg1
        return input
    }

    export const 我方魔法值是否低于_记载:记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000014",
        函数:我方魔法值是否低于,
        test:"如果 我方的魔法值低于x 则",
        名字:"回春",
        权重:{
            [PROFESSION.圣职者]:0.7,
            [PROFESSION.法师]:0.9,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:()=>{
            const manaPercent = RandomInt(10,90);
            const 消耗得分 = (manaPercent - 45) * 30 ;
            const bind = {arg1:manaPercent}
            return {fn:我方魔法值是否高于.bind(bind),bind,消耗得分}
        }
    }

    function 我方力量转换百分比为数值(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster() as CDOTA_BaseNPC_Hero
        assert(m,"我方力量转换百分比为数值")
        const strength = m.GetStrength()
        input.数据流[数据流类型.属性字段] = strength * this.arg1 / 100
        return input
    }

    export const 我方力量转换百分比为数值_记载:可连接最终输出的记载 ={
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.属性字段,
        标识:"a000015",
        函数:我方力量转换百分比为数值,
        test:"转换我力量的百分之X给",
        名字:"化力",
        权重:{
            [PROFESSION.圣职者]:0.5,
            [PROFESSION.法师]:0.2,
            [PROFESSION.战士]:0.9,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:(剩余分数投入:number)=>{
            const 剩余分数 = 剩余分数投入 ? 剩余分数投入 / 35 : 0
            const 转换数值 = rolltable([
                {击中几率:10 + 剩余分数,击中后随机的数值:{min:20,max:30}},
                {击中几率:20 + 剩余分数,击中后随机的数值:{min:15,max:20}},
                {击中几率:30 + 剩余分数,击中后随机的数值:{min:12,max:17}},
                {击中几率:40 + 剩余分数,击中后随机的数值:{min:10,max:15}},
                {击中几率:50,击中后随机的数值:{min:8,max:12}},
                {击中几率:60,击中后随机的数值:{min:5,max:10}},
                {击中几率:70,击中后随机的数值:{min:3,max:8}},
            ])
            const 消耗得分 = (15 - 转换数值) * 30 ;
            const bind = {arg1:转换数值}
            return {fn:我方力量转换百分比为数值.bind(bind),bind,消耗得分}
        },
        最终得分转换率:1.5
    }

    function 我方敏捷转换百分比为数值(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster() as CDOTA_BaseNPC_Hero
        assert(m,"我方力量转换百分比为数值")
        const agility = m.GetAgility()
        input.数据流[数据流类型.属性字段] =  agility * this.arg1 / 100
        return input
    }

    export const 我方敏捷转换百分比为数值_记载:可连接最终输出的记载 ={
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.属性字段,
        标识:"a000016",
        函数:我方敏捷转换百分比为数值,
        test:"转换我敏捷的百分之X给",
        名字:"刺客",
        权重:{
            [PROFESSION.圣职者]:0.5,
            [PROFESSION.法师]:0.2,
            [PROFESSION.战士]:0.5,
            [PROFESSION.弓箭手]:0.9,
        },
        最终得分转换率:1.5,
        绑定参数生成:(剩余分数投入:number)=>{
            const 剩余分数 = 剩余分数投入 ? 剩余分数投入 / 35 : 0
            const 转换数值 = rolltable([
                {击中几率:10+剩余分数,击中后随机的数值:{min:20,max:30}},
                {击中几率:20+剩余分数,击中后随机的数值:{min:15,max:20}},
                {击中几率:30+剩余分数,击中后随机的数值:{min:12,max:17}},
                {击中几率:40+剩余分数,击中后随机的数值:{min:10,max:15}},
                {击中几率:50,击中后随机的数值:{min:8,max:12}},
                {击中几率:60,击中后随机的数值:{min:5,max:10}},
                {击中几率:70,击中后随机的数值:{min:3,max:8}},
            ])
            const 消耗得分 = (15 - 转换数值) * 30 ;
            const bind = {arg1:转换数值}
            return {fn:我方敏捷转换百分比为数值.bind(bind),bind,消耗得分}
        },
    }

    function 我方智力转换百分比为数值(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster() as CDOTA_BaseNPC_Hero
        assert(m,"我方力量转换百分比为数值")
        const intellect = m.GetIntellect()
        input.数据流[数据流类型.属性字段] =   intellect * this.arg1 / 100
        return input
    }

    export const 我方智力转换百分比为数值_记载:可连接最终输出的记载 ={
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.属性字段,
        标识:"a000017",
        函数:我方智力转换百分比为数值,
        test:"转换我智力的百分之X给",
        名字:"智者",
        权重:{
            [PROFESSION.圣职者]:0.5,
            [PROFESSION.法师]:0.9,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.5,
        },
        最终得分转换率:1.5,
        绑定参数生成:(剩余分数投入:number)=>{
            const 剩余分数 = 剩余分数投入 ? 剩余分数投入 / 35 : 0
            const 转换数值 = rolltable([
                {击中几率:10 + 剩余分数,击中后随机的数值:{min:20,max:30}},
                {击中几率:20 + 剩余分数,击中后随机的数值:{min:15,max:20}},
                {击中几率:30 + 剩余分数,击中后随机的数值:{min:12,max:17}},
                {击中几率:40 + 剩余分数,击中后随机的数值:{min:10,max:15}},
                {击中几率:50,击中后随机的数值:{min:8,max:12}},
                {击中几率:60,击中后随机的数值:{min:5,max:10}},
                {击中几率:70,击中后随机的数值:{min:3,max:8}},
            ])
            const 消耗得分 = (15 - 转换数值) * 30 ;
            const bind = {arg1:转换数值}
            return {fn:我方智力转换百分比为数值.bind(bind),bind,消耗得分}
        },
    }


    function 我方增加临时力量(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const role = GameRules.QSet.is_select_role.first
        const temp_modifier_comp = role.get(c.role.TempAllModifierAndAttributeComps)
        if(temp_modifier_comp.attribute[ATTRIBUTE.力量] == null){
            temp_modifier_comp.attribute[ATTRIBUTE.力量] = 0
        }
        temp_modifier_comp.attribute[ATTRIBUTE.力量] += this.arg1
        return input
    }

    export const 增加临时力量_记载:可连接最终输出的记载 = {
        消费分数:30,
        输入:数据流类型.属性字段,
        输出:数据流类型.直接单位操作,
        标识:"a000018",
        函数:我方增加临时力量,
        test:"那么我们增加x点临时力量给自身",
        名字:"强壮",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.1,
            [PROFESSION.战士]:0.9,
            [PROFESSION.弓箭手]:0.7,
        },
        最终得分转换率:1.5,
        绑定参数生成:(剩余分数投入:number)=>{
            const 剩余分数 = 剩余分数投入 ? 剩余分数投入 / 35 : 0
            const 转换数值 = rolltable([
                {击中几率:10 + 剩余分数,击中后随机的数值:{min:20,max:30}},
                {击中几率:20 + 剩余分数,击中后随机的数值:{min:15,max:20}},
                {击中几率:30 + 剩余分数,击中后随机的数值:{min:12,max:17}},
                {击中几率:40 + 剩余分数,击中后随机的数值:{min:10,max:15}},
                {击中几率:50,击中后随机的数值:{min:8,max:12}},
                {击中几率:60,击中后随机的数值:{min:5,max:10}},
                {击中几率:70,击中后随机的数值:{min:3,max:8}},
            ])
            const 消耗得分 = (15 - 转换数值) * 30 ;
            const bind = {arg1:转换数值}
            return {fn:我方增加临时力量.bind({arg1:转换数值}),bind,消耗得分}
        },
    }

    function 几率触发(this:ModifierAtomicBind,input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const Percentage = this.arg1
        if(RollPercentage(Percentage)){
            print("通过了判断触发成功")
            input.数据流[数据流类型.布尔值] = true
        }else{
            print("没有通过判断")
            input.数据流[数据流类型.布尔值] = false
        }
        print("几率为",Percentage)
        return input
    }

    export const 几率触发_记载:可连接最终输出的记载 = {
        消费分数:30,
        输入:数据流类型.判断数值,
        输出:数据流类型.布尔值,
        标识:"a000019",
        函数:几率触发,
        test:"百分之x几率触发",
        名字:"混沌",
        权重:{
            [PROFESSION.圣职者]:0.5,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.5,
            [PROFESSION.弓箭手]:0.5,
        },
        绑定参数生成:(剩余分数投入:number)=>{
            const 剩余分数 = 剩余分数投入 ? 剩余分数投入 / 35 : 0
            const 转换数值 = rolltable([
                {击中几率:10 + 剩余分数,击中后随机的数值:{min:20,max:30}},
                {击中几率:20 + 剩余分数,击中后随机的数值:{min:15,max:20}},
                {击中几率:30 + 剩余分数,击中后随机的数值:{min:12,max:17}},
                {击中几率:40 + 剩余分数,击中后随机的数值:{min:10,max:15}},
                {击中几率:50,击中后随机的数值:{min:8,max:12}},
                {击中几率:60,击中后随机的数值:{min:5,max:10}},
                {击中几率:70,击中后随机的数值:{min:3,max:8}},
            ])
            const 消耗得分 = (15 - 转换数值) * 30 ;
            const bind = {arg1:转换数值}
            return {fn:几率触发.bind(bind),bind,消耗得分}
        },
        最终得分转换率:1.5
    }
    
    export const PREATTACK_BONUS_DAMAGE:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.属性字段,
        输出:数据流类型.我方 | 数据流类型.敌方,
        标识:"a000020",
        函数:()=>{},
        test:"普通伤害增加",
        名字:"挥斩之",
        权重:{
            [PROFESSION.圣职者]:0.4,
            [PROFESSION.法师]:0.1,
            [PROFESSION.战士]:0.7,
            [PROFESSION.弓箭手]:0.7,
        },
        必要前置:[],
        是修饰器:true,
        修饰器名字:"GetModifierPreAttack_BonusDamage",
        枚举影响:ModifierFunction.PREATTACK_BONUS_DAMAGE,
        绑定参数生成:undefined
    }

    export const PREATTACK_CRITICALSTRIKE:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.属性字段 | 数据流类型.判断数值,
        输出:数据流类型.我方 | 数据流类型.敌方,
        标识:"a000021",
        函数:()=>{},
        test:"暴击率",
        名字:"暴击之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        },
        必要前置:[几率触发_记载],
        是修饰器:true,
        修饰器名字:"GetModifierPreAttack_CriticalStrike",
        枚举影响:ModifierFunction.PREATTACK_CRITICALSTRIKE,
        绑定参数生成:undefined
    }
    
    export const ON_ABILITY_EXECUTED:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.直接单位操作,
        输出:数据流类型.我方 | 数据流类型.敌方,
        标识:"a000022",
        函数:()=>{},
        test:"施法 则",
        名字:"施法之",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.8,
            [PROFESSION.战士]:0.4,
            [PROFESSION.弓箭手]:0.65,
        },
        必要前置:[几率触发_记载],
        是修饰器:true,
        修饰器名字:"OnAbilityExecuted",
        枚举影响:ModifierFunction.ON_ABILITY_EXECUTED,
        绑定参数生成:undefined
    }

    export const OnAttacked:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.直接单位操作,
        输出:数据流类型.无,
        标识:"a000023",
        函数:()=>{},
        test:"攻击中目标 则",
        名字:"火之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.8,
            [PROFESSION.弓箭手]:0.7,
        },
        必要前置:[几率触发_记载],
        是修饰器:true,
        修饰器名字:"OnAttacked",
        枚举影响:ModifierFunction.ON_ATTACKED,
        绑定参数生成:undefined
    }


    function 发射一枚元素球(this:ModifierAtomicBind,input:输入数据<ModifierAttackEvent>){
        const 分裂个数 = input.数据流[数据流类型.元素分裂] ?? 1;  
        const splitAngleIncrement = 360 / 分裂个数; // 计算每个分裂元素之间的角度增量  
        // 计算分裂的中心点  
        const center = input.修饰器.GetCaster().GetOrigin();
        const forward = input.修饰器.GetCaster().GetForwardVector()
        let project_ids = []

        const vecs = GenerateSplitVectors(center,forward,200,分裂个数)


        for (const [_,Velocity] of ipairs(vecs)) {  
            print(Velocity)
            // 计算每个分裂元素的旋转角度  
            // 创建投射物  
            const id = ProjectileManager.CreateLinearProjectile({  
                "Ability": input.修饰器.GetAbility(),  
                "EffectName": input.数据流[数据流类型.元素影响],  
                "vSpawnOrigin": Velocity,  
                "vVelocity": Velocity.__sub(center).Normalized().__mul(1000),  
                "fDistance": 1000,  
                "fStartRadius": 100,  
                "fEndRadius": 100,  
                "Source": input.修饰器.GetCaster(),  
            });  
          
            project_ids.push(id)
            // 延迟调用，检查是否有敌人单位在投射物路径上  
            GameRules.enquence_delay_call(() => {  
                const vec = ProjectileManager.GetLinearProjectileLocation(id);  
                const find = FindUnitsInRadius(  
                    input.修饰器.GetCaster().GetTeamNumber(),  
                    vec,  
                    undefined,  
                    100,  
                    UnitTargetTeam.ENEMY,  
                    UnitTargetType.CREEP | UnitTargetType.HERO,  
                    UnitTargetFlags.NONE,  
                    FindOrder.ANY,  
                    false  
                );  
          
                find.forEach(elm => {  
                    ApplyDamage({  
                        attacker: input.修饰器.GetCaster(),  
                        victim: elm,  
                        ability: input.修饰器.GetAbility(),  
                        damage: 100,  
                        damage_type: DamageTypes.MAGICAL,  
                    });  
                });  
          
                // 检查投射物是否仍然有效  
                if (project_ids.some(elm=>ProjectileManager.IsValidProjectile(elm))) {  
                    return "update";  
                }
            }, undefined, 555); // 延迟555毫秒  
        }  
          
        return input;
    }

    export const 发射一枚元素球_记载:可连接最终输出的记载 = {
        消费分数:30,
        输入:数据流类型.属性字段,
        输出:数据流类型.直接单位操作,
        标识:"a000024",
        函数:发射一枚元素球,
        test:"发射闪电球",
        名字:"闪电球",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        },
        绑定参数生成:undefined,
        最终得分转换率:1.5
    }

    function 随机选择一个元素(this:ModifierAtomicBind,input:输入数据<ModifierAttackEvent>){
        input.数据流[数据流类型.元素影响] = this.arg2
        return input
    }

    export const 随机选择一个元素_记载:记载 ={
        消费分数:30,
        输入:数据流类型.无,
        输出:数据流类型.元素影响 | 数据流类型.属性字段,
        标识:"a000025",
        函数:随机选择一个元素,
        test:"发射闪电球",
        名字:"闪电球",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        },
        绑定参数生成:(剩余分数:number)=>{
            const 选中的元素 = getRandomElementByWeightedChance(table.shuffle(Object.values(元素特效列表)).pop(),剩余分数)
            const bind = {arg1:选中的元素.name,arg2:选中的元素.path}
            return {bind,fn:随机选择一个元素.bind(bind),消耗得分:0}
        },
    }


    function 元素分裂(this:ModifierAtomicBind,input:输入数据<ModifierAttackEvent>){
        input.数据流[数据流类型.元素分裂] = this.arg1
        return input
    }

    export const 元素分裂_记载:记载 ={
        消费分数:30,
        输入:数据流类型.属性字段,
        输出:数据流类型.元素分裂,
        标识:"a000026",
        函数:随机选择一个元素,
        test:"发射闪电球",
        名字:"闪电球",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        },
        绑定参数生成:(剩余分数:number)=>{
            const 分裂次数 = rolltable([
                {击中几率:10,击中后随机的数值:{min:7,max:10}},
                {击中几率:20,击中后随机的数值:{min:4,max:5}},
                {击中几率:70,击中后随机的数值:{min:3,max:4}},
            ])
            const bind = {arg1:分裂次数}
            return {bind,fn:元素分裂.bind(bind),消耗得分:0}
        },
    }

    const 元素特效列表 = {
        火元素:[
            {chance:1,name:"基础火元素",消耗得分:10,path:"particles/base_attacks/ranged_tower_bad__2linear.vpcf"}
        ],
        特殊元素:[
            {chance:1,name:"深渊触手",消耗得分:10,path:"particles/units/heroes/hero_tidehunter/tidehunter_arm_of_the_deep_projectile.vpcf"}
        ]
    }

    function getRandomElementByWeightedChance(  
        elements: { chance: number, name: string, path: string }[],  
        bias: number = 1 // 默认不偏倚，即权重不变  
     ): { name: string, path: string } | undefined {  
        // 计算调整后的权重总和  
        let totalWeightedChance = elements.reduce((sum, element) => sum + (element.chance * bias), 0);  
      
        // 生成一个介于 0 和总权重之间的随机数  
        let randomValue = Math.random() * totalWeightedChance;  
      
        // 遍历元素数组，并根据权重累加值减去每个元素的调整后的权重  
        for (let element of elements) {  
            randomValue -= (element.chance * bias);  
      
            // 如果随机数小于等于0，那么我们就找到了根据权重随机选中的元素  
            if (randomValue <= 0) {  
                return { name: element.name, path: element.path };  
            }  
        }  
      
        // 如果没有找到元素（理论上不应该发生），返回 undefined  
        return undefined;  
    }  


    const 修饰器集合 = [
        PREATTACK_BONUS_DAMAGE,
        ON_ABILITY_EXECUTED,
        OnAttacked,
        PREATTACK_CRITICALSTRIKE
    ]


    const 随机一个权重值是否低于另一个权重值 = (a1:number) => RandomFloat(0,1) < a1 

    const 遍历权重值看哪个抽中 = (array:number[]) => array.find(num=> RandomFloat(0,1) < num )

    const 是否与已有节点排斥 = (已有记载:记载[],输入:记载) => {
        const 所有排斥 = Object.values(排斥节点)
        const 分类排斥:记载[][] = []
        for(const 遍历排斥集合 of 所有排斥){
            for(const 单个排斥记载 of 遍历排斥集合){
                if(已有记载.includes(单个排斥记载)){
                    分类排斥.push(遍历排斥集合)
                }
            }
        }
        const IF = 分类排斥.find(elm=>elm.includes(输入))
        if(IF){
            return true
        }else{
            return false
        }
    }

    const 嵌套判断集合 = Object.values(FN).filter((elm:记载)=>{
        if(has_mask(elm.输出,数据流类型.布尔值)){
            return true
        }
    }) as 记载[]

    const 所有的输出属性字段的记载 = Object.values(FN).filter((elm:记载)=>{
        if(has_mask(elm.输出,数据流类型.属性字段)){
            return true
        }
    })

    const 所有输出直接操作字段的记载 = Object.values(FN).filter((elm:记载)=>{
        if(has_mask(elm.输出,数据流类型.直接单位操作)){
            return true
        }
    })

    const 可连接输出的记载集合 = 所有的输出属性字段的记载.concat(所有输出直接操作字段的记载)


    const 根据权重选择集合中的函数_包含次数 = (main_profession:PROFESSION,collect:记载[],count:number) =>{
        let 最坏的选择:记载[] = [];
        let 最终选择:记载[] = [];
        let 当前已经选择数量 = count;
            for(const 单个记载 of table.shuffle(collect) ){
                if(是否与已有节点排斥(最终选择,单个记载)) continue;
                if(当前已经选择数量 == 0) break;
                if(随机一个权重值是否低于另一个权重值(单个记载.权重[Number(main_profession)])){
                    当前已经选择数量--;
                    最终选择.push(单个记载)
                    continue;
                }
                const 遍历随机选中 = 遍历权重值看哪个抽中([1,2,3,4].filter(num => num == Number(main_profession)))
                if(遍历随机选中){
                    当前已经选择数量--;
                    最终选择.push(单个记载)
                    continue;
                }
                最坏的选择.push(单个记载)
            }
        if(最终选择.length < count){
            for(let i = 0; i < count - 最终选择.length; i++){
                const 随机选择记载 = table.shuffle(最坏的选择).pop()
                if(是否与已有节点排斥(最终选择,随机选择记载) || 是否与已有节点排斥(最坏的选择,随机选择记载)){
                    i--;
                    continue;
                }
                最坏的选择.push(随机选择记载)
            }
            return 最终选择.concat(最坏的选择)
        }
        return 最终选择
    }


    const 随机一个主职业 = () => RandomInt(0,3) as PROFESSION

    const 随机一个物品分数 = () => {
        return {总分数:table.random([
            EQUIPMENT_FRACTION.橙色,
            EQUIPMENT_FRACTION.白色,
            EQUIPMENT_FRACTION.粉色,
            EQUIPMENT_FRACTION.红色,
            EQUIPMENT_FRACTION.绿色,
            EQUIPMENT_FRACTION.蓝色
        ])}
    }

    const 排斥节点 = {
        施法触发之元素排斥:[
            // 上一个技能是否释放的雷元素_记载,
            // 上一个技能是否释放的火元素_记载,
            // 上一个技能是否释放的水元素_记载,
            // 上一个技能是否释放的暗元素_记载,
        ],
        敌方血量排斥:[
            敌方血量是否低于_记载,
            敌方血量是否高于_记载,
        ],
        敌方蓝量排斥:[
            敌方魔法值是否低于_记载,
            敌方魔法值是否高于_记载,
        ],
        我方血量排斥:[
            我方血量是否低于_记载,
            我方血量是否高于_记载,
        ],
        临时值排斥:[
            增加临时力量_记载
        ]
    }

    function 顺序序列化(剩余分数:{总分数:number},...args:记载[][]):Record<number,包含动态值的记载>{
        let index = 0
        let sequence:Record<number,包含动态值的记载> = {}
        let 分数分配占比 = distributePercentages(args.length)
        for(let i = 0 ; i < args.length ; i++){
            const cur_element = args[i]
             for(let k = 0 ; k < cur_element.length ; k++){
                 if(cur_element[k]){
                     const 使用的当前分数 = 剩余分数.总分数 * 分数分配占比[i] 
                     剩余分数.总分数 -= 使用的当前分数
                     DeepPrintTable(cur_element[k])
                     const 动态生成之后的值 = cur_element[k]?.绑定参数生成?.(使用的当前分数)
                     const 动态值的记载:包含动态值的记载 = {...cur_element[k],动态值:动态生成之后的值?.bind,绑定后的函数:动态生成之后的值?.fn}
                     sequence[index++] = 动态值的记载
                     continue;
                 }
             }
        }
        return sequence
    }

    export const test = () =>{
        // const out = table.random_weight_table(Object.values(所有输出节点))
        // const p1 = table.random(Object.values(施法触发))
        // const p2 = table.random(Object.values(单体目标判断))
        // const p3 = table.random(Object.values(可连接最终输出).filter(elm=> (out.输入 | elm.输出) == out.输入 || elm.输出 == out.输入))
        // return `${p1.test} => ${p2.test} => ${p3.test} => ${out.test} 名字=>${p1.名字}${p2.名字}${p3.名字}戒指`
        const main_profession = 随机一个主职业()
        const 物品得分 = 随机一个物品分数()
        const 修饰器输出选择 = table.random(修饰器集合)
        const 判断选择 = 根据权重选择集合中的函数_包含次数(main_profession,嵌套判断集合,RandomInt(1,2))
        const 连接最终输出选择 = 根据权重选择集合中的函数_包含次数(main_profession,可连接输出的记载集合.filter((elm:记载)=>{
            if(has_mask(elm.输出,修饰器输出选择.输入)){
                return true
            }
        }) as any,1).pop() as 可连接最终输出的记载

        const 需要扣除的所有分数 = [
            ...判断选择,
            修饰器输出选择,
            连接最终输出选择,
        ].map((elm:记载)=>elm.消费分数).reduce((pre:number,cur:number)=>{
            return pre + cur
        },0)

        物品得分.总分数 -= 需要扣除的所有分数;

        DeepPrintTable(
            {main_profession,修饰器输出选择,判断选择,连接最终输出选择}
        )

        const a = 顺序序列化(物品得分,[几率触发_记载],[元素分裂_记载],[随机选择一个元素_记载],[发射一枚元素球_记载],[OnAttacked]);
        
        print("最终输出")
        DeepPrintTable(a);

        return a;
        // 1.先执行什么 先执行判断选择 如果输出是一个布尔值的话 如果为true 我们执行 连接最终输出选择 

        // return `如果 ${判断选择.map(elm=>elm.test).join(",")} =>${连接最终输出选择.test.replace("x", (给最终输出的分数为 * 连接最终输出选择.最终得分转换率).toString() ) }${修饰器输出选择.test} 词条名:${
        //     修饰器输出选择.名字 + 判断选择.map(elm=>elm.名字).join("") + 连接最终输出选择.名字
        // }`
    }

}

