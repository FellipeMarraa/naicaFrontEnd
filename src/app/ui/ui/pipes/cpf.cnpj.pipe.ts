import {Pipe, PipeTransform} from "@angular/core";
import {StringUtils} from "../utils/string.utils";

@Pipe({
    name: 'cpfCnpj',
})
export class CpfCnpjPipe implements PipeTransform {

    transform(value: string,): string {
        return StringUtils.formatCpfCnpj(value);
    }
}
