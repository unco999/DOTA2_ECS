import { BindDota2EntityLinkEcsEntity, CheckGetHasInventoryItemWithEntity, CheckGetHasItemWithEntity, TRACE, _replace$2KeytoArray, _replace$2obj, clear_event } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { System } from "../../lib/ecs/System";
import { reloadable } from "../../utils/tstl-utils";
import {type EQUIPMENT_TYPE, type EquipmentState,type Inventory} from '../component/equipment'
import * as item_json from "../../json/items_list_1.json" 
import * as equipment_json from "../../json/equipment.json"
import type { AllModifierAndAttributeComps, WarehouseInventory } from "../component/role";
/**
 * 主要负责装备和卸载的功能
 */

@reloadable
export class EquipmentStateUpSystem extends System{
    
    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_equit_item",(_,event)=>{
            const dota_ent = EntIndexToHScript(event.item_entindex) as CDOTA_Item
            const select_role = GameRules.QSet.is_select_role.first
            const euqipment_comp = select_role.get(c.quipment.EquipmentState)
            const dota_item_ent = EntIndexToHScript(event.item_entindex) as CDOTA_Item
            const equiment_type_comp = dota_item_ent.Entity.get(c.quipment.EquipmentType)
            const euqit_type = equiment_type_comp.item_type
            const hero = EntIndexToHScript(select_role.get(c.base.HERO).hero_idx) as CDOTA_BaseNPC_Hero
            const inventory_comp = select_role.get(c.quipment.Inventory)

            this.dispatch(new GameRules.event.EquipmentEvent(dota_item_ent.Entity,hero.entindex(),"up"))
            if(euqit_type != euqipment_comp[("slot_" + event.slot) as keyof EquipmentState].type){
                CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(event.PlayerID),"LargePopupBox",{tag_name:"这个位置无法装备...",player_id:event.PlayerID});
                return
            }

            const last_euqipment = _replace$2KeytoArray(inventory_comp.slots).find((key,index)=>{
                return inventory_comp.slots[key as keyof Inventory['slots']].dota_entity == event.item_entindex
            })

            if(last_euqipment){
                euqipment_comp[last_euqipment as keyof EquipmentState].dota_entity = null
                euqipment_comp[last_euqipment as keyof EquipmentState].ecs_entity_index = null
            }

            

            euqipment_comp[("slot_" + event.slot) as keyof EquipmentState].dota_entity = event.item_entindex
            euqipment_comp[("slot_" + event.slot) as keyof EquipmentState].ecs_entity_index = dota_item_ent.Entity.id
            hero.DropItemAtPositionImmediate(dota_ent,Vector(44444,44444,44444))

        })

        CustomGameEventManager.RegisterListener("c2s_equit_down_item",(_,event)=>{
            const dota_ent = EntIndexToHScript(event.item_entindex) as CDOTA_Item
            const select_role = GameRules.QSet.is_select_role.first
            const euqipment_comp = select_role.get(c.quipment.EquipmentState)
            const hero = EntIndexToHScript(select_role.get(c.base.HERO).hero_idx) as CDOTA_BaseNPC_Hero

            
            this.dispatch(new GameRules.event.EquipmentEvent(dota_ent.Entity,hero.entindex(),"down"))

            if(!hero.HasAnyAvailableInventorySpace()){
                CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(event.PlayerID),"LargePopupBox",{tag_name:"物品栏已经满了无法拿下...",player_id:event.PlayerID});
                return
            }

            hero.AddItem(dota_ent)
            const last_euqipment =  _replace$2KeytoArray(euqipment_comp).find((key,index)=>{
                return euqipment_comp[key as keyof EquipmentState]?.dota_entity == event.item_entindex
            })

            print("last_euqipment",last_euqipment)
            if(last_euqipment == null){
                print("not find euqipment item",event.item_entindex)
                return
            }
            euqipment_comp[last_euqipment as keyof EquipmentState].dota_entity = null
            euqipment_comp[last_euqipment as keyof EquipmentState].ecs_entity_index = null

        })
    }
}


