import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';

/**
 * An *ngIf directive with 'callback' function
 * @author michael
 */
@Directive({selector: '[ngIfCallback]'})
export class NgIfCallback {
    private _context: NgIfCallbackContext = new NgIfCallbackContext();
    private _thenTemplateRef: TemplateRef<NgIfCallbackContext> | null = null;
    private _elseTemplateRef: TemplateRef<NgIfCallbackContext> | null = null;
    private _thenViewRef: EmbeddedViewRef<NgIfCallbackContext> | null = null;
    private _elseViewRef: EmbeddedViewRef<NgIfCallbackContext> | null = null;
    private condition: boolean;
    private callbackFunction: Function;

    constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgIfCallbackContext>) {
        this._thenTemplateRef = templateRef;
    }

    @Input()
    set ngIfCallbackCallbackFunction(targetFn: Function) {
        this.callbackFunction = targetFn;
    }

    @Input()
    set ngIfCallback(condition: any) {
        this.condition = condition;
        this._context.$implicit = this._context.ngIfCallback = condition;
        this._updateView();
    }

    @Input()
    set ngIfCallbackThen(templateRef: TemplateRef<NgIfCallbackContext> | null) {
        this._thenTemplateRef = templateRef;
        this._thenViewRef = null;
        this._updateView();
    }

    @Input()
    set ngIfCallbackElse(templateRef: TemplateRef<NgIfCallbackContext> | null) {
        this._elseTemplateRef = templateRef;
        this._elseViewRef = null;
        this._updateView();
    }

    private _notify() {
        if (this.callbackFunction) {
            this.callbackFunction(this.condition);
        }
    }

    private _updateView() {
        if (this._context.$implicit) {
            if (!this._thenViewRef) {
                this._viewContainer.clear();
                this._elseViewRef = null;
                if (this._thenTemplateRef) {
                    this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
                }
            }
        } else {
            if (!this._elseViewRef) {
                this._viewContainer.clear();
                this._thenViewRef = null;
                if (this._elseTemplateRef) {
                    this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
                }
            }
        }
        this._notify();
    }

    public static ngIfCallbackUseIfTypeGuard: void;
}

export class NgIfCallbackContext {
    public $implicit: any = null;
    public ngIfCallback: any = null;
}
