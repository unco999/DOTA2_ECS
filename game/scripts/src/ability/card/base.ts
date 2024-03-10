import { Config } from "../../modules/Config";
import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerAbility()
export class card_base_ability extends BaseAbility{
    IsHidden(): boolean {
        return true
    }

    OnSpellStart(): void {
        const id = ParticleManager.CreateParticle("particles/econ/items/antimage/antimage_weapon_basher_ti5_gold/antimage_manavoid_ti_5_gold.vpcf",ParticleAttachment.WORLDORIGIN,this.GetCaster())
        ParticleManager.SetParticleControl(id,0,this.GetCursorPosition())
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
        const uid = DoUniqueString("card")
        const card = new c.dungeon.Card(
            uid,
            none,
            DoUniqueString("card"),
            "普通元素",
            Config.base_type_list[0],
            1,
            [],
            ""
        )
        card.uid = uid,
        card.card_name = "普通元素"
        card.merge_sequence = []
        card.id = uid
        card.card = table.random(Config.base_type_list)
        card.image = table.random(Config.card_image_list)
        ent.appendComponent(card)

        GameRules.world.dispatch(new GameRules.event.CardEvent(
            CardContainerBehavior.添加牌,
            ent,
            {}
        ))
        print("[ability] 结束添加卡牌")
    }

    
}