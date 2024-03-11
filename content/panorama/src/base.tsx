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



export const Loading = ({offsetx,offsety}:{offsetx?:number,offsety?:number}) =>{
    return <Panel style={{marginLeft:offsetx ? offsetx + "px" : "0px",marginTop:offsety ? offsety + "px" : "0px",maxWidth:"100%",height:"100%",align:"center center"}}>
       <Movie key={Math.random()} src="s2r://panorama/videos/loading.webm" style={{maxHeight:"50%",align:"center center"}}  repeat={true} autoplay="onload"/>
    </Panel>
}

export const luaToJsArray = (items:any) =>{
    const list = []
    for(let key in items){
        if(!isNaN(Number(key))){
            list.push(items[key])
        }
    }
    return list
}

export const TilePanel = ({width,height,tile,children}:{tile:string,width:string,height?:string,children:JSX.Element[] | JSX.Element}) => {
    return <Panel hittest={false}   style={{                       
    marginTop:"10px",
    marginBottom:"10px",
    backgroundColor:"rgba(0,0,0,0.2)",
    borderRadius:"3px", 
    horizontalAlign:"center",flowChildren:"down",width,height}}
    >
        <Image hittest={false} src="s2r://panorama/images/hud/item_tooltip_passive.psd">
            <Label style={{color:"white",fontSize:"15px",textShadow:"2px 2px 8px 3.0 #333333b0"}} text={tile}/>
        </Image>
        <Panel>
        {children}
        </Panel>
    </Panel>
}
//锚点计算  按照传入的x和y计算剩余空间最多位置的方向 然后给panel换锚点
export const AnchorPanel = (x:number,y:number,panel:Panel) =>{
    const xs = x / Game.GetScreenWidth()
    const ys = y / Game.GetScreenHeight()
    panel.style.transformOrigin = `${xs * 100}% ${ys * 100}%`
    panel.style.transform =`translate3d( -${xs * Game.GetScreenWidth() /10 }px, -${ys * Game.GetScreenHeight()/2}px, 0px );`
    return panel
}


export function setHexOpacity(hex:string, opacity:number) {  
    // 确保十六进制颜色值是有效的  
    if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) {  
        throw new Error('Invalid hex color code');  
    }  
  
    // 确保透明度在0到255之间  
    opacity = Math.round(Math.max(0, Math.min(255, opacity)));  
  
    // 提取红、绿、蓝分量并转换为两位十六进制  
    let r = ("0" + parseInt(hex.slice(1, 3), 16).toString().slice(-2));  
    let g = ("0" + parseInt(hex.slice(3, 5), 16).toString().slice(-2));  
    let b = ("0" + parseInt(hex.slice(5, 7), 16).toString().slice(-2));  
    let a = ("0" + opacity.toString(16)).slice(-2);  
  
    // 返回带有透明度的十六进制颜色字符串  
    return `#${r}${g}${b}${a}`;  
}  
  


export function calculateCenter(coordinates: { x: number; y: number }[]): { x: number; y: number } {  
  let sumX = 0;  
  let sumY = 0;  
  let count = 0;  

  // 遍历坐标数组，累加x和y的值  
  for (const { x, y } of coordinates) {  
      sumX += Number(x);  
      sumY += Number(y);  
      count++;  
  }  

  // 计算平均值得到中心点坐标  
  const centerX = sumX / count;  
  const centerY = sumY / count;  


  // 返回中心点坐标  
  return { x: centerX, y: centerY };  
}  

export function splitArrayByIndex(array: any[], indexArray: number[]): any[][] {  
    // 初始化一个结果数组  
    let result: any[][] = [];  
    let startIndex = 0; // 记录开始切片的索引  
  
    // 遍历indexArray中的每一个索引     
    for (const index of indexArray) {  
        // 在当前索引处进行切片，并将结果添加到结果数组中  
        if(index == 0) continue;
        result.push(array.slice(startIndex, index));  
        startIndex = index; // 更新开始切片的索引为当前索引  
    }  
  
    // 添加最后一个切片（如果存在的话，并且不是空数组）  
    if (startIndex < array.length) {  
        result.push(array.slice(startIndex));  
    }  
  
    return result;  
}  



// 计算两点之间的欧几里得距离  
function calculateDistance(pointA:Point, pointB: Point): number {  
    const dx = pointA[0] - pointB[1];  
    const dy = pointA[0] - pointB[1];  
    return Math.sqrt(dx * dx + dy * dy);  
}  
  
// 计算一组数值的标准差  
function calculateStandardDeviation(values: number[]): number {  
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;  
    const squaredDiffSum = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);  
    const variance = squaredDiffSum / (values.length - 1);  
    return Math.sqrt(variance);  
}  


