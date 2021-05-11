import {Component, Input} from "@angular/core";

@Component({
    selector: "json",
    template: `
        <ngx-json-viewer
                [cleanOnChange]="cleanOnChange"
                [expanded]="expanded"
                [json]="json">
        </ngx-json-viewer>
    `
})
export class JsonComponent {
    private _json: object;

    get json(): object {
        return this._json;
    }

    @Input()
    set json(value: object) {
        value = value ? value : undefined;

        if(value) {
            let valueString = JSON.stringify(value, this.getCircularReplacer(), 4);
            value = JSON.parse(valueString);
        }

        this._json = value;
    }

    @Input()
    cleanOnChange: boolean = true;

    @Input()
    expanded: boolean = false;

    getCircularReplacer() {
        const seen = new WeakSet;
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    const pk = Object.keys(value).find(o => o == "id");
                    return pk ? value[pk] : `${Object.keys(value)[0]} : ${value[Object.keys(value)[0]]}`
                }
                seen.add(value);
            }
            return value;
        };
    };
}
