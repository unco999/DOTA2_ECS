import { useEffect, useRef, useState } from "react"
import { Point } from "./utils/lib";


export function shake(){
   const id = Particles.CreateParticle("particles/econ/events/killbanners/screen_killbanner_compendium14_rampage_shake.vpcf",ParticleAttachment_t.PATTACH_MAIN_VIEW,Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))
   $.Schedule(2,()=>{
      Particles.DestroyParticleEffect(id,true)
      Particles.ReleaseParticleIndex(id)
   })
}

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
type Predicate<T> = (item: T) => boolean;  

export function groupByPredicate<T>(array: T[], predicate: Predicate<T>): { matches: T[], doesNotMatch: T[] } {  
  const matches: T[] = [];  
  const doesNotMatch: T[] = [];  

  for (const item of array) {  
      if (predicate(item)) {  
          matches.push(item);  
      } else {  
          doesNotMatch.push(item);  
      }  
  }  

  return { matches, doesNotMatch };  
}  

export function angleBetweenPoints(p1: Point, p2: Point): number {  
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
  let totalHausdorffDistance = 99999999;  

  for (let i = 0; i < labelArrays.length; i++) {  
      const hausdorffDist = hausdorffDistance(pointSetA, labelArrays[i]); // 假设这里有一个计算Hausdorff距离的函数  
      // $.Msg(hausdorffDist)
      if(hausdorffDist < totalHausdorffDistance){
         totalHausdorffDistance = hausdorffDist
      }
  }  
  return totalHausdorffDistance
}

export function chunk<T>(array: T[], chunkSize: number): T[][] {  
  if (chunkSize <= 0) {  
     $.Msg('Chunk size must be a positive integer.');  
  }  
  
  const result: T[][] = [];  
  for (let i = 0; i < array.length; i += chunkSize) {  
    const end = Math.min(i + chunkSize, array.length);  
    result.push(array.slice(i, end));  
  }  
  return result;  
} 

function angleBetweenVectors(v1: Point, v2: Point): number {  
  const dot = toFixed4(v1[0] * v2[0] + v1[1] * v2[1]);
  const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);  
  const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);  
  const cosTheta = dot / (norm1 * norm2);  
  const theta = Math.acos(cosTheta);  
  
  return toFixed1(theta * (180 / Math.PI)); // 转换为角度  
}  

export function toFixed4String(num:number){
  return num.toFixed(4)
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

export function WindowsAdapter(windows:Point){
    let [x,y] = windows
    x = x / Game.GetScreenWidth() * 1920
    y = y / Game.GetScreenHeight() * 1080
    $.Msg(x,y)
    return [x,y]
}

export function getRandomHexColor(): string {  
  const letters = '0123456789ABCDEF';  
  let color = '#';  
  for (let i = 0; i < 6; i++) {  
      color += letters[Math.floor(Math.random() * 16)];  
  }  
  return color;  
}  

export function groupByKey<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {  
  const grouped: Record<string, T[]> = {};  
  for (const item of array) {  
    const itemKey = item[key] as string; // 假设key的值总是可以转换为string  
    if (!grouped[itemKey]) {  
      grouped[itemKey] = [];  
    }  
    grouped[itemKey].push(item);  
  }  
  return grouped;  
}

export function areSegmentsParallel(points1: [number, number][], points2: [number, number][],parallelismThreshold:number): boolean {  
  // 确保每组都有两个点  
    
  // 计算两个线段的向量  
  const vector1 = [ toFixed4(points1[points1.length - 1][0] - points1[0][0]), toFixed4([points1.length - 1][1] - points1[0][1])];  
  const vector2 = [toFixed4(points2[points2.length - 1][0] - points2[0][0]), toFixed4(points2[points2.length - 1][1] - points2[0][1])];  
    
  // 计算两个向量的点积和模  
  const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];  
  const norm1 = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1]);  
  const norm2 = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);  
    
  // 计算两个向量之间的夹角（以弧度为单位）  
  const angle = Math.acos(dotProduct / (norm1 * norm2));  
    
  // 转换为角度  
  const angleInDegrees = (angle * 180) / Math.PI;  
    
  // 设置一个阈值来判断是否接近平行  
  // 例如，我们可以说如果两线段之间的夹角小于5度，则它们是平行的  
  // 检查夹角是否小于阈值  
  return Math.abs(angleInDegrees) < parallelismThreshold || Math.abs(angleInDegrees - 180) < parallelismThreshold;  
}  

