import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList, Self, SkipSelf,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {TabComponent, TabViewMode} from "./tab.component";
import {TabChangedEvent} from "../classes/tab.changed.event";

import * as _ from 'lodash';
import {DomHandler} from "../../app/services/dom.handler";
import {Subscription} from "rxjs";
import {Subject} from "rxjs/index";
import {AdjustHeight} from "../directives/adjust.height";
import {debounceTime, first} from "rxjs/operators";
import {TabOptionChanged} from "../classes/tab.option.changed";
import {CrudComponent} from "../crud/crud.component";
import {DxScrollViewComponent} from "devextreme-angular";
import {AutoSizeContainerComponent} from "../auto-size-container/auto.size.container.component";
import {TabPanelService} from "../services/tab.panel.service";
import {AppStateService} from "../../app/services/app.state.service";
import {ModoTabPanelEnum} from "../../core/auth/classes/model/modo.tab.panel.enum";
import {TabPanelNodeService} from "../services/tab.panel.node.service";
import {AutoSizeNodeService} from "../services/auto.size.node.service";
import {Resizable} from "../auto-size-container/resizable";
import {AutoSizeService} from "../services/auto.size.service";

let tabIdGen: number = 0;

const NAV_WIDTH = 92;

@Component({
    selector: 'tab-panel',
    styleUrls: ['tab-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './tab-panel.component.html',
    providers: [TabPanelNodeService, AutoSizeNodeService]
})
export class TabPanelComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, AdjustHeight, Resizable {

    private _extraTabs: TabComponent[];

    private _crudComponent: CrudComponent<any, any>;

    tabPanelMenuId: string = `tabPanelMenuButton${tabIdGen++}`;

    @ViewChild("tabHeader", { static: false })
    tabHeader: ElementRef;

    @ViewChild("container", { static: true })
    container: AutoSizeContainerComponent;

    @ViewChild("scrollView")
    scrollView: DxScrollViewComponent;

    @Input()
    visible: boolean = true;

    @Input()
    viewMode: TabViewMode = 'NORMAL';

    @Input()
    canChangeViewMode: boolean = true;

    @Input()
    get extraTabs(): TabComponent[] {
        return this._extraTabs;
    }

    set extraTabs(value: TabComponent[]) {
        if (this._extraTabs != value) {
            this._extraTabs = value;
            this.updateTabs();
        }
    }

    @Input()
    get crudComponent(): CrudComponent<any, any> {
        return this._crudComponent;
    }

    set crudComponent(value: CrudComponent<any, any>) {
        this._crudComponent = value;
        
        if (this._tabs) {
            this._tabs.forEach(t => t.setCrudComponent(value));
        }
    }

    private initialized: boolean = false;
    private _tabs: TabComponent[] = [];
    private _tabsWidth: number[] = [];
    private _activeTabIndex: number = 0;

    private redrawSubject = new Subject();

    tabOffset: number = 0;
    canNavBack: boolean = false;
    canNavNext: boolean = false;
    tabsVisible: TabComponent[] = [];
    tabsMenuDs = [];
    showNav: boolean = false;

    tabSet: Set<any> = new Set();

    @ContentChildren(TabComponent)
    set tabs(value: QueryList<TabComponent>) {
        this.handleVisibilityTabPanel();

        let newTabs = value.filter(t => !this.tabSet.has(t));
        if (newTabs.length == 0) {
            return;
        }

        this._tabsWidth = null;
        this.tabSet = new Set();
        value.forEach(t => {
            t.setTabPanel(this);
            t.setCrudComponent(this._crudComponent);
            t.viewMode = this.viewMode;
            this.tabSet.add(t)
        });

        this._tabs = value ? value.toArray() : [];
        this.updateTabs();
    }


    private updateTabs() {

        let currentIdx = this._activeTabIndex;

        if (this._tabs) {
            this._tabs.forEach(t => t.deactivate());
        }

        this.visible = !_.isEmpty(this._tabs);

        setTimeout(() => {

            if (this._extraTabs && this._extraTabs.length) {
                this._extraTabs.filter(t => !this.tabSet.has(t)).forEach(t => {
                    this._tabs.push(t);
                    this.tabSet.add(t);
                });
            }

            this.tabsVisible = this._tabs;

            this.updateTabMenu();

            if (currentIdx >= this._tabs.length) {
                currentIdx = 0;
            }

            if (this.initialized) {
                this.tabsVisible = this._tabs;

                this.redrawTabHeader();
                this.activateTab(currentIdx);

            }
        });
    }

    getTabs(): TabComponent[] {
        return this._tabs;
    }

    getActiveTab(): TabComponent {
        if (this._activeTabIndex < this._tabs.length) {
            return this._tabs[this._activeTabIndex];
        }
        return null;
    }

    private _height: number;

    @Input()
    get height(): any {
        return this._height;
    }

    set height(value: any) {
        this._height = value;
        this.adjustHeight(value);
    }

    private _width: any;

    @Input()
    get width(): any {
        return this._width;
    }

    set width(value: any) {
        this._width = value;
    }

    @Input()
    marginWidth: number = 0;

    @Input()
    marginHeight: number = 0;

    @Input()
    padddingTop = '10px';

    _scrollHeight: number|string;

    autoSizeDisabled: boolean = false;

    @Input()
    refresh: Subject<any>;
    private refreshSubscription: Subscription;

    @Input()
    set activeTabIndex(value: number) {
        this.setActiveTabIndex(value, true);
    }

    get activeTabIndex() {
        return this._activeTabIndex;
    }

    rootViewModeChanged(viewMode: TabViewMode) {
        if (this.canChangeViewMode) {
            this.updateViewMode(viewMode);
        }
    }

    adjust(options?: {marginRootHeight: number}) {
        this.container.adjust(options);
    }

    @Output() onTabChanged: EventEmitter<TabChangedEvent> = new EventEmitter<TabChangedEvent>();

    constructor(private element: ElementRef,
                private domHandler: DomHandler,
                private appStateService: AppStateService,
                @Optional() private tabPanelService: TabPanelService,
                @Self() private node: TabPanelNodeService,
                @Optional() @SkipSelf() private parentNode: TabPanelNodeService,
                @Optional() private _parentTab: TabComponent,

                @Optional() private autoSizeService: AutoSizeService,
                @Self() private autoSizeNode: AutoSizeNodeService,
                @Optional() @SkipSelf() private autoSizeParentNode: AutoSizeNodeService) {

        if (tabPanelService) {
            tabPanelService.register(parentNode, node, this);
        }

        if (autoSizeService) {
            autoSizeService.register(autoSizeParentNode, autoSizeNode, this);
        }

        this.redrawSubject.pipe(debounceTime(200)).subscribe(() => {
            this.calcTabsWidth();
            this.checkNav();
        });
    }

    private handleVisibilityTabPanel() {
        if(this._tabs) {
            let qtdTabInvisible = this._tabs.map(tab => tab.tabVisible ? 0 : 1).
            reduce((a, b) => a + b, 0);

            if(this._tabs.length == qtdTabInvisible) {
                this.visible = false;
            } else {
                this.visible = true;
            }
        } else {
            this.visible = false;
        }
    }

    get parentTab(): TabComponent {
        return this._parentTab;
    }

    set parentTab(value: TabComponent) {
        this._parentTab = value;
    }

    setActiveTabIndex(value: number, scrollTo: boolean) {
        const currentTab = this._tabs[value];

        if (!currentTab) {
            this._activeTabIndex = value;
            return;
        }

        if (_.isNil(value) || value < 0 || value > this._tabs.length - 1 || !this._tabs[value].tabVisible) {
            value = 0;
        }

        if (!currentTab.tabDisable) {
            let prev = this._activeTabIndex;
            this._activeTabIndex = value;

            //notifica mudança
            if (this.onTabChanged) {
                this.onTabChanged.next({
                    prevTabIndex: prev,
                    prevTabId: this._tabs[prev].getTabIdentifier(),
                    tabIndex: value,
                    tabId: this._tabs[value].getTabIdentifier()
                });
            }

            this._tabs.forEach((tab, idx) => {
                if (idx != value) {
                    tab.deactivate();
                }
            })
            currentTab.activate(this.viewMode);

            if (scrollTo) {
                if (this.viewMode != 'NORMAL') {
                    let yPos = 0;
                    for (let i = 0; i < value; i++) {
                        yPos += this.getTabHeight(this._tabs[i]);
                    }
                    this.scrollView.instance.scrollTo(yPos);

                } else {
                    this.container.resize();
                }
            } else if (this.viewMode != 'NORMAL') {
                if (value < this.tabOffset) {
                    this.tabOffset = value;
                    this.checkNav();
                } else if (value >= this.tabOffset + this.tabsVisible.length) {
                    this.tabOffset = value - this.tabsVisible.length + 1;
                    this.checkNav();
                }
            }
        }
    }

    optionChangeStatusTab(event: TabOptionChanged) {
        this.handleVisibilityTabPanel();

        this._tabs.forEach((tab, index) => {
            if ((tab.tabDisable || !tab.tabVisible) && index == this.activeTabIndex) {
                let idx = 0;

                for (let i = 0; i < this._tabs.length; i++) {
                    const tabDisable = this._tabs[i].getOption('tabDisable');
                    const tabVisible = this._tabs[i].getOption('tabVisible');

                    if (!tabDisable && tabVisible && index != i) {
                        idx = i;
                        break;
                    }
                }

                this.activeTabIndex = idx;
            }
        });

        //console.log('optionChange');
        if (event.oldValue) {
            this.redrawTabHeader();
            this.updateTabMenu();
            this.autoSizeService.resize();
        }
    }


    redrawTabHeader() {
        this.redrawSubject.next(true);
    }

    ngAfterViewInit(): void {
        this.initialized = true;

        //this.optionChangeStatusTab();

        this._tabs.forEach((tab, index) => {
            tab.onOptionChanged.subscribe(event => {
                this.optionChangeStatusTab(event);
            });
        });

        this.redrawTabHeader();

        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.deactivateAllTabs();
                this.activateTab(this.activeTabIndex);
            })
        }

        this.container.resize();
    }

    ngOnInit() {
        if (this.tabPanelService) {

            if (this.canChangeViewMode) {

                if (!this.tabPanelService.isRoot(this.node)) {
                    this.viewMode = this.node.getRootViewMode();
                    if (this.viewMode == 'FORM') {
                        this.autoSizeDisabled = true;
                        this._scrollHeight = "100%";
                    }
                } else {

                    this.appStateService.currentUser.pipe(first()).subscribe(user => {
                        if (user.modoTabPadrao) {
                            this.viewMode = user.modoTabPadrao == ModoTabPanelEnum.NORMAL ? 'NORMAL' : 'FORM';
                        }
                    });

                }

            }
        }
    }

    ngAfterContentInit(): void {
        // this.applyState();
    }

    navNext() {
        this.tabOffset += 1;
        this.checkNav();
    }

    navBack() {
        this.tabOffset -= 1;
        this.checkNav();
    }

    isActive(tabIndex: number): boolean {
        return this._activeTabIndex === tabIndex;
    }

    activateTab(tabIndex: number): void {
        this.activeTabIndex = tabIndex;
    }

    deactivateAllTabs() {
        this.getTabs().forEach(tab => {
            tab.deactivate();
            tab.clearData();
            tab.viewMode = this.viewMode;
        });
    }

    menuItemClick(event) {
        if (event.itemData.viewMode) {
            this.updateViewMode(event.itemData.viewMode);
            if (this.tabPanelService) {
                this.tabPanelService.notifyViewMode(this.node, this.viewMode);
            }
        } else {

            let idx = event.itemData.tabIndex;
            this.activateTab(idx);

            if (idx < this.tabOffset) {
                this.tabOffset = idx;
                this.checkNav();
            } else {
                while (idx >= this.tabOffset + this.tabsVisible.length) {
                    this.tabOffset += 1;
                    this.checkNav();
                }
            }

        }
    }

    private updateViewMode(viewMode: TabViewMode) {
        this.viewMode = viewMode;
        if (this._tabs) {
            if (viewMode == 'NORMAL') {
                this.autoSizeDisabled = false;
            } else if (!this.tabPanelService.isRoot(this.node)) {
                this.autoSizeDisabled = true;
                this._scrollHeight = "100%";
            }
            this._tabs.forEach(t => t.viewMode = this.viewMode);
            this.updateTabs();
            this.container.resize();
        }
    }

    adjustHeight(height: number): void {
        if (height) {
            this._scrollHeight = height - 100;
        } else {
            this._scrollHeight = "100%";
        }
        this.redrawTabHeader();
    }

    private updateTabMenu() {

        if (this.canChangeViewMode) {
            this.tabsMenuDs = [{
                text: 'Visualizar por aba',
                icon: 'fal fa-table',
                selectable: true,
                selected: this.viewMode == 'NORMAL',
                viewMode: 'NORMAL'
            },
            {
                text: 'Visualizar formulário contínuo',
                icon: 'fal fa-file-invoice',
                selectable: true,
                selected: this.viewMode == 'FORM',
                viewMode: 'FORM'
            }];
        } else {
            this.tabsMenuDs = [];
        }

        this._tabs.forEach((tab, idx) => {

            if (!tab.tabDisable && tab.tabVisible) {
                this.tabsMenuDs.push({text: tab.tabTitle, tabIndex: idx});
            }

        });

        if (this.canChangeViewMode && this.tabsMenuDs.length > 2) {
            this.tabsMenuDs[2].beginGroup = true;
        }
    }

    private calcTabsWidth() {
        if (this.tabHeader && (!this._tabsWidth || this._tabsWidth.length == 0)) {
            let jq = this.domHandler.jQuery;

            this._tabsWidth = [];

            let tabsWidth = this._tabsWidth;

            jq(this.tabHeader.nativeElement).find('.tab-header').each(function (idx) {
                tabsWidth[idx] = jq(this).outerWidth();
            });
        }
    }

    checkNav() {
        if (this.tabHeader) {

            let jq = this.domHandler.jQuery;

            let headerWidth = jq(this.tabHeader.nativeElement).width() - NAV_WIDTH;

            if (headerWidth <= 0) {
                return;
            }

            let currentWidth = 0;

            let lastVisible: number = 0;

            this._tabsWidth.slice(this.tabOffset).forEach((width, idx) => {
                //console.log('idx: ' + idx + ' w: ' + width);
                currentWidth = currentWidth + width;
                if (currentWidth <= headerWidth) {
                    lastVisible = this.tabOffset + idx;
                }
            });

            this.tabsVisible = this._tabs.slice(this.tabOffset, lastVisible + 1);

            //console.log('h: ' + headerWidth + " t: " + this._tabsWidth);

            this.canNavBack = this.tabOffset > 0;

            this.canNavNext = headerWidth < currentWidth;

            this.showNav = headerWidth < this._tabsWidth.reduce((w1, w2) => w1 + w2, 0);

            if (!this.showNav) {
                this.tabsVisible = this._tabs;
                this.tabOffset = 0;
            }

        }
    }

    ngOnDestroy(): void {
        if (this.tabPanelService) {
            this.tabPanelService.remove(this.parentNode, this.node, this);
        }

        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }

        this.redrawSubject.complete();
    }

    getTabId(idx: number, tab: TabComponent): string {
        return tab.getTabIdentifier();
    }

    onScroll(event: any) {
        if (this.viewMode == 'NORMAL' || !event.event) {
            return;
        }

        const offset = event.scrollOffset.top;

        let idx;
        let yPos = 0;
        for (idx = 0; idx < this._tabs.length; idx++) {
            yPos += this.getTabHeight(this._tabs[idx]);
            if (yPos > offset) {
                this.setActiveTabIndex(idx, false);
                break;
            }
        }

        if (idx == this._tabs.length) {
            this.setActiveTabIndex(idx, false);
        }
    }

    private getTabHeight(tab: TabComponent): number {
        if (tab.getDisplay() == 'block') {
            return this.domHandler.jQuery(tab.getElementRef().nativeElement).outerHeight() + 30;
        }
        return 0;
    }

}
