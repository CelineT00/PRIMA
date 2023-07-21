namespace Script {
  import ƒAid = FudgeAid;
  export let gegner: ƒ.Node;
  ƒ.Project.registerScriptNamespace(Script);
    
    enum MODE {
      IDLE, ATTACK
    }
    
        export class actions extends ƒAid.ComponentStateMachine<MODE> {
            public static readonly iSubclass: number = ƒ.Component.registerSubclass(actions);
            private static instructions: ƒAid.StateMachineInstructions<MODE> = actions.get();
        
            constructor() {
              super();
              this.instructions = actions.instructions; // setup instructions with the static set
        
              // Don't start when running in editor
              if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        
              // Listen to this component being added to or removed from a node
              this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
              this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
              this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
            }
        
            public static get(): ƒAid.StateMachineInstructions<MODE> {
              let setup: ƒAid.StateMachineInstructions<MODE> = new ƒAid.StateMachineInstructions();
              setup.transitDefault = actions.transitDefault;
              setup.actDefault = actions.actDefault;
              setup.setAction(MODE.IDLE, <ƒ.General>this.actIdle);
              setup.setAction(MODE.ATTACK, <ƒ.General>this.actAttack);
              return setup;
            }
        
            private static transitDefault(_machine: actions): void {
              // console.log("Transit to", _machine.stateNext);
            }
        
            private static async actDefault(_machine: actions): Promise<void> {
              // console.log(MODE[_machine.stateCurrent]);
            }
        
            private static async actIdle(_machine: actions): Promise<void> {              
              let ketpos: ƒ.Vector3= ket.mtxLocal.translation;
              let opponentpos: ƒ.Vector3= _machine.node.mtxLocal.translation
                _machine.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("GegnerIdle")[0] as ƒ.AnimationSprite;
                if(parseInt(ketpos.y.toFixed(0))==opponentpos.y&& Math.sqrt(Math.pow(opponentpos.x-ketpos.x,2))<=2){
                    _machine.transit(MODE.ATTACK);
                }
              
            }
        
            private static async actAttack(_machine: actions): Promise<void> {
              let opponentpos: ƒ.Vector3= _machine.node.mtxLocal.translation
              _machine.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("GegnerAngriff")[0] as ƒ.AnimationSprite;
              _machine.node.mtxLocal.translateX((3.0 ) * ƒ.Loop.timeFrameGame / 1000);

              if(opponentpos.x>30){
                opponent.dispatchEvent(new Event("Reset", { bubbles: true }));
                _machine.transit(MODE.IDLE);
              }

            }
            // Activate the functions of this component as response to events
            private hndEvent = (_event: Event): void => {
              switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                  ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                  this.transit(MODE.IDLE);
                  break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                  this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                  this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                  ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                  break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                  // this.transit(MODE.IDLE);
                  break;
              }
            }
           
            private update = (_event: Event): void => {
              this.act();
            }
          }
        }