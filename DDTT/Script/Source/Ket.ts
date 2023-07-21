namespace Script {
    import ƒ = FudgeCore;
    export let points: number = 0;
    ƒ.Debug.info("Main Program Template running!");

    export function movement(): void {
      let timeFrame: number = ƒ.Loop.timeFrameGame / 1000;
      let run: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
        if(run == true){
          ket.mtxLocal.rotation = ƒ.Vector3.Y(0);
          ket.mtxLocal.translateX(4 * timeFrame);
          changeAnimation("KetRun");
        }
        else{
          ket.mtxLocal.rotation = ƒ.Vector3.Y(0);
        ket.mtxLocal.translateX(2 * timeFrame);
        changeAnimation("KetWalk");
        }
      } 
      else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
        if(run == true){
          ket.mtxLocal.rotation = ƒ.Vector3.Y(180);
        ket.mtxLocal.translateX(4 * timeFrame);
        changeAnimation("KetRun");
        }
        else{
          ket.mtxLocal.rotation = ƒ.Vector3.Y(180);
        ket.mtxLocal.translateX(2 * timeFrame);
        changeAnimation("KetWalk");
        }
        
      }
      else{
        changeAnimation("KetIdle");
      }
      if (isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
        isGrounded = false; 
        ySpeed = 7;
        if(isGrounded == false){
          changeAnimation("KetJump");
        }
      }
      ySpeed += gravity * timeFrame;
      let pos: ƒ.Vector3 = ket.mtxLocal.translation;
      pos.y += ySpeed * timeFrame;
  
      
      let tileCollided: ƒ.Node = checkCollision(pos);
      if (tileCollided) {
        ySpeed = 0;
        pos.y = tileCollided.mtxWorld.translation.y + 1;
        isGrounded = true;
      }

      checkCollisionWithFood(pos);
      
      ket.mtxLocal.translation = pos;
      viewport.draw();
    }
  
    export function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node {
      let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildrenByName("BodenTeil1")[0].getChildren();
      for (let tile of tiles) {
        let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
        if (pos.y < 1 && pos.x > -0.5 && pos.x < 0.5){
          if(pos.y < -1){
            isGrounded = false;
            break;
          }
          else{
            isGrounded = true;
            return tile;

          }

        } 
      }
      isGrounded = false;
      return null;
    }
  
  
  
    export function changeAnimation(_animation: string): void {
      let currentAnim: ƒ.AnimationSprite = ket.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
      const newAnim: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animation)[0] as ƒ.AnimationSprite;
      if (currentAnim != newAnim) {
        ket.getComponent(ƒ.ComponentAnimator).animation = newAnim;
        if(_animation == "KetRun"){
          
        }
        if (_animation == "KetJump") {
          addAudioSound("jump.mp3");
        }
      }
    }

    export function checkCollisionWithFood(_posWorld: ƒ.Vector3): ƒ.Node {
      let foods: ƒ.Node[] = viewport.getBranch().getChildrenByName("Collectibles")[0].getChildren()
      for (let food of foods) {
        let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, food.mtxWorldInverse, true);
        if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6){
          if(pos.y < -1) {
            break;
          }
          else {
            viewport.getBranch().getChildrenByName("Collectibles")[0].removeChild(food);
            vui.points++;
            addAudioSound("food.mp3");
            return food;
          }
        }
      }
      return null;
    }

}