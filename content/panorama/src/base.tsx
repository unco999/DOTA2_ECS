import { useEffect, useRef, useState } from "react"
import { Point } from "./utils/lib";


export function _flattenArrayOfTuples ( arrOfTuples:any[] )
{
    let retVal:any[] = [];

    arrOfTuples.forEach( (t:any) => retVal.push( t[ 0 ] ) && retVal.push( t[ 1 ] ) );

    return retVal;

}

export const YellowButton = ({owned,wash,height,button_text,click}:{owned:boolean,wash:string,height:number,button_text:string,click:(panel:Panel)=>void}) =>{

    return<Panel hittest={true} onactivate={click} style={{width:"100%"}}>
         <Image style={{washColor:wash ?? "white",height:height+"px",width:"100%"}} src={"s2r://panorama/images/hud/hudv2_portrait_levelup_2.png"}/>
         <Label style={{textShadow:"0px 0px 0px 2.0 #333333b0",height:height+"px",width:"100%",fontSize:height / 1.5 + "px",textAlign:"center",color:"white"}} text={$.Localize("#"+button_text)}/>
         { owned ?  <></> : <Image style={{zIndex:33}} src={"s2r://panorama/images/icon_x_red_off.png"}/>}
    </Panel> 

}

export const H1 = ({tile}:{tile:string}) =>{
    return <Panel style={{horizontalAlign:"center"}}>
        <Label style={{fontSize:"40px",color:"WHITE",textShadow:" 1px 1px 1px 2.0 #333333b0"}} text={tile} />
    </Panel>
}


export const Kline = ({data,tile}:{data:number[],tile:string}) =>{
    const main = useRef<any>()
    const [points,set_points] = useState<Point[]>([])

    useEffect(()=>{
        if(data){
            const k = data.map((elm,index)=>{
                return [index * (500 / data.length) ,elm * 30 + 400]
            })
            set_points(k as any)
            for(let i = 0 ; i < k.length ; i+=1){
                let color = "#d42222"
                if(k[i + 1] == null) break;
                if(k[i + 1][1] > k[i][1] ){
                    color = "#85e384"
                }
                main.current?.DrawSoftLinePointsJS(2, _flattenArrayOfTuples([k[i],k[i + 1]]), 5,5, color)
            }
        }
    },[])

    const curtime = (index:number) =>{
        const now = new Date();

        // 计算前十天的日期
        const tenDaysAgo = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);

        // 格式化日期为 "YYYY-MM-DD" 字符串
        const formattedDate = tenDaysAgo.toISOString().slice(5,10);

        return formattedDate
    }




    return <Panel style={{width:"100%",height:"100%"}}>
        <H1 tile={tile}/>
        <GenericPanel  style={{width:"100%",height:"100%"}} ref={p=>main.current = p!} id="kline" type='UICanvas' /> 
        {points.map((elm,index)=>{
            let color = "#d42222"
            if(points[index + 1] && points[index + 1][1] > points[index + 0][1] ){
                color = "#85e384"
            }
            return <Panel key={index + "pointk"} style={{flowChildren:"down",x:elm[0] +"px",y:elm[1] - 50 + "px"}}> 
                <Label text={curtime(points.length - index)} style={{zIndex:22,fontSize:"12px",color:"white",textShadow:"0px 0px 0px 3.0 #333333b0"}}/>
                <Label text={"￥" + points[index + 0][1]} style={{zIndex:22,fontSize:"22px",color,textShadow:"0px 0px 0px 2.0 black"}}/>
            </Panel>
        })}
    </Panel> 
}


