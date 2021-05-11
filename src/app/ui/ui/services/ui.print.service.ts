import {Injectable} from "@angular/core";
import {PrintService} from "../../core/commons/services/print.service";
import {WindowRefService} from "../../app/services/window-ref.service";

@Injectable()
export class UiPrintService {
    constructor(private printService: PrintService, private windowRef: WindowRefService){
    }

    print(){
        this.printService.hideMainBlocksForPrinting();
        setTimeout(() => {
            this.windowRef.nativeWindow().print();
            this.printService.showMainBlocksForPrinting();
        }, 100);
    }
}
