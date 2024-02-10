import { NONE, WAIT, get_entity, _replace$2obj } from "../../fp";
import { System } from "../../lib/ecs/System";
import { OpenAPI } from "../../server/core/OpenAPI";
import { request } from "../../server/core/request";


//@负责初始化http组件的系统
export class steam_id_http_init_system extends System {
    
    start(event:InstanceType<typeof GameRules.event.xstateChangeEvent>){
    //     const user_body:string[] = []
    //     for(let [key,val] of http_with_user_container){
    //         print("当前的stage",val.stage)
    //         print("当前的event",event.xstateid,"=>",event.state)
    //         if(!event.state.includes(val.stage)){
    //             continue;
    //         }
    //         const steam_id = GameRules.world.getEntityById(val.instance["$$$$entity"]).get(PLAYER).steam_id 
    //         if(user_body.indexOf(steam_id) == -1){
    //             user_body.push(steam_id)
    //         }
    //     }

    //    user_body.length > 0 && request(OpenAPI,{
    //         method:"POST",
    //         url:"/data/v1/action/find",
    //         body:{
    //             "dataSource": "mongodb-atlas",
    //             "database": "dota-test",
    //             "collection": "user",
    //             "filter": {
    //                 "_id": { "$in": user_body }
    //             },
    //         }
    //    }).then((res:{documents:any[]})=>{
    //     for(let [key,val] of http_with_user_container){
    //         res.documents.forEach(elm=>{
    //             for(let resultkey in elm){
    //              print("resultkey",resultkey)
    //              if(val.instance.constructor.name == resultkey){
    //                  for(let deep_key in elm[resultkey]){
    //                      print(deep_key)
    //                      val.instance[deep_key] = elm[resultkey][deep_key]
    //                  }
    //              }
    //           }}
    //         )
    //     }
    //     for (let [key,val] of http_with_user_container){
    //         for(let key in replace$2obj(val.instance)){
    //             if(val.instance[key] == WAIT){
    //                 val.instance[key] = NONE
    //             }
    //         }
    //         http_with_user_container.delete(key);
    //     }
    //    }).catch(err=>{
    //        print(err)
    //    })
        if(container.http_comp_decorator_container_with_init.size != 0) {
            const body:{[collection in string]:{[steam_id in string]:{comp_name:string[]}}|{}} = {}
            for (let [key,val] of container.http_comp_decorator_container_with_init){
                const steam_id = GameRules.world.getEntityById(val.instance["$$$$entity"]).get(c.base.PLAYER).steam_id
                print(`当前${val.instance.constructor.name} == ${steam_id}`)
                if(!`${event.xstateid}=>${event.state}`.includes(val.stage)){
                    continue;
                }
                if(body[val.collection] == null){
                    body[val.collection] = {}
                }
                if(body[val.collection][steam_id] == null){
                    body[val.collection][steam_id] = {}
                }
                if(body[val.collection][steam_id].comp_name == null){
                    body[val.collection][steam_id].comp_name = []
                }
                (body[val.collection][steam_id].comp_name as string[]).push(val.instance.constructor.name)
            }
    
            print()
            DeepPrintTable(body)
            for(let collection in body){
                for(let steam_id in body[collection]){
                    const http = CreateHTTPRequestScriptVM("POST","https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-dxtin/endpoint/data/v1/action/aggregate")
            
                    http.SetHTTPRequestRawPostBody("application/json",json.encode({    
                      "dataSource": "mongodb-atlas",
                      "database": "dota-test",
                        "collection": collection,
                        "pipeline":[
                            {
                                "$match": { 
                                    "#comp": { "$in":(body[collection][steam_id]).comp_name}, 
                                    "steam_id": steam_id,
                                  },
                            },
                        ]
                        
                    }))
            
                    http.SetHTTPRequestHeaderValue("apiKey","HIZH7rzmt2JBpVNIqY9jyJ87t7yytJT1UWxcWM4znErbAGXjtRlDoddiqamvASYz")
                    // http.SetHTTPRequestHeaderValue("api-Key","HIZH7rzmt2JBpVNIqY9jyJ87t7yytJT1UWxcWM4znErbAGXjtRlDoddiqamvASYz")
                    http.SetHTTPRequestHeaderValue("Content-Type","application/json")
                    
    
                    http.Send((res)=>{
                        const data = JSON.decode(res.Body)?.documents
                        if(data == null) return;
                        print("数据分析")
                        DeepPrintTable(data)
                        for(let key in data){
                            const comp_name = data[key]?.["#comp"]
                            for (let [_,val] of container.http_comp_decorator_container_with_init){
                                print("当前遍历的name",comp_name)
                                if(val && comp_name == val?.instance?.constructor?.name){
                                    print("该comp",data[key]["_id"],"<id")
                                    val.instance["_id"] = data[key]["_id"]
                                    for(let raw_key in _replace$2obj(val.instance)){
                                        print("当前原始值",raw_key)
                                        if(data[key][raw_key] != null){
                                            val.instance[raw_key] = data[key][raw_key]
                                            continue
                                        }
                                    }
                                }
                            }
                        }
    
                        let null_record_comp = new Set<any>()
    
                        for (let [_,val] of container.http_comp_decorator_container_with_init){
                            const new_table = _replace$2obj(val.instance)
                            for(let key in new_table){
                                if(typeof val.instance[key] == "object" && val.instance[key].wait == "wait"){
                                    null_record_comp.add(val.instance)
                                    if(val.instance[key]?.url){
                                        val.instance[key] = (val.instance[key].url as Function)(val.instance)
                                    }
                                }
                            }
                        }
    
                        if(null_record_comp.size > 0){
                            request(OpenAPI,{
                                method:"POST",
                                url:"/data/v1/action/insertMany",
                                body:{
                                    "dataSource": "mongodb-atlas",
                                    "database": "dota-test",
                                    "collection": "comp",
                                    "documents": this.update_mongodb(null_record_comp),
                                }
                            }).then(elm=>{
                                container.http_comp_decorator_container_with_init.clear()
                            }).catch(err=>{
                                print(err)
                            })
                        } else{
                            container.http_comp_decorator_container_with_init.clear()
                        }
                    })
                }
            }
        }

        if(container.http_with_system_container.size !=0){
            print("event.xstateid","当前的大阶段",event.xstateid,"当前的小阶段",event.state)
            const cur_op_http_instance = Array.from(container.http_with_system_container).map(elm=>{
                if(`${event.xstateid}=>${event.state}`.includes(elm[1].stage)){
                    print("当前服务器的stage触发了")
                    return elm[1].system_key(elm[1].instance)
                }
            })

            if(cur_op_http_instance.length == 0) return;

            Promise.all(cur_op_http_instance).then(res=>{
                request(OpenAPI,{
                    method:"POST",
                    url:"/data/v1/action/findOne",
                    body:{
                        "dataSource": "mongodb-atlas",
                        "database": "dota-test",
                        "collection": "system",
                        "filter":{
                            "system_key": {"$in":res }
                        }
                    }
                }).then((elm:any)=>{
                    print("收到服务器事件")
                    DeepPrintTable(elm)
                }).catch(err=>{

                })
            })

           
        }
       
    }


    update_mongodb(instance_list:Set<any>){
        let new_list = []
        for(let elm of instance_list){
            new_list.push(_replace$2obj({steam_id:get_entity(elm).get(c.base.PLAYER).steam_id,"#comp":elm.constructor.name,...elm}))
        }
        return new_list
    }

    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.xstateChangeEvent,(event)=>{
            if(event.xstateid == "game_state_main" || event.xstateid == "ui_city"){
                print("当前状态asdasdsadsad",event.xstateid,event.state)
                Timers.CreateTimer(GameRules.GetGameFrameTime() * 60,()=>{
                    print("执行了")
                    try{
                        this.start(event)
                    }catch(err){
                        print("错误",err)
                    }
                })
            }
        })
    }
}

//@负责初始化http组件的系统
class steam_id_http_update_system extends System {
    public onAddedToEngine(): void {
    }
}