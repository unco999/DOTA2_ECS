/**
 * 主要负责采集资源相关的系统
 */

import { Entity } from "../../lib/ecs/Entity";
import { System } from "../../lib/ecs/System";

export class resouce_gather_system extends System{

    in_kuang_dong(role_ent:Entity){

    }

    exit_kuang_dong(role_ent:Entity){

    }

    public onAddedToEngine(): void {
        GameRules.QSet.is_in_kuang_dong.onEntityAdded.connect(snap=>this.in_kuang_dong(snap.current))
        GameRules.QSet.is_in_kuang_dong.onEntityRemoved.connect(snap=>this.in_kuang_dong(snap.current))
    }
}