import { doc, to_client_event, to_debug } from "../../fp";

@doc.watch("deep",to_client_event("player"),to_debug())
export class Inventory{
    constructor(
        public slots:{
            slot_0:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_1:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_2:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_3:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_4:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_5:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_6:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_7:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
            slot_8:{dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        }
    ){

    }
}

export enum EQUIPMENT_TYPE{
    Weapon,
    Headwear,
    Back,
    Shoulder,
    Ring,
    Hand,
    Necklace,
    Clothes,
}

// <EquipmentSlot x="23px" y="274px"  slot_index={0} slot_type={EQUIPMENT_TYPE.Headwear} item_data={null}/>
// <EquipmentSlot x="23px" y="44px" slot_index={1} slot_type={EQUIPMENT_TYPE.Weapon} item_data={null}/>
// <EquipmentSlot x="245px" y="584px" slot_index={2} slot_type={EQUIPMENT_TYPE.Clothes} item_data={null}/>
// <EquipmentSlot x="23px" y="274px"  slot_index={3} slot_type={EQUIPMENT_TYPE.Necklace} item_data={null}/>
// <EquipmentSlot x="23px" y="114px"  slot_index={4} slot_type={EQUIPMENT_TYPE.Back} item_data={null}/>
// <EquipmentSlot x="23px" y="384px"  slot_index={5} slot_type={EQUIPMENT_TYPE.Shoulder} item_data={null}/>
// <EquipmentSlot x="23px" y="194px"  slot_index={6} slot_type={EQUIPMENT_TYPE.Hand} item_data={null}/>
// <EquipmentSlot x="23px" y="484px"  slot_index={7} slot_type={EQUIPMENT_TYPE.Hand} item_data={null}/>
// <EquipmentSlot x="23px" y="584px"  slot_index={8} slot_type={EQUIPMENT_TYPE.Ring} item_data={null}/>
// <EquipmentSlot x="123px" y="584px" slot_index={9} slot_type={EQUIPMENT_TYPE.Ring} item_data={null}/>

@doc.watch("deep",to_client_event("player"),to_debug())
export class EquipmentState{
    public constructor(
        public slot_0?:{type:EQUIPMENT_TYPE.Headwear,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_1?:{type:EQUIPMENT_TYPE.Weapon,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_2?:{type:EQUIPMENT_TYPE.Clothes,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_3?:{type:EQUIPMENT_TYPE.Necklace,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_4?:{type:EQUIPMENT_TYPE.Back,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_5?:{type:EQUIPMENT_TYPE.Shoulder,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_6?:{type:EQUIPMENT_TYPE.Hand,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_7?:{type:EQUIPMENT_TYPE.Hand,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_8?:{type:EQUIPMENT_TYPE.Ring,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
        public slot_9?:{type:EQUIPMENT_TYPE.Ring,dota_entity:EntityIndex|undefined,ecs_entity_index:number},
    ){

    }
}

export class EquipmentType{
    public constructor(
        public item_type:EQUIPMENT_TYPE 
    ){

    }
}