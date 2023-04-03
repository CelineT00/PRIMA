namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let character: ƒ.Node;
  let sonic: ƒ.Node;
  let gravity: number =-9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  document.addEventListener("keydown",hndKeyboard);

  

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    
    character = viewport.getBranch().getChildrenByName("Character")[0];
    sonic = character.getChildren("Sonicc")[0];

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
      sonic.mtxLocal.rotation = ƒ.Vector3.Y(0);
    //if(_event.code == "ArrowRight" || _event.code == "KeyD"){
      sonic.mtxLocal.translateX(2 * timeFrame);
    } else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      sonic.mtxLocal.rotation = ƒ.Vector3.Y(180);
      sonic.mtxLocal.translateX(2 * timeFrame);
    }
    if(isGrounded = true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      ySpeed = 3;
      isGrounded = false;
    }


    ySpeed+=gravity* timeFrame;
    let pos: ƒ.Vector3 = character.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;
    if(pos.y < 0){
      ySpeed = 0;
      pos.y = 0;
    }

    character.mtxLocal.translation  = pos;
  }


  function hndKeyboard(_event: KeyboardEvent){
    console.log(_event);
  }

  function checkCollision(): void {
    graph = viewport.getBranch();
    let floors: ƒ.Node = graph.getChildrenByName("Terrain")[0];
    let pos: ƒ.Vector3 = sonic.mtxLocal.translation;
    for (let floor of floors.getChildren()) {
      let posFloor: ƒ.Vector3 = floor.mtxLocal.translation;
      if (Math.abs(pos.x - posFloor.x) < 0.5) {
        if (pos.y < posFloor.y + 0.01) {
          pos.y = posFloor.y + 0.01;
          sonic.mtxLocal.translation = pos;
          ySpeed = 0;

        }
      }
    }
  }
}
