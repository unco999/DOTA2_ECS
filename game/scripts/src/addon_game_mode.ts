import 'utils/index';

import { ActivateModules } from './modules';
import Precache from './utils/precache';




// const global_rawset = _G.rawset
// const global_rawget = _G.rawget

// _G.rawset = (obj,key,value) => {
//     if(type(obj) == 'userdata'){
//        return global_rawset(getmetatable(obj) as any,key,value)
//     }else{
//        return global_rawset(obj,key,value);
//     }
// }

// _G.rawget = (obj,key) => {
//     if(type(obj) == 'userdata'){
//         return global_rawget(getmetatable(obj) as any,key)
//     }else{
//         return global_rawget(obj,key)
//     }
// }

Object.assign(getfenv(), {
    Activate: () => {
        ActivateModules();
    },
    Precache: Precache,
});


