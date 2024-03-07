import { Entity } from "../../lib/ecs/Entity";
import * as gold_json from "../../json/gold.json" 
import { OpenAPI } from "../../server/core/OpenAPI";
import { request } from "../../server/core/request";


export namespace http_base{

    /**
    // * http交易系统
    * @param buy_city 交易城市
    * @param buy_npc 购买NPC
    * @param role_ent 交易角色
    * @param transaction_item_name 物品名字
    * @param price 单价
    * @param count 商品数量
    * @param total 总价
    * @param type sell or buy or query
    * @returns 
    */
   export function http_transaction(buy_city:string,buy_npc:string,role_ent:Entity,item_name:string,price:number,count:number,total:number,type:"sell"|"buy"|"query",call_back?:Function){
       const player_gold_comp = role_ent.get(c.role.PlayerGold)
       const player_idx = role_ent.get(c.base.PLAYER).PlayerID
       const hero = PlayerResource.GetPlayer(player_idx).GetAssignedHero()
       
       if(!player_gold_comp){
           return
       }
       const city_with_gold_string = gold_json[buy_city as keyof typeof gold_json] 
       
       //符合货币的数量

       let op_gold:string;
       if(player_gold_comp[city_with_gold_string] >= total){
            op_gold = city_with_gold_string
       }
       if(player_gold_comp.novice_gold >= total){
          op_gold = "novice_gold"
       }

       if(op_gold == undefined){
           CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:`你的前不足以支付货款...`,player_id:player_idx})
           return
       }
   
       let item_num_data = [count,total,price]
       try{
           item_num_data = item_num_data.map(elm=>parseInt(elm.toString()))
           if(item_num_data.some(elm=>isNaN(elm))){
               return false
           }
       }catch(err){
           return false
       }
   
       if(type == "buy"){   // city_ent.iterate(c.npc.npc,(npc_comp)=>{
           const [count,total,price] = item_num_data
              request(OpenAPI,{
                  method:"POST",
                  url:"/data/v1/action/updateOne",
                  body:{
                    "dataSource": "mongodb-atlas",
                    "database": "dota-test",
                    "collection": "npc",
                    "filter": {                                                                                                                                              
                        city:buy_city,
                        npc_name:buy_npc,
                        [`sell_list.${item_name + "_count"}`]:{ $gte:count},
                        [`sell_list.${item_name}`]:{ $lte:price},
                    },
                    "update": 
                      [
                        {"$set": { 
                           [`sell_list.${item_name + "_count"}`]:{$add:[`$sell_list.${item_name + "_count"}`,-count],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                         }},
                        },
                        {
                          "$set":{
                            [`sell_list.${item_name}`] :{$add:[`$sell_list.${item_name}`,{$divide:[ total, 
                                { "$multiply": [`$sell_list.${item_name}`,`$sell_list.${item_name}_count`]}]}]}
                            }
                        }
                      ],                
                 }}).then((elm:any)=>{
                  if(elm.modifiedCount == 1){
                      player_gold_comp[op_gold] -= total;
                      CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"购买成功...",player_id:player_idx});
                      GameRules.enquence_delay_call(()=>{
                           call_back?.();
                      })
                      return true
                  }else{
                      CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"购买失败,库存不足或价格不合适...",player_id:player_idx});
                      return
                  }
              }).catch(err=>{
                  print(err)
              })
           return
       }
       if(type =="sell"){
           const [count,total,price] = item_num_data
           request(OpenAPI,{
               method:"POST",
               url:"/data/v1/action/updateOne",
               body:{
                 "dataSource": "mongodb-atlas",
                 "database": "dota-test",
                 "collection": "npc",
                 "filter": {
                     city:buy_city,
                     npc_name:buy_npc,
                     [`sell_list.${item_name}`]:{ $gte:price},
                 },
                 "update": 
                 [
                   {"$set": { 
                      [`sell_list.${item_name + "_count"}`]:{$add:[`$sell_list.${item_name + "_count"}`,+count],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    }},
                   },
                   {
                     "$set":{
                       [`sell_list.${item_name}`] :{$subtract:[`$sell_list.${item_name}`,{$divide:[ total, 
                           { "$multiply": [`$sell_list.${item_name}`,`$sell_list.${item_name}_count`]}]}]}
                       }
                   }
                 ],         
              }}).then((elm:any)=>{
               if(elm.modifiedCount == 1){
                   player_gold_comp[city_with_gold_string] += total;
                   CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"出售成功...",player_id:player_idx});
                   GameRules.enquence_delay_call(()=>{
                       call_back?.();
                  })
                   return 
               }else{
                   CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"出售失败,价格不合适...",player_id:player_idx});
                   return
               }
           }).catch(err=>{
               print(err)
           })
           return
       }
       if(type == "query"){
           return
       }
   
   
       
   
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
   
       // city_ent.iterate(c.npc.npc,(npc_comp)=>{
       //     if(npc_comp.npc_name == buy_npc){
   
       //         request(OpenAPI,{
       //             method:"POST",
       //             url:"/data/v1/action/updateOne",
       //             body:{
       //               "dataSource": "mongodb-atlas",
       //               "database": "dota-test",
       //               "collection": "npc",
       //               "filter": {
       //                   city:buy_city,
       //                   npc_name:buy_npc,
       //                   [`sell_list.${sell_item_name + "_count"}`]:{ $gte:count},
       //               },
       //               "update": 
       //                 { 
       //                   "$inc": { [`sell_list.${buy_item_name + "_count"}`]: count } 
       //                 }, 
                          
       //            }}).then((elm:any)=>{
       //             if(elm.modifiedCount == 1){
       //                 npc_comp.ui_data[buy_item_name + "_count"] -= count
       //                 print("当前的确切价格",npc_comp.ui_data[buy_item_name + "_count"])
       //                 CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"购买成功...",player_id:player_idx});
       //             }else{
       //                 CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(player_idx),"LargePopupBox",{tag_name:"服务器库存不足...",player_id:player_idx});
       //                 return
       //             }
       //         }).catch(err=>{
       //             print(err)
       //         })
       //     }
       // })
       
   }
   
   
   export function update_npc_ui_data(city:string,npc_name:string){
       request(OpenAPI,{
           method:"POST",
           url:"/data/v1/action/findOne",
           body:{
             "dataSource": "mongodb-atlas",
             "database": "dota-test",
             "collection": "npc",
               "filter":{
                   city:city,
                   npc_name:npc_name
               }
           }
       }).then((elm:any)=>{
           const map_ent = GameRules.QSet.has_npc.first
           map_ent.iterate(c.npc.npc,(comp)=>{
               if(comp.npc_name == npc_name){
                   comp.ui_data = elm.document.sell_list
                   return;
               } 
           })
       }).catch(err=>{
           print(err)
       })
   }
}
