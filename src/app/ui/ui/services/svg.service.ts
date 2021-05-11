import {Injectable, ElementRef} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";

/**
 * @author michael
 */
@Injectable()
export class SVGService {
    constructor(private domHandler: DomHandler) {
    }

    /**
     * Ajusta o sizing de SVG's existentes no elemento pai informado como argumento.
     * Este método deve ser invocado no momento em que SVG's já estiverem presentes no DOM.
     * No componente, pode ser usado em ngAfterViewInit() e/ou ngAfterContentInit() - ou, dependendo da necessidade, ngAfterViewChecked.
     * Ainda, se há existir 'viewBox' no SVG, nada será alterado.
     *
     * @author michael
     * @param parentElement
     */
    autoResizeBasedOnParentElementRef(elemenetRef: ElementRef, preserveAspectRatio: string = 'xMidYMid meet') {
        this.autoResizeBasedOnParentElement(elemenetRef.nativeElement, preserveAspectRatio);
    }

    /**
     * Ajusta o sizing de SVG's existentes no elemento pai informado como argumento.
     * Este método deve ser invocado no momento em que SVG's já estiverem presentes no DOM.
     * No componente, pode ser usado em ngAfterViewInit() e/ou ngAfterContentInit() - ou, dependendo da necessidade, ngAfterViewChecked.
     * Ainda, se há existir 'viewBox' no SVG, nada será alterado.
     *
     * @author michael
     * @param parentElement
     */
    autoResizeBasedOnParentElement(parentElement: any, preserveAspectRatio: string = 'xMidYMid meet') {
        const dom = this.domHandler;
        dom.jQueryWithContext('svg', dom.jQuery(parentElement)).each(function (e) {
            const svg = dom.jQuery(this);
            const parentContainer = svg.parent()[0];
            const height: number = parentContainer.clientHeight;
            const width: any = parentContainer.clientWidth;
            const viewBox = svg.attr('viewBox');

            if (height != 0 && width != 0) {
                if (!viewBox) {
                    svg.removeAttr('height')
                        .removeAttr('width')
                        .css('width', '100%')
                        .css('height', '100%')
                        .attr('viewBox', `0 0 ${width} ${height}`)
                        .attr('preserveAspectRatio', preserveAspectRatio);
                    setTimeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    });
                }
            }
        });
    }

    private normalizeToNumber(value: any): number {
        return value ? parseInt(value.replace('px', '')) : 0;
    }
}
