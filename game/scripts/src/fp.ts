import { Entity } from "./lib/ecs/Entity"
import { Class } from "./lib/utils/Class"
import { WFC } from "./lib/wfc/wfc2D"
import type {  SystemProgress,  OkPanel } from "./modules/component/special"

import * as snow_01 from "./modules/map_json/snow_01.json"
import * as citys_json from "./modules/map_json/city.json"
import * as zi_luo_lan_json from "./modules/map_json/zi_luo_lan_01.json"
import * as kuangdong from "./modules/map_json/kuang_dong_01.json"
import * as yan_shi from "./modules/map_json/yan_shi_01.json"
import * as ban_xue from "./modules/map_json/ban_xue_01.json"
import * as data from "./lib/wfc/data.json"


/**这里的key是城市的名字 */
const tileset_modules_type = {
    "qing_xue_cheng":snow_01,
    "zi_luo_lan_gao_yuan":zi_luo_lan_json,
    "zi_luo_lan_dang_an_guan":ban_xue,
    "ni_ao_er_de_de_bi_lu":yan_shi,
    "kuang_dong":kuangdong
}

export const NONE = {none:"none"} as any
export const WAIT = {wait:"wait"} as any

/**@noSelf */
export const NUM_WAIT = (val:number,get?:(instance:any)=>number) => ({wait:"wait",init:val,url:get}) as any
/**@noSelf */
export const STRING_WAIT = (val:string,get?:(instance:any)=>string) => ({wait:"wait",init:val,url:get}) as any
/**@noSelf */
export const BOOLEAN_WAIT = (val:boolean,get?:(instance:any)=>boolean) => ({wait:"wait",init:val,url:get}) as any
/**@noSelf */
export const TABLE_WAIT = (val:AnyTable,get?:(instance:any)=>AnyTable) => ({wait:"wait",init:val,url:get}) as any




export function cache_remove(context:InstanceType<any>){
    context["$$$$death"] = true;
    cache_remove_all(context)
}

export function clear_event(...fns:((contenxt:InstanceType<any>)=>void)[]){
    return (target:any) =>{
        container.comp_decorator_clear_container.set(target.name,fns)
        return target
    }
}


export const ecsGetKV = (obj:AnyTable,...args) => {
    const list: [string,any][] = []
    const newobj =  _replace$2obj(obj)
    for(const key in newobj){
        list.push([key,newobj[key]])
    }
    if(list.length == 0){
        const des = Object.getOwnPropertyDescriptors(obj)
        for(let i in des){
            des[i].set(args[i])
        }
        return;
    }
    return list;
}

export function traverseObject(parent:AnyNotNil,cond:(e:any)=>boolean,fn:Function) {
    for (let key in parent) {
        const value = parent[key]
        if(type(parent) == 'table' ){
             if(typeof value == "object"){
                traverseObject(value,cond,fn)
                fn(parent,key,value)
             }
        }
    }
}

export function tableWatch(callback:Function[],context?:InstanceType<any>){
    return (parrent,oldkey,value) => {
        const mt = {
            __metatable:value,
            __index : function(k){
                if( typeof value[k] != 'object'){
                    return value[k]
                }
                return {[k]:{}}
            },
            __newindex : function (k,val){
              const oldVal = value[k]
              value[k] = val
              if (oldVal != val){
                 callback?.forEach(f=>f(context))
                }
              }
        }
          parrent[oldkey] = setmetatable({},mt)
    }
}

export function has(obj:any,key:string|number){
    return type(obj) == 'table' && obj[key] != null
}

