import {Injectable} from "@angular/core";

import notify from 'devextreme/ui/notify';

@Injectable()
export class ToastUiService {

    showSuccess(message: string) {
        notify(message, 'success', 10000);
    }

    showError(message: string) {
        notify(message, 'error', 10000);
    }

    showWarning(message: string) {
        notify(message, 'warning', 10000);
    }

}
