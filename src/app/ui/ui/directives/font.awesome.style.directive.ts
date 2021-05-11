import {Directive, ElementRef, Input, OnDestroy, OnInit} from "@angular/core";
import {ThemeService} from "../../app/services/theme.service";
import {Subscription} from "rxjs";

@Directive({
    selector: '[faStyle]'
})
export class FontAwesomeStyleDirective implements OnInit, OnDestroy {

    constructor(private elementRef: ElementRef, private themeService: ThemeService)  {
    }

    themeSubscription: Subscription;

    currentStyle: string;

    private _faStyle: string;

    @Input()
    set faStyle(value: string) {
        this._faStyle = value;
        if (this.currentStyle) {
            this.setStyle(this.currentStyle);
        }
    }

    get faStyle() : string {
        return this._faStyle;
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.themeSubscription = this.themeService.faStyleSubject.subscribe(styleClass => {
            this.currentStyle = styleClass;
            this.setStyle(styleClass);
        });
    }

    private setStyle(styleClass) {
        if (!styleClass) {
            return;
        }
        let classNames = this.elementRef.nativeElement.className;
        if (classNames) {
            let classes: string[] = classNames.split(" ");
            classes = classes.filter(className => !className.startsWith("fa-") && className != 'fas' && className != 'far' && className != 'fal' && className != 'fad');
            classes.push(styleClass, this.faStyle);
            classNames = classes.join(" ");
        } else {
            classNames = styleClass + " " + this.faStyle;
        }
        this.elementRef.nativeElement.className = classNames;
    }
}