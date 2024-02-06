import { System } from "../../lib/ecs/System";
import { OpenAPI } from "../../server/core/OpenAPI";
import { request } from "../../server/core/request";
import { reloadable } from "../../utils/tstl-utils";
import { http_base } from "./base";

export class http_get_npc_sell_list_system extends System{
    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.OpenNpcUiEvent,(event)=>{
            print("OpenNpcUiEvent")
            const cur_city_info_comp = GameRules.QSet.is_select_role.first.get(c.city.CurCityInfo)
            const city_name = cur_city_info_comp.city_name

            const map_ent = GameRules.QSet.has_npc.first

            map_ent.iterate(c.npc.npc,(comp)=>{
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
// data:{item_name:item_data._name,npc_name:npc_comp.npc_name}
@reloadable
export class npc_buy_system extends System{

    public onAddedToEngine(): void {
        /**
         * 出售的okpanel事件响应
         */
        this.engine.subscribe(GameRules.event.OkEvent,(event)=>{
            if(event.click == "ok" && event.type == "ji_shi_sell_item"){
                print("卖")
                DeepPrintTable(event)
                http_base.http_transaction(
                    event.data.city_name,
                    event.data.npc_name,
                    GameRules.QSet.is_select_role.first,
                    event.data.item_name,
                    event.data.price,
                    event.data.count,
                    event.data.total,
                    "sell",
                    ()=>http_base.update_npc_ui_data(event.data.city_name,event.data.npc_name)
                )
                //客户端信息
                //{total:input * cost() * (100 + extra_price) / 100,item_name:item_data._name,npc_name:npc_comp.npc_name,city_name:npc_comp.city,count:input},
                // http_sell(
                //     event.data.data.city_name,
                //     event.data.data.npc_name,
                //     GameRules.QSet.is_select_role.first,
                //     event.data.data.item_name,
                //     Number(event.data.data.price),
                //     Number(event.data.input),
                //     Number(event.data.total)
                // )
            }
            if(event.click == "ok" && event.type == "ji_shi_buy_item"){
                print("mai东西了")
                DeepPrintTable(event)
                http_base.http_transaction(
                    event.data.city_name,
                    event.data.npc_name,
                    GameRules.QSet.is_select_role.first,
                    event.data.item_name,
                    event.data.price,
                    event.data.count,
                    event.data.total,
                    "buy",
                    ()=>http_base.update_npc_ui_data(event.data.city_name,event.data.npc_name)
                )
            }
        })
    }
}