export const circle:Point[][] = [
  [[0,0],[-0.0146,0.0097],[-0.0291,0.029],[-0.0485,0.058],[-0.0825,0.0966],[-0.1311,0.1546],[-0.1699,0.2271],[-0.2184,0.2947],[-0.2718,0.3623],[-0.3204,0.4541],[-0.3544,0.5314],[-0.3883,0.6232],[-0.4029,0.6908],[-0.3932,0.7585],[-0.3544,0.8213],[-0.3107,0.8696],[-0.2379,0.9227],[-0.1408,0.9662],[-0.0534,0.9952],[0.0194,1],[0.0971,1],[0.1408,1],[0.1748,0.9903],[0.2039,0.9807],[0.2427,0.9517],[0.2961,0.8841],[0.3447,0.8309],[0.3883,0.7633],[0.4417,0.6908],[0.4854,0.6135],[0.5146,0.5556],[0.5485,0.4831],[0.5777,0.4348],[0.5971,0.2995],[0.5825,0.2512],[0.5388,0.1884],[0.5,0.1401],[0.4369,0.1014],[0.3689,0.0773],[0.2621,0.0483],[0.1893,0.0483],[0.1117,0.0483],[0.0437,0.0483],[0.0049,0.058],[-0.0243,0.0628],[-0.0534,0.0725]],
  [[0,0],[-0.0183,0],[-0.055,0.0056],[-0.0872,0.0169],[-0.1239,0.0393],[-0.1881,0.0674],[-0.2385,0.0955],[-0.2844,0.1236],[-0.3257,0.1685],[-0.3761,0.2247],[-0.4128,0.2978],[-0.4495,0.382],[-0.4817,0.4551],[-0.5092,0.5169],[-0.5275,0.573],[-0.5275,0.6348],[-0.5275,0.691],[-0.5,0.7584],[-0.3807,0.8708],[-0.3073,0.9213],[-0.2248,0.9438],[-0.133,0.9719],[-0.0275,0.9831],[0.0505,0.9831],[0.1284,0.9719],[0.1927,0.9551],[0.2523,0.927],[0.3073,0.8876],[0.3394,0.8483],[0.3624,0.8202],[0.3853,0.7865],[0.4128,0.7303],[0.4358,0.6685],[0.4633,0.6067],[0.4725,0.5337],[0.4725,0.4663],[0.4587,0.3708],[0.4312,0.3146],[0.3991,0.2584],[0.3578,0.1966],[0.3211,0.1461],[0.2798,0.1011],[0.2385,0.073],[0.1972,0.0281],[0.1697,0.0112],[0.1376,-0.0056],[0.1101,-0.0112],[0.0917,-0.0169],[0.078,-0.0169]],
  [[0,0],[-0.0672,-0.0152],[-0.1343,-0.0152],[-0.2164,-0.0152],[-0.2873,0.0101],[-0.3507,0.0455],[-0.403,0.096],[-0.5224,0.3333],[-0.5597,0.4293],[-0.5858,0.5152],[-0.597,0.596],[-0.5858,0.6768],[-0.5634,0.7475],[-0.5261,0.8081],[-0.4739,0.8687],[-0.4291,0.9091],[-0.3806,0.9343],[-0.3284,0.9495],[-0.2724,0.9545],[-0.2127,0.9596],[-0.1157,0.9596],[-0.0336,0.9596],[0.0634,0.9444],[0.1493,0.9192],[0.2313,0.8838],[0.2687,0.8535],[0.2985,0.8131],[0.3209,0.7778],[0.3433,0.7323],[0.3694,0.6616],[0.3918,0.6061],[0.403,0.5404],[0.403,0.4747],[0.3731,0.3838],[0.3358,0.3182],[0.2724,0.2374],[0.2127,0.1818],[0.1306,0.1162],[0.0597,0.0758],[-0.0112,0.0354],[-0.0896,-0.0101],[-0.1455,-0.0303],[-0.1754,-0.0354],[-0.1828,-0.0404],[-0.1903,-0.0404]],
  [[0,0],[-0.0496,0.039],[-0.117,0.0829],[-0.1773,0.122],[-0.2305,0.1707],[-0.2837,0.2293],[-0.3369,0.322],[-0.344,0.3707],[-0.3475,0.4098],[-0.344,0.4683],[-0.3085,0.5366],[-0.2553,0.6195],[-0.2021,0.6878],[-0.1277,0.7512],[-0.0496,0.8049],[0.0461,0.8488],[0.1241,0.8732],[0.1879,0.8829],[0.2411,0.8927],[0.305,0.8927],[0.3794,0.878],[0.461,0.8488],[0.5213,0.8098],[0.5638,0.7707],[0.5957,0.7268],[0.6135,0.6927],[0.6383,0.6195],[0.6525,0.5561],[0.6525,0.478],[0.6418,0.4],[0.617,0.3024],[0.5816,0.2244],[0.5248,0.1366],[0.4752,0.078],[0.4291,0.0244],[0.3652,-0.0341],[0.3191,-0.0634],[0.2695,-0.0927],[0.2163,-0.1073],[0.1773,-0.1073],[0.1454,-0.1073],[0.1135,-0.1073],[0.0851,-0.1073],[0.039,-0.1073],[0.0035,-0.1073],[-0.0248,-0.1073],[-0.0603,-0.1073]],
  [[0,0],[-0.0695,0],[-0.1892,0.0205],[-0.3012,0.041],[-0.4324,0.0872],[-0.5598,0.1333],[-0.7645,0.2667],[-0.8108,0.3231],[-0.8417,0.3795],[-0.8649,0.4359],[-0.8764,0.4923],[-0.8803,0.5333],[-0.861,0.6051],[-0.8301,0.6564],[-0.7954,0.7026],[-0.7568,0.7487],[-0.7066,0.7795],[-0.6371,0.8103],[-0.5676,0.8308],[-0.4981,0.8359],[-0.4324,0.8359],[-0.3668,0.8359],[-0.3127,0.8103],[-0.2587,0.7795],[-0.2317,0.7487],[-0.2008,0.7179],[-0.166,0.6667],[-0.1158,0.5949],[-0.0734,0.5282],[-0.027,0.4615],[0.0116,0.3846],[0.0579,0.3077],[0.0849,0.241],[0.1042,0.1897],[0.1197,0.1333],[0.1197,0.0872],[0.1004,0.0154],[0.0772,-0.0256],[0.0463,-0.0872],[0.0154,-0.1179],[-0.0193,-0.1487],[-0.0425,-0.159],[-0.0695,-0.1641],[-0.0888,-0.1641]],
  [[0,0],[-0.038,0.0094],[-0.0875,0.0423],[-0.1369,0.0798],[-0.1825,0.1174],[-0.2167,0.1643],[-0.2357,0.2113],[-0.2586,0.2629],[-0.2852,0.3286],[-0.3004,0.3803],[-0.308,0.4319],[-0.2129,0.6526],[-0.1483,0.7183],[-0.0494,0.7981],[0.0684,0.8592],[0.2319,0.9014],[0.346,0.9249],[0.4373,0.9249],[0.5057,0.9249],[0.5665,0.9108],[0.5856,0.8967],[0.6084,0.8732],[0.6274,0.8451],[0.6464,0.8122],[0.6692,0.77],[0.6882,0.7183],[0.692,0.6667],[0.692,0.6103],[0.6882,0.5587],[0.6692,0.4883],[0.6464,0.4272],[0.6084,0.3568],[0.5779,0.3099],[0.5323,0.2488],[0.4981,0.2066],[0.4639,0.1643],[0.4259,0.1268],[0.365,0.0751],[0.3004,0.0329],[0.2433,0.0047],[0.1901,-0.0282],[0.1255,-0.0516],[0.057,-0.061],[0.0076,-0.0704],[-0.0418,-0.0751],[-0.0646,-0.0751],[-0.0951,-0.0751],[-0.1217,-0.0751],[-0.1445,-0.0751],[-0.1597,-0.0657]],
  [[0,0],[-0.0109,0],[-0.0474,0],[-0.1058,0.0045],[-0.1569,0.0273],[-0.208,0.0591],[-0.2518,0.0955],[-0.2993,0.1409],[-0.3358,0.1864],[-0.3796,0.25],[-0.4088,0.3045],[-0.4307,0.3545],[-0.4453,0.4136],[-0.4562,0.4636],[-0.4562,0.5273],[-0.3796,0.6955],[-0.3358,0.7636],[-0.2774,0.8318],[-0.2263,0.8773],[-0.1861,0.9136],[-0.1496,0.9318],[-0.1095,0.9545],[-0.062,0.9727],[-0.0182,0.9818],[0.0474,0.9955],[0.0949,1],[0.1569,1],[0.2117,0.9955],[0.2737,0.9727],[0.3394,0.9364],[0.3759,0.9],[0.4088,0.8591],[0.4453,0.8045],[0.4708,0.7545],[0.4964,0.6955],[0.5219,0.6318],[0.5401,0.5364],[0.5438,0.4773],[0.5328,0.3909],[0.5182,0.3273],[0.4891,0.2636],[0.4708,0.2182],[0.4307,0.1727],[0.4088,0.1455],[0.3832,0.1182],[0.3686,0.1045],[0.3394,0.0909],[0.2956,0.0773],[0.2518,0.0636],[0.2007,0.0591],[0.135,0.0545],[0.0839,0.0455],[0.0474,0.0409],[0.0036,0.0227],[-0.0292,0.0182]],
  [[0,0],[-0.0442,0.0381],[-0.0946,0.0905],[-0.1514,0.1429],[-0.1987,0.1952],[-0.2429,0.2571],[-0.2713,0.3143],[-0.2934,0.3619],[-0.306,0.4714],[-0.2808,0.5524],[-0.2366,0.6286],[-0.1893,0.6857],[-0.1483,0.7286],[-0.1104,0.7476],[-0.0662,0.7714],[-0.0315,0.7762],[0.0032,0.7762],[0.0442,0.7762],[0.0883,0.7762],[0.1451,0.7619],[0.2366,0.7333],[0.3186,0.7048],[0.3943,0.6619],[0.4669,0.6143],[0.5363,0.5571],[0.6025,0.4857],[0.6372,0.419],[0.6593,0.3571],[0.6814,0.2905],[0.694,0.1857],[0.694,0.1095],[0.6782,0.0381],[0.653,-0.0238],[0.6215,-0.0762],[0.5868,-0.1143],[0.5552,-0.1429],[0.5205,-0.1667],[0.4826,-0.1905],[0.4416,-0.2048],[0.3817,-0.219],[0.3155,-0.2238],[0.2587,-0.2238],[0.1987,-0.2238],[0.123,-0.2238],[0.041,-0.2238],[-0.0032,-0.2238],[-0.0442,-0.2],[-0.0789,-0.1714],[-0.0978,-0.1476],[-0.1167,-0.1238],[-0.1356,-0.1143],[-0.142,-0.1048],[-0.1514,-0.1],[-0.1546,-0.1],[-0.1577,-0.1],[-0.1577,-0.0952],[-0.1577,-0.0952]],
  [[0,0],[-0.0699,0],[-0.2243,0],[-0.3493,0],[-0.4669,0.0248],[-0.5772,0.0545],[-0.6691,0.099],[-0.7463,0.1535],[-0.7978,0.203],[-0.8456,0.2673],[-0.886,0.3416],[-0.9522,0.4851],[-0.9632,0.5248],[-0.9632,0.5743],[-0.9449,0.6238],[-0.9118,0.6683],[-0.886,0.7079],[-0.8382,0.7376],[-0.8051,0.7673],[-0.7757,0.7871],[-0.7426,0.8119],[-0.7022,0.8317],[-0.6471,0.8564],[-0.6066,0.8564],[-0.5662,0.8564],[-0.511,0.8614],[-0.4559,0.8614],[-0.4044,0.8564],[-0.3309,0.8317],[-0.2721,0.797],[-0.2206,0.7574],[-0.1728,0.7079],[-0.1213,0.6436],[-0.0809,0.5792],[-0.0368,0.5],[-0.011,0.4505],[0.0147,0.396],[0.0257,0.3663],[0.0368,0.3366],[0.0368,0.302],[0.0294,0.2525],[0.0147,0.203],[-0.011,0.1287],[-0.0515,0.0495],[-0.0772,0],[-0.1029,-0.0446],[-0.125,-0.0842],[-0.1507,-0.1139],[-0.1654,-0.1337],[-0.1728,-0.1386],[-0.1765,-0.1386],[-0.1801,-0.1386],[-0.1801,-0.1386],[-0.1801,-0.1386]],
  [[0,0],[-0.0174,0],[-0.0377,0],[-0.0609,0.0065],[-0.087,0.0195],[-0.1478,0.0912],[-0.1739,0.1433],[-0.2029,0.202],[-0.229,0.2671],[-0.2609,0.3355],[-0.2957,0.4267],[-0.3217,0.4951],[-0.3333,0.5603],[-0.3333,0.6221],[-0.3101,0.6906],[-0.2812,0.7459],[-0.2406,0.8013],[-0.2058,0.8404],[-0.1652,0.8762],[-0.1246,0.9055],[-0.0754,0.9349],[-0.029,0.9544],[0.0203,0.9739],[0.0696,0.9902],[0.1188,1],[0.1594,1],[0.1971,1],[0.2464,1],[0.3072,0.9837],[0.3536,0.9642],[0.4,0.9381],[0.4464,0.9055],[0.4928,0.8632],[0.5217,0.8306],[0.5536,0.7785],[0.5826,0.7362],[0.6087,0.6938],[0.629,0.6515],[0.6551,0.5928],[0.6667,0.5375],[0.6667,0.4919],[0.6667,0.456],[0.658,0.3941],[0.6348,0.3453],[0.6058,0.3029],[0.5594,0.2378],[0.5217,0.1987],[0.4928,0.1759],[0.4725,0.1564],[0.4551,0.1401],[0.4377,0.127],[0.4203,0.1075],[0.3971,0.0945],[0.3652,0.0814],[0.3101,0.0651],[0.2464,0.0554],[0.1826,0.0489],[0.113,0.0391],[0.0435,0.0358],[-0.0348,0.0326],[-0.0812,0.0326],[-0.113,0.0326],[-0.1362,0.0326],[-0.1449,0.0326],[-0.1507,0.0326]],
  [[0,0],[-0.0456,0.01],[-0.0911,0.0268],[-0.1298,0.0435],[-0.1617,0.0602],[-0.1845,0.0836],[-0.1936,0.1003],[-0.2073,0.1271],[-0.2187,0.1538],[-0.2301,0.1839],[-0.246,0.2274],[-0.262,0.2809],[-0.2688,0.3278],[-0.2711,0.3846],[-0.2688,0.4448],[-0.2574,0.5084],[-0.2392,0.5719],[-0.2073,0.6555],[-0.1663,0.7191],[-0.1276,0.7759],[-0.082,0.8294],[-0.041,0.8729],[-0.0046,0.9064],[0.0456,0.9331],[0.082,0.9532],[0.1162,0.9699],[0.1526,0.9833],[0.1959,0.99],[0.2483,0.9933],[0.2984,1],[0.3713,0.9933],[0.4282,0.9799],[0.4966,0.9498],[0.5877,0.8763],[0.6196,0.8294],[0.6538,0.7726],[0.6765,0.7124],[0.7062,0.6355],[0.7198,0.5753],[0.7289,0.5151],[0.7289,0.4716],[0.7221,0.4247],[0.7062,0.3612],[0.6902,0.3244],[0.6674,0.2709],[0.6378,0.2241],[0.5991,0.1706],[0.574,0.1371],[0.5421,0.1037],[0.5057,0.0702],[0.4761,0.0569],[0.4419,0.0435],[0.3918,0.0435],[0.3417,0.0435],[0.287,0.0435],[0.2027,0.0435],[0.1367,0.0435],[0.0843,0.0401],[0.0342,0.0234],[0.0068,0.0201],[-0.0182,0.0167],[-0.0342,0.0167],[-0.0456,0.0234],[-0.0478,0.0301],[-0.0524,0.0334],[-0.0547,0.0368]],
  [[0,0],[-0.0382,0.0032],[-0.0677,0.0142],[-0.0985,0.0301],[-0.1293,0.0475],[-0.1663,0.0759],[-0.2143,0.1108],[-0.2525,0.1503],[-0.2931,0.1899],[-0.3239,0.2326],[-0.3522,0.2753],[-0.3744,0.3101],[-0.3978,0.3576],[-0.4163,0.4003],[-0.4335,0.4415],[-0.452,0.4842],[-0.4667,0.5237],[-0.4766,0.5633],[-0.4815,0.6076],[-0.4815,0.6408],[-0.4766,0.6756],[-0.468,0.7041],[-0.4532,0.7326],[-0.4384,0.7611],[-0.4163,0.7911],[-0.4015,0.8085],[-0.3842,0.8244],[-0.3584,0.8434],[-0.335,0.8608],[-0.303,0.875],[-0.2734,0.8845],[-0.2488,0.8877],[-0.2229,0.8924],[-0.1897,0.894],[-0.1416,0.8972],[-0.0911,0.8972],[-0.0111,0.8956],[0.053,0.8877],[0.1305,0.875],[0.1872,0.8655],[0.2291,0.856],[0.2586,0.8434],[0.2869,0.8212],[0.3017,0.807],[0.3214,0.7801],[0.3424,0.7453],[0.3596,0.7168],[0.3842,0.6756],[0.4175,0.6203],[0.4409,0.5791],[0.468,0.5269],[0.4914,0.4731],[0.5062,0.432],[0.5172,0.3813],[0.5185,0.3196],[0.5111,0.2769],[0.5012,0.2421],[0.4852,0.2025],[0.4594,0.1598],[0.4249,0.1171],[0.3645,0.0696],[0.3017,0.0301],[0.2401,-0.0063],[0.1921,-0.0332],[0.1392,-0.0633],[0.0924,-0.0839],[0.0443,-0.1013],[0.0172,-0.1028],[0.0074,-0.1028],[-0.0012,-0.0997],[-0.0135,-0.0918],[-0.0333,-0.0775],[-0.0493,-0.0665],[-0.0579,-0.057],[-0.0628,-0.0522],[-0.0665,-0.0443]],
  [[0,0],[-0.0531,-0.0091],[-0.0933,-0.0091],[-0.137,-0.0091],[-0.183,-0.0091],[-0.2302,-0.0015],[-0.2881,0.0121],[-0.3341,0.0287],[-0.3849,0.053],[-0.4345,0.0847],[-0.4805,0.1256],[-0.5195,0.171],[-0.562,0.23],[-0.5915,0.2799],[-0.621,0.3328],[-0.6446,0.3873],[-0.6682,0.4387],[-0.6848,0.4887],[-0.6954,0.5446],[-0.6954,0.584],[-0.693,0.6218],[-0.6848,0.6581],[-0.6718,0.6989],[-0.66,0.7201],[-0.6482,0.7413],[-0.6328,0.7655],[-0.6163,0.7867],[-0.5974,0.8079],[-0.5762,0.8275],[-0.5573,0.8442],[-0.5384,0.8623],[-0.5148,0.879],[-0.4852,0.8941],[-0.4557,0.9092],[-0.4179,0.9198],[-0.3601,0.9319],[-0.3022,0.938],[-0.2656,0.9425],[-0.2267,0.9425],[-0.1924,0.9425],[-0.1617,0.9425],[-0.1299,0.9365],[-0.0885,0.9228],[-0.0307,0.8986],[0.0331,0.8638],[0.0815,0.8336],[0.1251,0.7927],[0.1558,0.761],[0.1865,0.7156],[0.2149,0.6732],[0.2314,0.6415],[0.2491,0.6067],[0.2704,0.5537],[0.2857,0.5159],[0.2975,0.4826],[0.3046,0.4372],[0.2999,0.3933],[0.2893,0.348],[0.2609,0.2723],[0.2302,0.2179],[0.2031,0.1785],[0.1641,0.1377],[0.1192,0.0968],[0.0791,0.0681],[0.026,0.0303],[-0.0153,0.0091],[-0.059,-0.0121],[-0.098,-0.0303],[-0.1334,-0.0469],[-0.1523,-0.0545],[-0.1594,-0.0575],[-0.1606,-0.0575],[-0.1606,-0.0575]],
]

