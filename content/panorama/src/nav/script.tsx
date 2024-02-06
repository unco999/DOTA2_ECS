import { render } from "react-panorama-x"
import React, { useState } from "react"
import { EquipmentMain } from "./conpoment/equipment/script"

export const Nav = () =>{
    const [equipment_open,set_equipment_open] = useState(false)


    
    const equipment_click_nav = () =>{
        set_equipment_open(val => !val)
    }

    return <Panel hittest={false} style={{width:"100%",height:"100%"}}>
        <EquipmentMain open={equipment_open}/>
        <Image style={{flowChildren:"down",zIndex:-3,align:"right bottom",x:"52px",y:"10px"}} className={"mask"} src="s2r://panorama/images/hud/reborn/hud_custom_ti12/gold_bg.psd" >
            <Panel style={{marginTop:"65px",flowChildren:"right",width:"70%",height:"50%",align:"center center"}}>
                  <NavButton tile={"货币"}/>
                  <NavButton tile={"装备"} link_click={equipment_click_nav}/>
                  <NavButton tile={"技能"}/>
                  <NavButton tile={"天赋"}/>
                  <NavButton tile={"邮件"}/>
                  <NavButton tile={"属性"}/>
            </Panel>
        </Image>
    </Panel>
}

const NavButton = ({tile,link_click}:{tile:string,link_click?:(panel:Panel)=>void}) =>{
    return <Image hittest={true} onactivate={link_click} src="s2r://panorama/images/hud/reborn/hud_custom_ti12/roshan_timer_bg.psd">
        <Label text={tile}  style={{fontSize:"20px",color:"white",align:"center center"}}/>
    </Image>
}


render(<Nav/>,$.GetContextPanel())
$.Msg("123")