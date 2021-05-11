import { Injector, Input, SimpleChanges, ViewChild, Directive } from "@angular/core";
import {WindowStateAware} from "../../home/interfaces/window.state.aware";
import {Observable} from "rxjs";
import {WindowManagerService} from "../../home/services/window.manager.service";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {RelatorioVO} from "../../core/commons/classes/relatorio.vo";
import {ReportComponent} from "./report.component";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import * as _ from "lodash";
import {BaseComponent} from "../base-component/base.component";
import {AbstractReportFilterVO} from "../../core/commons/classes/abstract.report.filter.vo";

@Directive()
export abstract class AbstractReport<T extends AbstractReportFilterVO> extends BaseComponent implements WindowStateAware {

    private _reportComponent: ReportComponent<T>;

    active: boolean = false;

    maxToday: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);

    filter: T;

    @Input()
    embedded: boolean = false;

    get abrirEmNovaAba(): boolean {
        return this._reportComponent.abrirEmNovaAba;
    }

    @ViewChild(ReportComponent, { static: true })
    get reportComponent(): ReportComponent<T> {
        return this._reportComponent;
    }

    set reportComponent(value: ReportComponent<T>) {
        this._reportComponent = value;
        this.filter.parameters = value.reportViewParameters;
    }

    get validationGroupId(): string {
        if (this.validationGroup) {
            return this.validationGroup;
        }
        return this.reportComponent.validationGroupId;
    }

    private __wms: WindowManagerService;
    private utils: ObjectUtilsService;

    constructor(private _injector: Injector) {
        super(_injector);
        this.__wms = this._injector.get(WindowManagerService);
        this.utils = this._injector.get(ObjectUtilsService);

        this.setFilter(new this['reportFilterType']());
    }

    ngAfterContentChecked(): void {
        this.afterContentChecked();
    }

    ngAfterContentInit(): void {
        this.afterContentInit();
    }

    ngAfterViewChecked(): void {
        this.afterViewChecked();
    }

    ngAfterViewInit(): void {
        this.afterViewInit();
    }

    ngDoCheck(): void {
        this.doCheck();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.onChanges(changes);
    }

    ngOnDestroy(): void {
        this.active = false;
        this.onDestroy();
    }

    ngOnInit(): void {
        this.active = true;
        this._reportComponent.setParent(this);
        this.init();
    }

    onWindowFocusLost() {
    }

    onWindowFocused() {
    }

    canDoFilter(filterVO: T): boolean {
        return true;
    }

    abstract doFilter(filterVO: T): Observable<RelatorioVO>;

    loadEmbeddedContext(filter: T, parentContext: any): void {
        if (filter) {
            this.setFilter(filter);
        }
        this.onEmbeddedContextLoaded(parentContext);
    }

    doClear() {
        this.setFilter(new this['reportFilterType']());
        this.filter.parameters = this._reportComponent.reportViewParameters;
    }

    setFilter(f: T) {
        this.filter = f;
    }

    getFilter() {
        this.filter.parameters = this._reportComponent.reportViewParameters;
        return this.utils.removeEmptyProperties(this.filter);
    }

    handleError(error: ExceptionInfo): void {
        this._reportComponent.showException(error);
    }

    execFilter() {

        this.filter.parameters = this._reportComponent.reportViewParameters;

        const filter = this.getFilter();

        if (!this.canDoFilter(filter)) {
            return;
        }

        const reportObservable = this.doFilter(filter);

        if (reportObservable) {

            this._reportComponent.showLoading();

            reportObservable.subscribe(relatorioVO => {

                this._reportComponent.exibeRelatorio(relatorioVO);

            }, error => this.handleError(error))

        }

    }


    showLoading() {
        this._reportComponent.showLoading();
    }

    hideLoading() {
        this._reportComponent.hideLoading();
    }

    showSuccess(nomeRelatorio: string): void {
        this._reportComponent.showSuccess(nomeRelatorio);
    }

    showError(error: string): void {
        this._reportComponent.showError(error);
    }

    showException(exception: ExceptionInfo): void {
        this._reportComponent.showException(exception);
    }

    closeMessage(): void {
        this._reportComponent.closeMessage();
    }

    /**
     * Função de customização de formulários, que adiciona
     * suporte a validação server-side
     *
     * @param item
     */
    addServerValidation = (item) => {
        if (!item.validationRules) {
            item.validationRules = [];
        }

        const comp = this._reportComponent;
        const key = item.dataField;

        item.validationRules.push({
            type: 'custom',
            reevaluate: true,
            validationCallback: (params) => {

                let err = comp.getFilterError(key);
                if (!_.isNil(err)) {
                    params.rule.isValid = false;
                    params.rule.message = err;
                } else {
                    params.rule.isValid = true;
                }

                return params.rule.isValid;

            }
        });
    };

    serverValidation = (itemKey) => {

        const comp = this._reportComponent;

        return (params) => {

            let err = comp.getFilterError(itemKey);
            if (!_.isNil(err)) {
                params.rule.isValid = false;
                params.rule.message = err;
            } else {
                params.rule.isValid = true;
            }

            return params.rule.isValid;

        }

    };

    doClose() {
        this.__close();
    }

    private __close() {
        if (this.__wms) {
            this.__wms.deactivateByComponent(this);
        }
    }

    protected afterViewChecked() {
    }

    protected onChanges(changes: SimpleChanges) {
    }

    protected init() {
    }

    protected onDestroy() {
    }

    protected afterContentChecked() {
    }

    protected afterContentInit() {
    }

    protected doCheck() {
    }

    protected afterViewInit() {
    }

    protected onEmbeddedContextLoaded(parentContext: any) {
    }

}
