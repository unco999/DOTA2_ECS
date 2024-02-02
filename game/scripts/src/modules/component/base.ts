import { Entity } from "../../lib/ecs/Entity";
import { LinkedComponent } from "../../lib/ecs/LinkedComponent";



export class PLAYER{
    constructor(
        public steam_id:string,
        public PlayerID:PlayerID,
    ){

    }
}

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


//实体关联组件
export class Link extends LinkedComponent{
    constructor(
        public type:string,
        public entity:Entity
    ){
        super();
    }
}

export class State extends LinkedComponent{
    constructor(
        public state:XstateID
    ){
        super();
    }
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
