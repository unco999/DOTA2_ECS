// import { Entity } from "../../lib/ecs/Entity";
// import { System } from "../../lib/ecs/System";
// import { MarkCache } from "../component/base";
// import { SystemProgress } from "../component/special";
// import * as prefabs from "../map_json/qiang.json"
// import { WFC } from "../../lib/wfc/wfc2D";
// import * as snow_road_json from "../../lib/wfc/data.json";
// import * as snow_01 from "../map_json/snow_01.json"
// import * as citys_json from "../map_json/city.json"
// import * as zi_luo_lan_json from "../map_json/zi_luo_lan_01.json"
// import * as sha_mo_01 from "../map_json/sha_mo_01.json"
// import * as bi_lu from "../map_json/yan_shi_01.json"
// import * as yan_shi from "../map_json/yan_shi_01.json"
// import * as ban_xue from "../map_json/ban_xue_01.json"
// import * as kuangdong from "../map_json/kuang_dong_01.json"
// import { CurCityInfo } from "../component/city";
// import { interval } from "../../fp";


// /**这里的key是城市的名字 */
// const tileset_modules_type = {
//     "qing_xue_cheng":snow_01,
//     "zi_luo_lan_gao_yuan":zi_luo_lan_json,
//     "zi_luo_lan_dang_an_guan":ban_xue,
//     "ni_ao_er_de_de_bi_lu":yan_shi
// }

// function RemoveEliPreventFall(){
//     print("出版彭了")
// }


// export class generator_mark_build extends System{

//     // create_single_model(prefab:MapMarkBuildJSONInstance,progress:SystemProgress,map_chache:MarkCache){
//     //         progress.cur++
//     //             if(data.name.includes("obstruction")){
//     //                 const prop_dynamic = SpawnEntityFromTableSynchronous("point_simple_obstruction",{
//     //                     origin : `${cur_vector.x} ${cur_vector.y} ${cur_vector.z}`,
//     //                     angles : `${data.angle.x} ${data.angle.y} ${data.angle.z}`,
//     //                     scales : `${data.scale} ${data.scale} ${data.scale}`,
//     //                 })
//     //                 map_chache.cache.set(`${data.origin.x}${data.origin.y}${data.origin.z}obstruction`,prop_dynamic)
//     //             }else{
//     //                 const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
//     //                     origin : `${cur_vector.x} ${cur_vector.y} ${cur_vector.z}`,
//     //                     angles : `${data.angle.x} ${data.angle.y} ${data.angle.z}`,
//     //                     scales : `${data.scale} ${data.scale} ${data.scale}`,
//     //                     model : "models/test1.vmdl"
//     //                 })
//     //                 map_chache.cache.set(`${cur_vector.x}${cur_vector.y}${cur_vector.z}${data.model}`,prop_dynamic)
//     //             }
//     // }

//     //创造以某个中心扩张的正方形数组 每个数组是一个vector
//     create_box(center:Vector,wall_count:number,interval:number,data:typeof prefabs):MapMarkBuildJSONInstance[]{
//         const render_array:MapMarkBuildJSONInstance[] = []
//         const length = wall_count * interval
//         for(let i = 0 ; i <= length; i+=interval){
//             for(let j = 0 ; j <= length ; j+=interval){
//                 if(i == 0){
//                     if(j == 0){
//                         print("刷新corner_02")
//                         render_array.push({data:data['corner_02'],point:Vector(center.x - i,center.y - j,center.z)})
//                     }else if(j == (wall_count - 1) * interval){
//                         print("刷新corner_01")
//                         render_array.push({data:data['corner_01'],point:Vector(center.x - i,center.y - j,center.z)})
//                     }else if (j == (wall_count) * interval){

//                     }
//                     else{
//                         render_array.push({data:data["right"],point:Vector(center.x - i,center.y - j,center.z)})
//                     }
//                     continue;
//                 }
//                 if(i == length){
//                     if(j == 0){
//                         print("刷新corner_04")
//                         render_array.push({data:data["corner_04"],point:Vector(center.x - i,center.y- j,center.z)})
//                     }else if(j == (wall_count - 1) * interval){
//                         print("刷新corner_03")
//                         render_array.push({data:data["corner_03"],point:Vector(center.x - i,center.y- j,center.z)})
//                     }else if(j == (wall_count) * interval){

