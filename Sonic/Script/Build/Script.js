"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let character;
    let sonic;
    let gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    document.addEventListener("interactiveViewportStarted", start);
    // document.addEventListener("keydown",hndKeyboard);
    function start(_event) {
        viewport = _event.detail;
        character = viewport.getBranch().getChildrenByName("Character")[0];
        sonic = character.getChildrenByName("Sonicc")[0];
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        followCamera();
        movement();
        viewport.draw();
        addAudio();
        //ƒ.AudioManager.default.update();
    }
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            sonic.mtxLocal.rotation = ƒ.Vector3.Y(0);
            sonic.mtxLocal.translateX(2 * timeFrame);
            changeAnimation("SonicRun");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
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
        let pos = sonic.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        let tileCollided = checkCollision(pos);
        if (tileCollided) {
            ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 0.65;
            isGrounded = true;
        }
        sonic.mtxLocal.translation = pos;
        viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    function checkCollision(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren();
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.65 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
        }
        return null;
    }
    function changeAnimation(_animation) {
        let currentAnim = sonic.getComponent(ƒ.ComponentAnimator).animation;
        const newAnim = ƒ.Project.getResourcesByName(_animation)[0];
        if (currentAnim != newAnim) {
            sonic.getComponent(ƒ.ComponentAnimator).animation = newAnim;
            if (_animation == "SonicRun") {
                addAudioSound("HYUNJIN_MEOW.mp3");
            }
            if (_animation == "SonicJump") {
            }
        }
    }
    function followCamera() {
        let pos = sonic.mtxLocal.translation;
        pos.z = viewport.camera.mtxPivot.translation.z;
        viewport.camera.mtxPivot.translation = pos;
    }
    function addAudio() {
        let audioListener = viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
        ƒ.AudioManager.default.listenWith(audioListener);
        ƒ.AudioManager.default.listenTo(viewport.getBranch());
    }
    function addAudioSound(_audio) {
        const newAudio = ƒ.Project.getResourcesByName(_audio)[0];
        let audio = viewport.getBranch().getChildrenByName("Sounds")[0].getComponent(ƒ.ComponentAudio);
        audio.setAudio(newAudio);
        audio.play(true);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map