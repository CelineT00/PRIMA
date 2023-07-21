declare namespace Script {
    import ƒ = FudgeCore;
    let points: number;
    function movement(): void;
    function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node;
    function changeAnimation(_animation: string): void;
    function checkCollisionWithFood(_posWorld: ƒ.Vector3): ƒ.Node;
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let character: ƒ.Node;
    let ket: ƒ.Node;
    let opponent: ƒ.Node;
    let opponentDoggo: ƒ.Node;
    let opponents: ƒ.Node;
    let gravity: number;
    let ySpeed: number;
    let isGrounded: boolean;
    let vui: VisualUi;
    function addAudio(): void;
    function addAudioSound(_audio: string): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class OpponentMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private cmpRigidbody;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
        private hndCollision;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class OpponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        private startPostion;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class VisualUi extends ƒ.Mutable {
        points: number;
        heart: number;
        private controller;
        constructor(_config: {
            [key: string]: number;
        });
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    export let gegner: ƒ.Node;
    enum MODE {
        IDLE = 0,
        ATTACK = 1
    }
    export class actions extends ƒAid.ComponentStateMachine<MODE> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<MODE>;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actAttack;
        private hndEvent;
        private update;
    }
    export {};
}
