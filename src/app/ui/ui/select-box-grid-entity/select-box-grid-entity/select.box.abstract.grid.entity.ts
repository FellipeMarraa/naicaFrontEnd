import {Directive, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {DxDataGridComponent, DxDropDownBoxComponent, DxTreeListComponent} from "devextreme-angular";
import {BaseComponent} from "../../base-component/base.component";
import {SonnerBaseEntity} from "../../../core/commons/classes/sonner.base.entity";
import {DomHandler} from "../../../app/services/dom.handler";
import DevExpress from "devextreme";
import {Subscription} from "rxjs";
import {ValueDisplayable} from "../../classes/value.displayable";
import GridBaseColumn = DevExpress.ui.GridBaseColumn;

@Directive()
export abstract class SelectBoxAbstractGridEntity extends BaseComponent {

    protected abstract grid(): DxTreeListComponent | DxDataGridComponent;

    @ViewChild(DxDropDownBoxComponent, {static: true}) dropdownbox: DxDropDownBoxComponent;

    @Input() filterRow: boolean = true;
    @Input() width: number|string = "100%";
    @Input() height: number|string = "100%";
    @Input() placeholder = "Selecionar...";
    @Input() displayExpr: string | Function = this.getDisplayExpr.bind(this);
    @Input() showClearButton = true;
    @Input() disabled = false;
    @Input() tabIndex: number;
    @Input() visible: boolean = true;
    @Input() readOnly = false;
    @Input() paging: {
        enabled: boolean;
        pageIndex?: number;
        pageSize: number;
    } = {
        enabled: true,
        pageSize: 10
    };

    private _dataSource: SonnerBaseEntity[] = [];
    private _columns: Array<GridBaseColumn> = [];
    private _value: SonnerBaseEntity;

    get dataSource(): SonnerBaseEntity[] {
        return this._dataSource;
    }

    @Input()
    set dataSource(value: SonnerBaseEntity[]) {
        this._dataSource = value;
        this._value = this.getReferenceValue(this._value);
        this.selectRow(this.getKeySelectedRow());
    }

    get columns(): Array<GridBaseColumn> {
        return this._columns;
    }

    @Input()
    set columns(value: Array<GridBaseColumn>) {
        this._columns = value;
    }

    get value() {
        return this._value;
    }

    @Input()
    set value(value) {
        if (this._value != value) {
            this._value = this.getReferenceValue(value);
            this.selectRow(!!this._value ? this._value.getId() : null);
            this.valueChange.emit(this._value);
        }
    }

    @Output() valueChange = new EventEmitter<SonnerBaseEntity>();

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    constructor(injector: Injector,
                private domHandler: DomHandler = injector.get(DomHandler)) {
        super(injector)
        this.getDisplayExpr = this.getDisplayExpr.bind(this);
    }

    onKeyDownSubscription: Subscription;
    onContentReadySubscription: Subscription;
    onRowClickSubscription: Subscription;

    protected doOnDestroy() {
        this.unsubscribeAll();
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    protected getKeySelectedRow(): SonnerBaseEntity {
        return !!this.grid() ? this.grid().instance.getSelectedRowKeys()[0] : null;
    }

    private unsbcr(value: Subscription) {
        if (!!value) {
            value.unsubscribe();
        }
    }

    private unsubscribeAll() {
        this.unsbcr(this.onKeyDownSubscription);
        this.unsbcr(this.onRowClickSubscription);
        this.unsbcr(this.onContentReadySubscription);
    }

    private preparaGrid(event) {
        if (!!this.grid()) {

            this.unsubscribeAll();

            this.onKeyDownSubscription = this.grid().onKeyDown.subscribe(event => {
                this.onKeyDown(event);
            })

            this.onRowClickSubscription = this.grid().onRowClick.subscribe(event => {
                this.onRowClick(event);
            })

            this.grid().instance.option("dataSource", this.dataSource);
            this.grid().instance.option("keyExpr", "id");
            this.grid().instance.option('columns', this.columns);
            this.grid().instance.option('hoverStateEnabled', true);
            this.grid().instance.option('selection', {mode: 'single', recursive: false});
            this.grid().instance.option('filterRow', {visible: this.filterRow});
            this.grid().instance.option('paging', this.paging);
            this.applyWidthContainer();

            this.grid().instance.refresh().then(() => {
                return this.selectRow(!!this._value ? this._value.getId() : null);
            }).then((a) => {
                return this.grid().instance.focus();
            }).then((e) => {
                this.afterOpened(e);
            })
        }
    }

    protected afterOpened(e) {
    }

    private getReferenceValue(value: SonnerBaseEntity) {
        if (!!value && !!this.dataSource) {
            this.dataSource.forEach(entity => {
                if (entity.getId() != null) {
                    if (entity.getId() == value.getId()) {
                        value = entity
                        return;
                    }
                }
            });
        }
        return value;
    }

    protected closeDropdown() {
        this.dropdownbox.instance.close();
    }

    private applyWidthContainer() {
        let gridWidth = this.grid().instance.option("width");
        const element = this.grid().instance.element();
        if (element) {
            const parent = this.domHandler.jQuery(element).parent().parent().parent();
            if (gridWidth) {
                parent.width(gridWidth);
            }
        }
    }

    protected selectRow(keyExpr: any): Promise<any> {
        if (!!this.grid()) {
            let pageCount = this.grid().instance.pageCount(),
                pageIndex = this.grid().instance.pageIndex()

            if (!keyExpr) {
                this.grid().instance.selectRowsByIndexes([0]);
            } else {
                let index = this.grid().instance.getRowIndexByKey(keyExpr);
                if (index < 0) {
                    pageIndex = pageIndex + 1 > pageCount - 1 ? 0 : pageIndex + 1;

                    this.grid().instance.pageIndex(pageIndex)['then'](() => {
                        this.selectRow(keyExpr);
                    });
                } else {
                    return this.grid().instance.selectRows(keyExpr, false);
                }
            }
        }
        return new Promise<any>((a) => a());
    }

    protected onKeyPress(event) {
    }

    onOpened(event) {
        this.preparaGrid(event);
    }


    onValueChanged(e: any) {
        if (e === null) {
            this.valueChange.emit(null);
        }
    }

    onRowClick(event: any) {
        if (event.isSelected) {
            this.value = event.data;
            this.closeDropdown();
        }
    }

    getDisplayExpr(entity) {
        const isDisplayabled = (value: any): value is ValueDisplayable => {
            return value.getDisplayValue !== undefined;
        }

        if (entity) {
            let displayExpr = [];
            if (!this._.isEmpty(this._columns)) {
                this._columns.forEach(col => {
                    if (this._.get(entity , col.dataField)) {
                        displayExpr.push(isDisplayabled(this._.get(entity , col.dataField)) ? this._.get(entity , col.dataField).getDisplayValue() : this._.get(entity , col.dataField));
                    }
                })
            }
            return displayExpr.join(" - ");
        }
    }

    protected onKey(event: any, keys: string | string[], consumer: () => void) {
        if (!!event && !!event.event && (this._.isArray(keys) ? keys.some(key => key == event.event.key) : keys == event.event.key) && this.dropdownbox.opened) {
            event.event.preventDefault();
            consumer();
        }
    }

    onKeyDown(event: any) {
        this.onKey(event, 'Escape', () => {
            this.closeDropdown();
        })

        this.onKey(event, ['Tab', 'Enter'], () => {
            if(!this._.isEmpty(this.dataSource)) {
                this.value = this.dataSource.find(item => item.getId() == this.getKeySelectedRow());
            }
            this.closeDropdown();
        })

        this.onKey(event, 'ArrowDown', () => {
            new Promise((acept: (keyExpr: any) => void) => {
                let itens = this.grid().instance.getDataSource().items(),
                    index = this.grid().instance.getRowIndexByKey(this.getKeySelectedRow()) || 0,
                    pageIndex = this.grid().instance.pageIndex(),
                    currentPageSize = itens.length,
                    pageCount = this.grid().instance.pageCount();

                if (this._.isEmpty(this._dataSource)) {
                    acept(null);
                } else if ((index + 1) > currentPageSize - 1) {
                    pageIndex = pageIndex + 1 > pageCount - 1 ? 0 : pageIndex + 1;

                    (this.grid().instance.pageIndex(pageIndex) as Promise<void> & JQueryPromise<void>).then(() => {
                        acept(this.grid().instance.getKeyByRowIndex(0));
                    });
                } else {
                    acept(this.grid().instance.getKeyByRowIndex(index + 1));
                }
            }).then((keyExpr) => {
                this.selectRow(keyExpr);
            });
        })

        this.onKey(event, 'ArrowUp', () => {
            new Promise((acept: (keyExpr: any) => void) => {
                let index = this.grid().instance.getRowIndexByKey(this.getKeySelectedRow()) || 0,
                    pageIndex = this.grid().instance.pageIndex(),
                    pageCount = this.grid().instance.pageCount();

                if (this._.isEmpty(this._dataSource)) {
                    acept(null);
                } else if ((index - 1) < 0) {
                    pageIndex = pageIndex - 1 < 0 ? pageCount - 1 : pageIndex - 1;

                    (this.grid().instance.pageIndex(pageIndex) as Promise<void> & JQueryPromise<void>).then(() => {
                        let itens = this.grid().instance.getDataSource().items(),
                            currentPageSize = itens.length;
                        acept(this.grid().instance.getKeyByRowIndex(currentPageSize - 1));
                    });
                } else {
                    acept(this.grid().instance.getKeyByRowIndex(index - 1));
                }
            }).then((keyExpr) => {
                this.selectRow(keyExpr);
            });
        })

        this.onKey(event, 'ArrowLeft', () => {
        });

        this.onKey(event, 'ArrowRight', () => {
        });

        this.onKeyPress(event);

    }

}