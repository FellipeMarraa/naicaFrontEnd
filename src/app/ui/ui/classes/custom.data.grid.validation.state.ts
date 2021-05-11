/*
 * @author michael
 */

export class CustomDataGridValidationState {

    private asyncValidator: Function;

    data: any;
    editingData: any;
    isNewRecord: boolean;
    isValid: boolean;
    alreadyIn: boolean;
    deferred: any;
    event: any;
    contextData: any;
    grid: any;
    custom: any;

    addErrorMessage(msg: string) {
        this.custom.doAddErrorMessage(msg);
    }

    hasErrorMessages() {
        return this.custom.hasErrorMessages();
    }

    addErrorMessages(msgs: string[]) {
        msgs.forEach((m) => {
            this.addErrorMessage(m);
        })
    }

    validateAsync(fn: Function) {
        this.isValid = false; // by default, it's not valid. Prove otherwise.
        this.asyncValidator = fn;
    }

    getAsyncValidator() {
        return this.asyncValidator;
    }

    resolveAsyncAsValid() {
        this.resolveAsyncValidator();
        this.isValid = true;
    }

    resolveAsyncAsInvalid() {
        this.resolveAsyncValidator(true);
        this.isValid = false;
    }

    private resolveAsyncValidator(value?: any) {
        if (this.deferred) {
            if (typeof value != 'undefined') {
                this.deferred.resolve(value);
            } else {
                this.deferred.resolve();
            }
        }
    }
}
