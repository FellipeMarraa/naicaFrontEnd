import {Injectable} from "@angular/core";

import * as Dialog from "devextreme/ui/dialog";

@Injectable()
export class MessageBoxUiService {

  show(message): Promise<void> {
    return Dialog.alert(`
        <div style="display: flex; justify-content: left">
            <div style="width: 70px; flex-shrink: 0; padding-left: 20px; padding-right: 20px"><i class="fa fa-info" style="font-size:48px"></i></div>
            <div style="text-align: left; flex-grow: 1; display: flex; justify-content: center; align-items: center"><span>${message}</span></div>
        </div>`, "Aviso");
  }

  showWithButton(message, buttons): Promise<void> {
    let myDialog = Dialog.custom({
      title: "Aviso",
      message: `
        <div style="display: flex; justify-content: left">
            <div style="width: 70px; flex-shrink: 0; padding-left: 20px; padding-right: 20px"><i class="fa fa-info" style="font-size:48px"></i></div>
            <div style="text-align: left; flex-grow: 1; display: flex; justify-content: center; align-items: center"><span>${message}</span></div>
        </div>`,
      buttons: buttons
    });
    myDialog.show();
    return myDialog;
    //return Dialog.custom( { title: "teste", message: message, buttons: buttons, showTitle: true } );
  }

  showError(error): Promise<void> {
    return Dialog.alert(`
        <div style="display: flex; justify-content: left">
            <div style="width: 70px; flex-shrink: 0; padding-left: 20px; padding-right: 20px"><i class="fa fa-times" style="font-size:48px"></i></div>
            <div style="text-align: left; flex-grow: 1; display: flex; justify-content: center; align-items: center"><span>${error}</span></div>
        </div>`, "Falha");
  }

  confirm(message, title): Promise<boolean> {
    return Dialog.confirm(`
        <div style="display: flex; justify-content: left">
            <div style="width: 70px; flex-shrink: 0; padding-left: 20px; padding-right: 20px"><i class="fa fa-question" style="font-size:48px"></i></div>
            <div style="text-align: left; flex-grow: 1; display: flex; justify-content: center; align-items: center"><span>${message}</span></div>
        </div>`, title);
  }

}
