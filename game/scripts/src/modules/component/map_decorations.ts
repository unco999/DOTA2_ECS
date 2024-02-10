import {  clear_event, to_client_event, cache_remove, doc } from "../../fp";

export class Creep {
    constructor(
        public x: number,
        public y: number,
        public type:string,
        public name:string,
        /**解密等级 与地图下一层相关 */
        public decrypt_level: number,
        /**本次随机的怪物数值等级 */
        public random_scale: number,
        /**怪物模型 */
        public model:string,
        /**怪物行为模式 */
        public ai:number
    ){

    }
}


export class Event{
    constructor(
        public x: number,
        public y: number,
        public type:string,
        public name:string
    ){

    }
}


