namespace Script {
import ƒ = FudgeCore;
    export class Block extends ƒ.Node{
        constructor (){
            super("Block");
            let mesCube: ƒ.MeshCube = new ƒ.MeshCube("Block");
            let mtlCube: ƒ.Material = new ƒ.Material()
        }

        createMesh():void{
            this.addComponent(this)
        }
    }
}