export class doc{
    
static watch<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(mode:"deep"|"none",...fns:((comp:InstanceType<T>,remove_tag?:boolean)=>void)[]) {
    return (target: T) => {
        const constructor = target.prototype.____constructor as (this:void,...args) => any
        target.prototype.____constructor = unco_new
        
        function unco_new(this:InstanceType<T>,...args:any) {
            constructor(this,...args)
            print("创造了根本")
            const cache_key = ecsGetKV(this,...args)
            const contenxt = this;
            DeepPrintTable(cache_key)
            if(cache_key === null){
                return
            }
            for(let [key,value] of cache_key){
                const newkey = container.comp_container.has(target.name) ? key  : "$$$$" + tostring(key)
                if(type(value) == 'table'){
                    const mt = {
                      __metatable:value,
                      __index : function(k){
                        if( typeof value[k] != 'object'){
                            return value[k]
                        }
                        return setmetatable({[k]:{}},{__newindex:function(deepk,deepv){
                            rawset(value[k],deepk,deepv)
                            fns.forEach(f=>f(contenxt))
                            return value[k][deepk]
                        }})
                    },
                      __newindex : function (k, v){
                        const oldVal = value[k]
                        print("设置",k,v)
                        rawset(value, k, v)
                        if (oldVal != v){
                              fns?.forEach(f=>f(contenxt))
                            }
                        }
                    }  
                    rawset(this as any,newkey,setmetatable({},mt))
                }
                else{
                    rawset(this as any,newkey,value)
                }  
                if(!container.comp_container.has(target.name)){
                    rawset(this as any,key,null)
                }
            }
            Timers.CreateTimer(()=>{
               if(this["$$$$entity"]){
                 fns.forEach(f=>f(this))
                 return
                }
                return 0.01
            })
            if(container.comp_container.has(target.name)) return; 
            const context = this
                cache_key.forEach(([key,value])=>{
                Object.defineProperty(this,key,{
                    "set":function(v){
                        print("当前什么KEY",key,"设置为",typeof v == "object" && v['uid'])
                        if(mode == "deep" && typeof v == 'object') {
                            const mt = {
                                __metatable:v,
                                __index : function(k){
                                    if( typeof v[k] != 'object'){
                                        return v[k]
                                    }
                                    return setmetatable({[k]:{}},{__newindex:function(deepk,deepv){
                                        rawset(v[k],deepk,deepv)
                                        fns.forEach(f=>f(context))
                                        return v[k][deepk]
                                    }})
                                },
                                __newindex : function (k,val){
                                  const oldVal = value[k]
                                  v[k] = val
                                  if (oldVal != val){
                                        fns?.forEach(f=>f(context))
                                      }
                                  }
                            }
                            this["$$$$" + key] = setmetatable({},mt)
                            fns.forEach(f=>f(this))
                            return
                        }
                        context["$$$$" + key] = v
                        fns.forEach(f=>f(context))
                    },
                    "get":function(){
                        return context["$$$$" + key]
                    },
                })
            })
            if(!container.comp_container.has(target.name)){
                container.comp_container.add(target.name)
            }
        }
    }
    }
}


/**
 * 延迟一帧执行
 */
export function enquence_delay_call(){
    const cur:Map<string,Function> = new Map()
    const timer:Map<number,Function> = new Map()
    Timers.CreateTimer(()=>{
        for(let batch = 0 ; batch < 3 ; batch ++){
            const fns = cur.keys().next().value as string
            if(fns){
                if(cur.get(fns)() != "update"){
                    cur.delete(fns)
                }
            }
        }
        for(let [over_time,val] of timer){
            if(GetSystemTimeMS() >= Number(over_time) ){
                if(val() != "update"){
                   timer.delete(Number(over_time))
                }
            }
        }
        return 0.01
    })
    return (fn:Function,name?:string,delay_ms?:number) =>{
        if(delay_ms){
            timer.set(GetSystemTimeMS() + delay_ms,fn)
        }else{
            cur.set(name??DoUniqueString("fn"),fn)
        }
        
    }
}

export function to_save(){
    return (instance)=>{
        if(!container.to_save_container.has(instance.constructor.name)){
            container.to_save_container.add(instance.constructor.name)
        }
    }
}

export function to_debug(){
    return (instance)=>{
        if(!container.to_debug_container.has(instance.constructor.name)){
            container.to_debug_container.set(instance.constructor.name,getmetatable(instance).constructor as any)
        }
        if(getmetatable(instance)){
            if(getmetatable(getmetatable(instance))?.constructor?.name == "LinkedComponent"){
                const entity = GameRules.world.getEntityById(instance["$$$$entity"])
                if(entity == null) return;
                GameRules.enquence_delay_call(()=>{
                    CustomGameEventManager.Send_ServerToAllClients("s2c_debug_comp",{
                        comp_name:instance.constructor.name,
                        entity:instance["$$$$entity"] as any,
                        data:_replace$2obj(instance),
                        $_update_time:GetSystemTimeMS(),
                        is_link_component:"1"
                    })
                })
                return
            }
        }
        GameRules.enquence_delay_call(()=>{
            CustomGameEventManager.Send_ServerToAllClients("s2c_debug_comp",{
                comp_name:instance.constructor.name,
                entity:instance["$$$$entity"],
                data:_replace$2obj(instance),
                $_update_time:GetSystemTimeMS()
            })
        })
    }
}

// /**
//  * 实时的http访问 不等待时机 立刻刷新的函数
//  * 这个keys和实际服务器查找的语句并不匹配 而是实例接收的字段
//  * 所以导入keys 应该是一系列键值对  键代表接收 值代表数据库的查询语句
//  * keys 是查询的条件
//  * project是投影 把指定数据给我指定的字段
//  * 
//  */
// export function httpi<T>(
// mode:"init"|"update"|'both' = "both",
// dataSource:string,
// database:string,
// collection:string,
// data_finds:Partial<Record<keyof T,any>>,
// project:(Partial<{[key in keyof T]:string}>),
// intervalms:number,
// )
// {
//     let last_update_time = -1000
//     return (instance:T)=>{
//         instance = _replace$2obj(instance as any) as any
//         if( Object.keys(project).every(elm=>instance[elm] != null) && GameRules.GetGameTime() - last_update_time < intervalms) return
//         print("hhtpi   in")
//         last_update_time = GameRules.GetGameTime()
//         Object.keys(project).forEach(key=>{
//                 print("hhtpiwait")
//                 request(OpenAPI,{
//                     method:"POST",
//                     url:"/data/v1/action/findOne",
//                     body:{
//                         dataSource,
//                         database,
//                         collection,
//                         "filter":data_finds
//                     }
//                 }).then((elm:any)=>{
//                     print("hhtpi get")
//                     DeepPrintTable(elm)
//                     Object.keys(project).forEach(key=>{
//                         elm.document?.[project[key]] && (instance[key] = elm.document?.[project[key]])
//                     })
//                 }).catch(err=>{
//                     print(err)
//                 })
//         })
//     }
// }

