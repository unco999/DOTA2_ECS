import { Entity } from "../../lib/ecs/Entity";
import { System } from "../../lib/ecs/System";
import { reloadable } from "../../utils/tstl-utils";
import {EQUIPMENT_TYPE, type EquipmentState,type Inventory} from '../component/equipment'
/**
 * 主要负责inventory的自定义与官方组件连接的系统
 */

@reloadable
export class EquipmentStateUpSystem extends System{
    
    public onAddedToEngine(): void {
        CustomGameEventManager.RegisterListener("c2s_equit_item",(_,event)=>{
            const dota_ent = EntIndexToHScript(event.item_entindex) as CDOTA_Item
            const select_role = GameRules.QSet.is_select_role.first
            const select_role_comp = select_role.get(c.quipment.EquipmentState)
            const dota_item_ent = EntIndexToHScript(event.item_entindex) as CDOTA_Item
            const equiment_type_comp = dota_item_ent.Entity.get(c.quipment.EquipmentType)
            const euqit_type = equiment_type_comp.item_type

            print("物品的类型",euqit_type,"栏目的类型",select_role_comp[("slot_" + event.slot) as keyof EquipmentState].type)
            if(euqit_type != select_role_comp[("slot_" + event.slot) as keyof EquipmentState].type){
                print(" tuicchu")
                CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(event.PlayerID),"LargePopupBox",{tag_name:"这个位置无法装备...",player_id:event.PlayerID});
                return
            }

            select_role_comp[("slot_" + event.slot) as keyof EquipmentState].dota_entity = event.item_entindex
            select_role_comp[("slot_" + event.slot) as keyof EquipmentState].ecs_entity_index = dota_item_ent.Entity.id
        })
    }
}


@reloadable
export class InventorySytemOnAdd extends System{

    public update_slot(slot:number,dota_item_entity_index:EntityIndex,ecs_ent?:Entity){
        const role_ent = GameRules.QSet.is_select_role.first

        if(role_ent == null){
            return
        }
        const equipment_comp = role_ent.get(c.quipment.Inventory)
        

        if(ecs_ent == null){
            const dota_item_ent = EntIndexToHScript(dota_item_entity_index) as CDOTA_Item
            const item_ent = new Entity()
            const equiment_type_comp = new c.quipment.EquipmentType(EQUIPMENT_TYPE.Headwear)
            item_ent.add(equiment_type_comp)
            ecs_ent = item_ent;
            dota_item_ent.Entity = item_ent
            this.engine.addEntity(item_ent)
        }

        if(equipment_comp.slots[("slot_" + slot) as keyof Inventory['slots']] == null){
            return 
        }
        equipment_comp.slots[("slot_" + slot) as keyof Inventory['slots']].dota_entity = dota_item_entity_index
        equipment_comp.slots[("slot_" + slot) as keyof Inventory['slots']].ecs_entity_index = ecs_ent.id
        print("ecs equiment add item =>",slot)
    }

    public onAddedToEngine(): void {
        ListenToGameEvent("dota_inventory_item_added",(event)=>{
            print("dota_inventory_item_added")
            if(event.itemname == "item_tpscroll"){
                return
            }
            this.update_slot(event.item_slot + 1,event.item_entindex)
            DeepPrintTable(event)
        },[])

        ListenToGameEvent("dota_inventory_changed",(event)=>{
            print("dota_inventory_changed")
            DeepPrintTable(event)
        },[])

        
        ListenToGameEvent("dota_inventory_item_changed",(event)=>{
            print("dota_inventory_item_changed")
            DeepPrintTable(event)
        },[])
    }
}