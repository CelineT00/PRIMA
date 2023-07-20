declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
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
    let gravity: number;
    let ySpeed: number;
    let isGrounded: boolean;
    let vui: VisualUi;
    function addAudio(): void;
    function addAudioSound(_audio: string): void;
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
        updatehealth(): void;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
