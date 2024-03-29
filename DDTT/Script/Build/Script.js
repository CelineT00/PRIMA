"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    Script.points = 0;
    ƒ.Debug.info("Main Program Template running!");
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        let run = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            if (run == true) {
                Script.ket.mtxLocal.rotation = ƒ.Vector3.Y(0);
                Script.ket.mtxLocal.translateX(4 * timeFrame);
                changeAnimation("KetRun");
            }
            else {
                Script.ket.mtxLocal.rotation = ƒ.Vector3.Y(0);
                Script.ket.mtxLocal.translateX(2 * timeFrame);
                changeAnimation("KetWalk");
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            if (run == true) {
                Script.ket.mtxLocal.rotation = ƒ.Vector3.Y(180);
                Script.ket.mtxLocal.translateX(4 * timeFrame);
                changeAnimation("KetRun");
            }
            else {
                Script.ket.mtxLocal.rotation = ƒ.Vector3.Y(180);
                Script.ket.mtxLocal.translateX(2 * timeFrame);
                changeAnimation("KetWalk");
            }
        }
        else {
            changeAnimation("KetIdle");
        }
        if (Script.isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            Script.isGrounded = false;
            Script.ySpeed = 7;
            if (Script.isGrounded == false) {
                changeAnimation("KetJump");
            }
        }
        Script.ySpeed += Script.gravity * timeFrame;
        let pos = Script.ket.mtxLocal.translation;
        pos.y += Script.ySpeed * timeFrame;
        let tileCollided = checkCollision(pos);
        if (tileCollided) {
            Script.ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 1;
            Script.isGrounded = true;
        }
        checkCollisionWithFood(pos);
        Script.ket.mtxLocal.translation = pos;
        Script.viewport.draw();
    }
    Script.movement = movement;
    function checkCollision(_posWorld) {
        let tiles = Script.viewport.getBranch().getChildrenByName("Terrain")[0].getChildrenByName("BodenTeil1")[0].getChildren();
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 1 && pos.x > -0.5 && pos.x < 0.5) {
                if (pos.y < -1) {
                    Script.isGrounded = false;
                    break;
                }
                else {
                    Script.isGrounded = true;
                    return tile;
                }
            }
        }
        Script.isGrounded = false;
        return null;
    }
    Script.checkCollision = checkCollision;
    function changeAnimation(_animation) {
        let currentAnim = Script.ket.getComponent(ƒ.ComponentAnimator).animation;
        const newAnim = ƒ.Project.getResourcesByName(_animation)[0];
        if (currentAnim != newAnim) {
            Script.ket.getComponent(ƒ.ComponentAnimator).animation = newAnim;
            if (_animation == "KetRun") {
            }
            if (_animation == "KetJump") {
                Script.addAudioSound("jump.mp3");
            }
        }
    }
    Script.changeAnimation = changeAnimation;
    function checkCollisionWithFood(_posWorld) {
        let foods = Script.viewport.getBranch().getChildrenByName("Collectibles")[0].getChildren();
        for (let food of foods) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, food.mtxWorldInverse, true);
            if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6) {
                if (pos.y < -1) {
                    break;
                }
                else {
                    Script.viewport.getBranch().getChildrenByName("Collectibles")[0].removeChild(food);
                    Script.vui.points++;
                    Script.addAudioSound("food.mp3");
                    return food;
                }
            }
        }
        return null;
    }
    Script.checkCollisionWithFood = checkCollisionWithFood;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    Script.gravity = -9.81;
    Script.ySpeed = 0;
    Script.isGrounded = true;
    let stateMachine;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        let response = await fetch("config.json");
        let config = await response.json();
        Script.viewport = _event.detail;
        Script.character = Script.viewport.getBranch().getChildrenByName("Character")[0];
        Script.opponents = Script.viewport.getBranch().getChildrenByName("Gegner")[0];
        Script.opponent = Script.opponents.getChildrenByName("Gegner1")[0];
        Script.opponentDoggo = Script.opponents.getChildrenByName("Gegner2")[0];
        Script.ket = Script.character.getChildrenByName("Ket")[0];
        stateMachine = new Script.actions();
        let cmpCamera = Script.viewport.getBranch().getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        Script.vui = new Script.VisualUi(config);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        ƒ.Physics.simulate();
        followCamera();
        Script.movement();
        Script.viewport.draw();
        addAudio();
        ƒ.AudioManager.default.update();
    }
    function followCamera() {
        let pos = Script.ket.mtxLocal.translation;
        pos.z = Script.viewport.camera.mtxPivot.translation.z;
        Script.viewport.camera.mtxPivot.translation = pos;
    }
    function addAudio() {
        let audioListener = Script.viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
        ƒ.AudioManager.default.listenWith(audioListener);
        ƒ.AudioManager.default.listenTo(Script.viewport.getBranch());
    }
    Script.addAudio = addAudio;
    function addAudioSound(_audio) {
        const newAudio = ƒ.Project.getResourcesByName(_audio)[0];
        let audio = Script.viewport.getBranch().getChildrenByName("Sounds")[0].getComponent(ƒ.ComponentAudio);
        audio.setAudio(newAudio);
        audio.play(true);
    }
    Script.addAudioSound = addAudioSound;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class OpponentMovementScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(OpponentMovementScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        cmpRigidbody;
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
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    this.cmpRigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.update();
                    this.cmpRigidbody.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.hndCollision);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = () => {
            console.log(this.cmpRigidbody);
            this.cmpRigidbody.addVelocity(ƒ.Vector3.X(-3));
        };
        async hndCollision(_event) {
            Script.opponents.removeChild(Script.opponentDoggo);
        }
    }
    Script.OpponentMovementScript = OpponentMovementScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class OpponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(OpponentScript);
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
                    this.node.addEventListener("Reset", this.startPostion);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        startPostion(_event) {
            // sets gegner back to idle
            console.log("Reset");
            Script.opponent.mtxLocal.translation = new ƒ.Vector3(-8, 22, 0);
        }
    }
    Script.OpponentScript = OpponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class VisualUi extends ƒ.Mutable {
        points;
        heart;
        controller;
        constructor(_config) {
            super();
            this.points = _config.points;
            this.heart = _config.heart;
            this.controller = new ƒUi.Controller(this, document.querySelector("#vui"));
        }
        /*public updatehealth():void {
            let lifebar: HTMLImageElement = document.querySelector("#img");
            if(this.heart == 3){
                // console.log("two");
                lifebar.setAttribute('src', 'Resources/Herzen3.png');
            }
            if(this.heart == 2){
                lifebar.setAttribute('src', 'Resources/Herzen2.png');
                // console.log("one");
            }
            if(this.heart == 1){
                lifebar.setAttribute('src', 'Resources/Herzen1.png');
                // console.log("zero");
            }
        }*/
        reduceMutator(_mutator) { }
        ;
    }
    Script.VisualUi = VisualUi;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Script);
    let MODE;
    (function (MODE) {
        MODE[MODE["IDLE"] = 0] = "IDLE";
        MODE[MODE["ATTACK"] = 1] = "ATTACK";
    })(MODE || (MODE = {}));
    class actions extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(actions);
        static instructions = actions.get();
        constructor() {
            super();
            this.instructions = actions.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = actions.transitDefault;
            setup.actDefault = actions.actDefault;
            setup.setAction(MODE.IDLE, this.actIdle);
            setup.setAction(MODE.ATTACK, this.actAttack);
            return setup;
        }
        static transitDefault(_machine) {
            // console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            // console.log(MODE[_machine.stateCurrent]);
        }
        static async actIdle(_machine) {
            let ketpos = Script.ket.mtxLocal.translation;
            let opponentpos = _machine.node.mtxLocal.translation;
            _machine.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("GegnerIdle")[0];
            if (parseInt(ketpos.y.toFixed(0)) == opponentpos.y && Math.sqrt(Math.pow(opponentpos.x - ketpos.x, 2)) <= 2) {
                _machine.transit(MODE.ATTACK);
            }
        }
        static async actAttack(_machine) {
            let opponentpos = _machine.node.mtxLocal.translation;
            _machine.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("GegnerAngriff")[0];
            _machine.node.mtxLocal.translateX((3.0) * ƒ.Loop.timeFrameGame / 1000);
            if (opponentpos.x > 30) {
                Script.opponent.dispatchEvent(new Event("Reset", { bubbles: true }));
                _machine.transit(MODE.IDLE);
            }
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    this.transit(MODE.IDLE);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // this.transit(MODE.IDLE);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.actions = actions;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map