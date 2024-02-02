import { System } from "../../lib/ecs/System";
import { OpenAPI } from "../../server/core/OpenAPI";
import { request } from "../../server/core/request";
import { CurCityInfo } from "../component/city";
import { npc } from "../component/npc";

export class http_get_npc_sell_list_system extends System{
    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OpenNpcUiEvent,(event)=>{
            print("OpenNpcUiEvent")
            const cur_city_info_comp = GameRules.QSet.is_select_role.first.get(CurCityInfo)
            const city_name = cur_city_info_comp.city_name

            const map_ent = GameRules.QSet.has_npc.first

            map_ent.iterate(npc,(comp)=>{
                if(comp.npc_name == event.npc_name && comp.city == city_name){
                    print("OpenNpcUiEvent 找到了")
                    request(OpenAPI,{
                        method:"POST",
                        url:"/data/v1/action/findOne",
                        body:{
                          "dataSource": "mongodb-atlas",
                          "database": "dota-test",
                          "collection": "npc",
                            "filter":{
                               city:city_name,
                               npc_name:event.npc_name
                            }
                        }
                    }).then((elm:any)=>{
                        print("hhtpi get")
                        DeepPrintTable(elm)
                        comp.ui_data = elm.document.sell_list
                    }).catch(err=>{
                        print(err)
                    })
                }
            })
        })
    }
}


// const uuid = Math.random().toFixed(6)
// GameEvents.SendCustomGameEventToServer("c2s_number_input_ok_register",{uuid})
// GameUI.CustomUIConfig().EventBus?.emit("OkNumberInputPanel",{
//     title:`需要买进多少个${item_data._name}?`,
//     type:"ji_shi_buy_item",
//     uuid:Math.random().toFixed(9),
//     data:{}
// })

export class npc_buy_system extends System{

    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_number_input_ok_register",(_,event)=>{
            CustomGameEventManager.RegisterListener(event.uuid,(_,event)=>{
                 
                const uid_event = CustomGameEventManager.RegisterListener(event.uuid,(_,event)=>{
                     if(event.type == "ji_shi_buy_item" && event.click == "ok"){
                        print("发生了购买事件 购买数量为=>",event.data?.input)
                        CustomGameEventManager.UnregisterListener(uid_event)
                     }
                })
             })
         })
    }
}