import { Entity } from "../../lib/ecs/Entity";
import { PlayerGold } from "../component/role";
import * as gold_json from "../../json/gold.json" 
import { HERO, PLAYER } from "../component/base";
import { npc } from "../component/npc";
import { OpenAPI } from "../../server/core/OpenAPI";
import { request } from "../../server/core/request";



export function http_buy(buy_city:string,buy_npc:string,role_ent:Entity,buy_item_name:string,price:number){
    const player_gold_comp = role_ent.get(PlayerGold)
    const player_idx = role_ent.get(PLAYER).PlayerID
    const hero = PlayerResource.GetPlayer(player_idx).GetAssignedHero()
    
    if(!player_gold_comp){
        print("buy not find player_gold_comp")
        return
    }
    const city_with_gold_string = gold_json[buy_city as keyof typeof gold_json]
    
    //符合货币的数量
    const cur_gold_count = player_gold_comp[city_with_gold_string]

    // if(cur_gold_count <= price){
    //     //买不起
    //     CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"金币不够...",player_id:player_idx});
    //     return;
    // }

    if(!hero && hero.HasAnyAvailableInventorySpace()){
        CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"你的背包满了...",player_id:player_idx});
        return;
    }

    const city_ent = GameRules.QSet.cur_in_city_map_ent.first;

    city_ent.iterate(npc,(npc_comp)=>{
        if(npc_comp.npc_name == buy_npc){
            request(OpenAPI,{
                method:"POST",
                url:"/data/v1/action/aggregat",
                body:{
                  "dataSource": "mongodb-atlas",
                  "database": "dota-test",
                  "collection": "npc",
                    "pipeline": [
                        {
                            $match: {
                                city: buy_city,
                                npc_name: buy_npc
                            }
                          },
                          {
                            $project: {
                              // 对文档进行投影操作
                              [`sell_list`]: {
                                $cond: {
                                  if: {
                                    $lt: [
                                      { $subtract: [`sell_list.${buy_item_name + "_count"}`, 5] },
                                      0 // 如果减少后的值小于0，则返回false
                                    ]
                                  },
                                  then: { $subtract: [`sell_list.${buy_item_name + "_count"}`, 5] }, // 如果可以减少，则减少5并返回新的子对象值
                                  else: false // 如果不能减少，则返回false
                                }
                              }
                            }
                          },
                        //   {
                        //     $match: {
                        //       // 对结果进行过滤，只返回符合条件的文档
                        //     }
                        //   }
                    ]
               }}).then((elm:any)=>{
                DeepPrintTable(elm)
            }).catch(err=>{
                print(err)
            })
        }
    })
    
}