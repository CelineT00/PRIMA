namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let character: ƒ.Node;
  let sonic: ƒ.Node;
  let gravity: number = -9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  // document.addEventListener("keydown",hndKeyboard);



  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    character = viewport.getBranch().getChildrenByName("Character")[0];
    sonic = character.getChildrenByName("Sonicc")[0];

    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;




    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    followCamera();
    movement();
    viewport.draw();
    addAudio();
    ƒ.AudioManager.default.update();
  }

  function movement(): void {
    let timeFrame: number = ƒ.Loop.timeFrameGame / 1000;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
      sonic.mtxLocal.rotation = ƒ.Vector3.Y(0);
      sonic.mtxLocal.translateX(2 * timeFrame);
      changeAnimation("SonicRun");
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
      sonic.mtxLocal.rotation = ƒ.Vector3.Y(180);
      sonic.mtxLocal.translateX(2 * timeFrame);
      changeAnimation("SonicRun");
    }
    else {
      changeAnimation("SonicIdle");
    }
    if (isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      addAudioSound("Jump.mp3");
      ySpeed = 3;
      isGrounded = false;
    }

    ySpeed += gravity * timeFrame;
    let pos: ƒ.Vector3 = sonic.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    let tileCollided: ƒ.Node = checkCollision(pos);
    if (tileCollided) {
      ySpeed = 0;
      pos.y = tileCollided.mtxWorld.translation.y + 0.65;
      isGrounded = true;
    }
    sonic.mtxLocal.translation = pos;


    viewport.draw();
    // ƒ.AudioManager.default.update();
  }



  function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren();
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.65 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
    }

    return null;
  }

  function changeAnimation(_animation: string): void {
    let currentAnim: ƒ.AnimationSprite = sonic.getComponent(ƒ.ComponentAnimator).animation as ƒ.AnimationSprite;
    const newAnim: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_animation)[0] as ƒ.AnimationSprite;
    if (currentAnim != newAnim) {
      sonic.getComponent(ƒ.ComponentAnimator).animation = newAnim;
      if(_animation == "SonicRun"){
        addAudioSound("HYUNJIN_MEOW.mp3");
      }
      if (_animation == "SonicJump") {
        
      }
    }
  }

  function followCamera() {
    let pos: ƒ.Vector3 = sonic.mtxLocal.translation;
    pos.z = viewport.camera.mtxPivot.translation.z;
    viewport.camera.mtxPivot.translation = pos;
  }

  function addAudio() {
    let audioListener: ƒ.ComponentAudioListener = viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
    ƒ.AudioManager.default.listenWith(audioListener);
    ƒ.AudioManager.default.listenTo(viewport.getBranch());

  }

  function addAudioSound(_audio: string) {
    const newAudio = ƒ.Project.getResourcesByName(_audio)[0] as ƒ.Audio;
    let audio = viewport.getBranch().getChildrenByName("Sounds")[0].getComponent(ƒ.ComponentAudio);
    audio.setAudio(newAudio);
    audio.play(true);
  }

}
