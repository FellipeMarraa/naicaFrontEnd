import {DxFormComponent} from "devextreme-angular";
import * as $ from 'jquery';

import CheckBox from 'devextreme/ui/check_box';
import * as events from 'devextreme/events';

export class DevExtremeUtils {

    static focusOnFirstInput(form: DxFormComponent) {
        const _form: any = form;
        setTimeout(() => {
            if (_form) {
                const native_ = _form.element.nativeElement;
                $(native_)
                    .find("input[type!='hidden']")
                    .first()
                    .focus();
            }
        });
    }

    static disableInputs(form: DxFormComponent) {
        const _form: any = form;
        setTimeout(() => {
            if (_form) {
                const native_ = _form.element.nativeElement;
                $(native_).find("input[type!='hidden']").each(function () {
                    const el = $(this);
                    if (el.attr("type") != "hidden") {
                        el.prop('disabled', true);
                    }
                });
            }
        });
    }


    static focusOnByNativeElement(el: any) {
        if (el) {
            $(el).focus();
        }
    }

    static focusOnByQuery(selector: string, context: any) {
        $(selector, context).each(function () {
            $(this).focus();
        });
    }

    static focusOnElementByIndex(form: DxFormComponent, index: number) {
        const _form: any = form;

        const native_ = _form.element.nativeElement;
        const el = $(native_)
            .find("input")
            .eq(index);

        setTimeout(() => {
            el.focus();
        });
    }

    static focusByDataField(
        form: DxFormComponent,
        dataField: string
    ) {
        if (form) {
            $("input", $(form.instance.getEditor(dataField)['_$element'])).each(function () {
                const el = $(this);
                if (el.attr("type") != "hidden") {
                    setTimeout(() => {
                        el.focus();
                    });
                }
                return;
            });
        }
    }

    static stopCancelPropagation(event: any) {
        event.cancel = true;
        event.isValid = !event.cancel;
    }

    static columnFocusedSelectContent(event: any) {
        event.event.target.select();
    }

    static getCheckBoxInstance(element: Element | JQuery) {
        return CheckBox.getInstance(element);
    }

    static eventOff(el: any) {
        events.off(el);
    }

    static eventOn(el: any, eventName: string, handler: Function) {
        events.on(el, eventName, handler);
    }

}
