import {AbstractCrud} from "../abstract.crud";
import {Component, Injector} from "@angular/core";
import {TestCrud} from "../../classes/test.crud";
import {CrudMetadata} from "../../classes/crud.metadata.decorator";
import {GlobalLoadingIndicator} from "../../../core/codec/decorator/global.loading.indicator.decorator";
import {of} from "rxjs";

@Component({
    selector: "test-crud",
    template: `
        <crud listToolbarTitle="Test Crud Listing" editToolbarTitle="Edit Test Crud" [embedded]="embedded" [multipleSelection]="multipleSelection">

            <div crud-list-filter-fields>
                <span>Test Name:</span>
                <dx-text-box [(value)]="filter.test"
                             placeholder="Inform test name...">
                </dx-text-box>

                <span>Version Name:</span>
                <dx-text-box [(value)]="filter.version"
                             [activeStateEnabled]="true"
                             placeholder="Inform version name...">
                </dx-text-box>
            </div>

            <div crud-list-grid>
                <dx-data-grid [dataSource]="dataSource">
                    <dxi-column dataField="test"></dxi-column>
                    <dxi-column dataField="version"></dxi-column>
                </dx-data-grid>
                <!--
                <dx-data-grid [dataSource]="dataSource" [elementAttr]="{ 'principal': 'true' }">
                    <dxi-column dataField="version"></dxi-column>
                </dx-data-grid>

                <dx-data-grid [dataSource]="dataSource">
                    <dxi-column dataField="test"></dxi-column>
                    <dxi-column dataField="version"></dxi-column>
                </dx-data-grid>
                -->
            </div>

            <div crud-edit-template>
                <span>Id: </span>
                <dx-text-box [(value)]="model.id">
                </dx-text-box>

                <span>Test: </span>
                <dx-text-box [(value)]="model.test">
                </dx-text-box>

                <span>Version: </span>
                <dx-text-box [(value)]="model.version">
                </dx-text-box>
            </div>

        </crud>
    `
})
@CrudMetadata('TestCrudComponent', [TestCrud, TestCrud])
export class TestCrudComponent extends AbstractCrud<TestCrud, TestCrud> {
    constructor(private injector: Injector) {
        super(injector);
    }

    doFilter() {
        const filter = this.getFilter();

        // mock
        this.setDataSource([{
            id: filter.test,
            test: filter.test,
            version: filter.version
        }])

        return null;
    }

    save(alsoClose: boolean) {
        console.log('save-alsoClose:', alsoClose);
        const model = this.getModel();
        console.log(model);
    }

    @GlobalLoadingIndicator
    onIdParam(id: any) {
        // fake
        console.log('onIdParam', id);
        const m = new TestCrud();
        m.id = id;
        m.test = id;
        m.version = id + "/Version";
        this.setModel(m);
        return of(null);
    }

    init() {
        console.log('TestCrudComponent init');
    }
}