export function isPointsLikeACircle(points: [number,number][],bias:number) {  
    // 计算质心  
    const centroid = calculateCentroid(points) as [number,number];  
      
    // 计算每个点到质心的距离  
    const distances = points.map(point => calculateDistance(point, centroid));  
      
    // 计算距离的标准差  
    const standardDeviation = calculateStandardDeviation(distances);  
      
    // 设定一个阈值来判断距离是否足够接近（这个值可以根据实际情况调整）  
    const threshold = distances.reduce((a, b) => Math.max(a, b), 0) * bias; // 例如，最大距离的10%作为阈值  
      
    // 如果标准差小于阈值，则认为这些点像一个圆  
    return {centroid,is_circle:standardDeviation < threshold};  
}  
  
// 计算质心（中心点）  
export function calculateCentroid(points: [number,number][]){  
    let sumX = 0;  
    let sumY = 0;  
    const count = points.length;  
  
    for (const [x,y] of points) {  
        sumX += x;  
        sumY += y;  
    }  
  
    const centroidX = sumX / count;  
    const centroidY = sumY / count;  
  
    return [centroidX,centroidY]
}  

export type PointSet = Point[]

function distance(p1: Point, p2: Point): number {  
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));  
}  

function getClosestPoint(point: Point, pointSet: PointSet): Point {  
  let closestPoint: Point | undefined = undefined;  
  let minDistance = Infinity;  
  
  for (const p of pointSet) {  
    const d = distance(point, p);  
    if (d < minDistance) {  
      minDistance = d;  
      closestPoint = p;  
    }  
  }  
  
  if (!closestPoint) {  
    $.Msg('No points in the set to compare with.');  
  }  
  
  return closestPoint!;  
}  


export function PointSub(a:Point,b:Point):Point{
  return [a[0] - b[0],a[1] - b[1]]
}
  
export function hausdorffDistance(pointSetA: PointSet, pointSetB: PointSet): number {  
  let maxDistanceA = 0;  
  let maxDistanceB = 0;  
  
  for (const pointA of pointSetA) {  
    const closestPointB = getClosestPoint(pointA, pointSetB);  
    const distanceAB = distance(pointA, closestPointB);  
    maxDistanceA = Math.max(maxDistanceA, distanceAB);  
  }  
  
  for (const pointB of pointSetB) {  
    const closestPointA = getClosestPoint(pointB, pointSetA);  
    const distanceBA = distance(pointB, closestPointA);  
    maxDistanceB = Math.max(maxDistanceB, distanceBA);  
  }  
  
  return Math.max(maxDistanceA, maxDistanceB);  
}  

function angleBetweenPoints(p1: Point, p2: Point): number {  
  const dx = p2[0] - p1[0];  
  const dy = p2[1] - p1[1];  
  return Math.atan2(dy, dx) * (180 / Math.PI); // 转换为度数  
}  
function hausdorffDistanceWithAngle(setA: Point[], setB: Point[], angleWeight: number): number {  
  let maxDist = 0;  
  for (const a of setA) {  
      let minDist = Infinity;  
      let minAngleDiff = Infinity;  
      for (const b of setB) {  
          const dist = distance(a, b);  
          const angleDiff = Math.abs(angleBetweenPoints(a, b) - angleBetweenPoints(a, [ a[0], a[1]])); // 假设a点下方为参考方向  
          const weightedDist = dist + angleWeight * angleDiff; // 结合距离和角度差异  
          if (weightedDist < minDist) {  
              minDist = weightedDist;  
          }  
      }  
      maxDist = Math.max(maxDist, minDist);  
  }  
  return maxDist;  
}



export function dir(p1:Point,p2:Point):number{
  return cosineSimilarity(p1,p2)
}

export function sigmoid(x: number): number {  
    return 1 / (1 + Math.exp(-x));  
  }  
    
export function applySigmoidToPoint(Point: Point): Point {  
    return [Number(sigmoid(Number(Point[0].toFixed(8))).toFixed(8)), Number(sigmoid(Number(Point[1].toFixed(8))).toFixed(8))];  
  }  

export function normalizePoint(Point: Point): Point {  
  const magnitude = Math.sqrt(Point[0] ** 2 + Point[1] ** 2);  
  if (magnitude === 0) {  
    // 避免除以零  
    return [0,0];  
  }  
  return [Point[0] / magnitude,Point[1] / magnitude];  
}  