/**正三角形 */
export const triangle1:Point[][] = [
  [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.0043,0.0071],[-0.0236,0.0286],[-0.0494,0.0571],[-0.1416,0.175],[-0.1738,0.225],[-0.2017,0.2714],[-0.2425,0.3357],[-0.3112,0.4214],[-0.3605,0.5],[-0.4142,0.5786],[-0.4614,0.6429],[-0.5064,0.7],[-0.5343,0.7393],[-0.5536,0.775],[-0.5579,0.7857],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5601,0.7893],[-0.5536,0.7893],[-0.5322,0.7893],[-0.4378,0.8036],[-0.3176,0.8107],[-0.1674,0.8286],[0.0258,0.8286],[0.1588,0.8143],[0.2983,0.7964],[0.3777,0.7857],[0.4227,0.775],[0.4356,0.7679],[0.4356,0.7679],[0.4356,0.7679],[0.4356,0.7679],[0.4356,0.7679],[0.4378,0.7643],[0.4399,0.7393],[0.4399,0.7071],[0.4399,0.6607],[0.4227,0.5893],[0.3648,0.4821],[0.3069,0.3786],[0.2103,0.2321],[0.1309,0.0929],[0.0751,-0.0143],[0.0408,-0.0929],[0.0129,-0.1464],[-0.0021,-0.1643],[-0.0172,-0.1714],[-0.0193,-0.1714],[-0.0193,-0.1714],[-0.0193,-0.1714]],
  [[0,0],[0,0],[0,0],[0,0],[-0.0057,0.0035],[-0.0171,0.0175],[-0.0427,0.0594],[-0.0741,0.1049],[-0.1111,0.1538],[-0.1567,0.2203],[-0.208,0.2902],[-0.2621,0.3671],[-0.3476,0.479],[-0.416,0.5664],[-0.4872,0.6573],[-0.5499,0.7378],[-0.6097,0.8182],[-0.6581,0.8741],[-0.6895,0.9126],[-0.7009,0.9301],[-0.7066,0.9336],[-0.7066,0.9336],[-0.7066,0.9336],[-0.7066,0.9336],[-0.7066,0.9336],[-0.7066,0.9336],[-0.7066,0.9336],[-0.7066,0.9336],[-0.698,0.9336],[-0.6781,0.9301],[-0.6382,0.9301],[-0.5556,0.9301],[-0.3903,0.9336],[-0.2479,0.9545],[-0.0997,0.9685],[0.0655,0.979],[0.1652,0.9825],[0.2279,0.9895],[0.265,0.9895],[0.2735,0.9895],[0.2735,0.9895],[0.2735,0.9895],[0.2735,0.9895],[0.2735,0.9895],[0.2735,0.9895],[0.2764,0.986],[0.2821,0.979],[0.2849,0.965],[0.2877,0.9441],[0.2934,0.9056],[0.2934,0.8217],[0.2821,0.7238],[0.1823,0.5455],[0.094,0.4056],[0.0114,0.2552],[-0.0655,0.1049],[-0.0969,0.028],[-0.0969,-0.0035],[-0.0969,-0.0105],[-0.0969,-0.0105],[-0.0969,-0.0105]],
  [[0,0],[0,0],[0,0],[0,0],[0,0],[-0.0189,0.0303],[-0.066,0.0909],[-0.1415,0.1717],[-0.217,0.2626],[-0.3113,0.3737],[-0.4057,0.4949],[-0.4906,0.5859],[-0.5472,0.6869],[-0.6038,0.7778],[-0.6604,0.8687],[-0.7075,0.9293],[-0.717,0.9596],[-0.7264,0.9697],[-0.7264,0.9697],[-0.7264,0.9798],[-0.7264,0.9798],[-0.7264,0.9798],[-0.7264,0.9899],[-0.6981,1],[-0.6509,1],[-0.5755,1],[-0.3774,1],[-0.1981,1],[-0.0283,1],[0.1132,0.9596],[0.1792,0.9394],[0.1981,0.9293],[0.2075,0.9192],[0.217,0.9091],[0.217,0.9091],[0.2264,0.8889],[0.2358,0.8788],[0.2358,0.8586],[0.2453,0.8384],[0.2547,0.8182],[0.2547,0.7576],[0.2642,0.7273],[0.2736,0.6667],[0.2736,0.596],[0.2358,0.4848],[0.1792,0.3939],[0.1415,0.3434],[0.1038,0.2828],[0.0849,0.2424],[0.0849,0.1919],[0.0849,0.1414],[0.0849,0.1212],[0.0849,0.0707],[0.0943,0.0505],[0.0943,0.0505]],
  [[0,0],[0,0],[-0.0171,0],[-0.0598,0.0465],[-0.1111,0.1395],[-0.1795,0.2442],[-0.2564,0.3605],[-0.3248,0.5],[-0.4103,0.6279],[-0.4615,0.7558],[-0.5214,0.8488],[-0.5556,0.8953],[-0.5726,0.9302],[-0.5726,0.9535],[-0.5726,0.9651],[-0.5812,0.9767],[-0.5812,0.9884],[-0.5812,0.9884],[-0.5812,0.9884],[-0.5812,0.9884],[-0.5812,0.9884],[-0.5812,1],[-0.5641,1],[-0.5128,1],[-0.4103,1],[-0.2991,1],[-0.1368,1],[0.0085,1],[0.1368,1],[0.2564,1],[0.3248,1],[0.3675,1],[0.3761,0.9884],[0.3761,0.9884],[0.3761,0.9884],[0.3761,0.9884],[0.3761,0.9884],[0.3761,0.9884],[0.3761,0.9767],[0.3932,0.9535],[0.4017,0.907],[0.4103,0.8605],[0.4103,0.814],[0.4188,0.7558],[0.4188,0.6628],[0.3761,0.5814],[0.3248,0.4767],[0.2821,0.407],[0.265,0.3488],[0.2393,0.3023],[0.2308,0.2442],[0.1966,0.2093],[0.1795,0.1628],[0.1538,0.1163],[0.1538,0.093],[0.1453,0.093],[0.1453,0.093],[0.1453,0.093]],
  [[0,0],[0,0],[0,0],[-0.0196,0.0204],[-0.0588,0.0816],[-0.1373,0.1531],[-0.2549,0.2449],[-0.3725,0.3571],[-0.549,0.5],[-0.6765,0.6327],[-0.8039,0.7347],[-0.8922,0.8469],[-0.9608,0.9082],[-1,0.949],[-1,0.9694],[-1,0.9898],[-1,0.9898],[-1,0.9898],[-1,0.9898],[-1,1],[-1,1],[-0.9706,1],[-0.9314,1],[-0.8922,1],[-0.8235,0.9898],[-0.7353,0.9898],[-0.598,0.9898],[-0.5294,0.9796],[-0.4902,0.9796],[-0.4706,0.9694],[-0.4608,0.9694],[-0.451,0.9592],[-0.451,0.9592],[-0.4412,0.9592],[-0.4314,0.9592],[-0.4118,0.9592],[-0.3824,0.9592],[-0.3235,0.949],[-0.3235,0.949],[-0.3137,0.949],[-0.3137,0.949],[-0.3039,0.9184],[-0.2941,0.8878],[-0.2745,0.8469],[-0.2745,0.8061],[-0.2549,0.7245],[-0.2255,0.6735],[-0.2157,0.602],[-0.2059,0.5204],[-0.2255,0.449],[-0.2941,0.3469],[-0.3235,0.2653],[-0.3333,0.2245],[-0.3529,0.1939],[-0.3529,0.1633],[-0.3529,0.1531],[-0.3529,0.1429],[-0.3529,0.1327],[-0.3529,0.1327],[-0.3529,0.1327]],
  [[0,0],[0,0],[-0.0056,0],[-0.0113,0],[-0.0395,0.0328],[-0.0621,0.082],[-0.1017,0.1475],[-0.1582,0.2377],[-0.2147,0.3443],[-0.2938,0.4426],[-0.3616,0.5328],[-0.4237,0.623],[-0.4746,0.6967],[-0.5085,0.7541],[-0.5254,0.7787],[-0.5311,0.7951],[-0.5311,0.8033],[-0.5311,0.8115],[-0.5311,0.8115],[-0.5254,0.8279],[-0.4802,0.8361],[-0.4124,0.8361],[-0.2881,0.8361],[-0.113,0.8361],[0.0847,0.8443],[0.2373,0.8443],[0.339,0.8443],[0.4068,0.8443],[0.4407,0.8443],[0.4576,0.8443],[0.4576,0.8443],[0.4576,0.8443],[0.4576,0.8443],[0.4633,0.8443],[0.4633,0.8279],[0.4689,0.8033],[0.4689,0.7787],[0.4689,0.7541],[0.4689,0.7295],[0.452,0.6885],[0.3955,0.623],[0.339,0.5328],[0.2429,0.4344],[0.1582,0.3115],[-0.0056,0.1148],[-0.0791,0.041],[-0.1356,-0.0328],[-0.1638,-0.0902],[-0.1695,-0.1066],[-0.1695,-0.1311],[-0.1695,-0.1475],[-0.1695,-0.1475],[-0.1695,-0.1557],[-0.1695,-0.1557],[-0.1695,-0.1557]],
  [[0,0],[0,0],[0,0],[-0.0254,0.0086],[-0.0932,0.0603],[-0.161,0.1293],[-0.2542,0.1983],[-0.3814,0.2845],[-0.5,0.3621],[-0.5932,0.4483],[-0.6949,0.5431],[-0.7373,0.5948],[-0.7712,0.6466],[-0.7966,0.6897],[-0.8051,0.7328],[-0.822,0.7586],[-0.8305,0.8017],[-0.8305,0.8103],[-0.839,0.819],[-0.839,0.819],[-0.839,0.8276],[-0.839,0.8362],[-0.822,0.8362],[-0.7966,0.8362],[-0.7373,0.8362],[-0.661,0.8362],[-0.5508,0.8362],[-0.4407,0.8362],[-0.2966,0.8362],[-0.178,0.8362],[-0.0763,0.8362],[0.0254,0.8276],[0.0593,0.819],[0.0847,0.819],[0.0847,0.8103],[0.0932,0.8017],[0.1102,0.7586],[0.1271,0.7241],[0.1441,0.7069],[0.1525,0.681],[0.1525,0.6638],[0.161,0.6552],[0.161,0.6466],[0.161,0.6293],[0.161,0.5776],[0.1356,0.5172],[0.0847,0.4224],[0.0085,0.2931],[-0.0678,0.1983],[-0.1525,0.0948],[-0.2627,-0.0431],[-0.2966,-0.1034],[-0.3051,-0.1293],[-0.3051,-0.1552],[-0.3051,-0.1638],[-0.3051,-0.1638],[-0.3051,-0.1638]],
  [[0,0],[0,0],[0,0],[-0.0018,0],[-0.0166,0.0142],[-0.0405,0.0427],[-0.0737,0.0855],[-0.116,0.151],[-0.1602,0.2279],[-0.2063,0.3162],[-0.2597,0.4302],[-0.2983,0.5071],[-0.3333,0.5812],[-0.3628,0.6439],[-0.3867,0.6952],[-0.4033,0.7407],[-0.418,0.7835],[-0.4236,0.8006],[-0.4273,0.812],[-0.4273,0.8177],[-0.4273,0.8205],[-0.4273,0.8205],[-0.4273,0.8234],[-0.4254,0.8262],[-0.418,0.8319],[-0.3775,0.8462],[-0.2965,0.8689],[-0.1326,0.9088],[0.0203,0.9345],[0.1805,0.9544],[0.3223,0.9658],[0.4641,0.9744],[0.5285,0.9801],[0.558,0.9801],[0.5635,0.9801],[0.5635,0.9801],[0.5635,0.9801],[0.5635,0.9801],[0.5635,0.9772],[0.5691,0.9658],[0.5727,0.9516],[0.5727,0.9316],[0.5709,0.886],[0.5525,0.8348],[0.5267,0.7749],[0.4807,0.6781],[0.3978,0.5499],[0.3094,0.4217],[0.2247,0.3134],[0.1234,0.1937],[0.046,0.1083],[-0.0055,0.0427],[-0.0405,-0.0028],[-0.046,-0.0142],[-0.046,-0.0171],[-0.046,-0.0171],[-0.046,-0.0171],[-0.046,-0.0199],[-0.046,-0.0199],[-0.046,-0.0199],[-0.046,-0.0199]],
  [[0,0],[0,0],[0,0],[0,0],[0,0],[-0.0049,0.003],[-0.0097,0.0243],[-0.0243,0.0578],[-0.0437,0.1033],[-0.0898,0.1824],[-0.1432,0.2644],[-0.2112,0.3587],[-0.2791,0.4529],[-0.3495,0.5532],[-0.4053,0.6474],[-0.4515,0.7264],[-0.4782,0.7903],[-0.4879,0.8085],[-0.4903,0.8176],[-0.4903,0.8176],[-0.4903,0.8176],[-0.4903,0.8176],[-0.4782,0.8207],[-0.4466,0.8267],[-0.3738,0.8389],[-0.2573,0.8602],[-0.1214,0.8784],[0.068,0.8997],[0.2087,0.921],[0.3252,0.9301],[0.4005,0.9392],[0.4563,0.9392],[0.4709,0.9392],[0.4757,0.9392],[0.4806,0.9392],[0.483,0.9392],[0.4903,0.924],[0.4976,0.9149],[0.5024,0.8997],[0.5073,0.8845],[0.5097,0.8693],[0.5097,0.845],[0.5049,0.7933],[0.483,0.7508],[0.449,0.69],[0.3883,0.5775],[0.3083,0.459],[0.2209,0.3283],[0.1286,0.2036],[0.0437,0.0973],[0.0073,0.0486],[-0.0121,0.0061],[-0.0243,-0.0213],[-0.0291,-0.0334],[-0.034,-0.0486],[-0.0388,-0.0578],[-0.0413,-0.0608],[-0.0461,-0.0608]],
  [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0.0066],[-0.0437,0.053],[-0.0938,0.1325],[-0.1812,0.2517],[-0.2625,0.351],[-0.3312,0.457],[-0.3875,0.543],[-0.4313,0.6093],[-0.4437,0.6689],[-0.45,0.7086],[-0.4437,0.7483],[-0.4313,0.7748],[-0.4063,0.7947],[-0.3875,0.8079],[-0.375,0.8146],[-0.3375,0.8278],[-0.2875,0.8344],[-0.2,0.8477],[-0.0813,0.8477],[0.1187,0.8609],[0.2437,0.8609],[0.3625,0.8609],[0.4562,0.8609],[0.4875,0.8609],[0.4938,0.8609],[0.5,0.8609],[0.5062,0.8543],[0.5062,0.8543],[0.5125,0.8411],[0.5188,0.8212],[0.5313,0.7947],[0.5375,0.7616],[0.55,0.7285],[0.5375,0.6689],[0.4875,0.5894],[0.4562,0.5099],[0.4,0.4238],[0.2938,0.2781],[0.2188,0.1854],[0.125,0.0927],[0.0187,-0.0199],[-0.0375,-0.0795],[-0.0688,-0.106],[-0.0875,-0.1258],[-0.0938,-0.1391],[-0.0938,-0.1391],[-0.0938,-0.1391],[-0.1,-0.1391],[-0.1,-0.1391]],
  [[0,0],[0,0],[-0.0019,0],[-0.0038,0],[-0.0113,0.0025],[-0.0244,0.0177],[-0.045,0.0456],[-0.0694,0.0759],[-0.0938,0.1089],[-0.1295,0.1544],[-0.1557,0.2],[-0.1951,0.2633],[-0.2326,0.319],[-0.2758,0.3873],[-0.3246,0.4532],[-0.379,0.5291],[-0.4184,0.5848],[-0.4484,0.6304],[-0.469,0.6684],[-0.4822,0.6962],[-0.4878,0.719],[-0.4916,0.7392],[-0.4916,0.7519],[-0.4916,0.7646],[-0.4859,0.7797],[-0.4728,0.7949],[-0.454,0.8051],[-0.4221,0.8203],[-0.3527,0.8506],[-0.2645,0.8785],[-0.1576,0.9139],[-0.0319,0.9443],[0.1257,0.9646],[0.2308,0.9646],[0.334,0.9646],[0.3959,0.9646],[0.439,0.9519],[0.4615,0.9418],[0.4728,0.9266],[0.4822,0.9038],[0.4916,0.8785],[0.4991,0.8582],[0.5028,0.8354],[0.5084,0.8051],[0.5084,0.7823],[0.5084,0.7544],[0.4878,0.7038],[0.454,0.6481],[0.4071,0.5848],[0.3208,0.4911],[0.2364,0.3924],[0.1407,0.281],[0.0563,0.1797],[-0.0113,0.0911],[-0.0432,0.0456],[-0.075,-0.0051],[-0.0844,-0.0253],[-0.0844,-0.0278],[-0.0863,-0.0304],[-0.0863,-0.0329],[-0.0863,-0.0354],[-0.0863,-0.0354],[-0.0863,-0.0354]],
  [[0,0],[0,0],[-0.0118,0.0193],[-0.0324,0.0579],[-0.0737,0.1236],[-0.115,0.1853],[-0.1593,0.2587],[-0.2065,0.3359],[-0.2537,0.3938],[-0.3097,0.4633],[-0.3599,0.529],[-0.4336,0.6178],[-0.4867,0.6988],[-0.5428,0.7722],[-0.59,0.8417],[-0.6195,0.8919],[-0.6431,0.9344],[-0.6549,0.9614],[-0.6549,0.9691],[-0.6549,0.9691],[-0.6549,0.9691],[-0.6549,0.9691],[-0.6195,0.9807],[-0.5605,0.9884],[-0.4513,0.9961],[-0.3068,0.9961],[-0.0914,0.9961],[0.059,0.9961],[0.174,1],[0.2478,1],[0.2861,1],[0.2891,1],[0.2891,1],[0.2891,1],[0.2891,1],[0.2891,1],[0.295,0.9961],[0.3038,0.9768],[0.3156,0.9459],[0.3304,0.9112],[0.3422,0.8533],[0.3451,0.7954],[0.3304,0.6988],[0.292,0.5753],[0.2537,0.4672],[0.2212,0.3707],[0.1681,0.2355],[0.1475,0.1776],[0.1298,0.1351],[0.1268,0.1004],[0.1209,0.0888],[0.118,0.0772],[0.1121,0.0695],[0.1091,0.0656]]
]

