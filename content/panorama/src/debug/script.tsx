import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { render, useGameEvent, useNetTableKey } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import { useCompWithPlayer } from '../hooks/useComp';
import { FC, useEffect, useMemo, useReducer, useRef, useState } from 'react';
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { pop_tag } from '../config';
import { LocalEvent } from '../def/local_event_def';
import { useXstate } from '../hooks/useXstate';
import { curveToBezier, pointsOnBezierCurves } from '../utils/lib';

const moni = {
    "zhangsan": {
        "name": "张三",
        "age": 18
    },
    "lisi": {
        "name": "李四",
        "age": 19
    }

}

let global_index = ""

const Debug = () =>{
    const [data,set_data] = useState<{
      comp_name: string;
      entity: number;
      data: any;
      $_update_time: number;
	  is_link_component?:string
    }[]>([])
    const val = useRef<string>()
    const [_,update] = useState<boolean>(false)
    const main = useRef<Panel>()

    const tag = useNetTableKey("system_tag","debug")

    
    useEffect(()=>{
      if(main.current){
        if(tag?.debug){
          main.current.style.visibility = "visible"
        }else{
          main.current.style.visibility = "collapse"
        }
      }
    },[tag?.debug])

    useGameEvent("s2c_debug_comp",(event)=>{
      if(event.entity == null) return;
          set_data(elm=>{
			
            const target = elm.find(elm=> elm.comp_name == event.comp_name && elm.entity == event.entity)
            if(target){
				if(target.is_link_component && target.is_link_component == event.is_link_component){
					return  [...elm,event]
				}
                target.$_update_time = event.$_update_time
                target.comp_name = event.comp_name
                target.data = event.data
                target.entity = event.entity
                return [...elm]
            }
            return [...elm,event] })
    },[])


    onLocalEvent("C",(event)=>{
        DoSomething(event.entity,event.key,event.className,"set",val.current)
    })

    return   <Panel ref={p=>main.current = p!} style={{flowChildren:"right-wrap",zIndex:100,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.9)"}}>
           <TextEntry ontextentrychange={p=>val.current = p.text} text='请输入字符串'/>
           {data.map((elm:any,index:any)=><Comp key={"comp_debug" + elm.comp_name + elm.entity + elm.$_update_time } index={elm.comp_name + elm.entity } className={elm.comp_name} entity={elm.entity} table={elm.data}/>)}
        </Panel> 
} 

const Comp = ({className,entity,table,index}:{className:string,entity:number,table:any,index:string}) =>{

    const [state,setstate] = useState<boolean>(false)
    const [val,setval] = useState()

    

    const t = `<pre>
    {
        <font color='#FF69B4'>"name"<font>: <font color='#FFD700'>"John Doe"<font> <a href="javascript:DoSomething()">[+] </a><a href="javascript:DoSomething()">[-] </a><a href="javascript:DoSomething()">[C] </a>
        <font color='#FFF8DC'>"age"<font>: 30,
        <font color='#FFF8DC'>"city"<font>: "New York"
    }
    </pre>`

    const convertJsonToHtml = (jsonData:any,parent?:string) => {
        var htmlString = '<pre>\n';
        htmlString += '    {\n';
        for (var key in jsonData) {
          if (typeof jsonData[key] === 'object') {
            htmlString += '        <font color=\'#FF69B4\'>"'+ key + '"<font>: ' + convertJsonToHtml(jsonData[key],key) + '\n';
          } else {
            let newp = parent ? parent + "::" + key : key;
            htmlString += '        <font color=\'#FF69B4\'>"'+ key + '"<font>: <font color=\'#FFD700\'>"'+ jsonData[key] + `"<font> <a href="javascript:DoSomething(${entity},'${newp}','${className}','inc')">[+] </a><a href="javascript:DoSomething('${entity}','${newp}','${className}','dec')">[-] </a><a href="javascript:local_send(${entity},'${newp}','${className}','set',${val})">[C] </a> \n`;
          }                                                                                                                                                                                                                                                                                                                                     
        }
        htmlString += '    }\n';
        htmlString += '</pre>';
        return htmlString;
      }

    useEffect(()=>{
       if(global_index == index){
          setstate(true)
       }
    },[])
    
    const toggle = () =>{
        global_index = index;
        setstate(!state)
    }

    return  <>
            <Panel hittest={true} onactivate={toggle} style={{width:"16px",height:"16px",backgroundColor:"yellow",borderRadius:"10px"}}/>
            <Label style={{flowChildren:"down"}}  text={`<font color='#7FFF00'>[${state ? "close" : "open"}]<font>  <font color='#FFF8DC'>` + "[" + className + "]<font>" + `<font color='#E9967A'>` + "[eid=" + entity + "]<font>"} html={true}>
               {state && <Label key={"convertJsonToHtml"+state} style={{borderRadius:"20px",backgroundColor:"#FFB6C102"}} text={convertJsonToHtml(table)} html={true}/>}
            </Label>
            </>

}

function local_send(entity:number,key:string,className:string,op:any,data:any){
    GameUI.CustomUIConfig().EventBus?.emit("C",{entity,key,className,op,data})
}

function DoSomething(entity:number,key:string,comp_name:string,op:"inc"|"set"|"dec",data:any){
    GameEvents.SendCustomGameEventToServer("c2s_debug_comp_change_value",{entity,key,comp_name,op,data})
}

const InputCode = () =>{
  const tag = useNetTableKey("system_tag","eval")
  const val = useRef<string>()
  const main = useRef<Panel>()

  useEffect(()=>{
    if(main.current){
      if(tag?.eval){
        main.current.style.visibility = "visible"
      }else{
        main.current.style.visibility = "collapse"
      }
    }
  },[tag?.eval])

  const click = () =>{
     GameEvents.SendCustomGameEventToServer("c2s_eval",{code:val.current!})
  }

   return  <Panel ref={p=>main.current = p!} style={{align:"center center",width:"800px",height:"800px",flowChildren:"down"}}>
       <TextEntry ontextentrychange={p=>val.current = p.text} style={{minWidth:"400px",minHeight:"400px"}} text='请输入字符串'/>
       <Panel>
       <Label onactivate={click} style={{width:"100px",height:"30px",backgroundColor:"white",color:"red"}} text={"发送"}/>
       <Label style={{marginLeft:"100px",width:"100px",height:"30px",backgroundColor:"white",color:"red"}} text={"清空"}/>
       </Panel>
   </Panel> 
}



//@ts-ignore
globalThis['DoSomething'] = DoSomething;
//@ts-ignore
globalThis['local_send'] = local_send;

render(
<>
<Debug/>
<InputCode/>
</>

,$.GetContextPanel())




export const KeyCode = {
	key_Q: "Q",
	key_W: "W",
	key_E: "E",
	key_R: "R",
	key_T: "T",
	key_Y: "Y",
	key_U: "U",
	key_I: "I",
	key_O: "O",
	key_P: "P",
	key_A: "A",
	key_S: "S",
	key_D: "D",
	key_F: "F",
	key_G: "G",
	key_H: "H",
	key_J: "J",
	key_K: "K",
	key_L: "L",
	key_Z: "Z",
	key_X: "X",
	key_C: "C",
	key_V: "V",
	key_B: "B",
	key_N: "N",
	key_M: "M",

	key_Backquote: "`",
	key_Tab: "TAB",
	key_Capslock: "CAPSLOCK",
	key_Shift: "SHIFT",
	// key_Ctrl: "CTRL",
	//无效 Alt: "ALT",
	key_Space: "SPACE",
	key_Minus: "-",
	key_Equal: "=",
	key_Backspace: "BACKSPACE",
	key_BracketLeft: "[",
	key_BracketRight: "]",
	key_Backslash: "\\",
	//无效 Semicolon: ";",
	key_Quote: "'",
	key_Comma: ",",
	key_Period: ".",
	key_Slash: "/",
	//无效 Enter: "RETURN",
	key_Printscreen: "PRINTSCREEN",
	key_ScrollLock: "SCROLLLOCK",
	key_Pause: "PAUSE",
	//无效 Insert: "INSERT",
	key_Home: "HOME",
	//无效 Delete: "DELETE",
	key_End: "END",
	//无效 PageUp: "PAGEUP",
	//无效 PageDown: "PAGEDOWN",
	//无效 Up: "UP",
	//无效 Down: "DOWN",
	//无效 Left: "LEFT",
	//无效 Right: "RIGHT",

	key_Digit1: "1",
	key_Digit2: "2",
	key_Digit3: "3",
	key_Digit4: "4",
	key_Digit5: "5",
	key_Digit6: "6",
	key_Digit7: "7",
	key_Digit8: "8",
	key_Digit9: "9",
	key_Digit0: "0",

	// S1_UP: "S1_UP",
	// S1_DOWN: "S1_DOWN",
	// S1_LEFT: "S1_LEFT",
	// S1_RIGHT: "S1_RIGHT",
	// A_BUTTON: "A_BUTTON",
	// B_BUTTON: "B_BUTTON",
	// X_BUTTON: "X_BUTTON",
	// Y_BUTTON: "Y_BUTTON",
	// L_SHOULDER: "L_SHOULDER",
	// R_SHOULDER: "R_SHOULDER",
	// L_TRIGGER: "L_TRIGGER",
	// R_TRIGGER: "R_TRIGGER",
	// X_AXIS: "X_AXIS",

	// Keypad1: "KEYPAD1",
	// Keypad2: "KEYPAD2",
	// Keypad3: "KEYPAD3",
	// Keypad4: "KEYPAD4",
	// Keypad5: "KEYPAD5",
	// Keypad6: "KEYPAD6",
	// Keypad7: "KEYPAD7",
	// Keypad8: "KEYPAD8",
	// Keypad9: "KEYPAD9",
	// Keypad0: "KEYPAD0",
	// KeypadPeriod: "KEYPAD.",
	// NumLock: "NUMLOCK",
	//无效 KeypadDivide: "KEYPAD/",
	//无效 KeypadMultiply: "KEYPAD*",
	//无效 KeypadSubtract: "KEYPAD-",
	//无效 KeypadAdd: "KEYPAD+",
	//无效 KeypadEnter: "KEYPAD ENTER",

	key_Esc: "ESCAPE",
	key_F1: "F1",
	key_F2: "F2",
	key_F3: "F3",
	key_F4: "F4",
	key_F5: "F5",
	key_F6: "F6",
	key_F7: "F7",
	key_F8: "F8",
	key_F9: "F9",
	key_F10: "F10",
	key_F11: "F11",
	key_F12: "F12",
};

export function finiteNumber(i: number, defaultVar = 0) {
	return isFinite(i) ? i : defaultVar;
}

export function jsonToArray(json: any) {
    const keys = Object.keys(json);
    const list: any[] = [];
    let index = 0
    keys.forEach(key => {
        list[index] = json[key];
        index++
    });
    return list;
}

/** 注册全局的按键绑定 */
export function RegisterKeyBind(key: string, onkeydown?: () => void, onkeyup?: () => void) {
	Game.CreateCustomKeyBind(KeyCode[key as keyof typeof KeyCode] , "+" + key);
	Game.AddCommand("+" + key, () => {
		if (onkeydown) {
			onkeydown();
		}
	}, "", Math.random());
	Game.AddCommand("-" + key, () => {
		if (onkeyup) {
			onkeyup();
		}
	}, "", Math.random());
}