declare type TEasing = (time: number) => number;

declare interface IEasingMap {
  linear: TEasing;
  quadratic: TEasing;
  cubic: TEasing;
  elastic: TEasing;
  inQuad: TEasing;
  outQuad: TEasing;
  inOutQuad: TEasing;
  inCubic: TEasing;
  outCubic: TEasing;
  inOutCubic: TEasing;
   inQuart: TEasing;
  outQuart: TEasing;
  inOutQuart: TEasing;
  inQuint: TEasing;
  outQuint: TEasing;
  inOutQuint: TEasing;
  inSine: TEasing;
  outSine: TEasing;
  inOutSine: TEasing;
  inExpo: TEasing;
  outExpo: TEasing;
  inOutExpo: TEasing;
  inCirc: TEasing;
  outCirc: TEasing;
  inOutCirc: TEasing;
}

//把这个事件写进CustomGameEventDeclarations合起来就行
declare interface CustomGameEventDeclarations {
    send_camera_sequcen:CameraSequcen
}

declare type CameraSequcen = Record<number,CameraSequenceData>

declare interface CameraSequenceData{
    /**追踪目标 */
    target?:EntityIndex,
    /**追踪坐标点 */
    position?:{x:number,y:number,z:number},
    call_back_event_name:string,
    height:number,
    Easing:keyof Partial<IEasingMap>,
    duration:number,
    await:number,
}