/**反三角型 */
export const triangle2:Point[][] = [
  [[0,0],[0.003,0],[0.003,0],[0.003,0],[0.0061,0],[0.0121,-0.0043],[0.0273,-0.0087],[0.0485,-0.013],[0.1091,-0.0174],[0.2303,-0.013],[0.3333,-0.013],[0.4485,-0.0087],[0.5545,0],[0.6394,0.0043],[0.7212,0.013],[0.8182,0.0217],[0.8818,0.0348],[0.9394,0.0391],[0.9758,0.0435],[0.997,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[1,0.0435],[0.9939,0.0696],[0.9667,0.1304],[0.9364,0.213],[0.8788,0.3217],[0.8152,0.4435],[0.7545,0.5783],[0.7182,0.6739],[0.6818,0.7565],[0.6667,0.8261],[0.6485,0.8783],[0.6303,0.9174],[0.6121,0.9391],[0.5939,0.9609],[0.5848,0.9696],[0.5758,0.9783],[0.5727,0.9783],[0.5727,0.9826],[0.5727,0.9826],[0.5667,0.9826],[0.5545,0.9565],[0.5424,0.9043],[0.5212,0.8174],[0.4121,0.6348],[0.3303,0.4913],[0.2848,0.4087],[0.2303,0.2913],[0.197,0.2174],[0.1818,0.1609],[0.1758,0.1174],[0.1758,0.1174],[0.1758,0.113]],
  [[0,0],[0,0],[0,0],[0.0115,0],[0.0267,0],[0.0649,0],[0.1145,0],[0.2176,0],[0.416,0],[0.5878,0],[0.7519,0],[0.8664,0],[0.9351,0],[0.9733,0],[0.9924,0],[0.9962,0],[0.9962,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0.0237],[0.9924,0.0569],[0.9809,0.09],[0.958,0.1564],[0.9313,0.2227],[0.8435,0.4597],[0.8206,0.564],[0.7977,0.673],[0.7748,0.7393],[0.7443,0.8152],[0.7328,0.8531],[0.7176,0.8768],[0.6985,0.9005],[0.6794,0.9242],[0.6641,0.9336],[0.6412,0.9431],[0.6336,0.9431],[0.6298,0.9431],[0.6298,0.9384],[0.6298,0.91],[0.6183,0.8341],[0.5802,0.7488],[0.5153,0.5924],[0.4695,0.4597],[0.4084,0.3128],[0.3702,0.218],[0.3435,0.1374],[0.313,0.0616],[0.2977,0],[0.2901,-0.0284],[0.2901,-0.0474],[0.2901,-0.0569],[0.2901,-0.0569]],
  [[0,0],[0,0],[0,0],[0,0],[0.0213,-0.0067],[0.0456,-0.0067],[0.079,-0.0167],[0.1398,-0.0167],[0.2371,-0.0167],[0.3647,-0.0067],[0.5562,0.0134],[0.7082,0.0301],[0.8328,0.0334],[0.9939,0.0502],[1,0.0502],[1,0.0502],[1,0.0502],[1,0.0502],[1,0.0502],[1,0.0502],[1,0.0535],[1,0.0635],[0.9909,0.0936],[0.9818,0.1304],[0.9635,0.194],[0.9605,0.2575],[0.9483,0.3278],[0.9331,0.4013],[0.9027,0.4849],[0.8723,0.5719],[0.8298,0.6488],[0.7812,0.7191],[0.7386,0.7793],[0.7021,0.8328],[0.6809,0.8595],[0.6717,0.8696],[0.6717,0.8729],[0.6717,0.8729],[0.6717,0.8729],[0.6717,0.8729],[0.6717,0.8729],[0.6687,0.8495],[0.6657,0.8094],[0.6565,0.7625],[0.5593,0.6355],[0.4894,0.5418],[0.4316,0.4482],[0.3587,0.3445],[0.307,0.2609],[0.2766,0.194],[0.231,0.0936],[0.2128,0.0234],[0.2067,-0.0468],[0.2067,-0.0936],[0.2067,-0.1171],[0.2067,-0.1271]],
  [[0,0],[0.0028,-0.0067],[0.0085,-0.0067],[0.0113,-0.0134],[0.0283,-0.0201],[0.0567,-0.0268],[0.0963,-0.0334],[0.1586,-0.0368],[0.2776,-0.0334],[0.4221,-0.0234],[0.6176,-0.0167],[0.7507,-0.0134],[0.8584,-0.0067],[0.9178,-0.0033],[0.9603,0],[0.983,0.0067],[0.9943,0.01],[1,0.0167],[1,0.0167],[1,0.0167],[1,0.0167],[1,0.0167],[1,0.0201],[1,0.0301],[0.9915,0.0569],[0.9745,0.097],[0.9462,0.1572],[0.8952,0.2609],[0.8442,0.3545],[0.7932,0.4682],[0.7365,0.6054],[0.7082,0.7057],[0.6601,0.8027],[0.6289,0.8629],[0.5977,0.9064],[0.5694,0.9398],[0.5552,0.9565],[0.5439,0.9632],[0.5354,0.9632],[0.5354,0.9632],[0.5297,0.9599],[0.5297,0.9498],[0.5269,0.9365],[0.5156,0.903],[0.4929,0.8629],[0.4448,0.8094],[0.3711,0.7157],[0.2975,0.6321],[0.2351,0.5452],[0.1643,0.4314],[0.1105,0.3244],[0.0822,0.2441],[0.0737,0.1605],[0.068,0.1204],[0.068,0.0836],[0.0708,0.0468]],
  [[0,0],[0.0024,0],[0.0048,-0.0031],[0.0119,-0.0093],[0.0238,-0.0125],[0.0452,-0.0156],[0.0786,-0.0187],[0.1452,-0.0187],[0.2405,-0.0125],[0.3476,-0.0031],[0.5024,0.0062],[0.631,0.0125],[0.7381,0.0156],[0.8119,0.0156],[0.8548,0.0156],[0.869,0.0156],[0.8714,0.0156],[0.8714,0.0156],[0.8714,0.0156],[0.8714,0.0156],[0.8714,0.0156],[0.8714,0.0156],[0.8714,0.0249],[0.8643,0.0467],[0.8524,0.0841],[0.831,0.1277],[0.7952,0.19],[0.7452,0.2741],[0.669,0.3988],[0.5952,0.5234],[0.5214,0.6449],[0.4619,0.7383],[0.4024,0.8442],[0.3595,0.9159],[0.3381,0.9502],[0.3214,0.9782],[0.319,0.9813],[0.319,0.9813],[0.319,0.9813],[0.319,0.9813],[0.319,0.972],[0.3167,0.9408],[0.3143,0.9003],[0.3048,0.8505],[0.2667,0.7508],[0.1786,0.6417],[0.1071,0.5483],[0.019,0.4206],[-0.0476,0.3271],[-0.1,0.2243],[-0.1262,0.134],[-0.1286,0.0748],[-0.1286,0.0312],[-0.1167,-0.0031]],
  [[0,0],[0,0],[0,0],[0.0021,-0.0081],[0.0103,-0.0202],[0.0246,-0.0283],[0.0493,-0.0445],[0.0739,-0.0607],[0.115,-0.0769],[0.2053,-0.081],[0.2977,-0.081],[0.4086,-0.0648],[0.54,-0.0445],[0.6776,-0.0162],[0.8296,0.0162],[0.9179,0.0283],[0.9754,0.0405],[0.9979,0.0486],[1,0.0486],[1,0.0486],[1,0.0486],[1,0.0486],[1,0.0526],[0.9979,0.0648],[0.9918,0.0891],[0.9754,0.1377],[0.9528,0.1903],[0.924,0.2672],[0.8871,0.3563],[0.8439,0.4696],[0.7926,0.5951],[0.7598,0.6842],[0.729,0.7652],[0.6982,0.8381],[0.6838,0.8907],[0.6756,0.919],[0.6756,0.919],[0.6756,0.919],[0.6756,0.919],[0.6756,0.9028],[0.6756,0.8664],[0.6756,0.8057],[0.6715,0.749],[0.616,0.6275],[0.5667,0.5344],[0.5154,0.4211],[0.4333,0.2955],[0.3758,0.2105],[0.3347,0.1457],[0.2977,0.085],[0.2834,0.0567],[0.2793,0.0324],[0.2731,0.0121],[0.2731,0],[0.2669,-0.0121],[0.2608,-0.0283],[0.2587,-0.0405]],
  [[0,0],[0,0],[0.0068,-0.0083],[0.0137,-0.0083],[0.0411,-0.0248],[0.0753,-0.0331],[0.1301,-0.0496],[0.2192,-0.0496],[0.3425,-0.0496],[0.4589,-0.0496],[0.6027,-0.0496],[0.6712,-0.0496],[0.7671,-0.0496],[0.8151,-0.0496],[0.8425,-0.0496],[0.8699,-0.0413],[0.8767,-0.0331],[0.8767,-0.0248],[0.8836,-0.0165],[0.8904,0],[0.911,0.0083],[0.9315,0.0331],[0.9452,0.0496],[0.9521,0.0661],[0.9521,0.0661],[0.9521,0.0744],[0.9521,0.0826],[0.9521,0.0909],[0.9315,0.124],[0.8904,0.1818],[0.8356,0.2479],[0.774,0.3554],[0.5822,0.6446],[0.5,0.7603],[0.4726,0.8099],[0.4452,0.8512],[0.4384,0.8678],[0.4178,0.8843],[0.4041,0.9008],[0.3973,0.9174],[0.3699,0.9339],[0.3288,0.9504],[0.3151,0.9504],[0.3082,0.9504],[0.3014,0.9421],[0.2945,0.9008],[0.2466,0.8099],[0.1301,0.6281],[0.0616,0.4793],[-0.0274,0.281],[-0.0479,0.157],[-0.0479,0.0744],[-0.0479,0.0083],[-0.0342,-0.0248],[-0.0342,-0.0331],[-0.0342,-0.0331],[-0.0342,-0.0331]],
  [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0.0123,0],[0.0412,0],[0.1317,0.015],[0.2881,0.0602],[0.5309,0.1053],[0.716,0.1278],[0.8683,0.1429],[0.963,0.1429],[0.9959,0.1429],[1,0.1429],[1,0.1504],[1,0.1504],[1,0.1579],[1,0.1579],[1,0.1654],[1,0.1729],[1,0.1955],[0.9794,0.2632],[0.9506,0.3233],[0.9136,0.391],[0.8683,0.4887],[0.8107,0.5714],[0.7572,0.6617],[0.6996,0.7594],[0.6584,0.8346],[0.6214,0.8947],[0.5885,0.9474],[0.5679,0.9774],[0.5597,0.9925],[0.5597,1],[0.5597,1],[0.5597,1],[0.5597,1],[0.5597,1],[0.5597,1],[0.5597,1],[0.5556,0.985],[0.5185,0.9398],[0.4568,0.8271],[0.4074,0.7293],[0.3086,0.5639],[0.2016,0.3609],[0.1358,0.203],[0.0947,0.1203],[0.0658,0.0526],[0.0617,0.0226],[0.0617,0.015],[0.0617,0.0075],[0.0617,0],[0.0617,0]],
  [[0,0],[0,0],[0,0],[0,-0.0057],[0.0048,-0.0057],[0.0239,-0.0114],[0.0766,-0.0171],[0.1531,-0.0286],[0.2679,-0.0514],[0.3923,-0.0571],[0.7129,-0.0743],[0.8182,-0.08],[0.9043,-0.08],[0.9617,-0.08],[0.9856,-0.08],[0.9952,-0.08],[1,-0.08],[1,-0.08],[1,-0.08],[1,-0.08],[1,-0.08],[1,-0.08],[1,-0.0743],[1,-0.0629],[1,-0.0457],[0.9952,-0.0114],[0.9761,0.0343],[0.9522,0.0914],[0.9187,0.1714],[0.8756,0.2743],[0.8134,0.4114],[0.7656,0.5029],[0.7464,0.6],[0.7129,0.6571],[0.6938,0.72],[0.689,0.7486],[0.689,0.7657],[0.689,0.7771],[0.689,0.7829],[0.689,0.7886],[0.689,0.7943],[0.689,0.7943],[0.689,0.7943],[0.689,0.7943],[0.689,0.7943],[0.6842,0.76],[0.6746,0.72],[0.6507,0.6571],[0.5598,0.56],[0.4545,0.4457],[0.3206,0.3086],[0.2105,0.2114],[0.1244,0.0971],[0.067,0],[0.0335,-0.0743],[0.0144,-0.1371],[0.0144,-0.1714],[0.0144,-0.2],[0.0144,-0.2057]],
  [[0,0],[0.0062,-0.0069],[0.0062,-0.0069],[0.0248,-0.0069],[0.0435,-0.0138],[0.087,-0.0138],[0.1925,-0.0138],[0.3043,-0.0138],[0.4534,0],[0.6211,0],[0.7578,0],[0.882,0],[0.9441,0],[0.9876,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[0.9938,0.0207],[0.9752,0.069],[0.9317,0.1586],[0.8571,0.2828],[0.7826,0.4069],[0.7019,0.531],[0.6335,0.6414],[0.5528,0.7586],[0.4907,0.8414],[0.4534,0.8966],[0.4286,0.931],[0.4099,0.9586],[0.3975,0.9724],[0.3975,0.9862],[0.3913,0.9862],[0.3913,0.9862],[0.3913,0.9862],[0.3913,0.9862],[0.3913,0.9862],[0.3851,0.9793],[0.3727,0.9448],[0.3665,0.8759],[0.3602,0.8207],[0.2981,0.731],[0.1739,0.5931],[0.087,0.4621],[0.0311,0.3586],[0.0062,0.2759],[0,0.1724],[0,0.131],[0,0.0828],[0.0062,0.0759]],
  [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0.0089,0],[0.0268,-0.0054],[0.0536,-0.0109],[0.1295,-0.0109],[0.2232,-0.0054],[0.3438,0],[0.4911,0.0163],[0.6563,0.0272],[0.8304,0.0272],[0.9241,0.0326],[0.9777,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.0326],[1,0.038],[0.9955,0.0543],[0.9821,0.0815],[0.9554,0.1413],[0.9152,0.2065],[0.8661,0.2826],[0.7857,0.3967],[0.7188,0.5],[0.6696,0.5815],[0.6295,0.6522],[0.5982,0.7011],[0.5804,0.7609],[0.567,0.788],[0.558,0.8098],[0.5491,0.837],[0.5491,0.8641],[0.5491,0.8859],[0.5446,0.9022],[0.5446,0.9022],[0.5446,0.9076],[0.5446,0.9076],[0.5402,0.9022],[0.5223,0.8587],[0.4955,0.7989],[0.442,0.7283],[0.3438,0.6033],[0.2679,0.5054],[0.1429,0.3043],[0.0938,0.1793],[0.0625,0.0652],[0.058,-0.0326],[0.058,-0.0815],[0.058,-0.0924],[0.058,-0.0924],[0.058,-0.0924]],
  [[0,0],[0,0],[0,0],[0,0],[0.0032,0],[0.0259,0],[0.0615,-0.004],[0.1489,-0.0161],[0.2524,-0.0161],[0.3786,-0.0202],[0.5146,-0.0282],[0.6343,-0.0323],[0.7443,-0.0323],[0.8673,-0.0323],[0.9353,-0.0202],[0.9806,-0.0202],[0.9968,-0.0202],[0.9968,-0.0202],[0.9968,-0.0202],[0.9968,-0.0202],[0.9968,-0.0202],[0.9968,-0.0202],[1,-0.0202],[1,-0.0202],[1,-0.0202],[1,-0.0202],[1,-0.0202],[1,-0.0202],[1,-0.0202],[1,-0.0202],[0.9968,-0.0081],[0.9838,0.0202],[0.9515,0.0685],[0.9191,0.129],[0.877,0.2056],[0.8252,0.3065],[0.7961,0.3831],[0.7573,0.4758],[0.7443,0.5524],[0.7314,0.6452],[0.7282,0.7097],[0.712,0.7782],[0.699,0.8145],[0.6667,0.8589],[0.6505,0.8871],[0.6343,0.9113],[0.6278,0.9194],[0.6278,0.9234],[0.6278,0.9234],[0.6246,0.9274],[0.6246,0.9274],[0.6246,0.9274],[0.6246,0.9274],[0.6246,0.8911],[0.6246,0.8306],[0.5761,0.7137],[0.4854,0.5806],[0.4078,0.4597],[0.3139,0.3306],[0.2362,0.2177],[0.1909,0.1331],[0.1845,0.0806],[0.1812,0.0242],[0.1812,-0.0282],[0.178,-0.0605],[0.1748,-0.0726],[0.1748,-0.0726],[0.1748,-0.0726]],
  [[0,0],[0,0],[0,0],[0,0],[0,0],[0.0087,-0.0033],[0.0239,-0.0065],[0.0672,-0.0131],[0.141,-0.0163],[0.2408,-0.0229],[0.3514,-0.0261],[0.4555,-0.0392],[0.5488,-0.0425],[0.6443,-0.0523],[0.6941,-0.0523],[0.7289,-0.0523],[0.7614,-0.049],[0.7896,-0.0458],[0.8156,-0.0359],[0.8503,-0.0294],[0.8872,-0.0229],[0.9219,-0.0196],[0.9566,-0.0131],[0.9826,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0131],[0.9978,-0.0098],[0.9978,0.0033],[0.9978,0.0163],[0.9978,0.0261],[0.9957,0.0327],[0.974,0.0948],[0.9306,0.1895],[0.8742,0.317],[0.8091,0.4641],[0.7289,0.6536],[0.6855,0.7843],[0.6508,0.8562],[0.6139,0.9183],[0.6009,0.9379],[0.5944,0.9444],[0.5857,0.9477],[0.5748,0.9477],[0.5553,0.9412],[0.5445,0.9248],[0.4924,0.8725],[0.4013,0.7712],[0.282,0.6569],[0.1562,0.5359],[0.0824,0.4575],[0.0369,0.3791],[0.0108,0.3137],[-0.0022,0.2418],[-0.0022,0.1895],[-0.0022,0.1536],[0,0.1307],[0.0043,0.1176],[0.0065,0.1144],[0.0065,0.1144],[0.0065,0.1144],[0.0065,0.1144],[0.0065,0.1144]]
]

