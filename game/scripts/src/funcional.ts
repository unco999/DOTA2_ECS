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

