declare interface CustomUIConfig{
    comp_data_with_date_time_cache:Record<keyof compc_map,any>
    comp_data_with_dota_entity:Partial<Record<EntityIndex,number>>
    /**按照entity分类的comp cache */
    //string 是comp的class name
    with_entity_comp_cache:Partial<Record<number,Record<string,any>>>,
    reload:boolean;
}