//                     }
//                     else{
//                         render_array.push({data:data["top"],point:Vector(center.x - i,center.y- j,center.z)})
//                     }
//                     continue;
//                 }
//                 if(j == 0){
//                     //左边
//                     render_array.push({data:data["left"],point:Vector(center.x - i,center.y - j,center.z)})
//                     continue;
//                 }
//                 if(j == length){
//                     //右边
//                     render_array.push({data:data["down"],point:Vector(center.x - i,center.y - j,center.z)})
//                     continue;
//                 }
//             }
//         }
//         return render_array
//     }


//     // /**这个要算中心坐标  也就是说这个模块根据这个中心坐标做偏置 */
//     // create_modules(){
//     //     const uuid = DoUniqueString("mark_cache")
//     //     const map_ent = new Entity();
//     //     const map_cache = new MarkCache(uuid,new Map(),false,true)
//     //     map_ent.add(map_cache)
//     //     // let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
     

//     //     const center = Vector(0,0,128)
//     //     const render_array =  this.create_box(center,25,256,prefabs)
//     //     const progress = new SystemProgress("mark_loading_build_over",uuid,render_array.length,0,"正在生成中...",false)
//     //     map_ent.add(progress)
//     //     this.engine.addEntity(map_ent);
//     //     let index = 0
//     //     Timers.CreateTimer(()=>{
//     //         if(progress.cur >= render_array.length){
//     //             return 
//     //         }            
//     //         this.create_single_model(render_array[index],progress,map_cache)
//     //         index++;
//     //         return GameRules.GetGameFrameTime()
//     //     },this)
     
//     // }

//     create_map_ent(){
//         const uuid = DoUniqueString("mark_cache")
//         const map_ent = new Entity();
//         this.engine.addEntity(map_ent);
//         const map_cache = new MarkCache(uuid,new Map(),false,true)
//         map_ent.add(map_cache)
//         let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
//         const progress = new SystemProgress("mark_loading_build_over",uuid,_json.length,0,"正在生成中...",false)
//         map_ent.add(progress)
//         let index = 0
//         Timers.CreateTimer(()=>{
//             if(map_cache.cache.size >= _json.length){
//                 // _json.forEach(elm=>{
//                 //     map_cache.cache.forEach(UTIL_Remove)
//                 //     map_cache.is_remove = true;
//                 // })
//                 _json = null;
//                 map_cache.is_build = true
//                 return
//             }
//             if(_json[index]){
//                 // this.create_single_model(_json[index],progress,map_cache)
//             }
//             index++
//             return GameRules.GetGameFrameTime();
//         })
//     }

//     /**
//      * 根据静态去生成地形
//      */


//     async create_npc_with_static(city_name:string){
//         for(const elm of citys_json[city_name as keyof typeof citys_json].npcs){
//             const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
//                 targetname:elm.name,
//                 origin:`${elm.origin.x} ${elm.origin.y} ${elm.origin.z}`,
//                 angles:`${elm.angles.x} ${elm.angles.y} ${elm.angles.z}`,
//                 scales : `${1} ${1} ${1}`,
//                 model :elm.model,
//                 lightmapstatic:"1",
//                 renderfx:"kRenderFxPulseFast",
//                 solid:"0",
//                 skin:elm,
//                 DefaultAnim:"ACT_DOTA_IDLE"
//             }) as CDOTA_BaseNPC_Hero
//         }
//     }


//     async create_city_road_wfc(terrain_type:string){
//         // const uuid = DoUniqueString("mark_cache")
//         // const map_ent = new Entity();
//         // this.engine.addEntity(map_ent);
//         // const map_cache = new MarkCache(uuid,new Map(),false,true)
//         // map_ent.add(map_cache)
//         // // let _json = require("../map_json/test.json") as MapMarkBuildJSON[]
//         // const progress = new SystemProgress("mark_loading_build_over",uuid,8 * 8,0,"正在生成中...",false)
//         // map_ent.add(progress)
//         try{

//         let wfc2d = new WFC.WFC2D(snow_road_json as any)
//         //设定地图尺寸
//         let mapWidth = 8;
//         let mapHeigth = 8;
//         //计算生成 地图数据 ，返回数据类型 数组 [[string,number],.....]

//         // const next = (count:number) => progress.cur = count
//         const next = (count:number) => {};
        
//         const map_cache = new Map()

