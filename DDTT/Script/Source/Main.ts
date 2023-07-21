namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let character: ƒ.Node;
  export let ket: ƒ.Node;
  export let opponent: ƒ.Node;
  export let opponentDoggo: ƒ.Node;
  export let opponents: ƒ.Node;
  export let gravity: number = -9.81;
  export let ySpeed: number = 0;
  export let isGrounded: boolean = true;
  export let vui: VisualUi;
  let stateMachine: actions;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent):Promise <void> {
    let response = await fetch("config.json");
    let config = await response.json();
    viewport = _event.detail;
    character = viewport.getBranch().getChildrenByName("Character")[0];
    
    opponents= viewport.getBranch().getChildrenByName("Gegner")[0];
    opponent= opponents.getChildrenByName("Gegner1")[0];
    opponentDoggo= opponents.getChildrenByName("Gegner2")[0];
  
    ket = character.getChildrenByName("Ket")[0];
    stateMachine = new actions();

    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    vui = new VisualUi(config);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    followCamera();
    movement();
    viewport.draw();
    addAudio();
    ƒ.AudioManager.default.update();
  }

  function followCamera() {
    let pos: ƒ.Vector3 = ket.mtxLocal.translation;
    pos.z = viewport.camera.mtxPivot.translation.z;
    viewport.camera.mtxPivot.translation = pos;
  }

  export function addAudio() {
    let audioListener: ƒ.ComponentAudioListener = viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
    ƒ.AudioManager.default.listenWith(audioListener);
    ƒ.AudioManager.default.listenTo(viewport.getBranch());

  }

  export function addAudioSound(_audio: string) {
    const newAudio = ƒ.Project.getResourcesByName(_audio)[0] as ƒ.Audio;
    let audio = viewport.getBranch().getChildrenByName("Sounds")[0].getComponent(ƒ.ComponentAudio);
    audio.setAudio(newAudio);
    audio.play(true);
  }
}
