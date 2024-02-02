import { weak } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { RoleWorldMapData } from "../component/role";


export namespace event{

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
    
}


