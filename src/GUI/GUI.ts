import {GUI} from "dat.gui";


export class GuiSingleton{
/*
    private static instance: gui=new gui();
*/
    public static animationGui:GUI=new GUI();
    private constructor() {
    }

/*    public static getGui(): gui{

        return gui.instance;//3

    }*/
    public static getGui(): GUI{
        return this.animationGui;
    }


}

