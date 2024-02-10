import { TRACE, _replace$2KeytoArray, _replace$2obj, clear_event } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { System } from "../../lib/ecs/System";
import { reloadable } from "../../utils/tstl-utils";
import {type EQUIPMENT_TYPE, type EquipmentState,type Inventory} from '../component/equipment'
import * as item_json from "../../json/items_list_1.json" 
import * as equipment_json from "../../json/equipment.json"
import type { AllModifierAndAttributeComps, SPECIAL } from "../component/role";
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
            if(last_euqipment == null){
                print("not find euqipment item",event.item_entindex)
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
        for(let key in comp){
            if(typeof comp[key] == 'number'){
                comp[key] = 0
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
                    const sign = attribute_atomic[0]
                    const num = Number(attribute_atomic.slice(1,attribute_atomic.length))
                    all_attributes_comp[sign] += num;
                })
                print("ecs cur equipment special attribute state")
                DeepPrintTable(proxy.special_args_slot_attribute)
                if(proxy.special_args_slot_attribute == null) return;
                let special_list:SPECIAL = []
                Object.values(proxy.special_attribute).forEach(proxy_sign=>{
                    const json_element = Object.values(equipment_json).find((elm)=>elm.attribute_sign == proxy_sign)
                    if(json_element){
                        special_list.push(
                            {
                                enum_modifier_function:json_element.dota_attribute_modifier_fuc_name,
                                call_fuc:Object.values(json_element.call_fuc),
                                raw_modifier_function_name:json_element.dota_attribute_modifier_name,
                                AbilityValues:proxy.special_args_slot_attribute
                            }
                        )
                    }
                })


                print("ecs add equipment speciel staic and dynamic data in all_attributes")


                all_attributes_comp.special.push(...special_list)
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