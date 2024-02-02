import { http, to_debug, doc } from "../../fp";


/**
 * 这里是通过类名为#comp 和 steam_id 为主键的方式来更新mongodb
 * 但是这个系统在数据库里是一个通用组件 所以旧的http装饰器并不能容纳这个系统
 */
@doc.watch("none",
// http("init","mongodb-atlas","dota-test","system","ui_city=>loading",
// (instance:CurCityInfo)=>
// new Promise((res,rej)=>{
//     Timers.CreateTimer(0.1,()=>{
//         if(instance.city_name){
//             res(instance.city_name as MONGODB_SYSTEM_KEY)
//             return;
//         }
//         return 0.1
//     })
// })
to_debug()
)
export class CurCityInfo{
    constructor(
        public city_name:string,
        public cur_dialog_npc:string,
    ){

    }
}