/**
 * 该装饰器标识此组件需要与网络同步 
 */
export function http(mode:"init"|"update"|'both' = "both",dataSource:string,database:string,collection:string,stage:string,system_key?:(instance:InstanceType<any>) => Promise<MONGODB_SYSTEM_KEY>){
    return (instance:InstanceType<any>) => {
        GameRules.enquence_delay_call(()=>{
        if(container.is_has_http_comp.has(instance.constructor.name)){
            return;
        }
        if(collection == "user" && !container.http_with_user_container.has(instance.constructor.name)){
            container.http_with_user_container.set(instance.constructor.name,{dataSource,database,collection,stage,instance})
            return;
        }
        if(collection == "system" && !container.http_with_user_container.has(instance.constructor.name)){
            container.http_with_system_container.set(instance.constructor.name,{dataSource,database,collection,stage,instance,system_key})
            return;
        }
        container.http_comp_decorator_container.set(instance.constructor.name,{dataSource,database,collection,stage,instance})
        if(mode == "init" || mode == "both"){
            container.http_comp_decorator_container_with_init.set(instance.constructor.name,{dataSource,database,collection,stage,instance})
        }
        return instance
     }
    ,instance.constructor.name +"http")}
}




/**
 * 这个是频闭了一些关键词的replace
 * @param instance 
 * @returns 
 */
export function _replace$2obj(instance:object){
    let obj = {}
    for(let key in instance){
        if( key.includes("next")||key.includes("____constructor")||key.includes("constructor")) continue
        obj[key.replace("$$$$","")] = typeof instance[key] == 'object' ? getmetatable(instance[key]) ?? instance[key] : instance[key]
    }
    return obj
}


/**
 * 这个是频闭了一些关键词的replace
 * @param instance 
 * @returns 
 */
export function replace$2obj(instance:object){
    let obj = {}
    for(let key in instance){
        if( key.includes("next")||key.includes("____constructor")||key.includes("constructor")) continue
        obj[key.replace("$$$$","")] = instance[key] 
    }
    return obj
}

export function _replace$2KeytoArray(instance:object){
    let obj:string[] = []
    for(let key in instance){
        if( key.includes("entity") || key.includes("next")||key.includes("____constructor")||key.includes("constructor")) continue
        obj.push(key.replace("$$$$",""))
    }
    return obj
}


export function SatisfyFn<T>(predicate:(T:T)=>boolean,...fns:((T:T)=>void)[]){
    return (instance:T) => {
        predicate(instance) && fns.forEach(fn=>{
            fn(instance)
        })
    }
}

export function to_player_net_table<T>(){
    return (instance:T) => {
        const player_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.base.PLAYER)
        if(player_cmp == null) return;
        const cache = CustomNetTables.GetTableValue("player_comps","player" + player_cmp.PlayerID)
        const obj = {[instance.constructor.name]:_replace$2obj(instance as any)}
        CustomNetTables.SetTableValue("player_comps","player" + player_cmp.PlayerID,cache ? Object.assign(cache,obj) : obj)
    }
}



export function to_system_net_table<T>(){
    return (instance:T) => {
        const cache = CustomNetTables.GetTableValue("system_comps",instance.constructor.name)
        const obj = {[instance.constructor.name]:_replace$2obj(instance as any)}
        CustomNetTables.SetTableValue("system_comps",instance.constructor.name,cache ? Object.assign(cache,obj) : obj)
    }
}



