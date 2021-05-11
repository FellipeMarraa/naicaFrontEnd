import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, ViewContainerRef} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {
    DxAutocompleteComponent,
    DxCalendarComponent,
    DxCheckBoxComponent,
    DxColorBoxComponent,
    DxDateBoxComponent,
    DxDropDownBoxComponent,
    DxLookupComponent,
    DxNumberBoxComponent,
    DxRadioGroupComponent,
    DxSelectBoxComponent,
    DxSliderComponent,
    DxSwitchComponent,
    DxTagBoxComponent,
    DxTextAreaComponent,
    DxTextBoxComponent
} from "devextreme-angular";
import {AppStateService} from "../../app/services/app.state.service";
import {Subscription} from "rxjs";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";


/**
 * @author michael
 */
@Directive({
    selector: "[focusAfterViewInit]"
})
export class FocusAfterViewInitDirective implements AfterViewInit, OnDestroy {

    // false by default
    @Input()
    focusAfterViewInit = false;

    private targets = [];

    private elementEventsSubscription: Subscription;

    constructor(private vcr: ViewContainerRef,
                private elementRef: ElementRef,
                private domHandler: DomHandler,
                private objectUtilsService: ObjectUtilsService,
                private appStateService: AppStateService) {
    }

    isFocusAfterViewInitDirective() {
        return this.focusAfterViewInit;
    }

    getHostComponent(): void {
        return this.vcr["_data"].componentView.component;
    }

    ngOnDestroy(): void {
        if (this.elementEventsSubscription) {
            this.elementEventsSubscription.unsubscribe();
        }
        this.targets = [];
    }

    ngAfterViewInit(): void {

        /*
         * from global events
         */
        const dom = this.domHandler;
        this.elementEventsSubscription = this.appStateService.elementEvents.subscribe(ctx => {
            if(!this.objectUtilsService.isEmptyArray(this.targets)){
                setTimeout(() => {
                    this.targets[0].focus();
                }, 999); // timeout para forçar embora este handler esteja após o respectivo evento deste subscribe()
            }
        });

        /*
         * from directive
         */
        if (this.isFocusAfterViewInitDirective()) {
            const component: any = this.getHostComponent();
            const nativeElement = this.elementRef.nativeElement;

            // <dx-number-box>
            if (component instanceof DxNumberBoxComponent) {
                this.dxNumberBox(nativeElement, component as DxNumberBoxComponent);
            }

            // <dx-text-box>
            else if (component instanceof DxTextBoxComponent) {
                this.dxTextBox(nativeElement, component as DxTextBoxComponent);
            }

            // <dx-autocomplete>
            else if (component instanceof DxAutocompleteComponent) {
                this.dxAutocomplete(nativeElement, component as DxAutocompleteComponent);
            }

            // <dx-calendar>
            else if (component instanceof DxCalendarComponent) {
                this.dxCalendar(nativeElement, component as DxCalendarComponent);
            }

            // <dx-select-box>
            else if (component instanceof DxSelectBoxComponent) {
                this.dxSelectBox(nativeElement, component as DxSelectBoxComponent);
            }

            // <dx-select-box>
            else if (component instanceof DxSelectBoxComponent) {
                this.dxSelectBox(nativeElement, component as DxSelectBoxComponent);
            }

            // <dx-check-box>
            else if (component instanceof DxCheckBoxComponent) {
                this.dxCheckBox(nativeElement, component as DxCheckBoxComponent);
            }

            // <dx-color-box>
            else if (component instanceof DxColorBoxComponent) {
                this.dxColorBox(nativeElement, component as DxColorBoxComponent);
            }

            // <dx-date-box>
            else if (component instanceof DxDateBoxComponent) {
                this.dxDateBox(nativeElement, component as DxDateBoxComponent);
            }

            // <dx-drop-down-box>
            else if (component instanceof DxDropDownBoxComponent) {
                this.dxDropDownBox(nativeElement, component as DxDropDownBoxComponent);
            }

            // <dx-lookup>
            else if (component instanceof DxLookupComponent) {
                this.dxLookup(nativeElement, component as DxLookupComponent);
            }

            // <dx-radio-group>
            else if (component instanceof DxRadioGroupComponent) {
                this.dxRadioGroup(nativeElement, component as DxRadioGroupComponent);
            }

            // <dx-slider>
            else if (component instanceof DxSliderComponent) {
                this.dxSlider(nativeElement, component as DxSliderComponent);
            }

            // <dx-switch>
            else if (component instanceof DxSwitchComponent) {
                this.dxSwitch(nativeElement, component as DxSwitchComponent);
            }

            // <dx-tag-box>
            else if (component instanceof DxTagBoxComponent) {
                this.dxTagBox(nativeElement, component as DxTagBoxComponent);
            }

            // <dx-text-area>
            else if (component instanceof DxTextAreaComponent) {
                this.dxTextArea(nativeElement, component as DxTextAreaComponent);
            }

        }
    }

    defaultAction(element: any) {
        const dom = this.domHandler;
        const targets = this.targets;
        dom.jQueryWithContext("input", element).each(function(){
            // component.instance.focus() nem sempre funciona
            if (dom.jQuery(this).attr('type') != 'hidden') {
                targets.push(this);
                this.focus();
            }
        })
    }

    dxNumberBox(element: any, component: DxNumberBoxComponent) {
        this.defaultAction(element);
    }

    dxTextBox(element: any, component: DxTextBoxComponent) {
        this.defaultAction(element);
    }

    dxAutocomplete(element: any, component: DxAutocompleteComponent) {
        this.defaultAction(element);
    }

    dxCalendar(element: any, component: DxCalendarComponent) {
        this.defaultAction(element);
    }

    dxSelectBox(element: any, component: DxSelectBoxComponent) {
        this.defaultAction(element);
    }

    dxCheckBox(element: any, component: DxCheckBoxComponent) {
        this.defaultAction(element);
    }

    dxColorBox(element: any, component: DxColorBoxComponent) {
        this.defaultAction(element);
    }

    dxDateBox(element: any, component: DxDateBoxComponent) {
        this.defaultAction(element); // acceptCustomValue=true => <dx-date-box [(value)]="filter.data" [acceptCustomValue]="true">
    }

    dxDropDownBox(element: any, component: DxDropDownBoxComponent) {
        this.defaultAction(element);
    }

    dxLookup(element: any, component: DxLookupComponent) {
        this.defaultAction(element);
    }

    dxRadioGroup(element: any, component: DxRadioGroupComponent) {
        this.defaultAction(element);
    }

    dxSlider(element: any, component: DxSliderComponent) {
        this.defaultAction(element);
    }

    dxSwitch(element: any, component: DxSwitchComponent) {
        this.defaultAction(element);
    }

    dxTagBox(element: any, component: DxTagBoxComponent) {
        this.defaultAction(element);
    }

    dxTextArea(element: any, component: DxTextAreaComponent) {
        // textarea
        const dom = this.domHandler;
        const targets = this.targets;
        dom.jQueryWithContext("textarea", element).first().each(function () {
            targets.push(this);
            this.focus();
        })
    }
}
