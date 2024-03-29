"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Block extends ƒ.Node {
        static mshCube = new ƒ.MeshCube("Block");
        static mtrCube = new ƒ.Material("Block", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position, _color) {
            super("Block");
            this.addComponent(new ƒ.ComponentMesh(Block.mshCube));
            let cmpMaterial = new ƒ.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary = _color;
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            let cmpPick = new ƒ.ComponentPick();
            cmpPick.pick = ƒ.PICK.CAMERA;
            this.addComponent(cmpPick);
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(cmpRigidbody);
            // cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, () => console.log("Collision"));
        }
    }
    Script.Block = Block;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CritterMover extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CritterMover);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        #cmpRigidbody;
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
                    this.#cmpRigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    console.log(this.#cmpRigidbody);
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.hndEvent);
                    break;
                case "renderPrepare" /* RENDER_PREPARE */:
                    console.log("Rendering Node");
                    if (!Script.steve)
                        return;
                    let vctDiff = ƒ.Vector3.DIFFERENCE(Script.steve.mtxWorld.translation, this.node.mtxWorld.translation);
                    vctDiff.normalize(3);
                    this.#cmpRigidbody.applyForce(vctDiff);
                    break;
            }
        };
    }
    Script.CritterMover = CritterMover;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class Gamestate extends ƒ.Mutable {
        points;
        health;
        name;
        constructor() {
            super();
            this.points = 0;
            this.health = 100;
            this.name = "Steve";
            let vui = document.querySelector("div#vui");
            new ƒUi.Controller(this, vui);
            this.addEventListener("mutate" /* MUTATE */, () => console.log(this));
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Gamestate = Gamestate;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    Script.grid3D = [];
    Script.gridAssoc = {};
    let config;
    let isGrounded = false;
    let MINECRAFT;
    (function (MINECRAFT) {
        MINECRAFT["STEVE_COLLIDES"] = "steveCollides";
    })(MINECRAFT || (MINECRAFT = {}));
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        let response = await fetch("config.json");
        config = await response.json();
        console.log(config);
        let gamestate = new Script.Gamestate();
        console.log(gamestate);
        Script.viewport = _event.detail;
        Script.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        Script.viewport.canvas.addEventListener("contextmenu", _event => _event.preventDefault());
        generateWorld(10, 3, 9);
        let pickAlgorithm = [Script.pickByComponent, Script.pickByCamera, Script.pickByRadius, Script.pickByGrid];
        Script.viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
        Script.viewport.getBranch().addEventListener("pointerdown", Script.hitComponent);
        Script.viewport.getBranch().addEventListener(MINECRAFT.STEVE_COLLIDES, (_event) => console.log(_event));
        setupSteve();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        controlSteve();
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function setupSteve() {
        // console.log(ƒ.Physics.settings.sleepingAngularVelocityThreshold);
        Script.steve = Script.viewport.getBranch().getChildrenByName("Steve")[0];
        console.log(Script.steve);
        Script.viewport.camera = Script.steve.getChild(0).getComponent(ƒ.ComponentCamera);
        let cmpRigidbody = Script.steve.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
        cmpRigidbody.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, steveCollides);
    }
    function controlSteve() {
        let cmpRigidbody = Script.steve.getComponent(ƒ.ComponentRigidbody);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            cmpRigidbody.applyTorque(ƒ.Vector3.Y(config.torque));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            cmpRigidbody.applyTorque(ƒ.Vector3.Y(-config.torque));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
            cmpRigidbody.applyForce(ƒ.Vector3.SCALE(Script.steve.mtxWorld.getZ(), config.force));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            cmpRigidbody.applyForce(ƒ.Vector3.SCALE(Script.steve.mtxWorld.getZ(), -config.force));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && isGrounded) {
            cmpRigidbody.addVelocity(ƒ.Vector3.Y(5));
            isGrounded = false;
        }
    }
    function steveCollides(_event) {
        // let vctCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, steve.mtxWorld.translation);
        //if (Math.abs(vctCollision.x) < 0.1 && Math.abs(vctCollision.z) < 0.1 && vctCollision.y < 0) // collision below steve
        isGrounded = true;
        let customEvent = new CustomEvent(MINECRAFT.STEVE_COLLIDES, { bubbles: true, detail: Script.steve.mtxWorld.translation });
        Script.steve.dispatchEvent(customEvent);
    }
    function generateWorld(_width, _height, _depth) {
        Script.blocks = new ƒ.Node("Blocks");
        Script.viewport.getBranch().addChild(Script.blocks);
        // let vctOffset: ƒ.Vector2 = new ƒ.Vector2(Math.floor(_width / 2), Math.floor(_depth / 2));
        let vctOffset = ƒ.Vector2.ZERO();
        for (let y = 0; y < _height; y++) {
            Script.grid3D[y] = [];
            for (let z = 0; z < _depth; z++) {
                Script.grid3D[y][z] = [];
                for (let x = 0; x < _width; x++) {
                    let vctPosition = new ƒ.Vector3(x - vctOffset.x, y + Math.random() * 0.2, z - vctOffset.y);
                    let txtColor = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
                    createBlock(vctPosition, txtColor);
                }
            }
        }
        console.log(Script.gridAssoc);
    }
    function createBlock(_vctPosition, _txtColor) {
        let block = new Script.Block(_vctPosition, ƒ.Color.CSS(_txtColor));
        block.name = _vctPosition.toString() + "|" + _txtColor;
        // console.log(block.name);
        Script.blocks.addChild(block);
        Script.gridAssoc[_vctPosition.toString()] = block;
        try {
            Script.grid3D[_vctPosition.y][_vctPosition.z][_vctPosition.x] = block;
        }
        catch (_e) { }
    }
    Script.createBlock = createBlock;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function pickByComponent(_event) {
        console.log("pickByComponent");
        Reflect.set(_event, "closestDistance", Infinity);
        Reflect.set(_event, "closestBlock", null);
        Script.viewport.dispatchPointerEvent(_event);
        hitBlock(Reflect.get(_event, "closestBlock"));
    }
    Script.pickByComponent = pickByComponent;
    function hitComponent(_event) {
        let block = _event.target;
        let closestDistance = Reflect.get(_event, "closestDistance");
        let pick = Reflect.get(_event, "pick");
        if (pick.zBuffer < closestDistance) {
            Reflect.set(_event, "closestDistance", pick.zBuffer);
            Reflect.set(_event, "closestBlock", block);
        }
    }
    Script.hitComponent = hitComponent;
    function pickByCamera(_event) {
        console.log("pickCamera");
        let picks = ƒ.Picker.pickViewport(Script.viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
        picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
        let pick = picks[0];
        if (_event.button == 1)
            hitBlock(pick.node);
        else if (_event.button == 2) {
            let posNewBlock = ƒ.Vector3.SUM(pick.node.mtxWorld.translation, pick.normal);
            addBlock(posNewBlock);
        }
    }
    Script.pickByCamera = pickByCamera;
    function pickByRadius(_event) {
        console.log("pickByRay");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let shortest;
        let found = null;
        let compare = Math.pow(0.7, 2);
        for (let block of Script.blocks.getChildren()) {
            if (compare < ray.getDistance(block.mtxWorld.translation).magnitudeSquared)
                continue;
            let distance = ƒ.Vector3.DIFFERENCE(block.mtxWorld.translation, ray.origin).magnitudeSquared;
            if (shortest == undefined || distance < shortest) {
                shortest = distance;
                found = block;
            }
        }
        hitBlock(found);
    }
    Script.pickByRadius = pickByRadius;
    function pickByGrid(_event) {
        console.log("pickByGrid");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let posCheck = ray.origin.clone;
        let vctStep = ray.direction.clone;
        // find largest component value
        let largest = vctStep.get().reduce((_p, _c) => Math.max(_p, Math.abs(_c)));
        // normalize to 1 in that direction
        vctStep.scale(1 / largest);
        for (let i = 0; i < 100; i++) {
            posCheck.add(vctStep);
            let posGrid = posCheck.map(_value => Math.round(_value));
            console.log(posGrid.toString(), posCheck.toString());
            try {
                let block = Script.grid3D[posGrid.y][posGrid.z][posGrid.x];
                // let block = gridAssoc[posGrid.toString()];
                if (block) {
                    hitBlock(block);
                    return;
                }
            }
            catch (_e) { }
        }
    }
    Script.pickByGrid = pickByGrid;
    function hitBlock(_block) {
        if (!_block)
            return;
        console.log(_block.name);
        _block.getParent().removeChild(_block);
        Script.viewport.draw();
    }
    function addBlock(_pos) {
        if (Script.gridAssoc[_pos.toString()]) // already a block there...
            return;
        Script.createBlock(_pos, "white");
        Script.viewport.draw();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map