type Matcher<T> = (value: T) => boolean;  
type Handler<T, R> = (value: T) => R | undefined;  
type MatchPattern<T, R> = {  
  when: Matcher<T>;  
  then: Handler<T, R>;
  test: string;
};  
  
export function matchObject<T, R>(tile:string,obj: T, patterns: MatchPattern<T, R>[]): R | undefined {
  print("[ecs] matchObject matched :",tile," ==> called");
  for (const pattern of patterns) {  
    if (pattern.when(obj)) { 
      print("[ecs] matchObject matched :",pattern.test," ==> ok");
      return pattern.then(obj);  
    }  
  }  
    
  print("[ecs] matchObject failed to match :",obj);
  return undefined;  
}

//将数组内元素22配对
export function pairElements(arr: any[]): [any, any][] {  
  const pairs: [any, any][] = [];  
  const seen = new Set<any>();  
  
  for (let i = 0; i < arr.length; i++) {  
    const element = arr[i];  
    if (seen.has(element)) {  
      // 如果元素已经被配对过，则跳过  
      continue;  
    }  
  
    for (let j = i + 1; j < arr.length; j++) {  
      const potentialPair = arr[j];  
      if (!seen.has(potentialPair)) {  
        // 如果潜在配对元素还未被配对过，则进行配对  
        pairs.push([element, potentialPair]);  
        seen.add(element);  
        seen.add(potentialPair);  
        break; // 配对后跳出内层循环  
      }  
    }  
  }  
  
  return pairs;  
}  
  

export function findFarthestFivePoints(points: Vector[],count:number): Vector[] {  
  // 初始化已选坐标集合  
  const selectedPoints: Vector[] = [];  
  
  // 当已选坐标数量小于5时，继续选择  
  while (selectedPoints.length < count) {  
    // 初始化最远坐标和最远距离  
    let farthestPoint: Vector | null = null;  
    let maxDistance = -1;  
  
    // 遍历剩余坐标，找到与已选坐标集合中最远的坐标  
    for (const point of points) {  
      if (!selectedPoints.includes(point)) {  
        let currentDistance = -1;  
        for (const selectedPoint of selectedPoints) {  
          const dist = point.__sub(selectedPoint).Length2D();  
          if (dist > currentDistance) {  
            currentDistance = dist;  
          }  
        }  
        if (currentDistance > maxDistance) {  
          maxDistance = currentDistance;  
          farthestPoint = point;  
        }  
      }  
    }  
  
    // 如果找到了最远坐标，则添加到已选坐标集合中  
    if (farthestPoint) {  
      selectedPoints.push(farthestPoint);  
      // 从剩余坐标中移除已选择的坐标  
      const index = points.indexOf(farthestPoint);  
      if (index !== -1) {  
        points.splice(index, 1);  
      }  
    } else {  
      // 如果没有找到新的最远坐标，则跳出循环  
      break;  
    }  
  }  
  
  return selectedPoints;  
}  

export function areAllStringsUnique(arr: string[]): boolean {  
  const uniqueStrings = new Set<string>();  

  for (const str of arr) {  
      if (uniqueStrings.has(str)) {  
          // 如果集合中已经存在这个字符串，说明有重复的  
          return false;  
      }  
      uniqueStrings.add(str);  
  }  

  // 如果遍历完数组后没有发现重复，说明每个字符串都是唯一的  
  return uniqueStrings.size === arr.length;  
}  

export function calculateCenter(coordinates: { x: number; y: number }[]): { x: number; y: number } {  
  let sumX = 0;  
  let sumY = 0;  
  let count = 0;  

  // 遍历坐标数组，累加x和y的值  
  for (const { x, y } of coordinates) {  
      sumX += Number(x);  
      sumY += Number(y);  
      print(sumX)
      print(Number(x))
      count++;  
  }  

  // 计算平均值得到中心点坐标  
  const centerX = sumX / count;  
  const centerY = sumY / count;  


  // 返回中心点坐标  
  return { x: centerX, y: centerY };  
}  

// 示例使用  
const coords: { x: number; y: number }[] = [  
  { x: 1, y: 2 },  
  { x: 3, y: 4 },  
  // ... 添加更多坐标点  
  { x: 5, y: 6 }  
];  


export function isPointsLikeACircle(points: { x: number; y: number }[],bias:number) {  
    // 计算质心  
    const centroid = calculateCentroid(points);  
      
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
function calculateCentroid(points: { x: number; y: number }[]): { x: number; y: number } {  
    let sumX = 0;  
    let sumY = 0;  
    const count = points.length;  
  
    for (const { x, y } of points) {  
        sumX += x;  
        sumY += y;  
    }  
  
    const centroidX = sumX / count;  
    const centroidY = sumY / count;  
  
    return { x: centroidX, y: centroidY };  
}  
  
// 计算两点之间的欧几里得距离  
function calculateDistance(pointA: { x: number; y: number }, pointB: { x: number; y: number }): number {  
    const dx = pointA.x - pointB.x;  
    const dy = pointA.y - pointB.y;  
    return Math.sqrt(dx * dx + dy * dy);  
}  
  
// 计算一组数值的标准差  
function calculateStandardDeviation(values: number[]): number {  
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;  
    const squaredDiffSum = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);  
    const variance = squaredDiffSum / (values.length - 1);  
    return Math.sqrt(variance);  
}  

  