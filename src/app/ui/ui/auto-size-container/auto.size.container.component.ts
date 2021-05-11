import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Self,
    SimpleChanges, SkipSelf,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {AutoSizeNodeService} from "../services/auto.size.node.service";
import {DomHandler} from "../../app/services/dom.handler";
import {AutoSizeService} from "../services/auto.size.service";
import {Resizable} from "./resizable";

/**
 * Componente que permite ajustar a altura e largura de acordo com o espaço
 * disponível na tela.
 */
@Component({
    selector: 'auto-size-container',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './auto.size.container.component.html',
    providers: [AutoSizeNodeService]
})
export class AutoSizeContainerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, Resizable {

    @ViewChild("element")
    element: ElementRef;

    /**
     * Caso informado, o container terá uma largura fixa
     */
    @Input()
    width: number;

    /**
     * Caso informado, o container terá uma altura fixa
     */
    @Input()
    height: number;

    /**
     * Ao calcular a largura, subtrai o valor informado do resultado final
     */
    @Input()
    marginWidth: number = 0;

    /**
     * Ao calcular a altura, subtrai o valor informado do resultado final
     */
    @Input()
    marginHeight: number = 0;

    /**
     * Largura mínima do container
     */
    @Input()
    minWidth: number = 0;

    /**
     * Altura mínima do container
     */
    @Input()
    minHeight: number = 0;

    /**
     * Desabilita o calculo automático de altura e largura
     */
    @Input()
    disabled: boolean = false;

    /**
     * Calcula a altura
     */
    @Input()
    calcHeight: boolean = true;

    /**
     * Calcula a largura (desabilitado por padrão)
     */
    @Input()
    calcWidth: boolean = false;

    @Output()
    widthChange: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    heightChange: EventEmitter<number> = new EventEmitter<number>();

    private _calcWidth: number;

    private _calcHeight: number;

    constructor(private domHandler: DomHandler,
                @Optional() private autoSizeService: AutoSizeService,
                @Self() private node: AutoSizeNodeService,
                @Optional() @SkipSelf() private parentNode: AutoSizeNodeService) {
        if (autoSizeService) {
            autoSizeService.register(parentNode, node, this);
        }
    }

    adjust(options?: {marginRootHeight: number}) {
        this.adjustWidth();
        this.adjustHeight(options);
    }

    resize() {
        if (this.autoSizeService) {
            //agenda o redimensionamento de todos os containers na hierarquia
            this.autoSizeService.resize();
        } else {
            //redimensiona este container
            this.adjust();
        }
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        if (this.autoSizeService) {
            this.autoSizeService.resize();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.disabled && !changes.disabled.firstChange) ||
            (changes.marginHeight && !changes.marginHeight.firstChange)) {
            this.resize();
        }
    }

    ngOnDestroy() {
        if (this.autoSizeService) {
            this.autoSizeService.remove(this.parentNode, this.node, this);
        }
    }

    get elementRef() {
        return this.element;
    }

    adjustWidth() {
        if (!this.disabled && this.calcWidth) {
            if (this.width) {
                this.domHandler.jQuery(this.element.nativeElement).width(this.width);
            } else {
                this._calcWidth = Math.max(this.getWidthComponentArea() - this.marginWidth, this.minWidth);
                this.domHandler.jQuery(this.element.nativeElement).width(this._calcWidth);
                this.widthChange.emit(this._calcWidth);
            }
        } else {
            this.element.nativeElement.style.width = undefined;
        }
    }

    adjustHeight(options?: {marginRootHeight: number}) {
        if (!this.disabled && this.calcHeight) {
            if (this.height) {
                this.domHandler.jQuery(this.element.nativeElement).height(this.height);
                this.element.nativeElement.style.maxHeight = `${this.height}px`;
            } else {
                this._calcHeight = Math.max(this.calcHeightBasedOnElement(options) - this.marginHeight, this.minHeight);
                this.domHandler.jQuery(this.element.nativeElement).height(this._calcHeight);
                this.element.nativeElement.style.maxHeight = `${this._calcHeight}px`;
                this.heightChange.emit(this._calcHeight);
            }
        } else {
            this.element.nativeElement.style.height = null;
            this.element.nativeElement.style.maxHeight = null;
            this.heightChange.emit(null);
        }
    }

    public getHeighTop(): number {
        return this.getElement()[0].offsetTop;
    }

    public getHeighWindowComponent(): number {
        return this.domHandler.jQuery(".component-restricted-area").height();
    }

    public getWidthWindowComponent(): number {
        return this.domHandler.jQuery(".component-restricted-area").width();
    }

    public getWidthComponentArea(): number {
        return this.domHandler.jQuery(this.element.nativeElement).closest('.component-restricted-area').width();
    }

    public getWindowRootNode(el: Element): any {
        return this.domHandler.jQuery(el).closest(".root-component-restricted-area,.dx-popup-content");
    }

    public getRootNode(el: Element): any {
        return this.domHandler.jQuery(el).closest(".component-restricted-area,.dx-popup-content");
    }

    public calcHeightBasedOnElement(options?: {marginRootHeight: number}): number {

        const windowComponentElement = this.getWindowRootNode(this.element.nativeElement);

        /* Nó Raiz */
        const rootElement = this.getRootNode(this.element.nativeElement);

        if (rootElement[0] == windowComponentElement[0]) {
            if (options && options.marginRootHeight) {
                return windowComponentElement.height() - this.getHeighTop() - options.marginRootHeight;
            }
            return windowComponentElement.height() - this.getHeighTop();
        }

        return rootElement.height() - 30;
    }

    public getElement(): any {
        return this.domHandler.jQuery(this.elementRef.nativeElement);
    }

}