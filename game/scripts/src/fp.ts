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


/**这里的key是城市的名字 */
const tileset_modules_type = {
    "qing_xue_cheng":snow_01,
    "zi_luo_lan_gao_yuan":zi_luo_lan_json,
    "zi_luo_lan_dang_an_guan":ban_xue,
    "ni_ao_er_de_de_bi_lu":yan_shi
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
    print("启动了清除功能")
    context["$$$$death"] = true;
    cache_remove_all(context)
}

export function clear_event(...fns:((contenxt:InstanceType<any>)=>void)[]){
    return (target:any) =>{
        container.comp_decorator_clear_container.set(target.name,fns)
        return target
    }
}


export const ecsGetKV = (obj:AnyTable) => {
    const list: [string,any][] = []
    for(const key in obj){
        list.push([key,obj[key]])
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
                print("tableWatch访问的k",k,value)
                if( typeof value[k] != 'object'){
                    return value[k]
                }
                print("tableWatchtableWatchtype(value) == 'table'","返回的代理")
                return {[k]:{}}
            },
            __newindex : function (k,val){
              const oldVal = value[k]
              value[k] = val
              print("tableWatch访问的k深度值检测到了",k)
               print(this?.constructor?.name)
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
            const cache_key = ecsGetKV(this)
            const contenxt = this;
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
                            print(`一层${key} 二层${k} 三层${deepk} ${deepv}`)
                            rawset(value[k],deepk,deepv)
                            fns.forEach(f=>f(contenxt))
                            return value[k][deepk]
                        }})
                    },
                      __newindex : function (k, v){
                        const oldVal = value[k]
                        rawset(value, k, v)
                        if (oldVal != v){
                              print(`[watch] ${contenxt['$$$$entity']} table change [${tostring(k)} = ${v}] oldvalue[${oldVal}]`) 
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
                    this[key] = null
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
                        if(mode == "deep" && typeof v == 'object') {
                            const mt = {
                                __metatable:v,
                                __index : function(k){
                                    print("取值",k,v[k])
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
                        this["$$$$" + key] = v
                        fns.forEach(f=>f(this))
                    },
                    "get":function(){
                        return this["$$$$" + key]
                    },
                })
            })
            container.comp_container.add(target.name)
        }
    }
    }
}


/**
 * 延迟一帧执行
 */
export function enquence_delay_call(){
    const cur:Map<string,Function> = new Map()
    Timers.CreateTimer(()=>{
        const fns = cur.keys().next().value as string
        if(fns){
            cur.get(fns)();
            cur.delete(fns)
        }else{
            return GameRules.GetGameFrameTime() * 3
        }
        return GameRules.GetGameFrameTime()
    })
    return (fn:Function,name?:string) =>{
        cur.set(name??DoUniqueString("fn"),fn)
    }
}