export function to_client_event(owner:"player"|"hero"|"system"|"player_hero",is_clear:boolean = false){
    return (instance) => {
        if(getmetatable(instance) && getmetatable(getmetatable(instance))?.constructor.name == "LinkedComponent"){
            if(!container.to_client_event_container.has(instance)){
                container.to_client_event_container.add(instance)
            }
            GameRules.enquence_delay_call(()=>{
                const comp = replace$2obj(instance)
                if(comp['uid'] == null) return; 
                const player_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.dungeon.PlayerInfoComp)
                player_cmp && (comp["$$$$player_id"] = player_cmp.player_num);
                print("[ecs] 添加了一个linkcomp",getmetatable(instance)?.constructor.name)
                print(comp["uid"])
                DeepPrintTable(comp)

                if(player_cmp){
                    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_cmp.player_num as PlayerID),"s2c_link_comp_to_event",{uid:comp["uid"],class_name:getmetatable(instance)?.constructor.name,comp,ecs_entity_index:instance['$$$$entity']})
                }else{
                    CustomGameEventManager.Send_ServerToAllClients("s2c_link_comp_to_event",{uid:comp["uid"],class_name:getmetatable(instance)?.constructor.name,comp,ecs_entity_index:instance['$$$$entity']})
                }
              return
           },instance["$$$$uid"],111)
            return;
        }   
    }
}

export function PickArrayNumString2D<T>(arr:Record<numString,Record<numString,T>>,x:number,y:number,width_range:number,height_range:number):Record<numString,T>{
    const res:Record<numString,T> = {}
    let index = 0;
    for(let i = x-width_range;i<=x+width_range;i++){
        for(let j = y-height_range;j<=y+height_range;j++){
            if(arr[i.toString()]?.[j.toString()]){
                index++
                res[index.toString()] = arr[i.toString()]?.[j.toString()]
            }
        }
    }
    return res;
}
 
//删除删除表里的所有值
export function cache_remove_all(cache:object){
    for(let key in cache){
        if(key == "$$$$death"){
            continue
        }
        if(typeof cache[key] == "object" && ((cache[key] as CDOTA_BaseNPC_Hero).entindex)){
            cache[key] = undefined
            continue
        }
        if(cache[key] instanceof Entity){
            cache[key] = undefined
            continue
        }
        if(typeof cache[key] == "object"){
            cache_remove_all(getmetatable(cache[key]) ?? cache[key])
            cache[key] && (cache[key] = null)
        }
        cache[key] = null
    }
}




export function get_entity(comp:any){
    if(comp["$$$$entity"] == null){
        Warning(`没有找到${comp.constructor.name}的实体标记`)
        return
    }
    const entity = GameRules.world.getEntityById(comp["$$$$entity"])
    if(entity == null){
        Warning(`${comp.constructor.name}的实体标记过期了`)
    }
    return entity
}

/**@noSelf */
export function TriggerOkPanel(tile:string,uid_name:string,type:string,data:AnyTable,call_back:(panel_event:OkPanel)=>void){
    const uuid = DoUniqueString(uid_name)
    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(this.GetCaster().GetPlayerOwnerID()),"OkPanel",{
        title:tile,
        uuid,
        type:type,
        data:data
   })
   const id = CustomGameEventManager.RegisterListener(uuid,(_,panel_event)=>{
      panel_event(panel_event)
   })
}

/**
 * 通过静态数据创造地图
 * @param city_name 
 */
export async function create_npc_with_static(city_name:string){
    for(const elm of citys_json[city_name as keyof typeof citys_json].npcs){
        const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
            targetname:elm.name,
            origin:`${elm.origin.x} ${elm.origin.y} ${elm.origin.z}`,
            angles:`${elm.angles.x} ${elm.angles.y} ${elm.angles.z}`,
            scales : `${1} ${1} ${1}`,
            model :elm.model,
            lightmapstatic:"1",
            renderfx:"kRenderFxPulseFast",
            solid:"0",
            skin:elm,
            DefaultAnim:"ACT_DOTA_IDLE"
        }) as CDOTA_BaseNPC_Hero
    }
}


export async function create_with_static_table(city_name:string,progress?:SystemProgress,map_cache?:InstanceType<typeof c.base.MarkCache>){
    try{
    let i = 0
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
                await interval(GameRules.GetGameFrameTime() / 2)
                const {modelname,rotate} = citys_json[city_name as keyof typeof citys_json].modules[x + y * 8]
                const skin = citys_json[city_name as keyof typeof citys_json].skin
                DebugDrawText(Vector(x * 1024 -3072,y * 1024 - 4089.4,3),`${x},${y}`,true,9999);
                //model顺时针旋转次数（每次90度）, 类型 number 
                const data = tileset_modules_type[city_name as keyof typeof tileset_modules_type]["tileset" + modelname] as typeof tileset_modules_type['qing_xue_cheng']['tileset1']
                if(data){
                    for(let elm of data){
                        i++;
                        // const raworigin = Vector(x * 1024 - 16384  + elm.origin.x,y * 1024 - 16384 + elm.origin.y,3)
                        const op_buildy = RotatePosition(Vector(0,0,0),QAngle(0,-rotate * 90,0),Vector(elm.origin.x,elm.origin.y,elm.origin.z))
                        let angles = `0 ${elm.angle.y + rotate * 90} 0`
                        let vector_l = Vector(x * 1024 - 3072 + op_buildy.x,y * 1024 - 4096 + op_buildy.y, elm.origin.z + 127)
                        // DebugDrawText(raworigin,`rotate:${rotate} model${modelname}`,true,9999);
                        if(elm.name.includes("tree")){
                            const ent = CreateTempTreeWithModel(vector_l,99999,elm.model)
                            ent.SetAngles(0,RandomInt(0,360),RandomInt(-5,5))
                            map_cache.cache.set(`${vector_l.x}_${vector_l.y}_${i}`,ent)
                            continue;
                        }
                        if(elm.model.includes("tileset_snow_")){
                            vector_l = Vector(x * 1024 - 3072,y * 1024 - 4096, elm.origin.z + 127)
                        }
                        const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
                            targetname:elm.name,
                            origin:vector_l,
                            angles,
                            scales : `${elm.scale} ${elm.scale} ${elm.scale}`,
                            skin,
                            model :elm.model,
                            lightmapstatic:"1",
                            renderfx:"kRenderFxPulseFast",
                            solid:"0",
                            DefaultAnim:"ACT_DOTA_IDLE"
                        }) as CDOTA_BaseNPC_Hero
                        map_cache.cache.set(`${vector_l.x}_${vector_l.y}_${i}`,prop_dynamic)
                    }
                }
                progress.cur++;
            }
    }
    }
    catch(err){
        print(err)
    }
}

