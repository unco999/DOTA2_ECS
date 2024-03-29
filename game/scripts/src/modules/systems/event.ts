import { Entity } from "../../lib/ecs/Entity";


export namespace event{

    /**
     * 在装备卸载之前发送的事件
     */
    export class EquipmentEvent{
        public constructor(
            public readonly equipment_entity:Entity,
            public readonly Hero_idx:EntityIndex,
            public readonly type:"up"|"down", 
        ){

        }
    }

    export class BuildSystemEvent{
        public constructor(
            public readonly BuildfncName:string,
         ) {}
    }
    
    export class MapEvent{
        public constructor(
            public readonly map_name:string,
            public readonly event_name:string,
         ) {}
    }
    
    export class PlayerMapEvent{
        public constructor(
            public readonly last_move_point:{x:number,y:number},
            public readonly new_move_point:{x:number,y:number},
            public readonly PlayerID:PlayerID,
        ) {}
    }
    
    export class ProgressEvent{
        public constructor(
            public readonly state:string,
            public readonly uuid:string,
            public readonly data?:any
        ){}
    }
    
    
    
    export class OkEvent{
        public constructor(
            public readonly uuid:string,
            public readonly type:string,
            public readonly click:"ok"|"not_ok",
            public readonly PlayerID:PlayerID,
            public readonly data?:any,
        ){}
    }
    
    export class xstateChangeEvent{
        public constructor(
            public readonly state:string,
            public readonly xstateid:XstateID
        ){}
    }
    
    
    export class RoleChangeMapAnyEvent{
        public constructor(
            public readonly comp:RoleWorldMapData,
            public readonly trigger_entity:Entity,
        ){}
    }

    export class RoleMoveTriggerEvent{
        public constructor(
            public readonly trigger_entity:Entity,
        ){}
    }

    /**进入城市 野外 等等据点的统一事件 */
    export class InLandMarkEvent{
        public constructor(
            public readonly trigger_entity:Entity,
            public readonly mark_name:string
        ){

        }
    }

    export class OpenNpcUiEvent{
        public constructor(
            public readonly npc_name:string,
        ){

        }
    }

    //**地下城加载完毕事件 */
    export class DungeonMapReadOk{
        public constructor(
            public readonly dungeon_ent:Entity,
        ){

        }
    }

    //**游戏初始化完毕 */
    export class GameLoopEvent{
        public constructor(
            public readonly event:GameLoopState
        ){
            
        }
    }

    //**进入下一关 */
    export class NextLevelEvent{
        public constructor(
            
        ){

        }
    }



    export class LevelEvent{
        constructor(
            public level_state:LevelState,
            public level_type:LevelType,
            public level_ecs_ent:Entity
        ){

        }
    }

    export class CardEvent{
        constructor(
            public card_event:CardContainerBehavior,
            public player_ent:Entity,
            /**@string uid */
            public merge_data:Record<number,string>,
            public spell_data?:SpellCardData[],
        ){

        }
    }
    
    export class SpellCardEvent{
        constructor(
            public spell_data:ToWorldSpellCardData[],
            public player_ent:Entity,
            public spell_card_state:SpellCardState
        ){
            
        }
    }
}


