import { has_mask } from "../../fp";
import { BaseModifier } from "../../utils/dota_ts_adapter";

export namespace FN {

    
    function 释放法术魔法消耗是否低于某个值(input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"释放法术魔法消耗是否超过某个值")
        return input.事件.ability.GetManaCost(1) < input.数据流[数据流类型.判断数值]
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
        }
    }

    function 释放法术魔法消耗是否超过某个值(input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"释放法术魔法消耗是否超过某个值")
        return input.事件.ability.GetManaCost(1) > input.数据流[数据流类型.判断数值]
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
        }
    }

    function 上一个技能是否释放的雷元素(input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"上一个技能是否释放的雷元素")
        const role = GameRules.QSet.is_select_role.first
        const ability_state_comp = role.get(c.role.RoleSpellState)
        if(!has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.雷元素)) return false;
        return true
    }

    export const 上一个技能是否释放的雷元素_记载:记载 = {
        消费分数:30,
        输入:数据流类型.技能,
        输出:数据流类型.布尔值,
        标识:"a000003",
        函数:释放法术魔法消耗是否超过某个值,
        test:"如果 上一个技能是释放的雷元素 则",
        名字:"雷之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        }
    }

    function 上一个技能是否释放的火元素(input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"上一个技能是否释放的雷元素")
        const role = GameRules.QSet.is_select_role.first
        const ability_state_comp = role.get(c.role.RoleSpellState)
        if(!has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.火元素)) return false;
        return true
    }

    export const 上一个技能是否释放的火元素_记载:记载 = {
        消费分数:30,
        输入:数据流类型.技能,
        输出:数据流类型.布尔值,
        标识:"a000004",
        函数:上一个技能是否释放的火元素,
        test:"如果 上一个技能是释放的火元素 则",
        名字:"火之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        }
    }

    function 上一个技能是否释放的水元素(input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"上一个技能是否释放的雷元素")
        const role = GameRules.QSet.is_select_role.first
        const ability_state_comp = role.get(c.role.RoleSpellState)
        if(!has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.水元素)) return false;
        return true
    }

    export const 上一个技能是否释放的水元素_记载:记载 = {
        消费分数:30,
        输入:数据流类型.技能,
        输出:数据流类型.布尔值,
        标识:"a000005",
        函数:上一个技能是否释放的水元素,
        test:"如果 上一个技能是释放的水元素 则",
        名字:"水之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        }
    }
    
    function 上一个技能是否释放的暗元素(input:输入数据<ModifierAbilityEvent>){
        assert(input.事件.ability,"上一个技能是否释放的雷元素")
        const role = GameRules.QSet.is_select_role.first
        const ability_state_comp = role.get(c.role.RoleSpellState)
        if(!has_mask(ability_state_comp.last_spell.element,ABILITY_ELEMENT.暗元素)) return false;
        return true
    }

    export const 上一个技能是否释放的暗元素_记载:记载 = {
        消费分数:30,
        输入:数据流类型.技能,
        输出:数据流类型.布尔值,
        标识:"a000006",
        函数:上一个技能是否释放的暗元素,
        test:"如果 上一个技能释放的是暗元素 则",
        名字:"暗之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        }
    }

    function 敌方血量是否高于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否高于")
        return target.GetHealthPercent() > input.数据流[数据流类型.判断数值]
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
        }
    }

    function 敌方血量是否低于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否低于")
        return target.GetHealthPercent() < input.数据流[数据流类型.判断数值]
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
        }
    }

    function 敌方魔法值是否高于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否低于")
        return target.GetManaPercent() > input.数据流[数据流类型.判断数值]
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
        }
    }

    function 敌方魔法值是否低于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const target = input.事件.target
        assert(target,"敌方血量是否低于")
        return target.GetManaPercent() < input.数据流[数据流类型.判断数值]
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
        }
    }

    function 我方血量是否高于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我血量是否低于")
        return m.GetManaPercent() > input.数据流[数据流类型.判断数值]
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
        }
    }

    function 我方血量是否低于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我血量是否低于")
        return m.GetManaPercent() < input.数据流[数据流类型.判断数值]
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
        }
    }

    function 我方魔法值是否高于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我方魔法值是否高于")
        return m.GetManaPercent() > input.数据流[数据流类型.判断数值]
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
        }
    }

    function 我方魔法值是否低于(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster()
        assert(m,"我方魔法值是否低于")
        return m.GetManaPercent() < input.数据流[数据流类型.判断数值]
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
        }
    }

    function 我方力量转换百分比为数值(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster() as CDOTA_BaseNPC_Hero
        assert(m,"我方力量转换百分比为数值")
        const strength = m.GetStrength()
        return strength * input.数据流[数据流类型.判断数值] / 100
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
        最终得分转换率:1.5
    }

    function 我方敏捷转换百分比为数值(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster() as CDOTA_BaseNPC_Hero
        assert(m,"我方力量转换百分比为数值")
        const agility = m.GetAgility()
        return agility * input.数据流[数据流类型.判断数值] / 100
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
        最终得分转换率:1.5
    }

    function 我方智力转换百分比为数值(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const m = input.修饰器.GetCaster() as CDOTA_BaseNPC_Hero
        assert(m,"我方力量转换百分比为数值")
        const intellect = m.GetIntellect()
        return intellect * input.数据流[数据流类型.判断数值] / 100
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
        最终得分转换率:1.5
    }


    function 我方增加临时力量(input:输入数据<ModifierAbilityEvent>|输入数据<ModifierAttackEvent>){
        const role = GameRules.QSet.is_select_role.first
        const temp_modifier_comp = role.get(c.role.TempAllModifierAndAttributeComps)
        if(temp_modifier_comp.attribute[ATTRIBUTE.力量] == null){
            temp_modifier_comp.attribute[ATTRIBUTE.力量] = 0
        }
        temp_modifier_comp.attribute[ATTRIBUTE.力量] += input.数据流[数据流类型.属性字段]
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
        最终得分转换率:1.5
    }

    function 几率触发(){

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
        最终得分转换率:0.1
    }
    
    export const PREATTACK_BONUS_DAMAGE:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.属性字段,
        输出:数据流类型.无,
        标识:"a000020",
        函数:上一个技能是否释放的火元素,
        test:"普通伤害增加",
        名字:"挥斩之",
        权重:{
            [PROFESSION.圣职者]:0.4,
            [PROFESSION.法师]:0.1,
            [PROFESSION.战士]:0.7,
            [PROFESSION.弓箭手]:0.7,
        },
        必要前置:[]
    }

    export const PREATTACK_CRITICALSTRIKE:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.属性字段 | 数据流类型.判断数值,
        输出:数据流类型.无,
        标识:"a000021",
        函数:上一个技能是否释放的火元素,
        test:"暴击率",
        名字:"暴击之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.6,
            [PROFESSION.战士]:0.2,
            [PROFESSION.弓箭手]:0.6,
        },
        必要前置:[几率触发_记载]
    }
    
    export const ON_ABILITY_EXECUTED:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.直接单位操作,
        输出:数据流类型.无,
        标识:"a000022",
        函数:上一个技能是否释放的火元素,
        test:"施法 则",
        名字:"施法之",
        权重:{
            [PROFESSION.圣职者]:0.8,
            [PROFESSION.法师]:0.8,
            [PROFESSION.战士]:0.4,
            [PROFESSION.弓箭手]:0.65,
        },
        必要前置:[几率触发_记载]
    }

    export const OnAttacked:修饰器记载 = {
        消费分数:30,
        输入:数据流类型.直接单位操作,
        输出:数据流类型.无,
        标识:"a000023",
        函数:上一个技能是否释放的火元素,
        test:"攻击中目标 则",
        名字:"火之",
        权重:{
            [PROFESSION.圣职者]:0.6,
            [PROFESSION.法师]:0.5,
            [PROFESSION.战士]:0.8,
            [PROFESSION.弓箭手]:0.7,
        },
        必要前置:[几率触发_记载]
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
        return table.random([
            EQUIPMENT_FRACTION.橙色,
            EQUIPMENT_FRACTION.白色,
            EQUIPMENT_FRACTION.粉色,
            EQUIPMENT_FRACTION.红色,
            EQUIPMENT_FRACTION.绿色,
            EQUIPMENT_FRACTION.蓝色
        ])
    }

    const 排斥节点 = {
        施法触发之元素排斥:[
            上一个技能是否释放的雷元素_记载,
            上一个技能是否释放的火元素_记载,
            上一个技能是否释放的水元素_记载,
            上一个技能是否释放的暗元素_记载,
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

    function 顺序序列化(...args:记载[][]|记载[]){
        let index = 0
        let sequence:Record<number,记载> = {}
        for(let i = 0 ; i < args.length ; i++){
            const cur_element = args[i] as 记载[]
            if(cur_element?.length){
                for(let k = 0 ; k < cur_element.length ; k++){
                    if(cur_element[k]){
                        sequence[index++] = Object.assign({},cur_element[k])
                        continue;
                    }
                }
            }else{
                sequence[index++] =Object.assign({},cur_element as unknown as 记载)
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

        const 给最终输出的分数为 = 物品得分 - 需要扣除的所有分数;

        DeepPrintTable(
            {main_profession,修饰器输出选择,判断选择,连接最终输出选择}
        )

        const a = 顺序序列化(判断选择,[连接最终输出选择],[修饰器输出选择]);
        
        print("最终输出")
        DeepPrintTable(a);

        return a;
        // 1.先执行什么 先执行判断选择 如果输出是一个布尔值的话 如果为true 我们执行 连接最终输出选择 

        // return `如果 ${判断选择.map(elm=>elm.test).join(",")} =>${连接最终输出选择.test.replace("x", (给最终输出的分数为 * 连接最终输出选择.最终得分转换率).toString() ) }${修饰器输出选择.test} 词条名:${
        //     修饰器输出选择.名字 + 判断选择.map(elm=>elm.名字).join("") + 连接最终输出选择.名字
        // }`
    }

}