export function TriggerBigWolrdTile(tile:string,position:[number,number,number]){
    print("发送了大字事件")
    CustomGameEventManager.Send_ServerToAllClients("s2c_big_world_tile",{
        position,
        tile
    })
}

export async function create_city_road_wfc(wfc_json_data:any,width:number,height:number){
    // const uuid = DoUniqueString("mark_cache")
    // const map_ent = new Entity();
    // this.engine.addEntity(map_ent);
    // const map_cache = new MarkCache(uuid,new Map(),false,true)
    // map_ent.add(map_cache)
    // // let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
    // const progress = new SystemProgress("mark_loading_build_over",uuid,8 * 8,0,"正在生成中...",false)
    // map_ent.add(progress)
    try{

    let wfc2d = new WFC.WFC2D(wfc_json_data)
    //设定地图尺寸
    let mapWidth = 8;
    let mapHeigth = 8;
    //计算生成 地图数据 ，返回数据类型 数组 [[string,number],.....]

    // const next = (count:number) => progress.cur = count
    const next = (count:number) => {};
    
    let resultMap = await wfc2d.collapse(mapWidth, mapHeigth,next);
    let record = []
    let count = 0
    for (let y = 0; y < width; y++) {
     for (let x = 0; x < height; x++) {
            let imgData = resultMap[count];
            count++
            //model资源名 , 类型 string
            let modelname = imgData[0];
            // DebugDrawText(Vector(-x * 2048,-y * 2048,128),`${modelname}`,true,9999);
            //model顺时针旋转次数（每次90度）, 类型 number 
            // const data = kuangdong["tileset" + modelname as keyof typeof zi_luo_lan_json] 
            record.push(modelname)

        }    
       }
       DeepPrintTable(record)
       return record
    //    const json_str = JSON.encode(record)
    //    // print(json_str)
    //    const http = CreateHTTPRequest("POST","http://localhost:3123/")
    //    http.SetHTTPRequestRawPostBody("application/json",json_str)
    //    http.Send((res)=>{})
    //    return map_cache
    }
    catch(err){
        print(err)
    } 
    // })


}


export function sigmoid() {
    return (x:number) => 1 / (1 + math.exp(-x))  
}

export function TRACE(text:string,trace:boolean,http:boolean = false){
    const info = debug.getinfo(1)
    const source = info.source
    const line = info.currentline   
    if(trace){
        print(`[ecs][${source}:${line}] ${text}`)
        print("一一一oo一一一oo一一一oo一一一oo一一一oo一一一oo一一一oo")
        for(let i = 1 ; i < 1000 ; i++){
            const localab = debug.getlocal(2,i)
            if(localab[0] == null){
                break
            }
            print(localab[0],localab[1])
        }
        print(` 一一一oo一一一oo一一一oo一一一oo一一一oo一一一oo一一一oo`)
    }else{
        print(`[${source}:${line}] ${text}`)
    }
}


/**
 * 等待函数
 * @param val 
 * @returns 
 */
export function interval(val:number){
    return new Promise((res,rej)=>{
        Timers.CreateTimer(val,()=>{
            res(null)
        })
    })
}


/**
 * 
 * @returns 伤害过滤器注册
 */