export function to_save(){
    return (instance)=>{
        if(!container.to_save_container.has(instance.constructor.name)){
            print("添加了to_save")
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
                print("创造的name",instance.constructor.name)
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
                data:replace$2obj(instance),
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


export function weak(t:AnyTable){
    const new_proxy = newproxy(true) 
        const mt = getmetatable(new_proxy)
        mt.__gc = function(){ print(`[gc]: ${t} is remove cache`) }
        mt.__index = t as any
        mt.__metatable = t
        mt.__newindex = t as any
        return new_proxy as any
}

export function replace$2obj(instance:object){
    let obj = {}
    for(let key in instance){
        obj[key.replace("$$$$","")] = typeof instance[key] == 'object' ? getmetatable(instance[key]) ?? instance[key] : instance[key]
    }
    return obj
}

/**
 * 这个是频闭了一些关键词的replace
 * @param instance 
 * @returns 
 */
export function _replace$2obj(instance:object){
    let obj = {}
    //@ts-ignore
    for(let key in instance){
        if(  key.includes("next")||key.includes("____constructor")||key.includes("constructor")) continue
        obj[key.replace("$$$$","")] = typeof instance[key] == 'object' ? getmetatable(instance[key]) ?? instance[key] : instance[key]
    }
    return obj
}


export function SatisfyFn<T>(predicate:(T:T)=>boolean,...fns:((T:T)=>void)[]){
    return (instance:T) => {
        predicate(instance) && fns.forEach(fn=>{
            fn(instance)
            print("发出最终事件")
        })
    }
}

export function to_player_net_table<T>(){
    return (instance:T) => {
        const player_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.base.PLAYER)
        print("检车传递啊哈收到",instance['$$$$entity'])
        if(player_cmp == null) return;
        const cache = CustomNetTables.GetTableValue("player_comps","player" + player_cmp.PlayerID)
        const obj = {[instance.constructor.name]:replace$2obj(instance as any)}
        print("更新过后的cache")
        print(player_cmp.PlayerID)
        DeepPrintTable(obj);
        CustomNetTables.SetTableValue("player_comps","player" + player_cmp.PlayerID,cache ? Object.assign(cache,obj) : obj)
    }
}



export function to_system_net_table<T>(){
    return (instance:T) => {
        const cache = CustomNetTables.GetTableValue("system_comps",instance.constructor.name)
        const obj = {[instance.constructor.name]:replace$2obj(instance as any)}
        CustomNetTables.SetTableValue("system_comps",instance.constructor.name,cache ? Object.assign(cache,obj) : obj)
    }
}

export function to_client_event<T>(owner:"player"|"hero"|"system"|"player_hero",is_clear:boolean = false){
    return (instance:T) => {
        GameRules.enquence_delay_call(()=>{
            if(!container.to_client_event_container.has(instance)){
                container.to_client_event_container.add(instance)
            }
            const send_obj = Object.assign({},_replace$2obj(instance as object));
            if(owner == "system" ){
                CustomGameEventManager.Send_ServerToAllClients(instance.constructor.name,is_clear ? {} : send_obj);
                return;
            }
            if(owner == "player" ){
                const player_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.base.PLAYER)
                if(player_cmp == null) return;
                print("收到改变",instance.constructor.name)
                player_cmp && (send_obj["$$$$player_id"] = player_cmp.PlayerID);
                print(instance.constructor.name + player_cmp.PlayerID + "player");
                CustomGameEventManager.Send_ServerToAllClients(instance.constructor.name + player_cmp.PlayerID + "player",is_clear ? {} : send_obj );
                return;
            }
            if(owner == "hero"){
                const hero_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.base.HERO)
                if(hero_cmp == null) return;
                hero_cmp && (send_obj["$$$$hero_idx"] = hero_cmp.hero_idx);
                CustomGameEventManager.Send_ServerToAllClients(instance.constructor.name + hero_cmp.hero_idx + "hero",is_clear ? {} :send_obj);
                return;
            }
            if(owner == "player_hero"){
                const player_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.base.PLAYER)
                if(player_cmp == null) return;
                player_cmp && (send_obj["$$$$player_id"] = player_cmp.PlayerID);
                const hero_cmp = GameRules.world.getEntityById(instance['$$$$entity'])?.get(c.base.HERO)
                hero_cmp && (send_obj["$$$$hero_idx"] = hero_cmp.hero_idx);
                CustomGameEventManager.Send_ServerToAllClients(instance.constructor.name + player_cmp.PlayerID + hero_cmp.hero_idx + "player_hero",is_clear ? {} :send_obj);
                return;
            }
        },instance.constructor.name + "to_client_event")
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

export function $Log(title:string,...value:any[]){
    print(`[log:${title}] `);
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


//深度递归打印 如果目标有entindex函数 就只打印a.entindex()
export function deep_print(obj:AnyTable,deep?:string){
    for(let key in obj){
        print("[read::]",key);
        if( typeof key != "string"){
            continue
        }
        if( typeof obj[key] == "object" && (obj[key] as CDOTA_BaseNPC_Hero).entindex){
            print(`${deep ?? ""} => ${key} = ${(obj as CDOTA_BaseNPC_Hero).entindex()}`)
            continue
        }
        if(typeof obj[key] == "number" || typeof obj[key] == "boolean" || typeof obj[key] == "string"){
            print(`${deep ?? ""} => ${key} = ${obj[key]}`)
            continue
        }
        if(typeof obj[key] == "object"){
            deep_print(obj[key],key)
        }
    }
}


//compose 
export function compose<T>(...fns:((contexnt:T)=>any)[]){
    return (x:T) => {
        return fns.reduce((acc,fn)=> fn(acc),x)
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


export async function create_with_static_table(city_name:string,progress:SystemProgress,map_cache:InstanceType<typeof c.base.MarkCache>){
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
                        print("创造物",elm.model)
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

/**
 * wfc通过随机WFC创造地图
 * @param terrain_type
 * @returns 
 */
export async function create_city_road_wfc(terrain_type:string){
    // const uuid = DoUniqueString("mark_cache")
    // const map_ent = new Entity();
    // this.engine.addEntity(map_ent);
    // const map_cache = new MarkCache(uuid,new Map(),false,true)
    // map_ent.add(map_cache)
    // // let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
    // const progress = new SystemProgress("mark_loading_build_over",uuid,8 * 8,0,"正在生成中...",false)
    // map_ent.add(progress)
    try{

    let wfc2d = new WFC.WFC2D(citys_json as any)
    //设定地图尺寸
    let mapWidth = 8;
    let mapHeigth = 8;
    //计算生成 地图数据 ，返回数据类型 数组 [[string,number],.....]

    // const next = (count:number) => progress.cur = count
    const next = (count:number) => {};
    
    const map_cache = new Map()

    let resultMap = await wfc2d.collapse(mapWidth, mapHeigth,next);
    const skin = RandomInt(1,19);
    let record = []
    let count = 0
    for (let y = 0; y < mapHeigth; y++) {
     for (let x = 0; x < mapWidth; x++) {
            let imgData = resultMap[count++];
            //model资源名 , 类型 string
            let modelname = imgData[0];
            DebugDrawText(Vector(x * 1024 -3072,y * 1024 - 4089.4,3),`${x},${y}`,true,9999);
            //model顺时针旋转次数（每次90度）, 类型 number 
            let rotate = imgData[1];
            const data = kuangdong["tileset" + modelname as keyof typeof zi_luo_lan_json] 
            record.push({rotate,modelname})

        

            if(data){
                for(let elm of data){
                    // const raworigin = Vector(x * 1024 - 16384  + elm.origin.x,y * 1024 - 16384 + elm.origin.y,3)
                    const op_buildy = RotatePosition(Vector(0,0,0),QAngle(0,-rotate * 90,0),Vector(elm.origin.x,elm.origin.y,elm.origin.z))
                    let angles = `0 ${elm.angle.y + rotate * 90} 0`
                    let vector_l = Vector(x * 1024 - 3072 + op_buildy.x,y * 1024 - 4096 + op_buildy.y, elm.origin.z + 127)
                    // DebugDrawText(raworigin,`rotate:${rotate} model${modelname}`,true,9999);
                    if(elm.name.includes("tree")){
                        const tree = CreateTempTreeWithModel(vector_l,99999,elm.model)
                        tree.SetAngles(0,RandomFloat(0,360),RandomInt(0,5))
                        tree.SetModelScale(RandomFloat(0.8,1.2))
                        map_cache.set(`${x}${y}${elm.origin.x}${elm.origin.y}`,tree)
                        continue;
                    }
                    if(elm.model.includes("tileset_snow_")){
                        vector_l = Vector(x * 1024 - 3072,y * 1024 - 4096, elm.origin.z + 127)
                    }
                    const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
                        origin:vector_l,
                        angles,
                        scales : `${elm.scale} ${elm.scale} ${elm.scale}`,
                        skin : "mark" + 18,
                        model :elm.model,
                        lightmapstatic:"1",
                        renderfx:"kRenderFxPulseFast",
                        solid:"0",
                        DefaultAnim:"ACT_DOTA_IDLE"
                    }) as CDOTA_BaseNPC_Hero
                    map_cache.set(`${x}${y}${elm.origin.x}${elm.origin.y}`,prop_dynamic)

                }
            }else{
                const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
                    origin : `${x * 1024 - 3072} ${y * 1024 - 4096} ${1}`,
                    scales : `${1} ${1} ${1}`,
                    skin : "mark" + skin,
                    model :`models/3dtileset/snow_city_road/tileset_snow_${modelname}.vmdl`
                 }) as CBaseModelEntity
                map_cache.set(`${x}${y}`,prop_dynamic)
            }

        }    
       }
       const json_str = JSON.encode(record)
       // print(json_str)
       const http = CreateHTTPRequest("POST","http://localhost:3123/")
       http.SetHTTPRequestRawPostBody("application/json",json_str)
       http.Send((res)=>{})
       return map_cache
    }
    catch(err){
        print(err)
    } 
    // })

}

/**
 * 打印报告
 */
function chunk(){
    
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

_G['TriggerOkPanel'] = TriggerOkPanel

export const NUMMAX = math.huge