//         let resultMap = await wfc2d.collapse(mapWidth, mapHeigth,next);
//         const skin = RandomInt(1,19);
//         let record = []
//         let count = 0
//         for (let y = 0; y < mapHeigth; y++) {
//          for (let x = 0; x < mapWidth; x++) {
//                 let imgData = resultMap[count++];
//                 //model资源名 , 类型 string
//                 let modelname = imgData[0];
//                 DebugDrawText(Vector(x * 1024 -3072,y * 1024 - 4089.4,3),`${x},${y}`,true,9999);
//                 //model顺时针旋转次数（每次90度）, 类型 number 
//                 let rotate = imgData[1];
//                 const data = kuangdong["tileset" + modelname as keyof typeof zi_luo_lan_json] 
//                 record.push({rotate,modelname})

//                 print(count)
            

//                 if(data){
//                     for(let elm of data){
//                         // const raworigin = Vector(x * 1024 - 16384  + elm.origin.x,y * 1024 - 16384 + elm.origin.y,3)
//                         const op_buildy = RotatePosition(Vector(0,0,0),QAngle(0,-rotate * 90,0),Vector(elm.origin.x,elm.origin.y,elm.origin.z))
//                         let angles = `0 ${elm.angle.y + rotate * 90} 0`
//                         let vector_l = Vector(x * 1024 - 3072 + op_buildy.x,y * 1024 - 4096 + op_buildy.y, elm.origin.z + 127)
//                         // DebugDrawText(raworigin,`rotate:${rotate} model${modelname}`,true,9999);
//                         if(elm.name.includes("tree")){
//                             const tree = CreateTempTreeWithModel(vector_l,99999,elm.model)
//                             tree.SetAngles(0,RandomFloat(0,360),RandomInt(0,5))
//                             tree.SetModelScale(RandomFloat(0.8,1.2))
//                             map_cache.set(`${x}${y}${elm.origin.x}${elm.origin.y}`,tree)
//                             continue;
//                         }
//                         if(elm.model.includes("tileset_snow_")){
//                             vector_l = Vector(x * 1024 - 3072,y * 1024 - 4096, elm.origin.z + 127)
//                         }
//                         const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
//                             origin:vector_l,
//                             angles,
//                             scales : `${elm.scale} ${elm.scale} ${elm.scale}`,
//                             skin : "mark" + 18,
//                             model :elm.model,
//                             lightmapstatic:"1",
//                             renderfx:"kRenderFxPulseFast",
//                             solid:"0",
//                             DefaultAnim:"ACT_DOTA_IDLE"
//                         }) as CDOTA_BaseNPC_Hero
//                         map_cache.set(`${x}${y}${elm.origin.x}${elm.origin.y}`,prop_dynamic)

//                     }
//                 }else{
//                     const prop_dynamic = SpawnEntityFromTableSynchronous("prop_dynamic",{
//                         origin : `${x * 1024 - 3072} ${y * 1024 - 4096} ${1}`,
//                         scales : `${1} ${1} ${1}`,
//                         skin : "mark" + skin,
//                         model :`models/3dtileset/snow_city_road/tileset_snow_${modelname}.vmdl`
//                      }) as CBaseModelEntity
//                     map_cache.set(`${x}${y}`,prop_dynamic)
//                 }

//             }    
//            }
//            const json_str = JSON.encode(record)
//            // print(json_str)
//            const http = CreateHTTPRequest("POST","http://localhost:3123/")
//            http.SetHTTPRequestRawPostBody("application/json",json_str)
//            http.Send((res)=>{})
//            return map_cache
//         }
//         catch(err){
//             print(err)
//         } 
//         // })

//     }

//     public onAddedToEngine(): void {
//         GameRules.QSet.is_in_chengshi.onEntityAdded.connect((snap)=>{
//             const cur_cityinfo = snap.current.get(CurCityInfo)
//             if(cur_cityinfo == null) {print("not find city_name with CurCityInfo");return}
//             create_with_static_table(cur_cityinfo.city_name)
//             create_npc_with_static(cur_cityinfo.city_name)
//             print("is in chengshi 增加了")
//         })
//         GameRules.QSet.is_in_chengshi.onEntityRemoved.connect((snap)=>{
//             print("有单位离开了城市")
//             GameRules.QSet.Cache.entities.forEach(ent=>{
//                 const map_cache = ent.get(MarkCache)
//                 if(map_cache){
//                     map_cache.is_build = true;
//                     map_cache.cache.forEach(elm=>{
//                         UTIL_RemoveImmediate(elm)
//                     })
//                     print("删除了所有缓存",map_cache.cache.size)
//                     map_cache.cache.clear()
//                 }
//             })
//             collectgarbage()
//             print("进行了垃圾回收")
//         })
//     }
// }