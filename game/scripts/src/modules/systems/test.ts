import { Entity } from "../../lib/ecs/Entity";
import { QueryBuilder } from "../../lib/ecs/Query";
import { System } from "../../lib/ecs/System";
import { PLAYER } from "../component/base";
import { Move } from "../component/role";

export class TestCreateRoleSystem extends System {
    public onAddedToEngine(): void {

        for(let i = 0 ; i < PlayerResource.GetPlayerCount() ; i++){
            const Player = PlayerResource.GetPlayer(i as PlayerID)
            const test_entity = new Entity();
            const move = new Move(12,33);
            test_entity.add(new PLAYER(PlayerResource.GetSteamID(Player.GetPlayerID()).ToHexString(),Player.GetPlayerID()))
                       .add(move);
            this.engine.addEntity(test_entity);
        }
                   
    }
}

export class TestQueryWithPlayerData extends System{
    public onAddedToEngine(): void {

        // const entities = this.engine.getEntitiesFor(query);
        // entities.forEach((entity)=>{
        //     print("当前的实体",entity);
        // })
    }
}