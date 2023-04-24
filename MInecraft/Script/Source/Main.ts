namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    //let block: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2023-04-20T13:20:07.943Z|28797"];
    //let instance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(block);
    //console.log(instance);
    //instance.mtxLocal.translateX(1);
    
    //let instance: Block = new Block(ƒ.Vector3.X(1),ƒ.Color.CSS("red"));
    //console.log(instance);

      for (let xindex = 0; xindex < 3; xindex++) {   
        for (let yindex = 0; yindex < 3; yindex++) {
           for (let zindex = 0; zindex < 3; zindex++) {
            let instance: Block = new Block(new ƒ.Vector3(xindex,yindex,zindex),ƒ.Color.CSS("purple"));
            console.log(instance);
            viewport.getBranch().addChild(instance);
          }
          
        }
        
      }
      

    

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}