export function dotProduct(a: Point, b: Point): number {  
    let sum = 0;  
    for (let i = 0; i < a.length; i++) {  
      sum += a[i] * b[i];  
    }  
    return sum;  
  }  
    
  // 计算向量的模（长度）  
  function magnitude(Point: Point): number {  
    return Math.sqrt(dotProduct(Point, Point));  
  }  
    
  // 计算两个向量的余弦相似度  
 export function cosineSimilarity(a: Point, b: Point): number {  
    const dot = dotProduct(a, b);  
    const magA = magnitude(a);  
    const magB = magnitude(b);  
    // 避免除以零的错误  
    if (magA === 0 || magB === 0) {  
      return 0; // 或者根据具体情况抛出错误或返回其他值  
    }  
    return dot / (magA * magB);  
  }  

  export function shapeDiff(a:Point[]){
    let base_shape = [
        {name:"圆",data:circle,score:0,switch:true},
        {name:"三角",data:triangle,score:0,switch:true},
    ]
    const max = base_shape.map(elm=>elm.data.length).sort((a,b)=> a - b).pop()!
   
    base_shape.forEach(shape=>{
      const b = shape.data.map(data_point=>{
          return {name:shape.name,score:data_point.map((elm,index) => distance(elm as Point,a[index] ?? [0.5,0.5])).reduce((pre,cur)=> pre + cur,0) / shape.data.length}
      })
      
      $.Msg(b)
    })

    return base_shape.map(elm=>({score:elm.score,name:elm.name}))
  }
  
export  function euclideanDistance(point1: number[], point2: number[]): number {  
    if (point1.length !== point2.length) {  
        throw new Error('Points must have the same number of dimensions');  
    }  
      
    let sumOfSquares = 0;  
    for (let i = 0; i < point1.length; i++) {  
        const diff = point1[i] - point2[i];  
        sumOfSquares += diff * diff;  
    }  
      
    return Math.sqrt(sumOfSquares);  
}  

  export function cosineSimilarityStrictlyPositive(a: Point, b: Point): number {  
    const sim = Math.abs(cosineSimilarity(a, b));  
    return sim;  
  }

 export function calculateAngleBetweenVectors2D(A: [number, number], B: [number, number]): number {  
    const dotProduct = A[0] * B[0] + A[1] * B[1];  
    const magnitudeA = Math.sqrt(A[0] * A[0] + A[1] * A[1]);  
    const magnitudeB = Math.sqrt(B[0] * B[0] + B[1] * B[1]);  
    const cosTheta = dotProduct / (magnitudeA * magnitudeB);  
    const thetaRadians = Math.acos(cosTheta);  
    const thetaDegrees = thetaRadians * (180 / Math.PI);  
    return thetaDegrees;  
}  

export function normalizeDistances(distances: number[]): number[] {  
  // 计算最大值和最小值  
  const minValue = Math.min(...distances);  
  const maxValue = Math.max(...distances);  
    
  // 应用归一化公式  
  const normalizedDistances: number[] = distances.map(distance => {  
      return (distance - minValue) / (maxValue - minValue);  
  });  
    
  return normalizedDistances;  
}  

export function normalizeData(points: Point[]): Point[] {  
  // 实现你的标准化逻辑，例如通过缩放因子将点缩放到[0, 1]范围  
  const minX = Math.min(...points.map(p => p[0]));  
  const minY = Math.min(...points.map(p => p[1]));  
  const maxX = Math.max(...points.map(p => p[0]));  
  const maxY = Math.max(...points.map(p => p[1]));  
    
  const normalizedPoints: Point[] = [];  
  for (const point of points) {  
      normalizedPoints.push([
          Number(((point[0] - minX) / (maxX - minX)).toFixed(4)),  
          Number(((point[1] - minY) / (maxY - minY) ).toFixed(4))
      ]);  
  }  
  return normalizedPoints;  
}

export function toFixedPoint(a:Point,length:number){
   return a.map(elm=>Number(elm.toFixed(length))) as [number,number]
}

type DistanceMatrix = number[][][];

function precomputeDistances(pointSetA: PointSet, labelArrays: PointSet[]): DistanceMatrix {  
  const distances: DistanceMatrix = labelArrays.map(labelArray => {  
      return pointSetA.map(pointA => {  
          return labelArray.map(pointB => distance(pointA, pointB));  
      });  
  });  
  return distances;  
}  

// 根据预先计算的距离矩阵计算Hausdorff距离  
function hausdorffDistanceFromMatrix(pointSetA: PointSet, pointSetB: PointSet, distancesMatrix: number[][]): number {  
  let maxDistanceAtoB = 0;  
  for (let i = 0; i < pointSetA.length; i++) {  
      const distancesToB = distancesMatrix[i];  
      const minDistanceToB = Math.min(...distancesToB);  
      maxDistanceAtoB = Math.max(maxDistanceAtoB, minDistanceToB);  
  }  

  let maxDistanceBtoA = 0;  
  for (let j = 0; j < pointSetB.length; j++) {  
      let maxDistanceFromBtoA = 0;  
      for (let i = 0; i < pointSetA.length; i++) {  
          maxDistanceFromBtoA = Math.max(maxDistanceFromBtoA, distancesMatrix[i][j]);  
      }  
      maxDistanceBtoA = Math.max(maxDistanceBtoA, maxDistanceFromBtoA);  
  }  

  return Math.max(maxDistanceAtoB, maxDistanceBtoA);  
}  

