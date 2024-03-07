import { doc, to_save } from "../../fp";
import { Entity } from "../../lib/ecs/Entity";
import { LinkedComponent } from "../../lib/ecs/LinkedComponent";

@doc.watch("none",to_save())
export class PLAYER{
    constructor(
        public steam_id:string,
        public PlayerID:PlayerID,
    ){

    }
}

@doc.watch("none",to_save())
export class HERO{
    constructor(
       public name:string,
       public hero_idx:EntityIndex
    ){
        
    }
}

export class Pair{
    constructor(
        public pair:{[key in string]:string|number|boolean},
     ){
         
     }
}

export class UiCache{
    constructor(
        public ui_cache:Partial<Record<XstateID | "OkPanel",Record<string,string|boolean|number>>>
    ){}
}


export class MarkCache{
    constructor(
        public uuid:string,
        public cache:Map<any,CBaseModelEntity>,
        public is_remove:boolean,
        public is_build:boolean,
    ){

    }
}
