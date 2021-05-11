import {fromEvent as observableFromEvent, Observable, of, Subscription} from 'rxjs';
import {
    Component, ComponentRef,
    ContentChild,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    Output,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {WindowRefService} from "../../app/services/window-ref.service";
import {AppStateService} from "../../app/services/app.state.service";
import {WindowState} from "../../home/classes/window.state";
import {HostComponentProvider} from "../directives/host.component.provider";
import {BaseComponent} from "../base-component/base.component";
import {DxPopupComponent} from "devextreme-angular";
import {PopupValueReceiver} from "../../core/commons/interfaces/popup.value.receiver";
import {PopupValueProvider} from "../../core/commons/interfaces/popup.value.provider";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {first} from "rxjs/operators";
import {ViewEncapsulation} from "@angular/core"
import {AutoSizeService} from "../services/auto.size.service";
import {TabPanelService} from "../services/tab.panel.service";
import {PopupService} from "../services/popup.service";

export interface PopupContentSize {

    contentWidth: number;

    contentHeight: number;

}

const MARGIN_ROOT_HEIGHT = 10;

let POPUP_ID_GEN = 0;

@Component({
    selector: 'sonner-popup',
    styleUrls: ['popup.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `

        <dx-popup [(visible)]="visible"
                  [container]="containerPopPupElement"
                  [width]="width"
                  [height]="height"
                  [animation]="{ show: { type: 'pop', duration: showDuration, from: { scale: showScale } }, hide: { type: 'pop', duration: hideDuration, to: { opacity: 0, scale: hideScale }, from: { opacity: 1, scale: 1 } } }"
                  [showTitle]="!fullScreen || !buttonsOnHeader"
                  [title]="popupTitle"
                  [closeOnOutsideClick]="closeOnOutsideClick"
                  [dragEnabled]="dragEnabled"
                  [shading]="shading"
                  (onShown)="popupOnShown($event)"
                  (onHidden)="onHidden($event)"
                  (onContentReady)="popupContentReady($event)"
                  [position]="position"
        >

            <div *dxTemplate="let data of 'content'" class="secondary-crud-container" [ngClass]="{'secondary-crud-container-no-padding': !paddingContent}">

                <!--Toolbar no cabecalho, com botoes de aceitar e cancelar. Usado em uma busca com filtros do crud-->
                <div *ngIf="fullScreen && buttonsOnHeader" class="secondary-crud-header">

                    <div *ngIf="showCancelButton" class="back-button" (click)="cancelarButtonClicked($event)">
                        <img src="/GRP/assets/images/icons-lib/inverted/back.png" width="24px" height="24px" alt="">
                    </div>

                    <div class="secondary-crud-title">
                        {{popupTitle}}
                    </div>

                    <div *ngIf="showAceitarButton" class="secondary-crud-ok-button secondary-crud-button"
                         (click)="onAceitarButtonClickedHandler()">
                        <div class="secondary-crud-button-icon">
                            <img src="/GRP/assets/images/icons-lib/inverted/1135-checkmark3.png" width="16px"
                                 height="16px"
                                 alt="">
                        </div>
                        <div class="secondary-crud-button-text">
                            {{textAceitarButton}}
                        </div>
                    </div>

                    <div class="secondary-crud-cancel-button secondary-crud-button"
                         (click)="cancelarButtonClicked($event)">
                        <div class="secondary-crud-button-icon">
                            <img src="/GRP/assets/images/icons-lib/inverted/back.png" width="16px" height="16px" alt="">
                        </div>
                        <div class="secondary-crud-button-text">
                            {{textCancelarButton}}
                        </div>
                    </div>

                </div>

                <!--Painel de mensagens e corpo do popup-->
                <div #container
                     [ngClass]="{'component-restricted-area root-component-restricted-area': true, 'secondary-crud-panel': fullScreen && buttonsOnHeader, 'popup-content-panel': !fullScreen || !buttonsOnHeader}">
                    <dx-scroll-view [height]="_scrollHeight">
                        <message-panel *ngIf="errorsVisible"
                                       [(visible)]="errorsVisible"
                                       style="flex-grow: 0"
                                       [messageType]="'ERROR'"
                                       [messages]="errorMessages">
                        </message-panel>
                        <div >
                            <ng-content ></ng-content>    
                        </div>
                    </dx-scroll-view>
                </div>

                <!--Botoes de aceitar e cancelar no rodape do popup, usados em um popup comum-->
                <div *ngIf="(!fullScreen || !buttonsOnHeader) && (showAceitarButton || showCancelButton)" class="popup-buttons-panel">

                    <ng-content select="[button-override]"></ng-content>
                    
                    <dx-button *ngIf="showAceitarButton" [text]="textAceitarButton" icon="fa fa-check"
                               (onClick)="onAceitarButtonClickedHandler()" style="margin-right: 5px"></dx-button>

                    <dx-button *ngIf="showCancelButton" [text]="textCancelarButton" icon="fa fa-times-circle"
                               (onClick)="cancelarButtonClicked($event)"></dx-button>
                </div>

            </div>

        </dx-popup>

    `,
    providers: [AutoSizeService, TabPanelService]
})
export class PopupComponent extends BaseComponent {

    popupId = `popup_${POPUP_ID_GEN++}`;

    @ViewChild(DxPopupComponent, { static: true })
    dxPopup: DxPopupComponent;

    @ContentChild(HostComponentProvider)
    contentProvider: HostComponentProvider;

    @ViewChild("container")
    container: ElementRef;

    @Input()
    applyContainerPopUpInRoot: boolean = false;

    @Input()
    paddingContent: boolean = true;

    private _containerPopPup: ElementRef;

    containerPopPupElement: Element | JQuery;

    get containerPopPup(): ElementRef<any> {
        return this._containerPopPup;
    }

    @Input()
    set containerPopPup(value: ElementRef<any>) {
        this._containerPopPup = value;
        this.setContainerPopPupElement(value);
    }


    private setContainerPopPupElement(value: ElementRef<any>) {
        if (value) {
            this.containerPopPupElement = value.nativeElement;
        } else {
            this.containerPopPupElement = undefined;
        }
    }

    private hostComponent: any;

    private _visible: boolean = false;

    private windowResizeSubscription: Subscription;

    private menuExpandedSubscription: Subscription;

    private currentWindow: WindowState;

    private registeredWindow: WindowState;

    private currentWindowSubscription: Subscription;

    private onCancelarButtonClickedSubscription: Subscription;

    private valueSubscription: Subscription;

    private toolbarExpandedSubscription: Subscription;

    private updateContentSize() {
        this.updateContentWidth();
        this.updateContentHeight();
        this.onContentSizeChanged.emit({contentWidth: this.contentWidth, contentHeight: this.contentHeight});
    }

    private updateContentWidth(): void {
        if (this.container && this.container.nativeElement)
            this.contentWidth = this.domHandler.jQuery(this.container.nativeElement).width();
    }

    private updateContentHeight(): void {
        if (this.container && this.container.nativeElement) {
            const elem = this.domHandler.jQuery(this.container.nativeElement);

            this.contentHeight = elem.closest('.secondary-crud-container').height()
                - (elem.siblings('.secondary-crud-header').outerHeight() | 0)
                - 20;
        }
    }

    aceitarButtonWasClicked: boolean = false;


    @Input()
    width: number | Function | string = 800;

    @Input()
    height: number | Function | string = 600;

    _scrollHeight: number;

    @Input()
    showDuration: number = 300;

    @Input()
    showScale: number = 0.55;

    @Input()
    hideDuration: number = 300;

    @Input()
    hideScale: number = 0.55;

    @Input()
    popupTitle: string;

    @Input()
    closeOnOutsideClick: boolean = false;

    @Input()
    dragEnabled: boolean = false;

    @Input()
    shading: boolean = true;

    @Input()
    fullScreen: boolean = false;



    /**
     * se 'true', exibe botões na barra de título
     *
     * Nota: É consierado apenas quando fullScreen = true
     */
    @Input()
    buttonsOnHeader: boolean = true;

    @Input()
    showCancelButton: boolean = true;

    @Input()
    showAceitarButton: boolean = true;

    @Input()
    textAceitarButton: string = "Aceitar";

    @Input()
    textCancelarButton: string = "Cancelar";

    @Input()
    closeOnApply: boolean = true;

    @Input()
    validaAceitar: (value?: any) => boolean | Observable<boolean>;

    @Input()
    position: any = {my: 'center', at: 'center', of: '#content-body'};

    @Input()
    set visible(value: boolean) {
        // Aplica o bypass nos validators.
        // Assim quando houver algum conteúdo via transclusion ,
        // estes não serão validados na abertura do popup
        if (value) {
            this.applyValidatorsByPass(true);
        }

        let notify = value !== this._visible;
        this._visible = value;
        if (notify) {
            this.visibleChange.emit(value);

            if (value) {
                this.registeredWindow = this.currentWindow;
            } else {
                this.registeredWindow = null;
                if (this.hostComponent && this.hostComponent.onPopupHide) {
                    this.hostComponent.onPopupHide();
                }
            }
        }
    }

    get visible(): boolean {
        return this._visible;
    }

    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    onItemSelected: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onAceitarButtonClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCancelarButtonClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onShown: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onClose: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onContentSizeChanged: EventEmitter<PopupContentSize> = new EventEmitter<PopupContentSize>();

    @Output()
    onContentReady: EventEmitter<any> = new EventEmitter<any>();

    constructor(private domHandler: DomHandler,
                private vcr: ViewContainerRef,
                private oUtil: ObjectUtilsService,
                private windowRefService: WindowRefService,
                private injector: Injector,
                private appStateService: AppStateService,
                private autoSizeService: AutoSizeService,
                private popupService: PopupService) {
        super(injector);
        autoSizeService.marginRootHeight = MARGIN_ROOT_HEIGHT;
    }

    contentWidth: number;

    contentHeight: number;


    /**
     * Procura quem é o elemento root
     * @param parent
     */
    private getRootHostPopUp(parent: any): any {
        if (parent && parent.parent && parent.parent.parent != null) {
            return this.getRootHostPopUp(parent.parent);
        }

        return parent;
    }

    doOnInit(): void {
        this.setContainerPopUpInRoot();

        this.windowResizeSubscription = observableFromEvent(this.windowRefService.nativeWindow(), "resize")
            .subscribe(event => {
                this.adjustPosition();
                this.updateContentSize();
            });

        this.menuExpandedSubscription = this.appStateService.menuExpanded
            .subscribe(expanded => {
                this.adjustPosition();
            });

        this.currentWindowSubscription = this.appStateService.currentWindow.subscribe(currentWindow => {

            this.currentWindow = currentWindow;

            if (this.registeredWindow) {

                if (this.registeredWindow.windowComponent == currentWindow.windowComponent) {
                    this._visible = true;
                } else {
                    this._visible = false;
                }

                this.visibleChange.emit(this._visible);

            } else if (this.visible) {

                this.registeredWindow = currentWindow;

            }

        });

        this.onCancelarButtonClickedSubscription = this.onCancelarButtonClicked.subscribe(() => {
            this.propagateValue({});
        });

        this.toolbarExpandedSubscription = this.appStateService.toolbarExpanded.subscribe(() => {
            this.adjustPosition();
            this.updateContentSize();
        });
    }

    /**
     * Coloca o popUp dentro do container informado
     * @example
     * $(entidade-crud > popup)
     */
    private setContainerPopUpInRoot() {
        if(this.applyContainerPopUpInRoot) {
            if (this.vcr && this.vcr['_view']) {
                let host = this.getRootHostPopUp(this.vcr['_view']).component;
                if (host && host.rootEl) {
                    this.containerPopPup = host.rootEl;
                }
            }
        }
    }

    doOnDestroy(): void {
        this.windowResizeSubscription.unsubscribe();
        this.menuExpandedSubscription.unsubscribe();
        this.currentWindowSubscription.unsubscribe();
        this.onCancelarButtonClickedSubscription.unsubscribe();
        if (this.valueSubscription) {
            this.valueSubscription.unsubscribe();
        }

        if (this.toolbarExpandedSubscription) {
            this.toolbarExpandedSubscription.unsubscribe();
        }
        this.popupService.popupInativo(this.popupId);
    }

    doAfterContentInit(): void {
        if (this.contentProvider) {

            this.hostComponent = this.contentProvider.hostComponent;
            this.hostComponent.embedded = true;
            if (this.hostComponent.setMarginRootHeight) {
                this.hostComponent.setMarginRootHeight(MARGIN_ROOT_HEIGHT);
            }

            if (this.hostComponent.providedValueObservable && this.hostComponent.providedValueObservable()) {
                this.valueSubscription = this.hostComponent.providedValueObservable().subscribe(data => {
                    this.onItemSelected.emit(data);
                    this.visible = false;
                });
            }
        }
    }

    onAceitarButtonClickedHandler() {
        let value = (this.hostComponent && this.hostComponent.providedValue) ? this.hostComponent.providedValue() : null;
        if (!value || !value.subscribe) {
            value = of(value);
        }
        value.subscribe(arg => {
            if (this.validaAceitar) {
                if (this.hostComponent) {
                    if (arg) {
                        const response = this.validaAceitar(arg);

                        this.handleValidationResponse(response, arg);
                    }
                } else {
                    const response = this.validaAceitar();

                    this.handleValidationResponse(response, arg);
                }
            } else if (this.hostComponent && this.hostComponent.validatePopupValue) {
                if (this.hostComponent.validatePopupValue(arg)){
                    this.finishPopup(arg);
                }
            } else {
                this.finishPopup(arg);
            }
        });

    }

    private handleValidationResponse(response: Observable<boolean> | boolean, arg) {
        if (this._.isBoolean(response)) {
            if (response) {
                this.finishPopup(arg);
            }
        } else {
            (response as Observable<boolean>).pipe(first()).subscribe(isValid => {
                if (isValid) {
                    this.finishPopup(arg);
                }
            });
        }
    }

    finishPopup(selectedValue: any) {
        if (this.hostComponent && selectedValue) {
            let selection = selectedValue;
            if (selection) {
                this.onItemSelected.emit(selection);
            }
        }

        this.onAceitarButtonClicked.emit(true);

        if (this.closeOnApply && this.visible) {
            this.visible = false;
            this.visibleChange.emit(false);
        }
    }

    cancelarButtonClicked(e) {
        this.visible = false;
        this.visibleChange.emit(false);
        this.onCancelarButtonClicked.emit(true);
    }

    popupContentReady(event: any) {
        if (this.fullScreen && this.buttonsOnHeader) {
            let elem = this.domHandler.jQuery(event.component.content());
            let overlay = elem.parent().parent();
            elem.css("padding", "0");
            overlay.addClass('secondary-popup-overlay');
        }
        this.onContentReady.emit(event);
    }

    popupOnShown(event: any) {
        this.aceitarButtonWasClicked = false;
        this.applyValidatorsByPass(false);
        this.onShown.emit(event);
        this.onPopupVisible();

        this.updateContentSize();

        this.autoSizeService.resize();

        this.popupService.popupAtivo(this.popupId);
    }

    onHidden(event: any) {
        this.onClose.emit(this.aceitarButtonWasClicked);
        this.popupService.popupInativo(this.popupId);
    }

    propagateValue(value: any) {
        if (this.contentProvider && this.contentProvider.hostComponent) {
            const valueReceiver: PopupValueReceiver = this.contentProvider.hostComponent as PopupValueReceiver;
            if (valueReceiver.receiveValue) {
                valueReceiver.receiveValue(value);
            }
        }
    }

    getContentValue() {
        const valueProvider: PopupValueProvider = this.contentProvider.hostComponent as PopupValueProvider;
        if (valueProvider) {
            return valueProvider.providedValue();
        }
    }

    close() {
        this.visible = false;
    }

    private onPopupVisible() {
        this.adjustPosition();

        if (this.hostComponent && this.hostComponent.onPopupShow) {
            this.hostComponent.onPopupShow();
        }

    }

    private adjustPosition() {
        if (this.fullScreen) {
            let contentBody = this.domHandler.jQuery("#content-body");
            this.width = contentBody.width();
            this.height = contentBody.height();
            let possuiRodape = (!this.fullScreen || !this.buttonsOnHeader) && (this.showAceitarButton || this.showCancelButton);
            this._scrollHeight = contentBody.height() - (possuiRodape ? 90 : 30);
            this.autoSizeService.resize();
            if (this.hostComponent && this.hostComponent.onPopupResize) {
                this.hostComponent.onPopupResize();
            }
        }
    }

}