// 找到与pointSetA得分最低的Hausdorff距离的标签数组  
export function findMinimumHausdorffDistanceOptimized(pointSetA: PointSet, labelArrays: PointSet[]): number {  
  const distancesMatrix = precomputeDistances(pointSetA, labelArrays);  
  let minHausdorffDistance = Infinity;  
  for (let i = 0; i < labelArrays.length; i++) {  
      const hausdorffDist = hausdorffDistanceFromMatrix(pointSetA, labelArrays[i], distancesMatrix[i]);  
      minHausdorffDistance = Math.min(minHausdorffDistance, hausdorffDist);  
  }  
  return minHausdorffDistance;  
}  

export function averageHausdorffDistance(pointSetA: PointSet, labelArrays: PointSet[]): number {  
  let totalHausdorffDistance = 0;  
  for (let i = 0; i < labelArrays.length; i++) {  
      const hausdorffDist = hausdorffDistance(pointSetA, labelArrays[i]); // 假设这里有一个计算Hausdorff距离的函数  
      totalHausdorffDistance += hausdorffDist;  
  }  
  return totalHausdorffDistance / labelArrays.length;  
}

function angleBetweenVectors(v1: Point, v2: Point): number {  
  const dot = toFixed4(v1[0] * v2[0] + v1[1] * v2[1]);
  const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);  
  const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);  
  const cosTheta = dot / (norm1 * norm2);  
  const theta = Math.acos(cosTheta);  
  
  return toFixed1(theta * (180 / Math.PI)); // 转换为角度  
}  


export function toFixed4(num:number){
    return Number(num.toFixed(4))
}

export function toFixed1(num:number){
    return Number(num.toFixed(1))
}

export function calculateSlope(point1: [number, number], point2: [number, number]): number | undefined {  
  const [x1, y1] = point1;  
  const [x2, y2] = point2;  

  // 检查x坐标是否相同，如果相同则斜率不存在  
  if (x1 === x2) {  
      return 0; // 或者可以抛出一个错误  
  }  

  // 计算斜率  
  const slope = (y2 - y1) / (x2 - x1);  
  return slope;  
}  

