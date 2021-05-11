import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

import * as _ from 'lodash';

export type CustomStorage = () => any;

import {ViewEncapsulation} from "@angular/core"
import {JacksonService} from "@sonner/jackson-service-v2";

@Component({
    selector: 'context-bar',
    styleUrls: ['context.bar.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: './context.bar.component.html'
})
export class ContextBarComponent {

    private _contextKey: string;

    private _context: any;

    private _mustSaveContext: boolean = true;

    private _showSave: boolean = true;

    private _initialDataLoaded: boolean = false;

    constructor(private jacksonService: JacksonService) {
    }

    @Input()
    visible: boolean = true;

    @Input()
    loadSavedData: boolean = true;

    @Input()
    set showSave(value: boolean) {
        this._showSave = value;
    }

    get showSave(): boolean {
        return this._showSave;
    }

    @Input()
    set contextKey(value: string) {
        this._contextKey = value;
        if (this._mustSaveContext && this._initialDataLoaded) {
            this.saveContext();
        }
    }

    get contextKey(): string {
        return this._contextKey;
    }

    @Input()
    set context(value: any) {
        this._context = value;
        if (this._mustSaveContext && this._initialDataLoaded) {
            this.saveContext();
        }
    }

    get context(): any {
        return this._context;
    }

    @Input()
    set mustSaveContext(value: boolean) {
        if (this.mustSaveContext != value){
            this.mustSaveContextChange.emit(value);
        }
        this._mustSaveContext = value;
        if (this._mustSaveContext && this._initialDataLoaded) {
            this.saveContext();
        }
    }

    get mustSaveContext(): boolean {
        return this._mustSaveContext;
    }

    @Output()
    mustSaveContextChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    contextChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    customStorage: CustomStorage;

    loadSavedContext(defaultValue: any, contextType?: Function): void {
        this._initialDataLoaded = true;
        if (!this.loadSavedData){
            return;
        }

        if (this.customStorage) {

            this._context = this.customStorage();
            this.contextChange.emit(this._context);
            return;

        }

        let serializedContext = localStorage.getItem(btoa(this._contextKey));

        if (_.isNil(serializedContext)) {

            this._context = defaultValue;
            this.contextChange.emit(defaultValue);
            return;
        }

        if (contextType) {

            this._context = this.jacksonService.decode(JSON.parse(atob(serializedContext)), contextType);
            this.contextChange.emit(this._context);

        } else {

            let value = null;

            try {
                value = JSON.parse(atob(serializedContext));
            } catch (e) {
                value = serializedContext;
            }

            this._context = value;
            this.contextChange.emit(this._context);
        }

    }

    private saveContext(): void {

        if (this._mustSaveContext && this._contextKey && !this.customStorage) {

            if (!_.isNil(this._context)) {

                localStorage.setItem(btoa(this._contextKey), btoa(this.jacksonService.encodeToJson(this._context)));

            } else {

                localStorage.removeItem(this._contextKey);

            }

        }

    }

}
