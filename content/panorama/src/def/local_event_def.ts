/**
 * 使用event-bus发送的事件在此处声明
 * @export
 * @interface LocalEvent
 */
export interface LocalEvent {
    // 收到网表更新事件
    x_net_table: {
        table_name: string;
        key: string;
        content: any;
    };

    LargePopupBox:{
        tag_name:string;
        player_id:PlayerID
    }

    C:{
        entity:number,
        className:string;
        key:string;
        data:any;
    }

    OkPanel:{
        title:string;
        type:string;
        uuid:string;
        data:any;
    }

    OkNumberInputPanel:{
        title:string;
        type:string;
        uuid:string;
        data:any;
        call_back?:(input:any)=>void
    }

    create_role:{}

    OpenCreateName:{}
    OpenCreateMap:{}
    OpenCreateHero:{}

    create_name:string
    create_map:string
    create_hero:string

    next_shop:string
    back_shop:string
    game_start:string

    in_shop:{}
}
