import { Config } from "../../modules/Config";
import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerAbility()
export class card_base_ability extends BaseAbility{
    IsHidden(): boolean {
        return true
    }

}

@reloadable
@registerAbility()
export class pick_card_ability extends BaseAbility{
    
    OnSpellStart(): void {
        const hero = this.GetCaster()
        const player= hero.GetPlayerOwnerID()
        const ent = GameRules.QSet.is_player_ent.entities.find(elm=>elm.get(c.dungeon.PlayerInfoComp).player_num == player);
        print("[ability] 开始添加卡牌")
        ent.appendComponent(new c.dungeon.Card(
            DoUniqueString("card"),
            "普通元素",
            Config.base_type_list[0],
            1,
            []
        ))

        GameRules.world.dispatch(new GameRules.event.CardEvent(
            CardContainerBehavior.添加牌,
            ent,
            {}
        ))
        print("[ability] 结束添加卡牌")
    }

    
}