export const circle:Point[][] = [
  [[0.3576,0.1069],[0.3576,0.1069],[0.3576,0.1069],[0.3576,0.1069],[0.3576,0.1069],[0.3576,0.1069],[0.3576,0.1069],[0.3444,0.1069],[0.3245,0.1145],[0.3179,0.1298],[0.3046,0.1374],[0.298,0.145],[0.2848,0.1603],[0.2583,0.1832],[0.2318,0.2061],[0.2119,0.229],[0.1921,0.2595],[0.1722,0.2901],[0.1589,0.3206],[0.1391,0.3359],[0.1258,0.3511],[0.1192,0.3664],[0.106,0.3817],[0.0993,0.4046],[0.0861,0.4275],[0.0662,0.458],[0.0464,0.4962],[0.0265,0.5344],[0.0132,0.5573],[0,0.6183],[0,0.6718],[0.0066,0.7252],[0.0331,0.7939],[0.0662,0.855],[0.0927,0.8931],[0.1192,0.9237],[0.1457,0.9389],[0.1788,0.9466],[0.1987,0.9618],[0.2318,0.9695],[0.2781,0.9847],[0.3576,0.9924],[0.4305,1],[0.5166,1],[0.6225,1],[0.6887,1],[0.7682,0.9847],[0.7947,0.9771],[0.8411,0.9313],[0.8609,0.9084],[0.8874,0.8473],[0.9205,0.771],[0.9603,0.6947],[1,0.5649],[1,0.4962],[1,0.4198],[0.9801,0.3359],[0.9338,0.2519],[0.8742,0.1908],[0.7682,0.1069],[0.6623,0.0534],[0.5364,0.0305],[0.4503,0.0229],[0.3841,0.0076],[0.3245,0],[0.2914,0],[0.2914,0],[0.2848,0],[0.2848,0]],
  [[0.5785,0.0093],[0.5702,0],[0.5537,0],[0.5372,0],[0.5207,0],[0.5041,0],[0.4711,0],[0.4463,0.0278],[0.4132,0.0463],[0.3719,0.0648],[0.3388,0.0926],[0.3058,0.1296],[0.2645,0.1574],[0.2397,0.1759],[0.2149,0.2037],[0.1901,0.2222],[0.1736,0.25],[0.157,0.2593],[0.1322,0.2963],[0.1074,0.3241],[0.0909,0.3519],[0.0661,0.3796],[0.0413,0.4259],[0.0248,0.4722],[0,0.5185],[0,0.5556],[0,0.5833],[0,0.6204],[0.0165,0.6667],[0.0413,0.7037],[0.0744,0.7407],[0.0909,0.7778],[0.124,0.8148],[0.157,0.8426],[0.1818,0.8611],[0.2231,0.8889],[0.2645,0.9074],[0.3306,0.9352],[0.3719,0.963],[0.4215,0.9722],[0.4711,0.9907],[0.5124,1],[0.5372,1],[0.5785,1],[0.595,1],[0.6529,0.9815],[0.7107,0.9537],[0.7603,0.9259],[0.8017,0.8889],[0.843,0.8426],[0.8843,0.787],[0.9174,0.713],[0.9504,0.6574],[0.9835,0.5833],[1,0.537],[1,0.4722],[0.9917,0.4074],[0.9752,0.3426],[0.9504,0.2963],[0.9008,0.2222],[0.8678,0.1852],[0.8099,0.1481],[0.7769,0.1296],[0.6942,0.1019],[0.5702,0.0741],[0.4793,0.0556],[0.3884,0.0278],[0.3636,0.0185],[0.3636,0.0185],[0.3636,0.0185],[0.3636,0.0185]],
  [[0.5196,0.1204],[0.4902,0.1389],[0.4608,0.1574],[0.4314,0.1759],[0.402,0.1944],[0.3627,0.2315],[0.3431,0.25],[0.3137,0.2778],[0.2745,0.3148],[0.2451,0.3426],[0.2157,0.3889],[0.1569,0.4444],[0.1176,0.4815],[0.0882,0.5093],[0.0588,0.5463],[0.049,0.5741],[0.0294,0.6111],[0.0098,0.6481],[0,0.6759],[0,0.7037],[0,0.7222],[0,0.7407],[0,0.7593],[0,0.7685],[0,0.787],[0,0.8056],[0.0098,0.8333],[0.0294,0.8519],[0.0784,0.8796],[0.098,0.8981],[0.1373,0.9259],[0.1765,0.9444],[0.2157,0.9537],[0.2549,0.963],[0.2843,0.9815],[0.3039,0.9815],[0.3529,0.9907],[0.3824,1],[0.4118,1],[0.451,1],[0.4902,1],[0.549,1],[0.598,1],[0.6569,0.9815],[0.7059,0.963],[0.7255,0.9537],[0.7353,0.9259],[0.7843,0.8889],[0.8137,0.8611],[0.8529,0.8241],[0.8824,0.75],[0.9216,0.7037],[0.9608,0.6296],[0.9804,0.6019],[0.9902,0.5648],[1,0.5093],[0.9902,0.4537],[0.9314,0.3704],[0.8824,0.3056],[0.8333,0.2593],[0.7647,0.1852],[0.7157,0.1481],[0.6275,0.0926],[0.5588,0.0648],[0.4902,0.0463],[0.4314,0.0278],[0.402,0.0093],[0.3922,0],[0.3922,0],[0.3922,0],[0.3922,0]],
]

