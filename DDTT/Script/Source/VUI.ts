namespace Script{
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class VisualUi extends ƒ.Mutable{
        public points: number;
        public heart: number;
        private controller: ƒUi.Controller;

        constructor(_config: {[key: string]: number}){
            super();
            this.points = _config.points;
            this.heart = _config.heart;

            this.controller = new ƒUi.Controller(this,document.querySelector("#vui"));
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

        

        protected reduceMutator(_mutator: ƒ.Mutator):void{};
    }
}