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
        8:"虚无",
    }

    export const item_yuan_chu_yi_shi = matrix._new([
        [/**太阳 */1,/**月亮 */1,/**火焰 */1],
        [/**雷电 */2,/**寒冰 */3,/**海洋 */2],
        [/**大地 */1,/**植物 */4,/**虚无 */3],
    ])

    export const item_ruo_he_li_jin_gu_shi = matrix._new([
        [/**太阳 */0.57,/**月亮 */0.7,/**火焰 */1],
        [/**雷电 */0.3,/**寒冰 */0.4,/**海洋 */1],
        [/**大地 */0.1,/**植物 */0.8,/**虚无 */3],
    ])

}