export const x:Point[][] = [
  [[0,0],[0,-0.0065],[0,-0.0195],[0.0084,-0.039],[0.0211,-0.0584],[0.0506,-0.0779],[0.0802,-0.0909],[0.1097,-0.0974],[0.1266,-0.0974],[0.1477,-0.0974],[0.1983,-0.0714],[0.2616,-0.0195],[0.3207,0.0455],[0.3755,0.0974],[0.4304,0.1688],[0.481,0.2468],[0.5443,0.3571],[0.5907,0.461],[0.6287,0.5519],[0.654,0.6364],[0.6793,0.7013],[0.692,0.7468],[0.6962,0.7792],[0.7004,0.7987],[0.7004,0.8182],[0.7046,0.8312],[0.7089,0.8442],[0.7131,0.8442],[0.7131,0.8506],[0.7173,0.8506],[0.7511,0.7987],[0.8017,0.6948],[0.8565,0.5779],[0.903,0.4675],[0.9536,0.3312],[0.9958,0.2143],[1,0.1234],[0.9916,0.0519],[0.9578,-0.039],[0.9198,-0.0779],[0.8608,-0.1234],[0.8059,-0.1364],[0.7468,-0.1494],[0.5823,-0.1234],[0.4641,-0.0325],[0.384,0.0649],[0.3038,0.1753],[0.2236,0.3182],[0.1688,0.4351],[0.1181,0.5195],[0.0717,0.5909],[0.0675,0.6039],[0.0633,0.6039],[0.0633,0.6039],[0.0633,0.6039],[0.0633,0.6039],[0.0633,0.6039]],
  [[0,0],[0.0033,-0.0065],[0.0131,-0.0196],[0.0295,-0.0327],[0.0525,-0.0392],[0.0787,-0.0392],[0.1344,-0.0392],[0.2066,-0.0131],[0.2984,0.0392],[0.3934,0.1046],[0.4918,0.1765],[0.5475,0.2353],[0.5869,0.3007],[0.6164,0.3595],[0.6361,0.4314],[0.6525,0.5359],[0.6721,0.6601],[0.6787,0.7451],[0.6852,0.8366],[0.6951,0.902],[0.7049,0.9346],[0.7049,0.9542],[0.7082,0.9608],[0.7148,0.9608],[0.7279,0.9542],[0.7672,0.8824],[0.8328,0.7778],[0.9082,0.6601],[0.9541,0.549],[0.9803,0.4575],[0.9967,0.3856],[1,0.3268],[0.9934,0.2745],[0.9443,0.1895],[0.8918,0.1176],[0.8393,0.0719],[0.777,0.0327],[0.7115,0.0327],[0.6623,0.0392],[0.6033,0.0915],[0.5148,0.1765],[0.4426,0.2745],[0.3607,0.3791],[0.3148,0.4575],[0.2656,0.5621],[0.2426,0.6144],[0.2295,0.6601],[0.223,0.6732],[0.223,0.6732],[0.223,0.6732],[0.2197,0.6732],[0.2197,0.6732],[0.2197,0.6732],[0.2197,0.6732]],
  [[0,0],[0,0],[0.0039,0],[0.0314,-0.0091],[0.0667,-0.0182],[0.098,-0.0273],[0.1529,-0.0273],[0.2118,-0.0091],[0.3098,0.0455],[0.3882,0.1273],[0.4588,0.2091],[0.5137,0.2909],[0.5608,0.3818],[0.5843,0.4455],[0.6118,0.5182],[0.6275,0.5909],[0.6353,0.6364],[0.6431,0.7091],[0.651,0.7727],[0.6667,0.8273],[0.6863,0.9],[0.698,0.9273],[0.7059,0.9545],[0.7137,0.9636],[0.7176,0.9636],[0.7333,0.9636],[0.7569,0.9455],[0.7961,0.8818],[0.851,0.7545],[0.902,0.6182],[0.9451,0.4818],[0.9765,0.3636],[1,0.2818],[1,0.2],[0.9922,0.1364],[0.9529,0.0818],[0.8745,-0.0091],[0.8039,-0.0364],[0.7412,-0.0364],[0.6706,-0.0364],[0.5804,0.0182],[0.5059,0.0818],[0.4471,0.1727],[0.3843,0.3],[0.3176,0.4636],[0.2824,0.5545],[0.2431,0.6818],[0.2235,0.7364],[0.2196,0.7545],[0.2196,0.7545],[0.2196,0.7545],[0.2196,0.7545],[0.2196,0.7545],[0.2157,0.7545]],
  [[0,0],[0.0047,-0.0041],[0.011,-0.0203],[0.0236,-0.0366],[0.0457,-0.0569],[0.0787,-0.0772],[0.1339,-0.0813],[0.2031,-0.0976],[0.3008,-0.0976],[0.3795,-0.0732],[0.4567,-0.0325],[0.5276,0.0203],[0.589,0.0691],[0.6378,0.1423],[0.6819,0.2276],[0.7055,0.3089],[0.726,0.3902],[0.7417,0.4675],[0.7543,0.5366],[0.7654,0.5894],[0.778,0.6423],[0.7858,0.6707],[0.7953,0.6911],[0.8047,0.7114],[0.8126,0.7154],[0.8252,0.7195],[0.8394,0.7195],[0.8598,0.6951],[0.9008,0.6463],[0.926,0.5894],[0.9528,0.5285],[0.9795,0.4228],[0.9937,0.3415],[1,0.2602],[0.989,0.1585],[0.9654,0.0528],[0.9354,-0.0528],[0.9102,-0.126],[0.8866,-0.1829],[0.8598,-0.2358],[0.8346,-0.2642],[0.8157,-0.2764],[0.7906,-0.2805],[0.7543,-0.2724],[0.7244,-0.2358],[0.6898,-0.1789],[0.6409,-0.0813],[0.5969,0.0244],[0.5638,0.0935],[0.526,0.1992],[0.4646,0.3577],[0.4346,0.439],[0.4031,0.5081],[0.3827,0.5488],[0.3764,0.565],[0.3748,0.565],[0.3748,0.565],[0.3732,0.565],[0.3732,0.565],[0.3732,0.565],[0.3732,0.565]],
  [[0,0],[0.006,0],[0.033,-0.0318],[0.0631,-0.0637],[0.1141,-0.0955],[0.1892,-0.1146],[0.2703,-0.1338],[0.3904,-0.1338],[0.4895,-0.1274],[0.5886,-0.1083],[0.6757,-0.0828],[0.7387,-0.051],[0.7808,-0.0255],[0.8138,0.0127],[0.8258,0.051],[0.8318,0.0955],[0.8378,0.1656],[0.8438,0.2548],[0.8498,0.3439],[0.8709,0.4586],[0.8829,0.5223],[0.9009,0.586],[0.9129,0.6306],[0.9219,0.6561],[0.9249,0.6815],[0.9309,0.6879],[0.9369,0.6943],[0.952,0.6943],[0.955,0.6879],[0.97,0.6433],[0.985,0.5796],[0.997,0.4904],[1,0.4013],[1,0.3057],[1,0.1975],[0.994,0.0955],[0.976,0.0318],[0.955,-0.0382],[0.9189,-0.1274],[0.8709,-0.1975],[0.8318,-0.2548],[0.7718,-0.2866],[0.6997,-0.3057],[0.6156,-0.3057],[0.5435,-0.293],[0.4865,-0.242],[0.4234,-0.1592],[0.3754,-0.0828],[0.3363,0.0064],[0.2973,0.1019],[0.2673,0.1656],[0.2492,0.2102],[0.2372,0.242],[0.2342,0.2484],[0.2312,0.2548],[0.2282,0.2611],[0.2282,0.2611],[0.2282,0.2611]],
  [[0,0],[0,0],[0,0],[0,0],[0,-0.0036],[0.0093,-0.0108],[0.0297,-0.0288],[0.0669,-0.054],[0.1115,-0.0719],[0.2955,-0.1007],[0.368,-0.1079],[0.4275,-0.1079],[0.4796,-0.0971],[0.513,-0.0719],[0.5483,-0.0396],[0.5762,0.0108],[0.5985,0.0683],[0.6245,0.1439],[0.6468,0.2302],[0.6747,0.3273],[0.7082,0.446],[0.7361,0.554],[0.7584,0.6511],[0.7751,0.723],[0.7937,0.7878],[0.816,0.8345],[0.8401,0.8741],[0.855,0.8885],[0.868,0.8921],[0.8866,0.8885],[0.9052,0.8561],[0.9312,0.795],[0.9628,0.7014],[0.9907,0.5719],[0.9981,0.4676],[1,0.3597],[0.9963,0.2986],[0.9814,0.2374],[0.9572,0.1619],[0.9387,0.1043],[0.9033,0.0432],[0.8773,0.0072],[0.8253,-0.0468],[0.7807,-0.0647],[0.7082,-0.0719],[0.6022,-0.0719],[0.5353,-0.0468],[0.461,0.0072],[0.3885,0.1115],[0.342,0.2086],[0.2993,0.3094],[0.2379,0.4388],[0.21,0.5036],[0.1822,0.554],[0.1747,0.5683],[0.1747,0.5683],[0.1729,0.5683],[0.1729,0.5683],[0.1729,0.5683],[0.1729,0.5683]],
  [[0,0],[0,-0.004],[0.0024,-0.0158],[0.0143,-0.0277],[0.0334,-0.0356],[0.0573,-0.0435],[0.0979,-0.0514],[0.148,-0.0514],[0.222,-0.0435],[0.2983,-0.0158],[0.3866,0.0316],[0.4726,0.1067],[0.5823,0.2134],[0.6539,0.3043],[0.7136,0.3913],[0.747,0.4466],[0.7661,0.4941],[0.7757,0.5296],[0.778,0.5613],[0.778,0.5731],[0.7804,0.6008],[0.7804,0.6245],[0.7804,0.6522],[0.7804,0.6798],[0.79,0.7115],[0.7995,0.7273],[0.8067,0.7312],[0.8162,0.7312],[0.8258,0.7273],[0.852,0.6838],[0.895,0.5968],[0.9212,0.5336],[0.9594,0.4308],[0.9928,0.3043],[1,0.1937],[0.9952,0.1225],[0.9833,0.0672],[0.9666,0.0158],[0.9499,-0.0158],[0.9332,-0.0356],[0.9069,-0.0514],[0.8783,-0.0514],[0.8353,-0.0435],[0.7852,-0.0119],[0.6969,0.083],[0.6205,0.1976],[0.5394,0.3399],[0.4177,0.5257],[0.3484,0.6561],[0.2864,0.7628],[0.2411,0.8498],[0.2053,0.9091],[0.1933,0.9368],[0.1885,0.9447],[0.1885,0.9447],[0.1885,0.9447],[0.1885,0.9447],[0.1885,0.9486]],
  [[0,0],[0,-0.0229],[0.0067,-0.0459],[0.0156,-0.0734],[0.0356,-0.1055],[0.0578,-0.1514],[0.0911,-0.1927],[0.1444,-0.2523],[0.1911,-0.3028],[0.2333,-0.3303],[0.2733,-0.3532],[0.3156,-0.3532],[0.3622,-0.344],[0.4222,-0.289],[0.4733,-0.2202],[0.5333,-0.1193],[0.6,0.0092],[0.6644,0.1468],[0.7289,0.2706],[0.7867,0.3945],[0.8156,0.445],[0.8311,0.4679],[0.8378,0.4817],[0.84,0.4862],[0.84,0.4862],[0.84,0.4862],[0.84,0.4862],[0.84,0.4862],[0.8444,0.4862],[0.8622,0.4495],[0.8889,0.4037],[0.9133,0.3394],[0.9489,0.2431],[0.98,0.1514],[0.9956,0.0688],[1,0],[0.9778,-0.1009],[0.9533,-0.1697],[0.9222,-0.2294],[0.8689,-0.2706],[0.8289,-0.2798],[0.7867,-0.2752],[0.7356,-0.2385],[0.6578,-0.133],[0.5844,0.0229],[0.5022,0.1789],[0.4244,0.344],[0.3689,0.4587],[0.3289,0.5367],[0.2889,0.6147],[0.2711,0.6376],[0.2644,0.6468],[0.2644,0.6468],[0.2644,0.6468],[0.2644,0.6468],[0.2644,0.6468]],
  [[0,0],[0.0106,-0.0244],[0.0211,-0.0569],[0.0387,-0.0813],[0.0739,-0.1301],[0.1127,-0.1463],[0.1549,-0.1626],[0.2183,-0.1626],[0.2958,-0.122],[0.3768,-0.0325],[0.4859,0.0894],[0.5634,0.2114],[0.6268,0.3415],[0.6725,0.4553],[0.7113,0.561],[0.7394,0.6585],[0.757,0.6992],[0.7641,0.7398],[0.7711,0.7561],[0.7746,0.7642],[0.7782,0.7724],[0.7817,0.7724],[0.8063,0.7561],[0.838,0.6748],[0.8732,0.5854],[0.912,0.4634],[0.9472,0.3496],[0.9824,0.2114],[0.9965,0.122],[1,0.0569],[0.993,-0.0163],[0.9683,-0.0894],[0.9085,-0.1626],[0.8451,-0.2195],[0.7113,-0.2276],[0.588,-0.2195],[0.4507,-0.1382],[0.3556,-0.0325],[0.2711,0.0894],[0.1937,0.2439],[0.1408,0.3821],[0.1056,0.4878],[0.088,0.5691],[0.0669,0.6504],[0.0528,0.6992],[0.0423,0.7398],[0.0352,0.7561],[0.0317,0.7642],[0.0282,0.7642],[0.0282,0.7642],[0.0282,0.7642]],
  [[0,0],[0.003,-0.0217],[0.006,-0.029],[0.015,-0.0435],[0.021,-0.0725],[0.033,-0.1087],[0.0541,-0.1449],[0.0931,-0.2101],[0.1291,-0.2536],[0.1682,-0.3043],[0.2192,-0.3333],[0.2733,-0.3478],[0.3303,-0.3478],[0.3904,-0.3478],[0.4414,-0.3478],[0.4895,-0.3116],[0.5526,-0.2536],[0.6156,-0.1884],[0.6787,-0.1014],[0.7447,0.029],[0.7838,0.1232],[0.8138,0.2101],[0.8378,0.2971],[0.8619,0.3623],[0.8769,0.413],[0.8919,0.4493],[0.8919,0.4638],[0.8919,0.471],[0.8979,0.471],[0.9039,0.471],[0.9129,0.471],[0.9279,0.4275],[0.958,0.3696],[0.991,0.2319],[1,0.0942],[1,-0.0797],[0.991,-0.2246],[0.973,-0.3551],[0.955,-0.442],[0.9489,-0.4783],[0.9369,-0.5],[0.9219,-0.5145],[0.9039,-0.5145],[0.8589,-0.4855],[0.8018,-0.4058],[0.7117,-0.2464],[0.6517,-0.1159],[0.5856,0.0507],[0.5195,0.2101],[0.4775,0.3188],[0.4505,0.4058],[0.4324,0.4565],[0.4294,0.4855],[0.4294,0.4855],[0.4294,0.4855],[0.4294,0.4855],[0.4294,0.4855],[0.4294,0.4855],[0.4294,0.4855],[0.4294,0.4855]],
  [[0,0],[0,0],[0.0032,0],[0.0064,0],[0.016,-0.0213],[0.0479,-0.1064],[0.0958,-0.2128],[0.1661,-0.3475],[0.23,-0.4681],[0.3035,-0.539],[0.377,-0.6099],[0.4409,-0.6525],[0.5016,-0.6596],[0.5623,-0.6596],[0.6006,-0.6454],[0.639,-0.6099],[0.6709,-0.5532],[0.6997,-0.4823],[0.7348,-0.383],[0.77,-0.234],[0.8019,-0.1064],[0.8339,-0.0071],[0.8626,0.078],[0.8882,0.1418],[0.901,0.1844],[0.9105,0.2128],[0.9169,0.234],[0.9169,0.2482],[0.9233,0.2553],[0.9233,0.2553],[0.9265,0.2553],[0.9297,0.2553],[0.9425,0.227],[0.9585,0.156],[0.984,0.0355],[1,-0.1418],[1,-0.2553],[1,-0.3617],[0.9968,-0.4255],[0.9808,-0.5106],[0.9649,-0.5461],[0.9329,-0.5957],[0.8882,-0.6383],[0.8179,-0.6383],[0.7316,-0.617],[0.6422,-0.5461],[0.5016,-0.4043],[0.4026,-0.2624],[0.3227,-0.1206],[0.2588,0.0071],[0.1949,0.1348],[0.1534,0.227],[0.1214,0.305],[0.1118,0.3333],[0.1118,0.3333],[0.1118,0.3333],[0.1118,0.3404],[0.1118,0.3404],[0.1118,0.3404]],
  [[0,0],[0.0036,-0.013],[0.0071,-0.026],[0.0107,-0.039],[0.0143,-0.0519],[0.0179,-0.0649],[0.025,-0.0844],[0.0357,-0.1039],[0.0536,-0.1169],[0.0821,-0.1364],[0.1393,-0.1429],[0.2179,-0.1429],[0.3464,-0.1234],[0.4536,-0.0974],[0.5536,-0.0519],[0.6321,0.013],[0.7107,0.0909],[0.7536,0.1688],[0.7857,0.2468],[0.8107,0.3312],[0.8393,0.4351],[0.8571,0.5195],[0.8679,0.5974],[0.8893,0.6818],[0.9071,0.7403],[0.9214,0.7597],[0.9321,0.7857],[0.9393,0.7922],[0.9429,0.7922],[0.9429,0.7987],[0.9429,0.7987],[0.95,0.7792],[0.975,0.7208],[1,0.6299],[1,0.5325],[1,0.4026],[1,0.3117],[0.9786,0.2013],[0.95,0.1234],[0.8857,0.0195],[0.85,-0.0455],[0.8071,-0.0974],[0.7536,-0.1364],[0.725,-0.1429],[0.6893,-0.1429],[0.6607,-0.1429],[0.6,-0.1039],[0.5429,-0.0195],[0.5,0.0714],[0.3679,0.3896],[0.2964,0.5584],[0.2464,0.6948],[0.2179,0.7857],[0.1929,0.8442],[0.1929,0.8571],[0.1929,0.8571],[0.1929,0.8571],[0.1929,0.8571],[0.1929,0.8571],[0.1929,0.8506]],
  [[0,0],[0,0],[0.0064,-0.0071],[0.0223,-0.0709],[0.051,-0.1348],[0.0796,-0.1986],[0.1274,-0.2624],[0.1815,-0.3333],[0.2516,-0.4043],[0.3121,-0.4468],[0.3758,-0.4823],[0.4363,-0.5035],[0.4904,-0.5035],[0.5414,-0.4894],[0.5892,-0.461],[0.6306,-0.4043],[0.6688,-0.3191],[0.7038,-0.2057],[0.7484,-0.0709],[0.7834,0.0426],[0.8153,0.1631],[0.8408,0.2482],[0.8599,0.3191],[0.8758,0.3546],[0.8854,0.3759],[0.8854,0.383],[0.8854,0.3901],[0.8854,0.3901],[0.8854,0.3901],[0.8854,0.3901],[0.8981,0.3688],[0.9459,0.227],[0.9777,0.1064],[0.9968,-0.0142],[1,-0.1206],[0.9745,-0.2624],[0.9331,-0.383],[0.8885,-0.4681],[0.8439,-0.5319],[0.7803,-0.5816],[0.707,-0.6099],[0.6465,-0.6099],[0.5764,-0.5745],[0.4682,-0.4539],[0.4108,-0.3617],[0.3662,-0.2695],[0.3408,-0.1773],[0.3089,-0.078],[0.293,-0.0355],[0.2834,0],[0.2803,0.0213],[0.2771,0.0355],[0.2739,0.0426],[0.2739,0.0426],[0.2739,0.0426]]
]

