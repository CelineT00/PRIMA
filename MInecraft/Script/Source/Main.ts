namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let blocks: ƒ.Node
  export let grid3D: Block[][][] = [];
  export let gridAssoc: { [pos: string]: Block } = {};
  export let steve: ƒ.Node;
  let config: {[key: string]: number}; 
  let isGrounded: boolean = false;

  enum MINECRAFT {
    STEVE_COLLIDES = "steveCollides"
  }

  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: Event): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    console.log(config);

    let gamestate: Gamestate = new Gamestate();
    console.log(gamestate);

    viewport = (<CustomEvent>_event).detail;
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    viewport.canvas.addEventListener("contextmenu", _event => _event.preventDefault());

    generateWorld(10, 3, 9);

    let pickAlgorithm = [pickByComponent, pickByCamera, pickByRadius, pickByGrid];

    viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
    viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);
    viewport.getBranch().addEventListener(MINECRAFT.STEVE_COLLIDES, (_event: Event) => console.log(_event));

    setupSteve();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    controlSteve();

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setupSteve(): void {
    // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
    steve = viewport.getBranch().getChildrenByName("Steve")[0];
    console.log(steve);
    viewport.camera = steve.getChild(0).getComponent(ƒ.ComponentCamera);
    let cmpRigidbody: ƒ.ComponentRigidbody = steve.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.effectRotation = ƒ.Vector3.Y();
    cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, steveCollides);
  }

  function controlSteve(): void {
    let cmpRigidbody: ƒ.ComponentRigidbody = steve.getComponent(ƒ.ComponentRigidbody);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
      cmpRigidbody.applyTorque(ƒ.Vector3.Y(config.torque));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
      cmpRigidbody.applyTorque(ƒ.Vector3.Y(-config.torque));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
      cmpRigidbody.applyForce(ƒ.Vector3.SCALE(steve.mtxWorld.getZ(), config.force));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
      cmpRigidbody.applyForce(ƒ.Vector3.SCALE(steve.mtxWorld.getZ(), -config.force));

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && isGrounded) {
      cmpRigidbody.addVelocity(ƒ.Vector3.Y(5));
      isGrounded = false;
    }
  }

  function steveCollides(_event: ƒ.EventPhysics): void {
    // let vctCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, steve.mtxWorld.translation);
    //if (Math.abs(vctCollision.x) < 0.1 && Math.abs(vctCollision.z) < 0.1 && vctCollision.y < 0) // collision below steve
    isGrounded = true;
    let customEvent: CustomEvent = new CustomEvent(MINECRAFT.STEVE_COLLIDES, { bubbles: true, detail: steve.mtxWorld.translation })
    steve.dispatchEvent(customEvent);
  }

  function generateWorld(_width: number, _height: number, _depth: number): void {
    blocks = new ƒ.Node("Blocks");
    viewport.getBranch().addChild(blocks);
    // let vctOffset: ƒ.Vector2 = new ƒ.Vector2(Math.floor(_width / 2), Math.floor(_depth / 2));
    let vctOffset: ƒ.Vector2 = ƒ.Vector2.ZERO();

    for (let y: number = 0; y < _height; y++) {
      grid3D[y] = [];
      for (let z: number = 0; z < _depth; z++) {
        grid3D[y][z] = [];
        for (let x: number = 0; x < _width; x++) {
          let vctPosition: ƒ.Vector3 = new ƒ.Vector3(x - vctOffset.x, y + Math.random() * 0.2, z - vctOffset.y);
          let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
          createBlock(vctPosition, txtColor);
        }
      }
    }
    console.log(gridAssoc);
  }

  export function createBlock(_vctPosition: ƒ.Vector3, _txtColor: string): void {
    let block: Block = new Block(_vctPosition, ƒ.Color.CSS(_txtColor));
    block.name = _vctPosition.toString() + "|" + _txtColor;
    // console.log(block.name);
    blocks.addChild(block);
    gridAssoc[_vctPosition.toString()] = block;
    try {
      grid3D[_vctPosition.y][_vctPosition.z][_vctPosition.x] = block;
    } catch (_e) { }
  }
}


