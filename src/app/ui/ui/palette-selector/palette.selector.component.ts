import {Component, EventEmitter, Input, Output} from "@angular/core";
import { getPalette } from "devextreme/viz/palette";

import {ViewEncapsulation} from "@angular/core"
import {PopupAsyncValueProvider} from "../../core/commons/interfaces/popup.async.value.provider";
import {PopupValueProvider} from "../../core/commons/interfaces/popup.value.provider";

@Component({
    selector: 'palette-selector',
    styleUrls: ['palette.selector.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: './palette.selector.component.html'
})
export class PaletteSelectorComponent implements PopupValueProvider{

    data: DataItem[];
    paletteCollection: string[];
    paletteExtensionModes: string[];

    @Input()
    paleta: string;

    @Input()
    modoVariacao: string;

    @Output()
    paletaChange: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    modoVariacaoChange: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
        this.data = this.getData();
        this.paletteExtensionModes = this.getPaletteExtensionModes();
        this.paletteCollection = this.getPaletteCollection();
        this.paleta = "Soft";
        this.modoVariacao = "Alternate";
    }

    get baseColors() {
        return getPalette(this.paleta).simpleSet;
    }

    getData(): DataItem[] {
        return new Array(20).fill(1).map((val, index) => {
            return {
                arg: "Item" + index,
                val: val
            }
        });
    }

    getPaletteCollection(): string[] {
        return ["Material", "Soft Pastel", "Harmony Light", "Pastel", "Bright", "Soft", "Ocean", "Office", "Vintage", "Violet", "Carmine", "Dark Moon", "Soft Blue", "Dark Violet", "Green Mist"];
    }

    getPaletteExtensionModes(): string[] {
        return ["Alternate", "Blend", "Extrapolate"];
    }

    providedValue(): any {
        return {
            paleta: this.paleta,
            modoVariacao: this.modoVariacao
        }
    }
}

export class DataItem {
    arg: string;
    val: number;
}