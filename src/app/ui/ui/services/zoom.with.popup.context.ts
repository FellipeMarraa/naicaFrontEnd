import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, ChangeDetectorRef, ViewRef, Injector, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {DomHandler} from "../../app/services/dom.handler";
import {ClassicDynamicModalComponent} from "../classic-dynamic-modal/classic.dynamic.modal.component";


export class ZoomWithPopupContext {
    popupComponentRef: ComponentRef<any>;
    targetPopupContentComponentRef: ComponentRef<any>;
    closeHandlerSubscription: Subscription;

    closeHandler() {
        this.destroy(this.targetPopupContentComponentRef);
        this.destroy(this.popupComponentRef);
        this.closeHandlerSubscription.unsubscribe();
    }

    destroy(ref: ComponentRef<any>) {
        ref.changeDetectorRef.detach();
        ref.destroy();
    }
}

/**
 * @author michael
 */
@Injectable()
export class ZoomWithPopupService {
    static readonly DEFAULT_WIDTH_OFFSET: number = 15;
    private state: ZoomWithPopupContext[] = [];

    constructor(
        private cfr: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private domHandler: DomHandler) {
    }

    zoomIn(componentType: any, title: string, top?: string, left?: string, width?: string, height?: string, cssClass?: string): ComponentRef<ClassicDynamicModalComponent> {
        // context
        const context: ZoomWithPopupContext = new ZoomWithPopupContext();
        this.state.push(context);

        // create dynamic popup component
        const popupfactory: ComponentFactory<ClassicDynamicModalComponent> = this.cfr.resolveComponentFactory(ClassicDynamicModalComponent);
        const popupRef: ComponentRef<ClassicDynamicModalComponent> = popupfactory.create(this.injector);
        const popupInstance: ClassicDynamicModalComponent = popupRef.instance;
        const popupViewContainerRef: ViewContainerRef = popupInstance.getViewContainerRef();
        context.popupComponentRef = popupRef;
        popupInstance.popupVisible = true;
        popupInstance.title = title;

        // close event subscription
        context.closeHandlerSubscription = popupInstance.onCloseClick.subscribe(() => {
            context.closeHandler();
            const index = this.state.indexOf(context);
            if (index != -1) {
                this.state.splice(index, 1);
            }
        });

        // if top has value but not height, height is calculed automatically
        if (top) {
            setTimeout(() => {
                popupInstance.top(top);
                if (!height) {
                    const nextPopupHeight = window.innerHeight - parseInt(top.replace('px', '')) + 'px';
                    console.log(nextPopupHeight);
                    popupInstance.height(nextPopupHeight);
                }
            });
        }

        // if left has value but not width, width is calculed automatically
        if (left) {
            setTimeout(() => {
                popupInstance.left(left);
                if (!width) {
                    popupInstance.width(window.innerWidth - ZoomWithPopupService.DEFAULT_WIDTH_OFFSET - parseInt(left.replace('px', '')) + 'px');
                }
            });
        }


        if (width) {
            setTimeout(() => {
                popupInstance.width(width);
            });
        }


        if (height) {
            setTimeout(() => {
                popupInstance.height(height);
            });
        }

        if (cssClass) {
            setTimeout(() => {
                popupInstance.cssClass = cssClass;
            });
        }

        // add it to the application (both component tree and DOM)
        this.appRef.attachView(popupRef.hostView);
        const domElem = (popupRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        // create target popup content component
        const factory: ComponentFactory<any> = this.cfr.resolveComponentFactory(componentType);
        const ref: ComponentRef<any> = factory.create(this.injector);
        context.targetPopupContentComponentRef = ref;

        // THIS IS MANDATORY: run in the NEXT .tick()
        setTimeout(() => {
            popupInstance.setView(ref.hostView);
        });

        return popupRef;
    }
}
