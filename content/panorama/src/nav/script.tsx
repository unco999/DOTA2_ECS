import { render } from "react-panorama-x"
import React, { useEffect, useRef, useState } from "react"
import { EquipmentMain } from "./conpoment/equipment/script"
//@ts-ignore
import {Motion, spring} from "@serprex/react-motion"
import { useLocalEvent } from "../utils/event-bus"
import { Inventory } from "./conpoment/inventory/script"


const main_style:Record<string,Partial<Record<keyof Partial<VCSSStyleDeclaration>,number | string>>> = {
	"init": {
		width: 0,
		height: 0,
		opacity: 0,
	},
	"spawn":{
		width: 100,
		height: 100,
		opacity: 1,
	},
}

export const Nav = () =>{
    const [last_state,set_last_state] = useState<keyof typeof main_style>("init")
    const [state,setState] = useState<keyof typeof main_style>("init")
    const [page,set_page] = useState(0)

    /**更换状态只能用这个接口 */
    const next_state = (key:string) => {
        set_last_state(state)
        setState(key)
    }

	useLocalEvent("open_nav",()=>{
		next_state(state == "init" ? "spawn" : "init")
	})

    return  <Motion key={"Nav" + state} defaultStyle={main_style[last_state]} style={{
        width: spring(main_style[state].width),
        height: spring(main_style[state].height),
        opacity: spring(main_style[state].opacity),
    }}> 
		{(style:any)=>
			<Panel  id="EquipmentMain"  hittest={false} style={{align:"center center",opacity:style.opacity.toFixed(3),zIndex:-3,width:style.width.toFixed(3) + "%",height:style.height.toFixed(3) + "%"}}>
        <Panel id="TopBarBackground" hittest={false} >
							<Panel id="TopBarDefaultBackground" className="TopBarRightBackground" hittest={false} />
							<Panel id="TopBarArmoryBackground" className="TopBarRightBackground" hittest={false} />
							<Panel id="TopBarPlusBackground" className="TopBarRightBackground" hittest={false} />
							<Panel id="TopBarArmoryHover" hittest={false} />
							<Panel id="TopBarPlusHover" hittest={false} />
							<Panel id="TopBarNotificationsHover" hittest={false} />
							<Panel id="TopBarExitHover" hittest={false} />
						</Panel>
        <Panel id="TopBarMainNav" className="LeftRightFlow" hittest={false}>
				<RadioButton onactivate={()=>set_page(0)} id="TopBarHome" group="DashboardMainTabs" selected={true} >
					<Panel id="SimpleDotaLogoBackground" />
					<Panel id="SimpleDotaLogo" />
				</RadioButton>
				<RadioButton onselect={()=>set_page(1)} id="TopBarHeroes" group="DashboardMainTabs" className="TopBarMenuItem" >
					<Label className="TitleFont" text="人物" />
				</RadioButton>
				<RadioButton onselect={()=>set_page(2)} id="TopBarCollection" group="DashboardMainTabs" className="TopBarMenuItem" >
					<Label className="TitleFont" text="背包" />
				</RadioButton>
				<RadioButton onselect={()=>set_page(3)} id="TopBarWatch" group="DashboardMainTabs" className="TopBarMenuItem" >
					<Label className="TitleFont" text="任务" />
				</RadioButton>
				<RadioButton onselect={()=>set_page(4)} id="TopBarLearn" group="DashboardMainTabs" className="TopBarMenuItem">
					<Label className="TitleFont" text="技能" />
				</RadioButton>
				<RadioButton onselect={()=>set_page(5)} id="TopBarMods" group="DashboardMainTabs" className="TopBarMenuItem" >
					<Label className="TitleFont" text="邮件" />
				</RadioButton>
			</Panel>
		<Image style={{zIndex:-3}} className="BattlePass2022_Badge" src="s2r://panorama/images/backgrounds/generic_hero_background_png.vtex" />
        <EquipmentMain page={page}/>
		<Inventory page={page} />
    </Panel>}
	</Motion>
}


const hudRoot = $.GetContextPanel()
.GetParent()!
.GetParent()!
.GetParent()!;

$.Schedule(1,()=>{
	for(let i = 0 ; i < 10 ; i++){
		hudRoot.FindChildTraverse("HUDElements")?.FindChild("EquipmentMain")?.RemoveAndDeleteChildren()
		hudRoot.FindChildTraverse("HUDElements")?.FindChild("EquipmentMain")?.DeleteAsync(0)
	} 
	
	
	render(<Nav/>,hudRoot.FindChildTraverse("HUDElements")!)
})