export const triangle:Point[][] = [
  [[0.6904,0],[0.6904,0],[0.6904,0],[0.6904,0],[0.6904,0.0058],[0.6701,0.0292],[0.6447,0.0819],[0.6091,0.1345],[0.5736,0.193],[0.5279,0.269],[0.467,0.3567],[0.4112,0.4386],[0.3401,0.5263],[0.2538,0.6316],[0.1929,0.7193],[0.1371,0.7895],[0.0914,0.8538],[0.0558,0.9064],[0.0254,0.9532],[0.0102,0.9708],[0.0051,0.9825],[0,0.9883],[0,0.9883],[0,0.9883],[0,0.9883],[0,0.9883],[0,0.9942],[0,0.9942],[0.0102,0.9942],[0.0305,1],[0.066,1],[0.1066,1],[0.1726,1],[0.2386,0.9942],[0.3147,0.9883],[0.4162,0.9883],[0.5127,0.9766],[0.6041,0.9708],[0.6954,0.9591],[0.802,0.9532],[0.868,0.9474],[0.8934,0.9415],[0.9086,0.9357],[0.9188,0.9357],[0.9188,0.9357],[0.9239,0.9357],[0.9391,0.9298],[0.9492,0.924],[0.9695,0.9181],[0.9848,0.9123],[0.9898,0.9123],[1,0.9123],[1,0.9064],[1,0.9064],[1,0.9064],[1,0.9064],[1,0.9064],[1,0.8889],[1,0.8421],[1,0.7719],[0.9391,0.6433],[0.8731,0.4912],[0.8122,0.345],[0.7716,0.2047],[0.7716,0.1462],[0.7716,0.1111],[0.7716,0.0994],[0.7716,0.0936],[0.7716,0.0936]],
  [[0.4577,0.0598],[0.4577,0.0598],[0.4577,0.0598],[0.4577,0.0598],[0.4577,0.0598],[0.4577,0.0598],[0.4472,0.0652],[0.4296,0.1196],[0.4049,0.1685],[0.3732,0.2446],[0.338,0.3315],[0.2887,0.4185],[0.2359,0.5109],[0.1725,0.6196],[0.1268,0.7011],[0.0915,0.7717],[0.0599,0.8261],[0.0352,0.8696],[0.0176,0.9022],[0.0035,0.9239],[0,0.9293],[0,0.9348],[0,0.9348],[0,0.9348],[0,0.9348],[0,0.9348],[0,0.9348],[0,0.9402],[0,0.9402],[0.0141,0.9402],[0.0915,0.9511],[0.1831,0.962],[0.3028,0.9728],[0.4366,0.9728],[0.6197,0.9837],[0.75,0.9837],[0.8451,1],[0.9085,1],[0.9577,1],[0.9789,1],[0.9789,1],[0.9824,1],[0.9859,0.9946],[0.9894,0.9891],[0.9894,0.9783],[0.9965,0.9674],[1,0.9565],[1,0.9402],[0.9859,0.913],[0.9718,0.8804],[0.9507,0.8207],[0.9155,0.7554],[0.8873,0.6902],[0.8556,0.6304],[0.8099,0.5435],[0.7641,0.4565],[0.7289,0.3696],[0.6725,0.2391],[0.6479,0.163],[0.6232,0.0815],[0.6127,0.0435],[0.6056,0.0163],[0.6021,0.0054],[0.5986,0],[0.5986,0],[0.5986,0]],
  [[0.5829,0.0446],[0.5829,0.0382],[0.5829,0.0382],[0.5829,0.0382],[0.5829,0.0382],[0.5829,0.0382],[0.5829,0.051],[0.5722,0.0764],[0.5508,0.121],[0.5134,0.1783],[0.4599,0.2611],[0.4118,0.3503],[0.3262,0.4522],[0.262,0.5414],[0.1979,0.6115],[0.1497,0.6879],[0.1016,0.7452],[0.0588,0.7834],[0.0214,0.8217],[0.0107,0.8471],[0.0053,0.8599],[0,0.8599],[0,0.8662],[0,0.8662],[0,0.8662],[0,0.8726],[0,0.8726],[0,0.8726],[0,0.879],[0.0053,0.879],[0.0588,0.8981],[0.139,0.9172],[0.2353,0.9427],[0.3583,0.9618],[0.5187,0.9809],[0.6471,0.9936],[0.754,1],[0.8663,1],[0.9305,1],[0.9465,0.9936],[0.9572,0.9809],[0.9626,0.9745],[0.9626,0.9745],[0.9679,0.9682],[0.9733,0.9618],[0.9733,0.9618],[0.9786,0.949],[0.984,0.9427],[0.984,0.9427],[0.9893,0.9427],[0.9893,0.9299],[0.9947,0.9108],[0.9947,0.8917],[0.9947,0.8471],[1,0.758],[0.9519,0.6306],[0.9037,0.4904],[0.8396,0.3439],[0.7914,0.2293],[0.7219,0.1019],[0.6952,0.0318],[0.6845,0],[0.6791,0],[0.6791,0]],
  [[0.5304,0],[0.5304,0],[0.5304,0],[0.5304,0],[0.5223,0],[0.5101,0.0313],[0.4858,0.075],[0.4615,0.1313],[0.413,0.225],[0.3644,0.3125],[0.3077,0.4],[0.2591,0.4938],[0.1984,0.5938],[0.1498,0.6875],[0.0891,0.7937],[0.0526,0.85],[0.0243,0.9125],[0.0121,0.9437],[0.004,0.9688],[0,0.9688],[0,0.9688],[0,0.9688],[0,0.9688],[0,0.9688],[0,0.9688],[0.004,0.975],[0.0283,0.975],[0.081,0.9875],[0.1619,0.9875],[0.2591,0.9938],[0.3846,1],[0.5587,1],[0.7004,1],[0.8178,1],[0.8907,0.9938],[0.9555,0.9938],[0.9798,0.9938],[0.9798,0.9875],[0.9798,0.9875],[0.9798,0.9875],[0.9798,0.9875],[0.9798,0.9875],[0.9798,0.9812],[0.9838,0.975],[0.9879,0.9688],[0.9919,0.9563],[0.996,0.95],[0.996,0.95],[1,0.95],[1,0.9437],[1,0.9437],[1,0.9437],[1,0.925],[1,0.9],[0.9879,0.85],[0.9474,0.7375],[0.9069,0.625],[0.8462,0.5],[0.8016,0.4],[0.7814,0.3375],[0.749,0.2625],[0.7328,0.2125],[0.7166,0.175],[0.6964,0.1313],[0.6842,0.1],[0.668,0.0688],[0.6478,0.0437],[0.6397,0.025],[0.6356,0.025]],
]