export function damage_filter_register(){
    const fucs:Map<string,((event:DamageFilterEvent)=>boolean)> = new Map()
    return (name:string,call:(event:DamageFilterEvent)=>boolean,clear?:boolean) =>{
        if(clear){
            fucs.delete(name)
            GameRules.GetGameModeEntity().SetDamageFilter<{fucs:Map<string,((event:DamageFilterEvent)=>boolean)>}>(function(event){
                print(`[ecs] 运行伤害过滤器 ${name}`)
                let out = false
                for(let fuc of this.fucs){
                    print(`[ecs] 指定过滤器 ${fuc[0]}`)
                    out = fuc[1](event)
                }
                return out
            },{fucs})
            return
        }
        fucs.set(name,call)
        print(`[ecs] 注册伤害过滤器 ${name}`)
        GameRules.GetGameModeEntity().SetDamageFilter<{fucs:Map<string,((event:DamageFilterEvent)=>boolean)>}>(function(event){
            print(`[ecs] 运行伤害过滤器 ${name}`)
            let out = false
            for(let fuc of this.fucs){
                print(`[ecs] 指定过滤器 ${fuc[0]}`)
                out = fuc[1](event)
            }
            return out
        },{fucs})
    } 
}


export function RemoveParticleCallBack(particle:ParticleID,immediate: boolean){
    return () => {
        ParticleManager.DestroyParticle(particle,immediate)
        ParticleManager.ReleaseParticleIndex(particle)
    }
}


export function BindDota2EntityLinkEcsEntity(dota_ent_index:EntityIndex,ecs_id:number){
    print("绑定了ecs-dota之间的练习",dota_ent_index,ecs_id)
    CustomGameEventManager.Send_ServerToAllClients("s2c_bind_dota_entity_to_ecs_entity",{
        ecs_entity_id:ecs_id,
        dota_entity:dota_ent_index
    })
}

/**掩码是否存在 */
export function has_mask(mask:number,flag:number){
    return (mask & flag) == flag
}

export function flattenArray<T>(array: T[][]): T[] {  
    return array.reduce((acc, val) => acc.concat(val), []);  
}  

/**随机分配一个长度的百分比分割 */
export function distributePercentages(length: number): number[] {  
    // 首先，确保长度是正数  
    if (length <= 0) {  
        print("distributePercentages错误")
    }  
  
    // 初始化一个数组来存储百分比  
    let percentages: number[] = [];  
  
    // 分配剩余的百分比  
    let remainingPercent = 100;  
  
    // 生成length-1个随机百分比值，确保剩余一个百分比用于最后一个元素  
    for (let i = 0; i < length - 1; i++) {  
        // 生成一个1到remainingPercent之间的随机整数（包括两端）  
        const randomPercent = Math.floor(Math.random() * remainingPercent) + 1;  
  
        // 将这个百分比添加到数组中，并从剩余百分比中减去它  
        percentages.push(randomPercent);  
        remainingPercent -= randomPercent;  
    }  
  
    // 添加最后一个百分比，它是剩余的所有百分比  
    percentages.push(remainingPercent);  
  
    // 返回分配好的百分比数组  
    return percentages;  
}  

export function compose<T extends 输入数据<any>>(  
    predicate: (result: T) => boolean,  
    ...functions: ((arg: T) => T)[]  
): (arg: T) => T {  
    if (functions.length === 0) {  
        return (arg: T) => arg; // 返回恒等函数  
    }  
    return functions.reverse().reduce((composed, fn) => {  
        return (arg: T) => {  
            const result = fn(arg);  
            if (predicate(result)) {  
                print('predicate 通过了，执行下一个函数');  
                return composed(result); // 将结果传递给下一个函数  
            } else {  
                print('predicate 未通过，中止函数链');  
                return result; // 不执行下一个函数，直接返回当前结果  
            }  
        };  
    }, (arg: T) => arg); // 初始值为恒等函数  
}


export function 组合函数不阻断<T extends 输入数据<any>>(  
    predicate: (result: T) => boolean,  
    ...functions: ((arg: T) => T)[]  
): (arg: T) => T {  
    if (functions.length === 0) {  
        return (arg: T) => arg; // 返回恒等函数  
    }  
    return functions.reverse().reduce((composed, fn) => {  
        return (arg: T) => {  
            const result = fn(arg);  
            return composed(result); // 将结果传递给下一个函数  
        };  
    }, (arg: T) => arg); // 初始值为恒等函数  
}

export function GenerateSplitVectors(center: Vector, forward: Vector, radius: number, splitCount: number): Vector[]  
{  
    const raw_forward = center.__add(forward.__mul(radius))
    
    const list:Vector[] = []

    let 累记角度 = 0;
    for(let i = 0 ; i < splitCount ; i++){
        if(i == 0){
             list.push(raw_forward)
             continue;
        }
        const 单双 = i % 2;
        累记角度 += 180 / splitCount
        const vec = RotatePosition(raw_forward,QAngle(0,((单双 == 0) ? 累记角度 : -累记角度),0),center)
        list.push(vec)
    }
    return list
}

/**
 * 查询给固定背包中是否有目标物品index 查找到指定的固定背包
 */
