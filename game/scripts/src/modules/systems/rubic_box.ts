import { matrix } from "../../lib/math/martrix";

/**
 * 拉比克的魔方相关属性
 */
export namespace rubic_box {
    
    /**合成的第一层过滤 */
    export const divinity = {
        0:"太阳",
        1:"月亮",
        2:"火焰",
        3:"雷电",
        4:"寒冰",
        5:"海洋",
        6:"大地",
        7:"植物",
        8:"虚空",
    }

    export const 物理攻击 = "a"
    export const 魔法攻击 = "b"
    export const 攻击速度 = "c"
    export const 移动速度 = "d"
    export const 魔法恢复 = "e"
    export const 护甲 = "f"
    export const 物理抗性 = "g"
    export const 魔法抗性 = "h"
    export const 状态抗性 = "h"
    export const 闪避 = "j"
    export const 生命恢复 = "k"
    export const 暴击率 = "l"
    export const 暴击加深 = "m"
    export const 魔法值 = "p"
    export const 生命值 = "q"

    export const 太阳 = []


    export const item_yuan_chu_yi_shi = () => matrix._new([
        [/**太阳 */RandomFloat(0,2),/**月亮 */RandomFloat(0,2),/**火焰 */RandomFloat(0,2)],
        [/**雷电 */RandomFloat(0,2),/**寒冰 */RandomFloat(0,2),/**海洋 */RandomFloat(0,2)],
        [/**大地 */RandomFloat(0,2),/**植物 */RandomFloat(0,2),/**虚空 */RandomFloat(0,2)],
    ])

    export const item_ruo_he_li_jin_gu_shi = () => matrix._new([
        [/**太阳 */RandomFloat(0,2),/**月亮 */RandomFloat(0,2),/**火焰 */RandomFloat(0,2)],
        [/**雷电 */RandomFloat(0,2),/**寒冰 */RandomFloat(0,2),/**海洋 */RandomFloat(0,2)],
        [/**大地 */RandomFloat(0,2),/**植物 */RandomFloat(0,2),/**虚空 */RandomFloat(0,2)],
    ])



}
