import { doc, http, to_client_event, to_debug } from "../../fp";
import { LinkedComponent } from "../../lib/ecs/LinkedComponent";
import { HERO } from "./base";

@doc.watch("none",to_debug(),
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

