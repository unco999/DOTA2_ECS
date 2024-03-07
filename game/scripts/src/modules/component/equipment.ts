import { BindDota2EntityLinkEcsEntity, _replace$2obj, doc, to_client_event, to_debug } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import * as equipmen_json from "../../json/equipment.json" 
import { FN } from "../attribute/FN";




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

    // const to_custom_table = {
    //     slot_0_comps:instance?.slot_0?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_0.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_1_comps:instance?.slot_1?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_1.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_2_comps:instance?.slot_2?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_2.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_3_comps:instance?.slot_3?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_3.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_4_comps:instance?.slot_4?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_4.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_5_comps:instance?.slot_5?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_5.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_6_comps:instance?.slot_6?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_6.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_7_comps:instance?.slot_7?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_7.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_8_comps:instance?.slot_8?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_8.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    //     slot_9_comps:instance?.slot_9?.ecs_entity_index && GameRules.world.getEntityById(instance.slot_9.ecs_entity_index)?.getComponents().map(elm=>_replace$2obj(elm)),
    // }
    // to_client_event("player")(Object.assign(instance,to_custom_table))


@doc.watch("deep",to_debug(),to_client_event("player"))
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


type sequence = number
@doc.watch("deep",to_client_event("player"),to_debug())
/**
 * 一件装备的所有属性都在这个组件里面
 */
export class EquipMentAttribute{
    public constructor(
        public item_name:string,
        public texture_index:string,
        public base_attribute:string[],
        public state_attribute:string[],
        public speicel_attribute:Record<sequence,记载>[],
    ){

    }
}


type item_name = string
/**
 * 
 * 存储拉比克魔方的材料值
 */
@doc.watch("deep",to_client_event("player"))
export class RbxBoxElement{
    public constructor(
        public element:Record<number,{item_name:item_name,num:number}>
    ){

    }
}

export function testCreateRandomItem(dota_item_name:string){
    const select_role = GameRules.QSet.is_select_role.first
    const player_id = select_role.get(c.base.PLAYER).PlayerID
    const hero = PlayerResource.GetPlayer(player_id).GetAssignedHero()
    const dota_item = CreateItem(dota_item_name,null,null)
    const kv = dota_item.GetAbilityKeyValues() as any
    dota_item.Entity = new Entity() // 物品的ecs entity

    BindDota2EntityLinkEcsEntity(dota_item.entindex(),dota_item.Entity.id)

    dota_item.Entity.add(select_role.get(c.base.PLAYER))
    dota_item.Entity.add(new c.quipment.EquipmentType(Number(kv.euqipment_type)))
    GameRules.world.addEntity(dota_item.Entity)
    const filter_attribute = Object.keys(equipmen_json).filter(elm=>{
        const p = equipmen_json[elm as keyof typeof equipmen_json].probability[dota_item.Entity.get(c.quipment.EquipmentType).item_type.toString() as any ]
        if(p){
            const num  = Number(p)
            if(RollPercentage(num)){
                return true
            }else{
                return false
            }
        }
    })

    const base_attribute = filter_attribute.filter(key=>equipmen_json[key as keyof typeof equipmen_json].type == 0)
                                            .map(key=> equipmen_json[key as keyof typeof equipmen_json].attribute_sign + RandomInt(50,100))
    
    const state_attribute = filter_attribute.filter(key=>equipmen_json[key as keyof typeof equipmen_json].type == 2)
                                            .map(key=> equipmen_json[key as keyof typeof equipmen_json].attribute_sign + RandomInt(50,100))
    
    const special_list:Record<number,记载>[] = []

    special_list.push(FN.test())
            
                                            

    
    const equipMentAttribute_comp = new EquipMentAttribute(
        DoUniqueString("装备名字"),
        `owl_${RandomInt(1,35)}`,
        base_attribute,
        state_attribute,
        special_list
    )


    dota_item.Entity.add(equipMentAttribute_comp)
    hero.AddItem(dota_item);
}

// 基础属性值 const a = [60,20,23,4,5,6,7,8,9,10,11,12,13,14,15] 这个表明了基础属性的数值
// 特殊属性值 const b = [23,23,23,23,23,232,32,32,23,23,]  这个表明了自定义属性的数值
// 触发特殊值 const c = [23,45,34,656,67,34] 这个表明了触发函数表
