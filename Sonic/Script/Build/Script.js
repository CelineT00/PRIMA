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
    let graph;
    let character;
    let sonic;
    let gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    document.addEventListener("interactiveViewportStarted", start);
    document.addEventListener("keydown", hndKeyboard);
    function start(_event) {
        viewport = _event.detail;
        character = viewport.getBranch().getChildrenByName("Character")[0];
        sonic = character.getChildren("Sonicc")[0];
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        movement();
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            sonic.mtxLocal.rotation = ƒ.Vector3.Y(0);
            //if(_event.code == "ArrowRight" || _event.code == "KeyD"){
            sonic.mtxLocal.translateX(2 * timeFrame);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            sonic.mtxLocal.rotation = ƒ.Vector3.Y(180);
            sonic.mtxLocal.translateX(2 * timeFrame);
        }
        if (isGrounded = true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            ySpeed = 3;
            isGrounded = false;
        }
        ySpeed += gravity * timeFrame;
        let pos = character.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        if (pos.y < 0) {
            ySpeed = 0;
            pos.y = 0;
        }
        character.mtxLocal.translation = pos;
    }
    function hndKeyboard(_event) {
        console.log(_event);
    }
    function checkCollision() {
        graph = viewport.getBranch();
        let floors = graph.getChildrenByName("Terrain")[0];
        let pos = sonic.mtxLocal.translation;
        for (let floor of floors.getChildren()) {
            let posFloor = floor.mtxLocal.translation;
            if (Math.abs(pos.x - posFloor.x) < 0.5) {
                if (pos.y < posFloor.y + 0.01) {
                    pos.y = posFloor.y + 0.01;
                    sonic.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map