export class CustomDataGridEditingState {

    constructor(data: any, grid: any, dxData: any, element: any, component: any, isNewRecord) {
        this.data = data;
        this.grid = grid;
        this.dxData = dxData;
        this.element = element;
        this.component = component;
        this.isNewRecord = isNewRecord;
    }

    data: any;
    grid: any; //custom component
    dxData: any;
    component: any; //dx component
    element: any;
    isNewRecord: boolean;

}