export function CheckGetHasInventoryItemWithEntity(dota_ent_index:EntityIndex):{elm:any,old_slot:number}{
    const role = GameRules.QSet.is_select_role.first
    let out:{elm:any,old_slot:number}
    role.iterate(c.role.WarehouseInventory,(elm)=>{
        for(let key = 1 ; key <= 6 ; key ++ ){
            if(elm.ItemSlots[key] == dota_ent_index){
                out = {elm,old_slot:key}
            }
        }
    })
    TRACE("找到了指定的数据",true)
    return out
}

/**查询快捷栏中是否有目标物品index */
export function CheckGetHasItemWithEntity(hero:CDOTA_BaseNPC_Hero,dota_ent_index:EntityIndex){
    for(let i = 0 ; i < 9 ; i++){
        const item = hero.GetItemInSlot(i)
        if(item){
            if(item.entindex() == dota_ent_index){
                print("在",i,"号位置找到物品")
                return i 
            }
        }
    }
    return null;
}


//给一段时间 一个起始速度 一个时间节点 生成一个起伏的抛物线的Z轴高度 在这段时间里抛物线从最低点到最高点然后降落在最低点
// 加入重力与空气阻力
export function GenerateParabolaZHeight(time:number,start_speed:number,time_node:number, gravity:number = 9.8, air_resistance:number = 0.1){
    const a = 2 * start_speed / time_node
    const b = start_speed
    const c = 0
    const z = a * time * time + b * time + c - (gravity * time * time) / 2 - air_resistance * time
    return z
}

  
// 构建抛物线函数  
export function parabola(t: number): number {  
    const g: number = 9.8; // 重力加速度  
    const v0: number = 3; // 起跳速度  
    const hMax: number = 300; // 最大高度  
    return -g / 2 * t ** 2 + v0 * t + hMax + g * (v0 ** 2) / (2 * 2);  
}  
//写一个类似野蛮人大跳的抛物线函数

export type TEasing = (time: number) => number;

export interface IEasingMap {
  linear: TEasing;
  quadratic: TEasing;
  cubic: TEasing;
  elastic: TEasing;
  inQuad: TEasing;
  outQuad: TEasing;
  inOutQuad: TEasing;
  inCubic: TEasing;
  outCubic: TEasing;
  inOutCubic: TEasing;
   inQuart: TEasing;
  outQuart: TEasing;
  inOutQuart: TEasing;
  inQuint: TEasing;
  outQuint: TEasing;
  inOutQuint: TEasing;
  inSine: TEasing;
  outSine: TEasing;
  inOutSine: TEasing;
  inExpo: TEasing;
  outExpo: TEasing;
  inOutExpo: TEasing;
  inCirc: TEasing;
  outCirc: TEasing;
  inOutCirc: TEasing;
}

export const easing: IEasingMap = {
  // No easing, no acceleration
  linear: (t) => t,

  // Accelerates fast, then slows quickly towards end.
  quadratic: (t) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4),

  // Overshoots over 1 and then returns to 1 towards end.
  cubic: (t) => t * (4 * t * t - 9 * t + 6),

  // Overshoots over 1 multiple times - wiggles around 1.
  elastic: (t) => t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15),

  // Accelerating from zero velocity
  inQuad: (t) => t * t,

  // Decelerating to zero velocity
  outQuad: (t) => t * (2 - t),

  // Acceleration until halfway, then deceleration
  inOutQuad: (t) => t <.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Accelerating from zero velocity
  inCubic: (t) => t * t * t,

  // Decelerating to zero velocity
  outCubic: (t) => (--t) * t * t + 1,

  // Acceleration until halfway, then deceleration
  inOutCubic: (t) => t <.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Accelerating from zero velocity
  inQuart: (t) => t * t * t * t,

  // Decelerating to zero velocity
  outQuart: (t) => 1 - (--t) * t * t * t,

  // Acceleration until halfway, then deceleration
  inOutQuart: (t) => t <.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  // Accelerating from zero velocity
  inQuint: (t) => t * t * t * t * t,

  // Decelerating to zero velocity
  outQuint: (t) => 1 + (--t) * t * t * t * t,

  // Acceleration until halfway, then deceleration
  inOutQuint: (t) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

  // Accelerating from zero velocity
  inSine: (t) => -Math.cos(t * (Math.PI / 2)) + 1,

  // Decelerating to zero velocity
  outSine: (t) => Math.sin(t * (Math.PI / 2)),

  // Accelerating until halfway, then decelerating
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Exponential accelerating from zero velocity
  inExpo: (t) => Math.pow(2, 10 * (t - 1)),

  // Exponential decelerating to zero velocity
  outExpo: (t) => -Math.pow(2, -10 * t) + 1,

  // Exponential accelerating until halfway, then decelerating
  inOutExpo: (t) => {
    t /= .5;
    if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
    t--;
    return (-Math.pow( 2, -10 * t) + 2) / 2;
  },

  // Circular accelerating from zero velocity
  inCirc: (t) => -Math.sqrt(1 - t * t) + 1,

  // Circular decelerating to zero velocity Moves VERY fast at the beginning and
  // then quickly slows down in the middle. This tween can actually be used
  // in continuous transitions where target value changes all the time,
  // because of the very quick start, it hides the jitter between target value changes.
  outCirc: (t) => Math.sqrt(1 - (t = t - 1) * t),

  // Circular acceleration until halfway, then deceleration
  inOutCirc: (t) => {
    t /= .5;
    if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
    t -= 2;
    return (Math.sqrt(1 - t * t) + 1) / 2;
  }
};


