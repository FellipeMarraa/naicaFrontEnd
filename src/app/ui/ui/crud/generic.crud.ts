import {Directive, Injector} from "@angular/core";
import {AbstractCrud} from "../../ui/crud/abstract.crud";

@Directive()
export abstract class GenericCrud<T, F> extends AbstractCrud<T, F> {

    filterInit: boolean = false;

    constructor(injector: Injector, public service: any, filterInit?: boolean) {
        super(injector);
        if(filterInit) {
            this.filterInit = filterInit;
        }
    }

    getMainService() {
        return this.service;
    }

    protected init() {
        super.init();
        if(this.filterInit && this.isListMode()) {
            this.setFilterOnInit(true);
        }
    }

}