//控制角色属性的刷新和实现的modifier重载
@reloadable
export class UpdateAllsAttributeSystem extends System{

    private _reload_allModifierAndAttributeComps(comp:AllModifierAndAttributeComps){
        for(let key in comp.attribute){
            if(typeof comp.attribute[key] == 'number'){
                comp.attribute[key] = 0
            }
        }
        comp.special = []
    }
    //计算
    equation(){
        const role_ent = GameRules.QSet.is_select_role.first
        const is_up_equiments = GameRules.QSet.cur_is_euqipments_ent.entities
        const all_attributes_comp = role_ent.get(c.role.AllModifierAndAttributeComps)
        this._reload_allModifierAndAttributeComps(all_attributes_comp)
        print("ecs cur this equiments length is ",is_up_equiments.length)
        is_up_equiments.forEach(item_ent=>{
            const item_base_attribute = item_ent.get(c.quipment.EquipMentAttribute);
            if(item_base_attribute){
                const proxy = _replace$2obj(item_base_attribute) as typeof item_base_attribute
                proxy.base_attribute.forEach(attribute_atomic=>{
                    print(attribute_atomic)
                    const sign = attribute_atomic[0]
                    const num = Number(attribute_atomic.slice(1,attribute_atomic.length))
                    if(all_attributes_comp.attribute[sign] == undefined){
                        all_attributes_comp.attribute[sign] = 0
                    }
                    all_attributes_comp.attribute[sign] += num;
                })
                /**特殊词条的特殊处理 */
                const item_speicel_array =proxy.speicel_attribute
                all_attributes_comp.special.push(item_speicel_array)
                print("ecs cur equipment special attribute state")
              
            }
        })
        TRACE("equipments",true)
    }

    //装备
    up(event:InstanceType<typeof GameRules.event.EquipmentEvent>){
        event.equipment_entity.addTag(GameRules.tag.is_cur_euqipment_tag)
        this.equation()
        const hero = EntIndexToHScript(event.Hero_idx) as CDOTA_BaseNPC_Hero
        hero.RemoveModifierByName("attribute_modifier")
        hero.AddNewModifier(hero,null,"attribute_modifier",{duration:-1})   
        print("刷新了")
    }

    //卸下
    down(event:InstanceType<typeof GameRules.event.EquipmentEvent>){
        event.equipment_entity.removeTag(GameRules.tag.is_cur_euqipment_tag)
        this.equation()
        const hero = EntIndexToHScript(event.Hero_idx) as CDOTA_BaseNPC_Hero
        hero.RemoveModifierByName("attribute_modifier")
        hero.AddNewModifier(hero,null,"attribute_modifier",{duration:-1})
        print("刷新了")
    }



    public onAddedToEngine(): void {
        this.engine.subscribe(GameRules.event.EquipmentEvent,(event)=>{
            print(`[ecs] trigger event event.type${event.type} event.equipment_entity.id${event.equipment_entity.id} event.Hero_idx${event.Hero_idx}`)
            if(event.type == 'down'){
                this.down(event)
            }
            if(event.type == "up"){
                this.up(event)
            }
        })
    }
}

//装备拾取匹配系统
@reloadable
export class InventorySytemOnAdd extends System{    