export function rolltable (roll_table:{击中几率:number,击中后随机的数值:{min:number,max:number}}[]):number{
    const seleced = roll_table.find(elm=>RollPercentage(elm.击中几率))
    if(seleced){
        return RandomInt(seleced.击中后随机的数值.min,seleced.击中后随机的数值.max)
    }else{
        const bad = table.shuffle(roll_table).pop()
        return RandomInt(bad.击中后随机的数值.min,bad.击中后随机的数值.max)
    }
}

//写一个rollweight权重[{wight:number,aciton:()=>{}}]的函数
export function rollweight (roll_table:{weight:number,aciton:Function}[]):void{
    const total = roll_table.reduce((acc,elm)=>acc + elm.weight,0)
    const random = RandomInt(1,total)
    let cur = 0
    for(let elm of roll_table){
        cur += elm.weight
        if(random <= cur){
            elm.aciton()
            return
        }
    }
}

export function entity_distance(a:CBaseEntity,b:CBaseEntity){
    return a.GetAbsOrigin().__sub(b.GetAbsOrigin()).Length2D()
}

/**
 * 创造一个踩踏开关
 */
export function CreateUpDown(origin:Vector,call_back:(event:{activator:CDOTA_BaseNPC_Hero})=>void,bind_int_attr?:[string,number]):CBaseModelEntity{
    //models/props_structures/ancient_trigger001.vmdl
    const volume_name = DoUniqueString("volume")

    const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
        targetname:"temp",
        origin:`${origin.x} ${origin.y} ${origin.z}`,
        angles:`1 1 1`,
        scales : `${1} ${1} ${1}`,
        DefaultAnim:"ACT_DOTA_IDLE",
        model :"models/props_structures/ancient_trigger001.vmdl",
    }) as any

    if(bind_int_attr){
        (prop_dynamic as CBaseModelEntity).SetIntAttr(bind_int_attr[0],bind_int_attr[1])
        switch(bind_int_attr[1]){
            case 1:{
                (prop_dynamic as CBaseModelEntity).SetRenderColor(55,0,0)
                break;
            }
            case 2:{ 
                (prop_dynamic as CBaseModelEntity).SetRenderColor(55,55,0)
                break;
            }
            case 3:{
                (prop_dynamic as CBaseModelEntity).SetRenderColor(0,0,55)
                break;
            }
            case 4:{
                (prop_dynamic as CBaseModelEntity).SetRenderColor(55,0,55)
                break;
            }
            case 5:{
                (prop_dynamic as CBaseModelEntity).SetRenderColor(0, 55, 0)
                break;
            }
        }
    }

    const trigger = SpawnEntityFromTableSynchronous("trigger_dota",{
        targetname:volume_name,
        origin:origin,
        angles:"0 0 0",
        scales : `1 1 1`,
        model :GameRules.trigger_base.GetModelName(),
        every_unit:true,
    }) as CBaseTrigger
    trigger.RedirectOutput('OnTrigger', 'startTouchHandler', trigger)
    trigger.Enable()
    trigger['startTouchHandler'] = (event)=>{
        const entity = event.activator as CDOTA_BaseNPC
        if(!entity.IsRealHero()){
            return
        }
        prop_dynamic.SetSequence("ancient_trigger001_down")
        GameRules.enquence_delay_call(()=>{
            prop_dynamic.SetSequence("ancient_trigger001_down_idle")
        },undefined,800)
        call_back(event)
    }

    return prop_dynamic
}

export function SetObstacles(info_target:CBaseEntity){
    info_target.SetIntAttr("Obstacles",1);
}

export function NearbyObstacles(origin:Vector,radius:number){
    return Entities.FindAllByClassnameWithin("info_target",origin,radius)
            .some(elm=>elm.GetIntAttr("Obstacles") == 0)
}

/**确保单位的每一个标签都没有 */
export function InfoTargetTagEvery(dota_ent:CBaseEntity,...args:INFO_TARGET_TAG[]){
    return [...args.map(elm=>dota_ent.GetIntAttr(elm) == null)].every(elm=>elm)
}

/**从一组表里找到没有任何标签的info_target */
export function FindNullTagInfoTarget(dota_ent:CBaseEntity[],...args:INFO_TARGET_TAG[]){
    return dota_ent.filter(elm=> args.every(tag=>elm.GetIntAttr(tag) == 0))
}
