import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "simNaoPrint"})
export class SimNaoPrintPipe implements PipeTransform {
    transform(booleanValue: boolean): any {
        if (booleanValue) {
            return 'Sim';
        }
        return 'Não';
    }
}
