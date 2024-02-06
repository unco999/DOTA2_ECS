import { doc, http, to_client_event, to_debug, to_save } from "../../fp";
import { LinkedComponent } from "../../lib/ecs/LinkedComponent";
import { HERO } from "./base";

@doc.watch("deep",to_debug(),to_save(),
to_client_event("system"))
export class npc<T> extends LinkedComponent{
    constructor(
        public city:string,
        public npc_name:string,
        public ui_data:T,
        public dota_entity:EntityIndex,
        public is_can_move:boolean,
        public is_can_battle:boolean,
        public is_http:boolean,
    ){
        super()
    }
}

