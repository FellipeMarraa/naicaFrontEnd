import {
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewChild, ViewRef
} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {DxDataGridComponent, DxFormComponent, DxMapComponent, DxTreeListComponent} from "devextreme-angular";
import {CustomDataGridComponent} from "../custom-data-grid/custom.data.grid.component";
import {HostComponentProvider} from "../directives/host.component.provider";
import {BaseComponent} from "../base-component/base.component";
import {CkeditorComponent} from "../ckeditor/ckeditor.component";
import {TabPanelComponent} from "./tab-panel.component";
import {GwtPessoaEditComponent} from "../../cadastros-gerais/commons/pessoa-edit-component/gwt-pessoa-edit.component";
import {TabOptionChanged} from "../classes/tab.option.changed";
import {CrudComponent} from "../crud/crud.component";
import {ValidationListener} from "../classes/validation.listener";

export type TabViewMode = 'NORMAL'|'FORM';

//Alteração de *ngIf para ngStyle, pois alguns componentes não disparam o onContentReady quando não estão no DOM
@Component({
    selector: 'tab',
    template: `
        <div [ngStyle]="{display: getDisplay(), height: '100%'}">
            <div #tabTitleHeader class="tab-header-title" *ngIf="showTitleHeader()"><i faStyle="fa-folder-open"></i><span style="margin-left:10px">{{getFullName()}}</span></div>
            <ng-content></ng-content>
        </div>`
})
export class TabComponent implements ValidationListener, OnDestroy {

    private tabPanel: TabPanelComponent;

    private _tabTitle: string = "";

    private _tabVisible: boolean = true;

    private _tabDisable: boolean = false;

    private _activationNotified: boolean = false;

    private _show: boolean;

    private _crudComponent: CrudComponent<any, any>;

    private _validationGroup: string;

    hasError: boolean = false;

    constructor(private elementRef: ElementRef,
                private domHandler: DomHandler){

    }

    @ContentChildren(HostComponentProvider)
    tabRoot: QueryList<HostComponentProvider>;

    getElementRef() : ElementRef {
        return this.elementRef;
    }

    setCrudComponent(crudComponent: CrudComponent<any, any>): void {
        this._crudComponent = crudComponent;
        if (this._validationGroup) {
            this._crudComponent.addSubValidator(this._validationGroup, this);
        }
    }

    @Output()
    onActivate: EventEmitter<string> = new EventEmitter();

    @Output()
    onFirstActivate: EventEmitter<string> = new EventEmitter();

    @Input()
    tabId: string;


    private _marginContentHeight: number = 0;

    @Input()
    get validationGroup(): string {
        return this._validationGroup;
    }

    set validationGroup(value: string) {
        this._validationGroup = value;
        if (value && this._crudComponent) {
            this._crudComponent.addSubValidator(value, this);
        }
    }

    @Input()
    get tabTitle(): string {
        return this._tabTitle;
    }

    @Input()
    get marginContentHeight(): number {
        return this._marginContentHeight;
    }

    set marginContentHeight(value: number) {
        this._marginContentHeight = value;
    }

    set tabTitle(tabTitle: string) {
        if (this._tabTitle != tabTitle) {
            const old = this._tabTitle;
            this._tabTitle = tabTitle;
            setTimeout(() => {
                this.onOptionChanged.emit({option: 'tabTitle', oldValue: old, value: tabTitle});
            });
        }
    }

    @Input()
    get tabVisible(): boolean {
        return this._tabVisible;
    }

    set tabVisible(tabVisible: boolean) {
        if (this._tabVisible != tabVisible) {
            const old = this._tabVisible;
            this._tabVisible = tabVisible;
            setTimeout(() => {
                this.onOptionChanged.emit({option: 'tabVisible', oldValue: old, value: tabVisible});
            });

        }
    }

    @Input()
    get tabDisable(): boolean {
        return this._tabDisable;
    }

    set tabDisable(tabDisable: boolean) {
        if (this._tabDisable != tabDisable) {
            const old = this._tabDisable;
            this._tabDisable = tabDisable;

            if (!tabDisable && this.tabPanel && this.tabPanel.getActiveTab() == this) {
                this.show = true;
            }

            setTimeout(()=> {
                this.onOptionChanged.emit({option: 'tabDisable', oldValue: old, value: tabDisable});
            });

        }
    }

    @Output() onOptionChanged: EventEmitter<TabOptionChanged> = new EventEmitter<TabOptionChanged>();


    show: boolean = false;

    private _viewMode: TabViewMode = 'NORMAL';

    get viewMode(): TabViewMode {
        return this._viewMode;
    }

    set viewMode(value: TabViewMode) {
        this._viewMode = value;
        if (value == 'FORM') {
            if (!this._activationNotified) {
                this.onFirstActivate.emit(this.getTabIdentifier());
                this._activationNotified = true;
            }
        }
    }

    getDisplay(): string {
        if (this._viewMode == 'NORMAL') {
            return this.show ? 'block' : 'none';
        }
        return !this._tabDisable && this._tabVisible ? 'block' : 'none';
    }

    showTitleHeader(): boolean {
        return this._viewMode != 'NORMAL';
    }

    setOption(option: string, value: any) {
        if (this.hasOwnProperty(option)) {
            this[option] = value;
        }
    }

    getOption(option: string) : any {
        return this[option];
    }

    activate(viewMode: TabViewMode){
        this.onActivate.emit(this.getTabIdentifier());
        if (!this._activationNotified) {
            this.onFirstActivate.emit(this.getTabIdentifier());
            this._activationNotified = true;
        }

        this.show = true;
        this._viewMode = viewMode;
    }

    deactivate() {
        this.show = false;
    }

    clearData() {
        this._activationNotified = false;
    }

    getFullName() {
        let name = "";
        if (this.tabPanel && this.tabPanel.parentTab) {
            name = this.tabPanel.parentTab.getFullName() + " / ";
        }
        name += this.tabTitle;
        return name;
    }

    getTabIdentifier(): string {
        return this.tabId || this.tabTitle;
    }

    setTabPanel(tabPanel: TabPanelComponent) {
        this.tabPanel = tabPanel;
    }

    onValidationExecuted(response: boolean): void {
        this.hasError = !response;
    }

    ngOnDestroy(): void {
        if (this._crudComponent && this._validationGroup) {
            this._crudComponent.removeSubValidator(this._validationGroup);
        }
    }

}
