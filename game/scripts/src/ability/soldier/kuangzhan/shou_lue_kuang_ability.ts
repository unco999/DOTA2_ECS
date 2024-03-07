import { RemoveParticleCallBack, rolltable, rollweight } from "../../../fp";
import { matchObject } from "../../../funcional";
import { BaseAbility, registerAbility } from "../../../utils/dota_ts_adapter";
import { reloadable } from "../../../utils/tstl-utils";

@reloadable
@registerAbility()
export class shou_lue_kuang_ability extends BaseAbility{



    OnSpellStart(): boolean {
        return matchObject("开始执行受虐狂的ability",this,[
            {
                test:"判断服务器与血量高于50 并执行",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() > 50,
                then:(buff)=>{
                    buff.GetCaster().AddNewModifier(buff.GetCaster(),buff,"shou_lue_kuang_modifier",{duration:1})
                    return true
                }
                
            },
            {
                test:"判断服务器与血量低于3 禁止施法",
                when:(buff)=> IsServer() && buff.GetCaster().GetHealthPercent() <= 50,
                then:(buff)=>{return false}
            }
        ])
    }

    GetCastAnimation(): GameActivity {
        return GameActivity.DOTA_CAST_ABILITY_1
    }

    GetCastPoint(): number {
        return 0.75
    }
    
}