export const line:Point[][] = [
  [[0,0],[0,0],[0.0225,0.0357],[0.0594,0.0357],[0.125,0.1071],[0.2131,0.2143],[0.3238,0.3929],[0.4426,0.5357],[0.584,0.7143],[0.6906,0.8214],[0.7807,0.9286],[0.8545,0.9286],[0.918,1],[0.957,1],[0.9877,1],[0.9959,1],[0.998,1],[1,1],[1,1],[1,1],[1,1]],
  [[0,0],[0.0169,-0.0149],[0.0618,-0.0495],[0.1311,-0.104],[0.2397,-0.1931],[0.339,-0.2723],[0.4457,-0.3416],[0.5506,-0.4158],[0.6498,-0.4802],[0.7303,-0.5495],[0.8165,-0.6436],[0.8652,-0.7228],[0.9064,-0.797],[0.9345,-0.8465],[0.9532,-0.8911],[0.9644,-0.9208],[0.9757,-0.9505],[0.985,-0.9703],[0.9925,-0.9851],[1,-1]],
  [[0,0],[0,-0.0087],[0.0345,-0.0292],[0.1379,-0.0641],[0.2414,-0.105],[0.3103,-0.1574],[0.3103,-0.2274],[0.1034,-0.309],[0.069,-0.3878],[0.069,-0.4898],[0.069,-0.5656],[0.069,-0.6385],[0.069,-0.7055],[0.2069,-0.7784],[0.3793,-0.8367],[0.5862,-0.9009],[0.7586,-0.9446],[0.8621,-0.9738],[1,-1]],
  [[0,0],[0,0],[0,-0.0032],[0,-0.0096],[0,-0.0354],[0,-0.074],[0,-0.119],[0,-0.1704],[-0.0144,-0.2315],[-0.0935,-0.3119],[-0.2662,-0.4469],[-0.3741,-0.5466],[-0.5036,-0.6431],[-0.6475,-0.7395],[-0.777,-0.8296],[-0.8561,-0.8939],[-0.9353,-0.9518],[-0.9712,-0.9807],[-1,-1]],
  [[0,0],[0,0],[0,0],[0,0],[-0.0103,-0.0968],[-0.0327,-0.0968],[-0.074,-0.0968],[-0.1549,-0.0968],[-0.2978,-0.2903],[-0.4165,-0.4516],[-0.537,-0.5484],[-0.6695,-0.6129],[-0.7831,-0.7742],[-0.8795,-0.871],[-0.9621,-0.9355],[-0.9914,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
  [[0,0],[0,0],[0,0],[0,-0.0029],[-0.0016,-0.0029],[-0.0175,0.0201],[-0.0557,0.0747],[-0.1242,0.1523],[-0.2118,0.2615],[-0.3631,0.4138],[-0.508,0.5259],[-0.621,0.6379],[-0.7357,0.7557],[-0.836,0.8506],[-0.9188,0.9253],[-1,0.9971],[-1,0.9971],[-1,0.9971],[-1,0.9971]],
  [[0,0],[0,0.0028],[-0.0227,0.0369],[-0.0909,0.1023],[-0.2197,0.2102],[-0.3333,0.3182],[-0.4394,0.4347],[-0.5379,0.5568],[-0.6667,0.6619],[-0.7727,0.7614],[-0.8788,0.8608],[-0.9394,0.9176],[-0.9773,0.9631],[-0.9924,0.9858],[-1,1],[-1,1],[-1,1],[-1,1],[-1,1]],
  [[0,0],[0.0088,0],[0.0354,0.0118],[0.0752,0.0533],[0.1858,0.1716],[0.3009,0.3018],[0.4336,0.4408],[0.5841,0.5858],[0.708,0.7189],[0.8142,0.8254],[0.9159,0.9201],[0.9646,0.9586],[0.9867,0.9822],[1,0.9941],[1,0.997],[1,0.997],[1,0.997],[1,1],[1,1]],
  [[0,0],[0,0],[0,0],[0.0153,0.0091],[0.055,0.0545],[0.1162,0.1545],[0.208,0.2727],[0.3425,0.4364],[0.4495,0.5636],[0.5505,0.6727],[0.6453,0.7818],[0.7217,0.8545],[0.7829,0.9182],[0.844,0.9636],[0.8899,0.9909],[0.9235,1],[0.9541,1],[0.9694,1],[0.9786,1],[0.9908,1],[0.9939,1],[1,1]],
  [[0,0],[0.0071,0],[0.0262,0],[0.0643,-0.012],[0.1238,-0.0361],[0.219,-0.1084],[0.3714,-0.2169],[0.4952,-0.3133],[0.619,-0.4096],[0.731,-0.506],[0.8167,-0.6024],[0.8786,-0.6627],[0.9262,-0.747],[0.95,-0.8072],[0.9643,-0.8554],[0.9762,-0.8916],[0.9857,-0.9277],[0.9929,-0.9518],[1,-0.9759],[1,-1]],
]

export const xline:Point[][] = [
  [[0,0],[0,-0.0288],[0.0119,-0.0865],[0.0375,-0.1731],[0.0652,-0.25],[0.1028,-0.2885],[0.1383,-0.3365],[0.17,-0.3654],[0.2154,-0.3654],[0.2668,-0.3558],[0.2925,-0.3365],[0.3182,-0.3173],[0.332,-0.2885],[0.3439,-0.25],[0.3597,-0.1923],[0.3893,-0.0673],[0.4229,0.0481],[0.4644,0.1827],[0.5119,0.2981],[0.5534,0.4038],[0.587,0.4712],[0.6285,0.5385],[0.6601,0.5865],[0.6937,0.625],[0.7273,0.6346],[0.7589,0.6346],[0.7945,0.625],[0.836,0.5481],[0.8636,0.4615],[0.9209,0.2019],[0.9387,0.1154],[0.9585,0.0192],[0.9704,-0.0288],[0.9783,-0.0673],[0.9842,-0.0769],[0.9941,-0.0865],[0.998,-0.1058],[1,-0.1058],[1,-0.1058]],
[[0,0],[0,0],[0.0043,-0.0043],[0.0064,-0.0086],[0.0085,-0.0259],[0.0107,-0.0431],[0.0214,-0.069],[0.0278,-0.0948],[0.0427,-0.1336],[0.0598,-0.1724],[0.0791,-0.2112],[0.1218,-0.2802],[0.1624,-0.3276],[0.2073,-0.3707],[0.2521,-0.4095],[0.3034,-0.4397],[0.3675,-0.4698],[0.4188,-0.4828],[0.4637,-0.4957],[0.4957,-0.5086],[0.5256,-0.5172],[0.5684,-0.5172],[0.6068,-0.5172],[0.6474,-0.5172],[0.6923,-0.5129],[0.7436,-0.5043],[0.7842,-0.5043],[0.8184,-0.5086],[0.8333,-0.5216],[0.8462,-0.5345],[0.8547,-0.5474],[0.8611,-0.569],[0.8739,-0.6078],[0.8868,-0.6422],[0.9038,-0.694],[0.9209,-0.75],[0.9444,-0.8276],[0.9637,-0.8793],[0.9786,-0.931],[0.9893,-0.9698],[1,-1]],
[[0,0],[0,-0.0032],[0,-0.0065],[0,-0.0226],[0,-0.0419],[0,-0.0613],[0,-0.0839],[-0.0506,-0.1161],[-0.1519,-0.1645],[-0.2785,-0.2129],[-0.4051,-0.271],[-0.519,-0.3323],[-0.5949,-0.3968],[-0.6203,-0.4419],[-0.6203,-0.4742],[-0.5949,-0.5097],[-0.557,-0.5355],[-0.481,-0.5645],[-0.3671,-0.6],[-0.3038,-0.6258],[-0.2278,-0.6452],[-0.1646,-0.6645],[-0.0886,-0.6903],[-0.0253,-0.7161],[0.038,-0.7355],[0.1266,-0.7645],[0.1772,-0.7935],[0.2532,-0.8161],[0.3038,-0.8419],[0.3291,-0.8613],[0.3544,-0.8806],[0.3671,-0.9],[0.3797,-0.9161],[0.3797,-0.9323],[0.3797,-0.9452],[0.3671,-0.9613],[0.3418,-0.971],[0.3165,-0.9774],[0.2785,-0.9871],[0.2658,-0.9935],[0.2532,-1]],
[[0,0],[0,0],[0,0],[-0.0042,0],[-0.0084,0],[-0.0294,0],[-0.063,-0.0109],[-0.105,-0.0327],[-0.1681,-0.0582],[-0.2563,-0.1091],[-0.3235,-0.1636],[-0.3992,-0.2327],[-0.4622,-0.3055],[-0.5084,-0.3636],[-0.5546,-0.44],[-0.5798,-0.4909],[-0.605,-0.5382],[-0.6176,-0.5745],[-0.6261,-0.6036],[-0.6303,-0.6218],[-0.6303,-0.64],[-0.6345,-0.6582],[-0.6345,-0.6727],[-0.6345,-0.6945],[-0.6345,-0.7091],[-0.6471,-0.7382],[-0.6555,-0.76],[-0.6681,-0.7818],[-0.6807,-0.8],[-0.6933,-0.8218],[-0.7059,-0.84],[-0.7185,-0.8545],[-0.7311,-0.8655],[-0.7353,-0.8727],[-0.7479,-0.8836],[-0.7689,-0.8982],[-0.8025,-0.9164],[-0.8361,-0.9309],[-0.8739,-0.9491],[-0.9034,-0.96],[-0.937,-0.9745],[-0.9538,-0.9818],[-0.9622,-0.9855],[-0.9748,-0.9891],[-0.9874,-0.9927],[-1,-1]],
[[0,0],[0,-0.0059],[0,-0.0059],[0,-0.0059],[-0.0036,-0.0118],[-0.0236,-0.0353],[-0.0436,-0.0529],[-0.0655,-0.0824],[-0.0909,-0.1059],[-0.1218,-0.1353],[-0.1764,-0.1765],[-0.2364,-0.2294],[-0.2982,-0.2882],[-0.3545,-0.3588],[-0.4109,-0.4353],[-0.4491,-0.5],[-0.48,-0.5588],[-0.5,-0.6176],[-0.5182,-0.6765],[-0.5309,-0.7235],[-0.5382,-0.7471],[-0.5455,-0.7706],[-0.5509,-0.7941],[-0.5564,-0.8],[-0.5564,-0.8059],[-0.5582,-0.8059],[-0.5618,-0.8059],[-0.5655,-0.8118],[-0.5727,-0.8176],[-0.5836,-0.8353],[-0.6036,-0.8706],[-0.62,-0.8824],[-0.6545,-0.9176],[-0.6927,-0.9529],[-0.72,-0.9824],[-0.7473,-0.9882],[-0.7727,-0.9941],[-0.7964,-1],[-0.8145,-1],[-0.8345,-1],[-0.8527,-1],[-0.8764,-1],[-0.8945,-0.9941],[-0.9073,-0.9765],[-0.9291,-0.9412],[-0.9491,-0.9118],[-0.9691,-0.8765],[-0.9855,-0.8471],[-0.9945,-0.8235],[-1,-0.8059]],
[[0,0],[0,0],[0,0],[0,0],[0,-0.0048],[0,-0.0048],[0,-0.0048],[0,-0.0048],[0,-0.0048],[-0.0019,-0.0048],[-0.0116,-0.0048],[-0.0523,-0.0048],[-0.1085,-0.0048],[-0.1783,-0.0048],[-0.2674,-0.0048],[-0.3624,-0.0048],[-0.4535,-0.0048],[-0.562,-0.0048],[-0.6337,-0.0048],[-0.6919,-0.0048],[-0.7248,0],[-0.7384,0.0145],[-0.7461,0.0338],[-0.7558,0.0628],[-0.7655,0.0966],[-0.7791,0.1546],[-0.7946,0.2174],[-0.814,0.2899],[-0.843,0.3865],[-0.8624,0.4734],[-0.8818,0.5652],[-0.8934,0.6522],[-0.8992,0.7101],[-0.9031,0.7536],[-0.9089,0.7923],[-0.9147,0.8164],[-0.9205,0.8454],[-0.9264,0.8696],[-0.9438,0.8986],[-0.9574,0.9275],[-0.9651,0.942],[-0.9806,0.9662],[-0.9903,0.9807],[-0.9961,0.9903],[-0.9981,0.9952],[-1,0.9952],[-1,0.9952],[-1,0.9952],[-1,0.9952],[-1,0.9952],[-1,0.9952],[-1,0.9952]],
[[0,0],[0,0],[0,0],[0,0],[-0.0026,0],[-0.0026,0],[-0.0053,0],[-0.0106,0.007],[-0.0265,0.0315],[-0.0503,0.0629],[-0.082,0.1119],[-0.1164,0.1608],[-0.172,0.2413],[-0.2169,0.2937],[-0.2566,0.3531],[-0.3095,0.3986],[-0.3492,0.4336],[-0.3915,0.465],[-0.4365,0.507],[-0.4788,0.528],[-0.5132,0.5455],[-0.5397,0.5664],[-0.5582,0.5804],[-0.5741,0.5944],[-0.5952,0.6154],[-0.619,0.6469],[-0.6481,0.6748],[-0.6931,0.7238],[-0.7275,0.7727],[-0.7593,0.8147],[-0.7884,0.8636],[-0.8175,0.9126],[-0.8439,0.9441],[-0.8598,0.958],[-0.8783,0.979],[-0.8915,0.9895],[-0.9021,0.9965],[-0.9101,1],[-0.9233,1],[-0.9339,1],[-0.9524,0.9965],[-0.9709,0.993],[-0.9894,0.979],[-0.9974,0.9755],[-1,0.972],[-1,0.972],[-1,0.972],[-1,0.972],[-1,0.972]],
[[0,0],[0,0],[0,0.0055],[0,0.0166],[0.0111,0.0304],[0.0333,0.0552],[0.0778,0.0829],[0.1611,0.1243],[0.2556,0.1657],[0.3333,0.2017],[0.4111,0.2348],[0.4667,0.2845],[0.5111,0.3232],[0.5444,0.3702],[0.5611,0.4116],[0.5611,0.4558],[0.5611,0.5],[0.55,0.547],[0.5389,0.5856],[0.5278,0.6215],[0.5222,0.6602],[0.5222,0.6878],[0.5222,0.7182],[0.5222,0.7486],[0.5278,0.7818],[0.55,0.8149],[0.5778,0.8536],[0.6389,0.884],[0.7111,0.9144],[0.7611,0.9337],[0.8111,0.953],[0.8778,0.9751],[0.9333,0.9862],[0.9722,0.9972],[0.9944,1],[0.9944,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],
[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0.0088,0.0164],[0.033,0.0451],[0.0793,0.082],[0.1454,0.1311],[0.2291,0.1885],[0.3106,0.2541],[0.3965,0.3197],[0.5088,0.4016],[0.5859,0.4672],[0.6476,0.5246],[0.6828,0.5697],[0.7026,0.6107],[0.7115,0.6311],[0.7225,0.6639],[0.7313,0.709],[0.7423,0.7418],[0.7533,0.7787],[0.7621,0.8074],[0.7665,0.8402],[0.7731,0.8607],[0.7819,0.877],[0.7907,0.8975],[0.804,0.918],[0.8216,0.9385],[0.8436,0.9631],[0.8744,0.9836],[0.9163,0.9959],[0.9471,1],[0.9692,1],[0.9912,1],[0.9978,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],
[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.004,0],[-0.0302,-0.0197],[-0.0927,-0.0592],[-0.1613,-0.0987],[-0.2278,-0.125],[-0.2681,-0.125],[-0.3024,-0.125],[-0.3286,-0.125],[-0.3488,-0.1053],[-0.371,-0.0789],[-0.3871,-0.0329],[-0.3992,0.0132],[-0.4133,0.0724],[-0.4274,0.1447],[-0.4415,0.2105],[-0.4597,0.3026],[-0.4758,0.3618],[-0.494,0.4211],[-0.5121,0.4671],[-0.5302,0.5],[-0.5484,0.5263],[-0.5605,0.5461],[-0.5786,0.5724],[-0.5927,0.5855],[-0.6069,0.6053],[-0.619,0.625],[-0.6411,0.6579],[-0.6774,0.6974],[-0.7137,0.7303],[-0.7621,0.7632],[-0.8367,0.8158],[-0.8891,0.8421],[-0.9274,0.8684],[-0.9718,0.875],[-0.9919,0.875],[-0.996,0.875],[-0.996,0.875],[-0.998,0.875],[-0.998,0.875],[-0.998,0.875],[-0.998,0.875],[-1,0.875],[-1,0.875]]
]

export function crossProduct2D(a: [number,number], b: [number,number]): number {  
    return a[0] * b[1] - a[1] * b[0];  
}  