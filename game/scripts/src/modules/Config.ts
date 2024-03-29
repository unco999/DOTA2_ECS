import { BuildECSSpecialBehavior, ECSSpecialBehavior } from "../lib/Behavioraltree/special_behaviortree"
import { BaseBehaviortree, BuildBaseBehaviortree } from "../lib/Behavioraltree/base_behaviortree"
import * as defualt_json from "../lib/wfc/test.json"
export namespace Config{

    /**关卡标记点 当余数是多少时候进入这个特殊关卡 */
    export const shop_level_sign = 5

    export const boss_level_sign = 3

    export const aggro_scalar = 0.7

    /**平均地面高度 */
    export const world_florr_height = 128

    export const level_behaivor = {
        "cai_ji_guan":{
            
        },
        "po_huai_suo_you_ji_guan":{

        },
        "shou_ji_shen_fu":{

        },
        "ji_bai_mi_gong_suo_you_guai_wu":{
            
        }
    }

    export const boss_data:BossData[] = [
        {
            name:"npc_tka_hero_medusa_3",
            model:"models/heroes/medusa/medusa.vmdl",
            possibility_behavior_data:[
                {
                    weight:100,
                    bt_node:BuildECSSpecialBehavior.build_create_unit_with_boss_trigger
                }
            ],
            /**衍生物模型  */
            derivative:
            {
                path:"models/items/phoenix/ultimate/blazing_wing_blazing_egg/blazing_wing_blazing_egg.vmdl",
                hitsequence:"",
                idlesequence:"snake_sphere_idle",
                scale:0.3,
                deathsequence:"snake_sphere_close",
                render_color:Vector(200,255,200)
            },
            minions:[
                "models/creeps/lane_creeps/ti9_chameleon_radiant/ti9_chameleon_radiant_flagbearer_melee.vmdl",
                "models/creeps/ice_biome/undeadtusk/undead_tuskskeleton01.vmdl"
            ]
        }
    ]
    
    export const boss_level ={
        [bossType.hai_di_boss] :{
            weight:1,
            vmap_path:"migong/boss/hai_di_boss",
            creep_list_possibility:[

            ],
            clearance_conditions_list_possibility:[

            ],
        }
    }

    export const card_image_list = [
        "card_1",
        "card_2",
        "card_3",
        "card_4",
        "card_5",
        "card_6",
        "card_7",
        "card_8"
    ]

    export const base_type_list = [
        BaseCardType.光,
        BaseCardType.土,
        BaseCardType.暗,
        BaseCardType.木,
        BaseCardType.水,
        BaseCardType.火,
        BaseCardType.雷,
        BaseCardType.风
    ]

    export const default_level ={
        [defaultDungenonType.sha_mo_yi_ji] :{
            width:8,
            height:8,
            weight:1,
            prevmap:"migong/summer/",
            prename:"summer",
            creep_list_possibility:[

            ],
            clearance_conditions_list_possibility:[

            ],
            json:defualt_json
        },

        [defaultDungenonType.shui_xian_hua_ping_yuan] :{
            width:8,
            height:8,
            weight:1,
            prevmap:"migong/",
            prename:"crass",
            creep_list_possibility:[

            ],
            clearance_conditions_list_possibility:[

            ],
            json:defualt_json
        }
    }

}