    public update_slot(slot:number,dota_item_entity_index:EntityIndex,ecs_ent?:Entity){
        const role_ent = GameRules.QSet.is_select_role.first

        if(role_ent == null){
            return
        }
        const inventory_comp = role_ent.get(c.quipment.Inventory)
        
        let new_ecs_item_entity:Entity = ecs_ent;
        if(ecs_ent == null){
            const dota_item_ent = EntIndexToHScript(dota_item_entity_index) as CDOTA_Item
            const item_ent = new Entity()
            BindDota2EntityLinkEcsEntity(dota_item_entity_index,item_ent.id)
            const kv = dota_item_ent.GetAbilityKeyValues() as typeof item_json["item_bian_ti_mo_fang"]
            if(kv.euqipment_type == -1){
                return;
            }
            const equiment_type_comp = new c.quipment.EquipmentType(Number(kv.euqipment_type))
            item_ent.add(equiment_type_comp)
            new_ecs_item_entity = item_ent;
            dota_item_ent.Entity = item_ent
            this.engine.addEntity(item_ent)
        }

        if(inventory_comp.slots[("slot_" + slot) as keyof Inventory['slots']] == null){
            return 
        }
        inventory_comp.slots[("slot_" + slot) as keyof Inventory['slots']].dota_entity = dota_item_entity_index
        inventory_comp.slots[("slot_" + slot) as keyof Inventory['slots']].ecs_entity_index = new_ecs_item_entity.id
        print("ecs equiment add item =>",slot)
    }

    public onAddedToEngine(): void {
        ListenToGameEvent("dota_inventory_item_added",(event)=>{
            print("dota_inventory_item_added")
            if(event.itemname == "item_tpscroll"){
                return
            }
            const dota_ent = EntIndexToHScript(event.item_entindex) as CDOTA_Item
            this.update_slot(event.item_slot + 1,event.item_entindex,dota_ent?.Entity)
            DeepPrintTable(event)
        },[])

    }
}

/**
 * 固定仓库管理系统
 */
@reloadable
export class WarehouseInventorySystem extends System{
    
    /**
     * 和快捷栏背包交换位置
     */
    raw_change(hero:CDOTA_BaseNPC_Hero,slot_num:number,warehouse_inventory:WarehouseInventory,event:CustomGameEventDeclarations['c2s_item_to_warehouse_inventory']){
        const raw_inventory_item = hero.GetItemInSlot(slot_num) as CDOTA_Item
        hero.DropItemAtPositionImmediate(raw_inventory_item,Vector(44444,44444,44444))
        const last_warehouse_item = warehouse_inventory.ItemSlots[event.to_slot]
        const last_item = EntIndexToHScript(last_warehouse_item) as CDOTA_Item
        hero.AddItem(last_item)
        warehouse_inventory.ItemSlots[event.to_slot] = event.dota_entity_id
    }


