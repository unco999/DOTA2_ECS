declare interface CustomNetTableDeclarations {
    game_timer: {
        game_timer: {
            current_time: number;
            current_state: 1 | 2 | 3 | 4 | 5;
            current_round: number;
        };
    };
    hero_list: {
        hero_list: Record<string, string> | string[];
    };
    custom_net_table_1: {
        key_1: number;
        key_2: string;
    };
    custom_net_table_3: {
        key_1: number;
        key_2: string;
    };
    player_tag:{
        [player_id:string]:{[key in string]:any}
    }
    player_comps:{
        [player_id:string]:{[key in string]:any}
    }
    system_comps:{
        [player_id:string]:{[key in string]:any}
    }
    system_tag:{
        [key in string]:any
    }
    xstate:{
        [id in XstateID]:{cur_name:XstateID,cur_state:string,last_state:string,parent_name:XstateID,parent_state:string}
    }
}