export const x:Point[][] = [
  [[0.0062,0],[0.0062,0],[0.0124,0],[0.0124,0.0238],[0.0186,0.0476],[0.0373,0.0833],[0.0807,0.119],[0.205,0.2143],[0.3478,0.3274],[0.5217,0.4405],[0.7081,0.5655],[0.8323,0.6548],[0.9255,0.7143],[0.9689,0.7381],[1,0.756],[1,0.7619],[1,0.7619],[1,0.7619],[1,0.7619],[1,0.7619],[0.7578,0.2024],[0.7391,0.2202],[0.7143,0.256],[0.677,0.3095],[0.6087,0.3988],[0.528,0.4821],[0.4534,0.5595],[0.3602,0.6488],[0.2422,0.7321],[0.1553,0.8036],[0.0745,0.9048],[0.0311,0.9583],[0.0062,0.9881],[0,1],[0,1],[0,1],[0,1],[0,1]],
  [[0.1802,0.1169],[0.1802,0.1169],[0.1802,0.1169],[0.1802,0.1299],[0.2151,0.1688],[0.3198,0.2532],[0.5058,0.4156],[0.6512,0.5455],[0.7791,0.6558],[0.8721,0.7338],[0.9419,0.7922],[0.9767,0.8312],[1,0.8636],[1,0.8636],[1,0.8636],[1,0.8636],[1,0.8636],[0.843,0],[0.8198,0.0325],[0.7965,0.0649],[0.7674,0.1104],[0.7093,0.1688],[0.6453,0.2143],[0.5581,0.2987],[0.4302,0.4351],[0.3198,0.5584],[0.2267,0.6818],[0.1453,0.7857],[0.0814,0.8701],[0.0465,0.9286],[0.0116,0.974],[0,0.9935],[0,1],[0,1],[0,1]],
  [[0.3396,0],[0.3396,0],[0.3396,0],[0.3459,0.0172],[0.3899,0.069],[0.4843,0.1638],[0.5975,0.319],[0.6918,0.4483],[0.7799,0.569],[0.8491,0.6724],[0.9119,0.75],[0.9497,0.8103],[0.9811,0.8621],[0.9937,0.8793],[0.9937,0.8966],[0.9937,0.8966],[1,0.9052],[1,0.9052],[1,0.9052],[0.9057,0.0086],[0.8931,0.0086],[0.8553,0.0345],[0.7987,0.0862],[0.7296,0.1552],[0.6289,0.2328],[0.5283,0.3534],[0.3899,0.5086],[0.283,0.6293],[0.1887,0.7414],[0.1195,0.8362],[0.044,0.9224],[0.0126,0.9655],[0.0063,0.9914],[0,0.9914],[0,1]],
  [[0.027,0],[0.027,0.0079],[0.027,0.0315],[0.0338,0.0787],[0.0946,0.1496],[0.2095,0.2835],[0.3311,0.4094],[0.473,0.5354],[0.6081,0.6535],[0.7297,0.7638],[0.8514,0.8583],[0.9122,0.9134],[0.9595,0.9449],[0.9865,0.9606],[1,0.9843],[1,0.9843],[1,0.9843],[1,0.9843],[1,0.9921],[1,0.9921],[0.9932,0.0315],[0.973,0.0315],[0.9189,0.0787],[0.8243,0.1575],[0.7365,0.2283],[0.6419,0.3071],[0.5338,0.3937],[0.4392,0.4882],[0.3311,0.6142],[0.25,0.7087],[0.1892,0.7795],[0.1284,0.8504],[0.0946,0.8976],[0.0541,0.9449],[0.0203,0.9764],[0.0068,1],[0,1]],
  [[0.4519,0.2056],[0.4519,0.2056],[0.4519,0.2056],[0.4519,0.2056],[0.4519,0.2243],[0.4519,0.2617],[0.4593,0.2897],[0.4667,0.3458],[0.4963,0.4299],[0.5704,0.5327],[0.637,0.6168],[0.6963,0.6916],[0.7259,0.7383],[0.7481,0.7757],[0.7556,0.7757],[0.763,0.7944],[0.763,0.8037],[0.7704,0.8037],[0.7704,0.8037],[0.7704,0.8131],[1,0],[0.9926,0],[0.9704,0.028],[0.9037,0.1028],[0.8148,0.1963],[0.7185,0.3084],[0.5407,0.4766],[0.4074,0.6075],[0.2815,0.729],[0.1852,0.8318],[0.1037,0.9065],[0.0296,0.9626],[0.0074,1],[0,1],[0,1],[0,1]],
  [[0.2353,0],[0.2402,0.0205],[0.2892,0.1027],[0.3529,0.1918],[0.4461,0.3151],[0.549,0.4247],[0.6569,0.5342],[0.7647,0.6438],[0.8775,0.7466],[0.9412,0.8014],[0.9804,0.8288],[0.9951,0.8493],[1,0.8493],[1,0.8493],[0.9363,0.226],[0.9363,0.226],[0.9314,0.226],[0.9118,0.2329],[0.8529,0.3014],[0.7598,0.4247],[0.652,0.5342],[0.5049,0.6507],[0.348,0.774],[0.2157,0.863],[0.1029,0.9384],[0.0539,0.9795],[0.0147,1],[0,1]],
]

