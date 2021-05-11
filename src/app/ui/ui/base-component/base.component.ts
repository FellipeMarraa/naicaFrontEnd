import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    DoCheck,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    Directive,
    ElementRef
} from "@angular/core";
import {CustomValidation, CustomValidationResult} from "./custom.validation";

import * as _ from 'lodash';
import validationEngine from "devextreme/ui/validation_engine";
import {DevExtremeValidatorHelper} from "../classes/dev.extreme.validator.helper";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {ExceptionInfoService} from "../services/exception.info.service";
import {ObservableUtils} from "../../core/commons/classes/observable.utils";
import {Observable} from "rxjs/index";
import {DxComponent} from "devextreme-angular";
import {Message} from "../classes/message";
import {PopupConvention} from "../../core/commons/interfaces/popup.convention";
import {AppStateService} from "../../app/services/app.state.service";
const uuidv1 = require("uuid/v1");

/**
 * Class base para componentes grpweb
 *
 */
@Directive()
export abstract class BaseComponent implements AfterViewInit, OnInit, OnChanges, DoCheck, AfterContentInit,
    AfterContentChecked, OnDestroy, AfterViewChecked, PopupConvention {

    _ = _; //Helper Lodash to view;

    private _errorMessages: string | string[] | Message | Message[];

    private uuidComponent: any;

    @Input()
    get errorMessages(): string[] {
        return (this._errorMessages as any);
    };

    set errorMessages(value: string[]) {
        this._errorMessages = value;
    }

    get errorObjects(): string | string[] | Message | Message[] {
        return this._errorMessages;
    }

    set errorObjects(value: string | string[] | Message | Message[]) {
        this._errorMessages = value;
    }

    @Input()
    errorsVisible: boolean = false;

    @Input()
    validationGroup: string;

    @Input()
    isRequired: boolean = false;

    @Input()
    requiredErrorMessage: string = 'Campo obrigatório';

    @Input()
    customValidation: CustomValidation;

    @Input()
    focusOnInit = false;

    exceptionInfoService: ExceptionInfoService;

    // keep it false by default
    @Input()
    focusFirstInputOnInit = false;

    @Output()
    hasError: EventEmitter<ExceptionInfo> = new EventEmitter<ExceptionInfo>();

    constructor(injector: Injector) {
        this.validationCallback = this.validationCallback.bind(this);
        this.exceptionInfoService = injector.get(ExceptionInfoService);
        //permite acesso a instância do componente via diretiva provideComponent
        injector.get(ElementRef).nativeElement.__component = this;
    }

    applyValidatorsByPass(doByPass: boolean) {
        DevExtremeValidatorHelper.applyValidatorsByPass(this.validationGroup, doByPass);
    }

    displayValue(data: any) {
        return data && data.getDisplayValue ? data.getDisplayValue() : data;
    }

    // subclasses can override when needed
    doFocusOnInit() {
    }

    doConsoleLog(e) {
        console.log(e);
    }

    validationCallback(params) {
        params.rule.isValid = true;

        if (this.isRequired) {
            let value = this.getCurrentValue(params);

            if (!value || value == '' || (_.isArray(value) && value.length == 0)) {

                params.rule.isValid = false;
                params.rule.message = this.requiredErrorMessage;

            }

        }

        if (this.customValidation) {

            let value = this.getCurrentValue(params);

            let result = this.customValidation(value, params.rule.isValid);

            if (!result) {
                return params.rule.isValid;
            }

            if (result['then']) {

                result = result as Promise<CustomValidationResult>;

                result.then(asyncResult => {

                    if (asyncResult) {
                        params.rule.isValid = asyncResult.isValid;
                        params.rule.message = asyncResult.errorMessage;

                        params.validator.validate();
                    }

                });
            } else {

                result = result as CustomValidationResult;

                params.rule.isValid = result.isValid;
                params.rule.message = result.errorMessage;

            }

        }

        return params.rule.isValid;
    }

    /**
     * Sobrescreva este método para definir o valor a ser enviado para a função 'customValidation'.
     *
     * Por padrão, o valor capturado pelo dx-validator é utilizado
     * @param params - params informado pelo dx-validator
     * @returns {any} - valor a ser passado para a função 'customValidation'
     */
    getCurrentValue(params): any {
        return params.value;
    }

    validate(): boolean {
        let isValid = null;

        if (_.isEmpty(this.validationGroup)) {
            throw new Error(`validationGroup não encontrado.`);
        }
        try {
            isValid = validationEngine.validateGroup(this.validationGroup);
        } catch (e) {
            console.log("ValidationGroup nao criado: " + this.validationGroup);
        }
        return (!isValid || isValid.isValid);
    }

    getValidators() {
        return DevExtremeValidatorHelper.getValidators(this.validationGroup);
    }

    clearValidation() {
        if (this.validationGroup) {
            const group = DevExtremeValidatorHelper.findGroup(this.validationGroup);
            if (group) {
                if (group && !_.isEmpty(group.validators)) {
                    for (let validator of group.validators) {
                        validator.reset();
                    }
                }
            }
        }
    }

    clearValidatorStyleByComponent(component: DxComponent, isValid?: boolean) {
        if (component) {
            if (_.isNil(isValid)) {
                isValid = true;
            }
            DevExtremeValidatorHelper.resetStyleComponent(component, isValid);
        }
    }

    isValid(): boolean {
        return this.validate();
    }

    addErrorMessage(message: string) {
        const array = this.errorMessages || [];
        array.push(message);
        this.errorMessages = [];
        this.errorMessages.push.apply(this.errorMessages, array);
        this.errorsVisible = true;
    }

    handleError(error: ExceptionInfo) {
        console.error(error);
        this.hasError.emit(error);
        this.errorMessages = [];
        this.exceptionInfoService.toMessages(error).forEach(msg => {
            this.errorMessages.push(msg.content);
        });
    }

    of(observable: Observable<any>, successFn?: Function, errorFn?: Function) {
        const defaultHandleError = this.handleError.bind(this);
        return ObservableUtils.of(observable, successFn, errorFn ? errorFn : defaultHandleError);
    }

    checkFocus() {
        if (this.focusOnInit) {
            this.doFocusOnInit();
        }
    }

    clearErrorMessages() {
        this.errorMessages = [];
        this.errorsVisible = false;
    }

    hasErrorMessages(): boolean {
        if (!_.isEmpty(this.errorMessages)) {
            return true;
        }
        return false;
    }

    assertError() {
       if(this.hasErrorMessages()){
           this.errorsVisible = true;
           this.errorMessages = [].concat(this.errorMessages);
       } else {
           this.clearErrorMessages();
       }
    }

    ngAfterContentChecked(): void {
        this.doAfterContentChecked();
    }

    ngAfterContentInit(): void {
        this.doAfterContentInit();
    }

    ngAfterViewChecked(): void {
        this.doAfterViewChecked();
    }

    ngAfterViewInit(): void {
        this.checkFocus();
        this.doAfterViewInit();
    }

    ngDoCheck(): void {
        this.doDoCheck();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.doOnChanges(changes);
    }

    ngOnDestroy(): void {
        this.doOnDestroy();
    }

    ngOnInit(): void {
        this.uuidComponent = uuidv1();
        this.doOnInit();
    }

    adjustHeight(height: number) {
    }

    accentInsensitiveFilterExpression(filterValue: any,
                                      selectedFilterOperation: String,
                                      target: String) {

        let column = this;

        const getter = function (data) {
            const value = _.get(data, column['dataField']);
            if (value) {
                return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            }
            return value;
        };

        return [getter, selectedFilterOperation, filterValue.normalize('NFD').replace(/[\u0300-\u036f]/g, "")];

    }

    protected doAfterViewChecked() {
    }

    protected doOnChanges(changes: SimpleChanges) {
    }

    protected doOnInit() {
    }

    protected doOnDestroy() {
    }

    protected doAfterContentChecked() {
    }

    protected doAfterContentInit() {
    }

    protected doDoCheck() {
    }

    protected doAfterViewInit() {
    }

    nope() {
        // do nothing. dumb method.
    }

    uuid(): any {
        this.uuidComponent;
    }

    onPopupHide() {
    }

    onPopupShow() {
    }

    onPopupResize() {
    }

    providedValue(): any {
    }

    providedValueObservable(): Observable<any> {
        return undefined;
    }

    receiveValue(value) {
    }
}
