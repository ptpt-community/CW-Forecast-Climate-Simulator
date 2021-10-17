export interface FrontEndUpdatable{
    updateWindow() : void;
}


export class FrontEndReceiver {
    private static instance: FrontEndReceiver = new FrontEndReceiver();

    private  _heightView;

    private constructor() {
        this._heightView = window.document.getElementById("height_view") as HTMLTableDataCellElement;
    }

    static getInstance(){
        return this.instance;
    }

    updateHeight(height: number){

        this._heightView.innerText = ''+Math.ceil(height*300) + 'ft';
    }

}







