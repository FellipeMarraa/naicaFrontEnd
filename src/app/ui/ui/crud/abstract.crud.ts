import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';

import {concatMap, filter, first} from 'rxjs/operators';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    ElementRef,
    Injector,
    Input,
    NgZone,
    QueryList,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {CrudComponent} from "./crud.component";
import {Mode} from "./crud.mode";
import {ActivatedRoute, Router} from "@angular/router";
import {DomHandler} from "../../app/services/dom.handler";
import {WindowManagerService} from "../../home/services/window.manager.service";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {WindowStateAware} from "../../home/interfaces/window.state.aware";

import * as _ from 'lodash';
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {AppStateService} from "../../app/services/app.state.service";
import {GlobalLoadingIndicator} from "../../core/codec/decorator/global.loading.indicator.decorator";
import {DxDataGridComponent, DxFormComponent} from "devextreme-angular";
import {DevExtremeUtils} from "../classes/dev.extreme.utils";
import {BasePathService} from "../../core/commons/services/base.path.service";
import {DxoFormComponent} from "devextreme-angular/ui/nested";
import {ToastUiService} from "../services/toast.ui.service";
import {DevExtremeValidatorHelper} from "../classes/dev.extreme.validator.helper";
import {EnumUtils} from "../../app/classes/enum.utils";
import {BaseComponent} from "../base-component/base.component";
import {WindowState} from "../../home/classes/window.state";
import {Location} from "@angular/common";
import {JacksonService} from "@sonner/jackson-service-v2";
import {PopupConvention} from "../../core/commons/interfaces/popup.convention";
import {ModoEdicaoNovoRegistroEnum} from "../../core/auth/classes/model/modo.edicao.novo.registro.enum";

let instanceGen = 0;

/**
 *
 *
 * @export
 * @abstract
 * @class AbstractCrud
 * @implements {AfterViewInit}
 * @template T - model value object type
 * @template F - filter value object type
 */
@Directive()
export abstract class AbstractCrud<T, F> extends BaseComponent implements WindowStateAware, PopupConvention {

    @Input()
    model: T;

    @Input()
    filter: F;

    dataSource: T[] = [];
    currentEditingRow: any;
    firstConstruction = true;
    canDoFilterFlag = true;
    autoEditUniqueFilteredRecord = true;

    contentWidth: number;
    contentHeight: number;