    /**交换位置 */
    change(hero:CDOTA_BaseNPC_Hero,old_warehouse_inventory:{elm:WarehouseInventory,old_slot:number},event:CustomGameEventDeclarations['c2s_item_to_warehouse_inventory']){
        const role = GameRules.QSet.is_select_role.first
        const old  = old_warehouse_inventory.elm.ItemSlots[old_warehouse_inventory.old_slot]
        role.iterate(c.role.WarehouseInventory,(elm)=>{
            if(elm.slot_index == event.to_index_inventory && elm.is_lock){
                //如果指定背包是锁定状态
                TRACE("该栏目已经被锁定了",false)
                CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(role.get(c.base.PLAYER).PlayerID),"LargePopupBox",{tag_name:"该背包还没有解锁...",player_id:role.get(c.base.PLAYER).PlayerID})
                return
            }
            if(elm.slot_index == event.to_index_inventory){
                const new_ent = elm.ItemSlots[event.to_slot];

                old_warehouse_inventory.elm.ItemSlots[old_warehouse_inventory.old_slot] = new_ent
                elm.ItemSlots[event.to_slot] = old
            }
        })
    }

    /**直接放置 */
    insert(hero:CDOTA_BaseNPC_Hero,warehouse_inventory:WarehouseInventory,event:CustomGameEventDeclarations['c2s_item_to_warehouse_inventory']){
        warehouse_inventory.ItemSlots[event.to_slot] = event.dota_entity_id
        print("event.to_slot",event.to_slot,"to",event.dota_entity_id)
        const item = EntIndexToHScript(event.dota_entity_id) as CDOTA_Item
        hero.DropItemAtPositionImmediate(item,Vector(44444,44444,44444))
    }

    /**
     * 从固定仓库面板放入快捷背包操作
     */
    to_raw(event:CustomGameEventDeclarations["c2s_warehouse_inventory_to_raw"]){
        const role = GameRules.QSet.is_select_role.first
        // role.iterate(c.role.WarehouseInventory,(elm)=>{
        //     if(event.to_index_inventory == elm.slot_index && !elm.is_lock){
                
        //     }
        // })
        const data = CheckGetHasInventoryItemWithEntity(event.dota_entity_id)
        if(data){
            const warehouse = data.elm as WarehouseInventory
            warehouse.ItemSlots[event.to_slot] = null
            const item = EntIndexToHScript(event.dota_entity_id) as CDOTA_Item
            const hero = EntIndexToHScript(role.get(c.base.HERO).hero_idx) as CDOTA_BaseNPC_Hero
            hero.AddItem(item)
        }else{
           TRACE("没有找到背包里的物品,失败",false)
        }
    }
    
    /**
     * 他交换位置时 要么是快捷栏背包 要么是固定背包
     * 所以我们要么传入 快捷栏背包 要么传入固定背包
     */
    public onAddedToEngine(): void {
        
        CustomGameEventManager.RegisterListener("c2s_warehouse_inventory_to_raw",(_,event)=>{
            // this.to_raw(event)
        })
        CustomGameEventManager.RegisterListener("c2s_item_to_warehouse_inventory",(_,event)=>{
            const role = GameRules.QSet.is_select_role.first
            const hero = EntIndexToHScript(role.get(c.base.HERO).hero_idx) as CDOTA_BaseNPC_Hero
            let slot_num:number
            let ecs_inventory_dota_ent:{elm:WarehouseInventory,old_slot:number}
            print("特殊值")
            DeepPrintTable(event)
            slot_num = CheckGetHasItemWithEntity(hero,event.dota_entity_id)
            if(slot_num == null){
                ecs_inventory_dota_ent = CheckGetHasInventoryItemWithEntity(event.dota_entity_id) 
            }
            if(slot_num){
                //这里是从快捷栏背包拿物品进仓库 有2种情况 仓库里本身有东西 和仓库本身没东西
                role.iterate(c.role.WarehouseInventory,(elm)=>{
                    if(elm.slot_index == event.to_index_inventory && elm.is_lock){
                        //如果指定背包是锁定状态
                        TRACE("该栏目已经被锁定了",false)
                        CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(event.PlayerID),"LargePopupBox",{tag_name:"该背包还没有解锁...",player_id:event.PlayerID})
                        return
                    }
                    if(elm.slot_index == event.to_index_inventory && elm.ItemSlots[event.to_slot]){
                        this.raw_change(hero,slot_num,elm,event)
                        return
                    }
                    if(elm.slot_index == event.to_index_inventory && elm.ItemSlots[event.to_slot] == null){
                        this.insert(hero,elm,event)
                        return
                    }
                })
            }
            else if(ecs_inventory_dota_ent){
                this.change(hero,ecs_inventory_dota_ent,event)
            }
            else{
                TRACE("错误没有在背包里找到指定的物品",false)
            }
        })
    }
}

@reloadable
export class RbxBoxSystem extends System{

    private _insert(dota_item_name:string,input:number,slot:number){
        print("触发了rbx_box")
        const role = GameRules.QSet.is_select_role.first
        const rbx_comp = role.get(c.quipment.RbxBoxElement)
        rbx_comp.element[slot] = {item_name:dota_item_name,num:input}
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_number_input_ok_register",(_,event)=>{
            const id = CustomGameEventManager.RegisterListener(event.uuid,(_,event)=>{
                if(event.type == "rbx_insert_item" && event.click == "ok"){
                    this._insert(
                        event.data.data.dota_item_name,
                        Number(event.data.input),
                        Number(event.data.data.slot)
                    )
                }
                CustomGameEventManager.UnregisterListener(id)
            })
        })    
    }
}