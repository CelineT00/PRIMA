namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sonic: ƒ.Node;
  let charactersonic: ƒ.Node;
  let gravity: number =-9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  document.addEventListener("keydown",hndKeyboard);

  

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    
    sonic = viewport.getBranch().getChildrenByName("Character")[0];
    charactersonic = sonic.getChildren("Sonicc")[0];

    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    movement();
    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

  function movement():void {
    let timeFrame: number = ƒ.Loop.timeFrameGame/ 1000;
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      charactersonic.mtxLocal.rotation = ƒ.Vector3.Y(0);
    //if(_event.code == "ArrowRight" || _event.code == "KeyD"){
      charactersonic.mtxLocal.translateX(2 * timeFrame);
    } else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      charactersonic.mtxLocal.rotation = ƒ.Vector3.Y(180);
      charactersonic.mtxLocal.translateX(2 * timeFrame);
    }
    if(isGrounded = true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      ySpeed = 3;
      isGrounded = false;
    }


    ySpeed+=gravity* timeFrame;
    let pos: ƒ.Vector3 = sonic.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;
    if(pos.y < 0){
      ySpeed = 0;
      pos.y = 0;
    }

    sonic.mtxLocal.translation  = pos;
  }


  function hndKeyboard(_event: KeyboardEvent){
    console.log(_event);
  }
}