export const line:Point[][] = [
  [[0,1],[0,1],[0,1],[0,1],[0,1],[0.0021,1],[0.0106,0.9333],[0.0318,0.8667],[0.0805,0.7333],[0.1758,0.7333],[0.2881,0.7333],[0.4195,0.6667],[0.5551,0.5333],[0.6928,0.3333],[0.8136,0.2],[0.9153,0.0667],[0.9682,0],[0.9958,0],[1,0],[1,0],[1,0],[1,0]],
  [[0,0],[0.0113,0.0134],[0.0249,0.0375],[0.0498,0.0724],[0.1131,0.1287],[0.1878,0.1957],[0.2692,0.2681],[0.3688,0.3566],[0.4751,0.4611],[0.6086,0.5871],[0.7104,0.681],[0.7964,0.7775],[0.871,0.8606],[0.9276,0.9169],[0.9615,0.9571],[0.9932,0.9839],[1,0.9973],[1,0.9973],[1,1],[1,1],[1,1]],
  [[1,0],[1,0],[1,0.0055],[0.9851,0.0301],[0.9254,0.0765],[0.8507,0.1311],[0.7164,0.2077],[0.6119,0.3005],[0.4478,0.4016],[0.2836,0.5027],[0.1045,0.6257],[0.0149,0.7131],[0,0.7923],[0.0149,0.8497],[0.0746,0.8989],[0.1343,0.9344],[0.209,0.9645],[0.2239,0.9727],[0.2239,0.9836],[0.2239,0.9918],[0.2239,0.9945],[0.2239,1]],
  [[1,0],[0.9892,0],[0.9677,0.0329],[0.914,0.1118],[0.8387,0.1908],[0.7455,0.2829],[0.6452,0.3882],[0.5556,0.4803],[0.4624,0.5855],[0.3369,0.7105],[0.233,0.7895],[0.1577,0.8553],[0.0896,0.9079],[0.0466,0.9474],[0.0215,0.9737],[0.0036,0.9868],[0,1],[0,1]],
  [[1,1],[1,1],[1,1],[1,0.9846],[1,0.9538],[0.9783,0.9179],[0.9239,0.8513],[0.837,0.759],[0.7101,0.6308],[0.4384,0.3846],[0.3768,0.3282],[0.2355,0.2051],[0.1268,0.1179],[0.0688,0.0615],[0.0217,0.0205],[0.0036,0.0051],[0,0],[0,0],[0,0],[0,0]],
  [[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,0.9935],[0,0.9771],[0,0.9412],[0.0588,0.8889],[0.1765,0.8268],[0.4118,0.7516],[0.7059,0.6797],[0.9412,0.6046],[1,0.5294],[1,0.451],[0.6471,0.3595],[0.3529,0.268],[0.2941,0.2026],[0.1765,0.1536],[0.1765,0.1111],[0.1765,0.0752],[0.1765,0.0425],[0.1765,0.0131],[0.1765,0]],
  [[0,1],[0.0127,1],[0.0424,0.9843],[0.0763,0.9634],[0.1102,0.9215],[0.1568,0.8743],[0.1949,0.8115],[0.2415,0.7382],[0.3093,0.6387],[0.3644,0.5654],[0.4322,0.4764],[0.4958,0.3874],[0.572,0.3037],[0.6525,0.2251],[0.7585,0.1466],[0.8475,0.0942],[0.9195,0.0471],[1,0]],
  [[0,1],[0.0072,0.9667],[0.0191,0.9417],[0.0477,0.8917],[0.0931,0.8167],[0.1599,0.7583],[0.2864,0.6667],[0.4033,0.5667],[0.5298,0.475],[0.6372,0.3917],[0.7375,0.3167],[0.821,0.225],[0.8831,0.1667],[0.9284,0.1083],[0.9547,0.075],[0.9737,0.05],[0.9833,0.0417],[0.9905,0.025],[0.9952,0.0167],[0.9976,0.0083],[1,0]],
]