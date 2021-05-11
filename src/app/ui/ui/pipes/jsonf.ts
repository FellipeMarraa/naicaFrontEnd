import {Pipe, PipeTransform} from "@angular/core";

@Pipe(
    {
        name: "jsonf",
        pure: false
    })
export class JsonfPipe implements PipeTransform {
    transform(object: any): any {
        if (object) {
            return JSON.stringify(object, this.getCircularReplacer(), 4);
        }
        return null;
    }


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



