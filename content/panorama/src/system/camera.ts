
export const easing: IEasingMap = {
    // No easing, no acceleration
    linear: (t) => t,
  
    // Accelerates fast, then slows quickly towards end.
    quadratic: (t) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4),
  
    // Overshoots over 1 and then returns to 1 towards end.
    cubic: (t) => t * (4 * t * t - 9 * t + 6),
  
    // Overshoots over 1 multiple times - wiggles around 1.
    elastic: (t) => t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15),
  
    // Accelerating from zero velocity
    inQuad: (t) => t * t,
  
    // Decelerating to zero velocity
    outQuad: (t) => t * (2 - t),
  
    // Acceleration until halfway, then deceleration
    inOutQuad: (t) => t <.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
    // Accelerating from zero velocity
    inCubic: (t) => t * t * t,
  
    // Decelerating to zero velocity
    outCubic: (t) => (--t) * t * t + 1,
  
    // Acceleration until halfway, then deceleration
    inOutCubic: (t) => t <.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
    // Accelerating from zero velocity
    inQuart: (t) => t * t * t * t,
  
    // Decelerating to zero velocity
    outQuart: (t) => 1 - (--t) * t * t * t,
  
    // Acceleration until halfway, then deceleration
    inOutQuart: (t) => t <.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  
    // Accelerating from zero velocity
    inQuint: (t) => t * t * t * t * t,
  
    // Decelerating to zero velocity
    outQuint: (t) => 1 + (--t) * t * t * t * t,
  
    // Acceleration until halfway, then deceleration
    inOutQuint: (t) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  
    // Accelerating from zero velocity
    inSine: (t) => -Math.cos(t * (Math.PI / 2)) + 1,
  
    // Decelerating to zero velocity
    outSine: (t) => Math.sin(t * (Math.PI / 2)),
  
    // Accelerating until halfway, then decelerating
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  
    // Exponential accelerating from zero velocity
    inExpo: (t) => Math.pow(2, 10 * (t - 1)),
  
    // Exponential decelerating to zero velocity
    outExpo: (t) => -Math.pow(2, -10 * t) + 1,
  
    // Exponential accelerating until halfway, then decelerating
    inOutExpo: (t) => {
      t /= .5;
      if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
      t--;
      return (-Math.pow( 2, -10 * t) + 2) / 2;
    },
  
    // Circular accelerating from zero velocity
    inCirc: (t) => -Math.sqrt(1 - t * t) + 1,
  
    // Circular decelerating to zero velocity Moves VERY fast at the beginning and
    // then quickly slows down in the middle. This tween can actually be used
    // in continuous transitions where target value changes all the time,
    // because of the very quick start, it hides the jitter between target value changes.
    outCirc: (t) => Math.sqrt(1 - (t = t - 1) * t),
  
    // Circular acceleration until halfway, then deceleration
    inOutCirc: (t) => {
      t /= .5;
      if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
      t -= 2;
      return (Math.sqrt(1 - t * t) + 1) / 2;
    }
  };

function DefualtStateCallBack(){
    GameUI.SetCameraTargetPosition(Entities.GetAbsOrigin(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())),0.8)
    GameUI.SetCameraDistance(1700)
}

export class CameraSequcenManager{
    

    constructor(
        public initCameraDistance:number = 1700
    ){
        GameEvents.Subscribe("send_camera_sequcen",(event)=>{
            this.route(event);
        })
    }

    async route(event:CustomGameEventDeclarations["send_camera_sequcen"]){
        GameUI.SetCameraTerrainAdjustmentEnabled(false)
        let back_height = 0;
        let cur_camera = GameUI.GetCameraLookAtPosition();
        for await(let data of Object.values(event)){
            if(back_height == 0){
                back_height = this.initCameraDistance;
            }
            let to:Function
            let all_call:Function
            if(data.target) 
                to = (timing:number) => this.to_target(cur_camera,data.target!,data.duration,easing[data.Easing],timing)
            if(data.position)
                to = (timing:number) => this.to_position(cur_camera,[data.position!.x,data.position!.y,data.position!.z],data.duration,easing[data.Easing],timing);
           
            GameEvents.SendCustomGameEventToServer(data.call_back_event_name,{height:back_height,cur_camera:cur_camera,state:"start"});
            all_call = function(this:CameraSequcenManager){ 
                let cur_height = back_height - data.height
                return new Promise((res,rej)=>{
                    this.timer(data.duration,(timing)=>{
                        to(timing);
                        this.to_height(back_height -  (1 - easing[data.Easing] (timing / data.duration)) * cur_height);
                        if(timing <= 0){
                            res(true)
                            return true;
                        }else{
                            return false;
                        }
                    })
                })
            }
            await all_call!.bind(this)();
            await this.delay(data.await)
            back_height = data.height;
            cur_camera = GameUI.GetCameraLookAtPosition();
            GameEvents.SendCustomGameEventToServer(data.call_back_event_name,{height:back_height,cur_camera:cur_camera,state:"end"});
        }
        GameUI.SetCameraTerrainAdjustmentEnabled(true)
    }

    delay(time:number):Promise<undefined>{
        return new Promise((res,rej)=>{
            $.Schedule(time,()=>{
                res(undefined)
            })
        })
    }

    timer(timing:number,callback:(spend_time:number)=>boolean){
        $.Schedule(Game.GetGameFrameTime(),async ()=>{
            const cur = timing - Game.GetGameFrameTime();
            const result = callback(cur);
            if(result){
                return true;
            }else{
                this.timer(cur,callback)
            }
        })
    }

    to_height(height:number){
        GameUI.SetCameraDistance(height);
    }

    async to_target(start_point:[number,number,number],target:EntityIndex,duration:number,easing:(t:number)=>number,timing:number){
        const target_points = Entities.GetAbsOrigin(target);
        const dis = target_points.map((elm,index)=> start_point[index] - (start_point[index] - elm) * (1 - easing( timing / duration))) as [number,number,number]
        GameUI.SetCameraTargetPosition(target_points,easing(timing / duration));
    }

    async to_position(start_point:[number,number,number],position:[number,number,number],duration:number,easing:(t:number)=>number,timing:number){
        const dis = position.map((elm,index)=> start_point[index] - (start_point[index] - elm) * (1 - easing( timing / duration))) as [number,number,number]
        $.Msg(dis)
        GameUI.SetCameraTargetPosition(dis,-0.1);
    }

}

const cameraManager = new CameraSequcenManager();