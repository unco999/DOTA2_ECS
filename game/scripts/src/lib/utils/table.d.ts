/** @noSelfInFile */
declare namespace table {
    function count(t: AnyTable): number;
    function contains(t: AnyTable, v: any): boolean;
    function random_and_remove<T>(t: T[]): T;
    function remove_value(t: AnyTable, v: any): void;
    function has_element_fit(t: AnyTable, func: (t: AnyTable, k: any, v: any) => boolean): [any, any];
    function get_key_by_value(t: AnyTable, v: any): any;
    function shallowcopy<T>(orig: T[]): T[];
    function deepcopy(orig: AnyTable): AnyTable;
    function random<T>(t: T[]): T;
    function shuffle<T>(tbl: T[]): T[];
    function random_some<T>(t: T[], count: number): T[];
    function random_with_condition<T>(t: T[], func: (t: AnyTable, k: any, v: T) => boolean): T;
    function filter<T>(t: AnyTable, condition: (t: AnyTable, k: any, v: T) => boolean): T[];
    function foreach(t: AnyTable, calback: (k: any, v: any) => void): void;
    function make_key_table(t: AnyTable): AnyTable;
    function is_equal(t1: AnyTable, t2: AnyTable): boolean;
    function random_key<T>(t: T): keyof T;
    function print(t: AnyTable): void;
    function deep_print(t: AnyTable): void;
    function safe_table(t: AnyTable): AnyTable;
    function save_as_kv_file(tbl: AnyTable, filePath: string, headerName: string, utf16: boolean): void;
    function to_kv_lines(tbl: AnyTable, tabCount: number): void;
    function join(...t: AnyTable[]): AnyTable;
    function reverse(tbl: AnyTable): AnyTable;
    function swap_key_value(tbl: AnyTable): AnyTable;
    function number_table(t: AnyTable): AnyTable;
    function string_table(t: AnyTable): AnyTable;
    function random_allocate(t: AnyTable, l: AnyTable, soft?: boolean): AnyTable;
    function random_weight_table(t: AnyTable): any;
}