    maxToday: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);

    @Input() embedded = false;

    @Input() editMode = false;

    @Input() multipleSelection = false;

    @Input() keepStateOnClose = false;

    @Input() doInit = true;

    @Input()
    set filterOnInit(value: boolean) {
        this.setFilterOnInit(value);
    }

    @Input()
    filterDataSource: Function = (data: T[]): T[] => {
        return data
    };

    @Input()
    validationGroup: string;

    private navigateToEditAfterSave: boolean = true;

    @ViewChild("mainEditForm") mainEditForm: DxFormComponent;
    @ViewChild("mainListForm") mainListForm: DxFormComponent;

    @ContentChildren(DxDataGridComponent) allGrids: QueryList<DxDataGridComponent>;
    @ContentChildren(DxoFormComponent) dxoForms: QueryList<DxoFormComponent>;
    @ViewChild(CrudComponent, {static: true}) crudComponent: CrudComponent<T, F>;

    //--------- TEMPLATE METHODS -------------

    /** doFilter() **/

    /**
     * Permite validar o objeto 'filter' antes do filtro
     * ser executado. É invocado antes do beforDoFilter()
     */
    canFilter(): boolean {
        return this.canDoFilterFlag;
    }

    /**
     * Callback invocado antes da execução do filtro
     *
     * Pode ser usado para transformar o objeto 'filter' antes
     * de a requisição para o servidor ser feita
     */
    beforeDoFilter() {
    }

    /**
     * Callback invocado após a execução do filtro
     */
    afterDoFilter() {

    }

    /**
     * @deprecated Define a lista de fields que serão retornados pelo
     * servidor. Esse método não deve ser usado uma vez que foi adotado
     * um comportamento padrão para todos os serviços do grp-web, onde
     * os fields com relação @OneToMany sempre são removidos.
     */
    getFilteredFieldsOnList() {
    }

    /**
     * @deprecated Define a lista de fields que serão retornados pelo
     * servidor. Esse método não deve ser usado uma vez que foi adotado
     * um comportamento padrão para todos os serviços do grp-web, onde
     * os fields com relação @OneToMany sempre são removidos.
     */
    getFilteredFieldsOnEdit() {
    }

    /** doSave() **/

    /**
     * Método de validação. Permite operações síncronas e assíncronas.
     *
     * Caso retorne 'false', a operação é cancelada.
     */
    canDoSave(): boolean | Observable<boolean> {
        return true;
    }

    /**
     * Callback invocado antes do serviço de save.
     * Pode ser usado para alterar o objeto 'model', ou fazer sincronização
     * com outros eventos.
     *
     * Permite operações síncronas e assíncronas, porém seu retorno
     * é ignorado.
     */
    beforeDoSave(): Observable<any> | null {
        return null;
    }


    @GlobalLoadingIndicator
    private __callSaveService(model) {
        return this.of(this.callSaveService(model));
    }

    /**
     * Invoca o serviço de save, recebe o model como argumento.
     *
     * @param model
     */
    callSaveService(model) {
        return this.getMainService().merge(model);
    }

    /**
     * Invoca o serviço de list, recebe o filtro como argumento.
     *
     * @param model
     */
    callFilterService(filter) {
        return this.getMainService().list(filter);
    }

    /**
     * Invoca o serviço de carregamento da entidade, recebe o id da entidade como argumento.
     *
     * @param model
     */
    callGetByIdService(id) {
        return this.getMainService().getById(id);
    }

    /**
     * Callback invocado com o resultado do serviço de save,
     * responsável por atualizar o estado do componente.
     *
     * A implementação default atualiza o objeto 'model', porém pode
     * ser sobrescrito caso o componente use outro atributo
     *
     * @param serviceResponse
     */
    updateModelAfterSave(serviceResponse) {
        this.setModel(serviceResponse);
    }

    /**
     * Callback invocado após a operação de save ser concluída.
     */
    afterDoSave() {
    }

    getSaveCompletedMessage() {
        return "Registro salvo com sucesso.";
    }

    getRemoveCompletedMessage() {
        return "Registro excluído com sucesso.";
    }

    /** doRemove() **/

    /**
     * Método de validação. Permite operações síncronas e assíncronas.
     *
     * Caso retorne 'false', a operação é cancelada.
     */
    canDoRemove(): boolean | Observable<boolean> {
        return true;
    }

    /**
     * Callback invocado antes do serviço de remove.
     * Pode ser usado para alterar o objeto 'model', ou fazer sincronização
     * com outros eventos.
     *
     * Permite operações síncronas e assíncronas, porém seu retorno
     * é ignorado.
     */
    beforeDoRemove(): Observable<any> | null {
        return null;
    }

    /**
     * Callback invocado após a operação de remove ser concluída.
     */
    afterDoRemove() {
    }

    /**
     * Invoca o serviço de remove, recebe o model como argumento.
     *
     * @param model
     */
    callDeleteService(model) {
        return this.getMainService().delete(model);
    }

    /** doCreateNew() **/

    beforeDoCreateNewOnEdit() {
    }

    /** doCancel() **/
    beforeDoCancel() {
    }

    afterDoCancel() {
    }

    canClose(): boolean | Observable<boolean> {
        return true;
    }

    protected errorAfterSave(error) {
    }

    //--------- FIM TEMPLATE METHODS -------------

    private _instanceId: number;

    private listGridSelectionSubject: Subject<any> = new Subject<any>();
    public isEditRecordSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);


    refreshModel: Subject<any> = new Subject<any>();

    compRouteId: string;
    private _route: ActivatedRoute;
    private _router: Router;
    private _location: Location;
    private domHandler: DomHandler;
    private rootEl: ElementRef;
    private currentIdParam;
    private currentWindow: WindowState;
    private currentWindowSubscription: Subscription;
    private utils: ObjectUtilsService;
    private __wms: WindowManagerService;
    private _jacksonService: JacksonService;
    private changeDetectorRef: ChangeDetectorRef;
    private ngZone: NgZone;
    private internalAppStateService: AppStateService;
    basePathService: BasePathService;
    toastService: ToastUiService;
    private filterSubscription: Subscription;

    public getNgZone() {
        return this.ngZone;
    }

    public getObjectUtilsService() {
        return this.utils;
    }


    // Poderia ser ----> abstract getMainService<X extends Function>(): any;
    public getMainService(): any {
        return null;
    }

    get instanceId(): number {
        return this._instanceId;
    }

    get validationGroupId(): string {
        if (this.validationGroup) {
            return this.validationGroup;
        }
        return this.crudComponent.validationGroupId;
    }

    toArrayOfSingle(element) {
        return element ? this.utils.toArrayOfSingle(element) : null;
    }

    applyToFilter(sourceObject: any, sourcePropertyName: string, targetPropertyName: string) {
        this.__applyProperty(sourceObject, this.filter, sourcePropertyName, targetPropertyName);
    }

    applyValueToFilter(targetPropertyName: string, value: any) {
        this.utils.applyFieldValueByHierarchyProperty(this.getFilter(), targetPropertyName, value);
    }

    applyToModel(sourceObject: any, sourcePropertyName: string, targetPropertyName: string) {
        this.__applyProperty(sourceObject, this.model, sourcePropertyName, targetPropertyName);
    }

    applyValueToModel(targetPropertyName: string, value: any) {
        this.utils.applyFieldValueByHierarchyProperty(this.getModel(), targetPropertyName, value);
    }

    applyEnumKeyToFilter(enumType: any, currentValue: any, targetPropertyName: string) {
        this.filter[targetPropertyName] = this.getEnumKey(enumType, currentValue);
    }

    applyEnumKeyToModel(enumType: any, currentValue: any, targetPropertyName: string) {
        this.model[targetPropertyName] = this.getEnumKey(enumType, currentValue);
    }

    applyEnumKeyToTargetObject(targetObject: any, enumType: any, currentValue: any, targetPropertyName: string) {
        if (targetObject) {
            targetObject[targetPropertyName] = this.getEnumKey(enumType, currentValue);
        }
    }

    enumValueOfByKey(type, targetKey) {
        if (type && targetKey) {
            return EnumUtils.valueOfByKey(type, targetKey);
        }
        return null;
    }

    enumKeys(type) {
        if (type) {
            return EnumUtils.keys(type);
        }
        return null;
    }

    enumValueOf(type, currentValue) {
        if (type && currentValue) {
            return EnumUtils.valueOf(type, currentValue);
        }
        return null;
    }

    enumGetKey(type, currentValue) {
        if (type && currentValue) {
            return EnumUtils.getKey(type, currentValue);
        }
        return null;
    }

    getEnumKey(enumType: any, currentValue: any) {
        if (enumType && currentValue) {
            return EnumUtils.getKey(enumType, currentValue);
        }
        return null;
    }

    __applyProperty(sourceObject: any, targetObject: any, sourcePropertyName: string, targetPropertyName: string) {
        if (sourceObject && targetObject) {
            this.applyFieldValueByHierarchyProperty(targetObject, targetPropertyName, sourceObject[sourcePropertyName]);
        }
    }

    applyFieldValueByHierarchyProperty(targetObject: any, targetPropertyName: string, value: any) {
        this.utils.applyFieldValueByHierarchyProperty(targetObject, targetPropertyName, value);
    }

    focusGridRowCell(grid: DxDataGridComponent, rowIndex: number, columnName: string) {
        grid.instance.cellValue(rowIndex, columnName);
        grid.instance.editCell(rowIndex, columnName);
    }

    navigateToEditMode(id, showSaveMsg: boolean = false, closeCurrentComponent: boolean = false) {
        if (id) {
            this.basePathService.getBasePath(this).subscribe(path => {
                const extras = showSaveMsg ? {fragment: 'saved'} : undefined;
                this._router.navigate([`${path}/edit/${id}`], extras).then(() => {
                    //this.__close(this.getMode());
                });

            }, this.handleError);
        }
    }

    navigateToListMode() {
        this.basePathService.getBasePath(this).subscribe(path => {
            this._router.navigate([`${path}`]).then(() => {
            });

        }, this.handleError);
    }

    navigateToCreateNewMode() {
        this.beforeCreateNewMode();
        this.basePathService.getBasePath(this).subscribe(
            path => {
                this._router.navigate([`${path}/create`]);
                this.afterCreateNewMode();
            },
            this.handleError);

    }

    /**
     * Callback invocado após um novo mode ser criado
     */
    beforeCreateNewMode() {

    }

    afterCreateNewMode() {

    }

    constructor(private _injector: Injector) {
        super(_injector);
        this._route = this._injector.get(ActivatedRoute);
        this._router = this._injector.get(Router);
        this._location = this._injector.get(Location);
        this.domHandler = this._injector.get(DomHandler);
        this.rootEl = this._injector.get(ElementRef);
        this.__wms = this._injector.get(WindowManagerService);
        this._jacksonService = this._injector.get(JacksonService);
        this.utils = this._injector.get(ObjectUtilsService);
        this.changeDetectorRef = this._injector.get(ChangeDetectorRef);
        this.ngZone = this._injector.get(NgZone);
        this.internalAppStateService = this._injector.get(AppStateService);
        this.basePathService = this._injector.get(BasePathService);
        this.toastService = this._injector.get(ToastUiService);
        this.handleError = this.handleError.bind(this);
        this.focusGridRowCell = this.focusGridRowCell.bind(this);

        this._instanceId = instanceGen++;

        if (this.validationGroup) {
            this.crudComponent.validationGroupId = this.validationGroup;
        }
        this.newFilterAndModelIfNull();
        this.filterSubscription = this['filterSubject'].subscribe(() => {

            if (this.isListMode()) {
                this.execFilter(false);
            }
        });
    }

    newFilterAndModelIfNull() {
        this.newFilterIfNull();
        this.newModelIfNull();
    }

    newFilterIfNull() {
        if (!this.filter) {
            this.filter = new this['filterConstructor']();
        }
    }

    newModelIfNull() {
        if (!this.model) {
            this.setModel(new this['modelConstructor']());
        }
    }

    setMustSetGridRowClick(mustSetGridRowClick: boolean) {
        if (this.crudComponent) {
            this.crudComponent.setMustSetGridRowClick(mustSetGridRowClick);
        }
    }

    onWindowFocused() {
        this.crudComponent.active = true;
        this.crudComponent.resize();
        this.focusOnFirstInputIfForm();
        if (this.firstConstruction) {
            this.firstConstruction = false;
            setTimeout(() => {
                if (this.getMode() == Mode.List && this.crudComponent.filterOnInit) {
                    this.doFilter();
                }
            });
        } else {
            setTimeout(() => {
                if (this.getMode() == Mode.List) {
                    if (this.crudComponent.filterOnFocused) {
                        this.doFilter();
                    }
                }
            });
        }
    }

    onWindowFocusLost() {
        this.crudComponent.active = false;
    }

    detectChanges() {
        setTimeout(() => {
            const grid = this.crudComponent.getMainListGrid();
            if (grid) {
                grid.dataSource = null;
                grid.instance.option('dataSource', this.dataSource);
                grid.instance.refresh();

                try {
                    setTimeout(() => {
                        if (!this.changeDetectorRef['destroyed']) {
                            this.changeDetectorRef.detectChanges();
                        }
                    });
                } catch (e) {
                    // ignore
                }
            }
        });
    }

    /*
     * template methods of angular lifecycle
     */

    doAfterViewChecked(): void {
        this.afterViewChecked();
    }

    doAfterViewInit() {
        this.crudComponent.embedded = this.embedded;
        this.crudComponent.multipleSelection = this.multipleSelection;
        // this.crudComponent.autoSizeService.resize();
        this.navigateToEditAfterSave = !this.crudComponent.onlyEditMode;
        this.ifEnterOnListFilterFields();
        this.focusOnFirstInputIfForm();
        this.crudComponent.doAfterViewInit();
        this.calcContentSize();
        this.afterViewInit();
    }

    doDoCheck(): void {
        this.doCheck();
    }

    doOnInit(): void {
        this.focusFirstInputOnInit = true;

        this.currentWindowSubscription = this.internalAppStateService.currentWindow.subscribe(currentWindow => {
            this.currentWindow = currentWindow;
        });

        if (!this.embedded) { //modo normal, component iniciado via rota

            if (this.isRouteCreateMode()) {
                this.setModeToEdit();
                this.setFreshNewModel();

                if (this.canDoInit())
                    this.init();
            } else {
                this.setModeToList();
            }


            const params = this._route.snapshot.paramMap;
            const id = params.get("id");

            if (this._route.snapshot.data[0] && this._route.snapshot.data[0].routeId) {
                this.compRouteId = this._route.snapshot.data[0].routeId;
            }

            if (id) {
                this.setModeToEdit();
                this.runOnIdParam(id);
            } else if (this.isNewRecord()) {
                this.crudComponent.editToolbarNewButtonShow = false;
                this.crudComponent.editToolbarDeleteButtonShow = false;
            }

            if (this.getMode() == Mode.List) {
                if (this.canDoInit())
                    this.init();
            }

        } else { //modo embarcado

            if (this.editMode) {
                this.setModeToEdit();
            } else {
                this.setModeToList();
            }
            if (this.canDoInit()) {
                this.init();
            }
        }

    }

    providedValue(): any {
        if (this.isListMode()) {
            return this.getSelectedItem();
        } else {
            return this.getModel();
        }
    }

    receiveValue(value) {
        this.setModel(value);
    }

    providedValueObservable(): Observable<any> {
        if (this.isListMode()) {
            return this.listGridSelectionSubject;
        }
        return undefined;
    }

    onPopupHide() {
        if (!this.keepStateOnClose) {
            this.doClear(this.getMode());
        }
    }

    onPopupShow() {
        // this.crudComponent.fixListGridHeight();
        this.onWindowFocused();
    }

    onPopupResize() {
        if (this.crudComponent) {
            this.crudComponent.resize();
        }
    }

    setMarginRootHeight(marginRootHeight: number) {
        this.crudComponent.setMarginRootHeight(marginRootHeight);
    }

    doOnChanges(changes: SimpleChanges): void {
        this.onChanges(changes);
    }

    doOnDestroy(): void {

        //Sempre destroy a session storage no list
        if (this.getMode() === Mode.List) {
            this.clearSessionStorage();
        }

        this.filterSubscription.unsubscribe();

        if (this.currentWindowSubscription) {
            this.currentWindowSubscription.unsubscribe();
        }

        this.crudComponent.doOnDestroy();

        this.onDestroy();
    }

    doAfterContentChecked(): void {
        this.afterContentChecked();
    }

    doAfterContentInit(): void {
        this.crudComponent.setParent(this);

        if (this._route.snapshot.fragment == 'saved') {
            this.toastSaveMessage(false);
        }

        if (this.embedded && this.isListMode()) {
            this.crudComponent.listRowDbClickHandler = (data) => {
                this.listGridSelectionSubject.next(data);
            };
        }
        this.internalAppStateService.resizedWindow.next(); //notify resize window after content init
        this.afterContentInit();
    }

    private isRouteCreateMode(): boolean {
        let path = this._router.url;
        return new RegExp("/create", "i").test(path);
    }

    private isRouteEditMode(): boolean {
        let path = this._router.url;
        if (new RegExp("/dismiss-route", "i").test(path)) {
            path = this.getUrlFromCurrentWindow();
        }
        return this.checkRouteEditMode(path);
    }

    private checkRouteEditMode(path): boolean {
        return new RegExp("/edit", "i").test(path);
    }

    private getUrlFromCurrentWindow() {
        if (this.currentWindow) {
            const activatedRoute = this.currentWindow.context.activatedRoute;
            if (activatedRoute) {
                return this.currentWindow
                    .context
                    .activatedRoute
                    .snapshot["_routerState"]["url"];
            }
        }
    }

    private runOnIdParam(id: any) {
        this.currentIdParam = id;
        this.onIdParam(id);
    }

    /**
     * fazer overriding para ser invocado quando uma rota contendo determinado
     * ID for invocada para o respectivo componente de CRUD.
     * @param id
     */
    @GlobalLoadingIndicator
    onIdParam(id: any) {
        if (id) {
            return this.of(this.callGetByIdService(id), (m) => {
                if (m) {
                    this.isEditRecordSubject.next(true);
                    this.setModel(m);
                    this.init();
                }
            });
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

    ngOnDestroy(): void {
        this.doOnDestroy();
    }

    protected afterContentChecked() {
    }

    protected afterContentInit() {
    }

    protected doCheck() {
    }

    protected afterViewInit() {
    }

    protected ifEnterOnListFilterFields() {
        const self = this;
        const rootEl = this.rootEl.nativeElement;
        const ctx = this.domHandler.jQueryWithContext("div[crud-list-filter-fields]", this.domHandler.jQuery((rootEl)));
        const doFilter = this.doFilter;
        this.domHandler.keypressHandlerOnEach("input", ctx, function () {

            // obrigatoriamente rodar no proximo event loop - nao remover
            setTimeout(function () {
                self.execFilter();
            })
        });
    }

    getMode() {
        return this.crudComponent.getMode();
    }

    getModes() {
        return this.crudComponent.getModes();
    }

    isListMode() {
        return this.getMode() == Mode.List;
    }

    isEditMode() {
        return this.getMode() == Mode.Edit;
    }

    getFixedArea() {
        return this.crudComponent.getFixedArea();
    }

    setModeToList() {
        this.setMode(Mode.List);
    }

    setFreshNewModel() {
        const model: any = new (<any>this).modelConstructor();
        this.setModel(model);
        this.onNew(this.getMode());
    }

    onNew(mode: Mode) {
    }

    setModeToEdit() {
        this.setMode(Mode.Edit);
    }

    setMode(mode: Mode) {
        this.crudComponent.setMode(mode);
    }

    onEditMode(data) {
        // this.setModel(data); //set duplicado, pois já e feito consulta via onIdParam

        this.navigateToEditMode(data.id); // convencionado property 'id'
    }

    setFilter(f: F) {
        this.filter = f;
    }

    setModel(m: T) {
        this.model = m;
        this.refreshModel.next();
    }

    getFilter(): any {
        return this.filter;
    }

    getModel(): any {
        return this.model;
    }

    valueChanged(e, targetObject, targetKey) {
        const _self = this;
        if (_self[targetObject]) {
            _self[targetObject][targetKey] = e.value;
        }
    }

    setDataSource(data: T[]) {
        this.dataSource = this.filterDataSource(data);

        // force change detection
        this.detectChanges();
    }

    getSelectedItem(): any {
        return this.crudComponent.selectedItem;
    }

    getDataSource(): T[] {
        return this.dataSource;
    }

    showErrorMessage(message: string | string[]): void {
        this.crudComponent.showErrorMessage(message);
    }

    showSuccessMessage(message: string | string[]): void {
        this.crudComponent.showSuccessMessage(message);
    }

    hideMessages(): void {
        this.crudComponent.hideMessages();
    }

    clearErrorMessages(): void {
        this.hideMessages();
    }

    showInfoMessage(message: string | string[]): void {
        this.crudComponent.showInfoMessage(message);
    }

    showWarningMessage(message: string | string[]): void {
        this.crudComponent.showWarningMessage(message);
    }

    handleError(error: ExceptionInfo): void {
        console.error(error);
        this.crudComponent.handleError(error);
        this.afterHandleError(error);
    }

    afterHandleError(error?: ExceptionInfo): void {
    }

    clearValidation(): void {
        this.crudComponent.clearValidation();
    }

    resetValidators() {
        this.clearValidation();
        if (this.validationGroupId) {
            DevExtremeValidatorHelper.resetValidatorsByValidationGroup(this.validationGroupId);
        }
    }

    @GlobalLoadingIndicator
    execFilter(ocultarFiltros: boolean = true) {
        return this.doFilter(ocultarFiltros);
    }

    ocultarFiltros() {
        if (this.crudComponent.isCollapsibleFilters() && !_.isNil(this.crudComponent.getCollapsibleState())) {
            this.crudComponent.ocultarFiltros();
        }
    }

    exibirFiltros() {
        if (this.crudComponent.isCollapsibleFilters() && _.isNil(this.crudComponent.getCollapsibleState())) {
            this.crudComponent.exibirFiltros();
        }
    }

    setCanDoFilter(canDoTheFilter: boolean) {
        this.canDoFilterFlag = canDoTheFilter;
    }

    setAutoEditUniqueFilteredRecord(autoEditUniqueFilteredRecord: boolean) {
        this.autoEditUniqueFilteredRecord = autoEditUniqueFilteredRecord;
    }

    @GlobalLoadingIndicator
    doFilter(ocultarFiltros: boolean = true) {
        if (this.canFilter()) {
            this.beforeDoFilter();
            return this.of(this.callFilterService(this.clearObj(this.filter)), (ds) => {
                this.setDataSource(ds);
                this.hideMessages();
                if (!_.isEmpty(this.getDataSource())) {
                    if (!this.embedded && this.autoEditUniqueFilteredRecord && this.getDataSource().length == 1 && this.temParametrosFiltro(this.filter)) {
                        this.onEditMode(this.getDataSource()[0]);
                    } else {
                        if (ocultarFiltros) {
                            this.ocultarFiltros();
                        }
                    }
                }
                this.afterDoFilter();
            });
        }
        return null;
    }

    temParametrosFiltro(filter: any) : boolean {
        for (let i in filter) {
            if (filter.hasOwnProperty(i) && filter[i]) {
                return true;
            }
        }
        return false;
    }

    canDoInit(): boolean {
        return this.doInit;
    }

    setLoadingIndicator(visible: boolean) {
        this.internalAppStateService.setGlobalLoadPanelVisible(visible);
    }

    doCreateNew(mode: Mode) {
        if (this.isRouteCreateMode()) {
            this.setFreshNewModel();
            this.beforeDoCreateNewOnEdit();
            return;
        }

        this.basePathService.getBasePath(this).subscribe(
            path => {
                this.internalAppStateService.currentUser.pipe(first()).subscribe(usuario => {
                    let hash = undefined;
                    if (mode == Mode.Edit && usuario.modoEdicaoNovoRegistro == ModoEdicaoNovoRegistroEnum.JANELA_CORRENTE) {
                        hash = {fragment: 'new'};
                    }
                    this._router.navigate([`${path}/create`], hash);
                });
            }, this.handleError);
    }


    fromProto(target: any) {
        // return Object.create(target.prototype || target.__proto__);
        return new target.constructor();
    }


    doSoon(fn: Function) {
        if (this.utils.typeOf(fn) === 'function') {
            fn = fn.bind(this);
            setTimeout(() => {
                fn();
            })
        }
    }

    doNext(fn: Function) {
        if (this.utils.typeOf(fn) === 'function') {
            fn = fn.bind(this);
            setTimeout(() => {
                fn();
            }, 1000);
        }
    }

    focusOnFirstInputIfForm() {
        if (this.isListMode()) {
            if (this.mainListForm) {
                DevExtremeUtils.focusOnFirstInput(this.mainListForm);
            }
        }

        if (this.isEditMode()) {
            if (this.mainEditForm) {
                DevExtremeUtils.focusOnFirstInput(this.mainEditForm);
            }
        }
    }

    doClear(mode: Mode) {
        this.setFilter(this.fromProto(this.getFilter()));
        this.setModel(this.fromProto(this.getModel()));
        this.setDataSource([]); // OBRIGATORIO: NÃO SETAR O DATASOURCE PARA NULL E SIM NOVO EMPTY ARRAY COMO ESTÁ!
        this.focusOnFirstInputIfForm();
        this.exibirFiltros();
    }

    doClose(mode: Mode) {
        let resp: any = this.canClose();

        if (resp.subscribe) {
            resp.subscribe(r => {
                if (r) {
                    this.__close(mode);
                }
            })
        } else if (resp) {
            this.__close(mode);
        }
    }

    private __close(mode: Mode) {
        if (this.__wms) {
            this.__wms.deactivateByComponent(this);
        }
    }

    toastSaveMessage(isAlsoClose: boolean) {
        if (!isAlsoClose && (!this.isRouteCreateMode() || !this.navigateToEditAfterSave)) {
            this.showSuccessMessage(this.getSaveCompletedMessage());
            setTimeout(() => {
                this.hideMessages();
                if (this._location.path(true).indexOf('#saved') > 0 || this._location.path(true).indexOf('#saved') > 0) {
                    this._location.replaceState(this._location.path(false));
                }
            }, 5000);
        }
    }

    doSave(isAlsoClose: boolean, showSuccessMessage: boolean = true) {

        this.clearErrorMessages();

        return this.of(this.runCanDoSave()
            .pipe(
                filter(isValid => isValid),
                concatMap(_ => this.runBeforeDoSave()),
                concatMap(_ => {
                    let m = this.clearObj(this.model);
                    return this.__callSaveService(m);
                })
            ), m => {
            this.updateModelAfterSave(m);
            if (showSuccessMessage) {
                this.toastSaveMessage(isAlsoClose);
            }
            this.afterDoSave();

            if (isAlsoClose) {
                this.__close(this.getMode());
                if (showSuccessMessage) {
                    this.toastService.showSuccess(this.getSaveCompletedMessage());
                }
                this['filterSubject'].next();
            } else if (this.navigateToEditAfterSave && this.isRouteCreateMode() && this.model['id']) {
                //se for create mode, navega para o modo de edição
                this.navigateToEditMode(this.model['id'], showSuccessMessage, true);
            } else {
                if (showSuccessMessage) {
                    this.showSuccessMessage(this.getSaveCompletedMessage());
                }
            }

        }, error => {
            this.handleError(error);
            this.errorAfterSave(error);
        });
    }

    private runCanDoSave() {
        let obsValidation = this.canDoSave();
        if (this._.isNil(obsValidation) || this._.isBoolean(obsValidation)) {
            obsValidation = of(obsValidation);
        }
        return obsValidation;
    }

    private runBeforeDoSave() {
        let observable: Observable<any> = this.beforeDoSave();
        if (!observable) {
            observable = of(true);
        }
        return observable;
    }

    @GlobalLoadingIndicator
    doRemove() {

        return this.of(this.runCanDoRemove().pipe(
            filter(canRemove => canRemove),
            concatMap(_ => this.runBeforeDoRemove()),
            concatMap(_ => {
                let m = this.clearObj(this.model);
                return this.callDeleteService(m);
            })
        ), data => {
            this['filterSubject'].next();
            this.afterDoRemove();
            this.__close(this.getMode());
            this.toastService.showSuccess(this.getRemoveCompletedMessage());
        });

    }

    private runBeforeDoRemove() {
        let observable: Observable<any> = this.beforeDoRemove();
        if (!observable) {
            observable = of(true);
        }
        return observable;
    }

    private runCanDoRemove() {
        let obsValidation = this.canDoRemove();
        if (this._.isNil(obsValidation) || this._.isBoolean(obsValidation)) {
            obsValidation = of(obsValidation);
        }
        return obsValidation;
    }

    @GlobalLoadingIndicator
    doCancel() {
        this.beforeDoCancel();
        // manter mesmo comportamento do GWT
        if (this.currentIdParam) {
            this.runOnIdParam(this.currentIdParam);
        } else {
            this.setFreshNewModel();
        }

        this.afterDoCancel();
    }

    getDomHandler() {
        return this.domHandler;
    }


    isExceptionInfo(payload): boolean {
        return payload && payload.tipo && payload.className && (payload.mensagens || payload.messageException || payload.stackTrace);
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

        const comp = this.crudComponent;
        const key = item.dataField;

        item.validationRules.push({
            type: 'custom',
            reevaluate: true,
            validationCallback: (params) => {

                let err = comp.getEditModelError(key);
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

        const comp = this.crudComponent;

        return (params) => {

            let err = comp.getEditModelError(itemKey);
            if (!_.isNil(err)) {
                params.rule.isValid = false;
                params.rule.message = err;
            } else {
                params.rule.isValid = true;
            }

            return params.rule.isValid;

        }

    };

    clearObj(obj: any): any {
        return this.utils.removeEmptyProperties(obj);
    }

    onCurrentEditingRow(e: any) {
        this.currentEditingRow = e.data;
    }

    setFilterOnInit(value: boolean) {
        this.crudComponent.filterOnInit = value;
    }

    isNewRecord(): boolean {
        if (this.embedded && this.editMode && this.getModel() && this.getModel()['id']) {
            return true;
        }
        return this.isRouteCreateMode();
    }

    isEditRecord(): boolean {
        if (this.embedded && this.editMode && this.getModel() && this.getModel()['id']) {
            return true;
        }
        return this.isRouteEditMode();
    }

    getMainEditForm(): DxFormComponent {
        return this.mainEditForm;
    }

    getFieldValueByHierarchyProperty(obj: any, dataField: string) {
        return this.utils.getFieldValueByHierarchyProperty(obj, dataField);
    }

    // session storage
    setItemSessionStorage(key, value) {
        if (!_.isNil(value)) {
            sessionStorage.setItem(this.getCompositekey(key), btoa(this._jacksonService.encodeToJson(value)));
        } else {
            this.removeItemSessionStorage(key);
        }
    }

    removeItemSessionStorage(key) {
        sessionStorage.removeItem(this.getCompositekey(key));
    }

    getItemSessionStorage(key, classType: Function) {
        const serialized = sessionStorage.getItem(this.getCompositekey(key));
        if (serialized) {
            return this._jacksonService.decode(JSON.parse(atob(serialized)), classType);
        }
    }

    getCompositekey(key) {
        return this.constructor.name + key;
    }

    clearSessionStorage() {
        const keys = Object.keys(sessionStorage);
        if (keys)
            keys.forEach(key => {
                if (key.includes(this.constructor.name)) {
                    sessionStorage.removeItem(key);
                }
            })
    }

    /**
     * Controla se o model pode ser editado ou não, desabilita os botões de controle;
     * @param flag
     */
    allowEditing(flag: boolean) {
        this.crudComponent.editToolbarSaveButtonShow = flag;
        this.crudComponent.editToolbarSaveCloseButtonShow = flag;
        if (this.isEditRecord()) {
            this.crudComponent.editToolbarDeleteButtonShow = flag;
        }
    }

    /**
     * Controla botões de save da toolbar
     * @param flag
     */
    allowSaving(flag: boolean) {
        this.crudComponent.editToolbarSaveButtonShow = flag;
        this.crudComponent.editToolbarSaveCloseButtonShow = flag;
    }

    setToolbarFilterEmbedded() {
        this.crudComponent.listToolbarNewButtonShow = false;
        this.crudComponent.listToolbarCloseButtonShow = false;
    }

    calcContentSize() {
        let element = this.domHandler.jQuery("#content-body");
        this.contentWidth = element.width();
        this.contentHeight = element.height();
    }
}
