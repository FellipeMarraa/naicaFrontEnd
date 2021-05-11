import {AfterViewInit, Directive, ElementRef, OnInit, ViewContainerRef} from "@angular/core";

@Directive({
    selector: "[provideComponent]"
})
export class HostComponentProvider implements OnInit, AfterViewInit {

    hostComponent: any;

    constructor(private elemRef: ElementRef) {}

    ngOnInit(): void {
        this.assignHostComponent();
    }

    ngAfterViewInit(): void {
        this.assignHostComponent();
    }
    protected assignHostComponent(): void {
        this.hostComponent = this.elemRef.nativeElement.__component;
    }

}
