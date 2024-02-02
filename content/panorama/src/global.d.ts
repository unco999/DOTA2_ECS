declare interface CustomUIConfig{
    cmp_data_cache:Record<string,any> // string = entity
    cmp_data_with_type_cache:Record<string,Record<string,any>> // string = comp_name  deep string = entity
    comp_data_with_date_time_cache:Record<keyof compc_map,any>
}


