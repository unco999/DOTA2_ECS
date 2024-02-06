import { Entity } from "../../lib/ecs/Entity";
import { LinkedComponent } from "../../lib/ecs/LinkedComponent";
import * as wolrd_map_json from "../../json/game_big_world_map.json"
import { doc, to_save } from "../../fp";


export class MapBaseBlock{
    constructor(
        public x:number,
        public y:number,
        public block_type:MapBlockType,
        public image_name:string,
        public rotation:number
    ){}
}


export class MapCacheResouce{
    constructor(
        public map_name:string,
        public map_data:Record<numString,Record<numString,Entity>>
    ){

    }
}


export class CurDungeonConfig{
    constructor(
        public map_name:string,
        public creep_count:number,
        public event_count:number,
        public creep_max:number,
        public event_max:number,
        public map_width:number,
        public map_height:number
    ){

    }
}

@doc.watch("none",to_save())
/**
 * 世界地图基础数据
 */
export class WorldMapLandMark extends LinkedComponent{
    constructor(
        item_name:string,	
        map_name:string,
        map_index:number,
        item_index:number,
        item_path:string,
        x:number,
        y:number,
        map_link_array:string[]
    ){
        super()
    }
} 