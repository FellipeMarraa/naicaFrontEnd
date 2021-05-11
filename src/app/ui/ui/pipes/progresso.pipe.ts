import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "progresso",
    pure: true
})
export class ProgressoPipe implements PipeTransform {

    transform(value: number, ...args: any[]): any {

        return ProgressoPipe.format(value);

    }

    public static format(value: number) {
        if (!value) {
            return "00h 00min";
        }

        let horas = Math.trunc(value / 60);
        let minutos = value % 60;

        return ((horas < 10) ? "0" : "") + horas.toString() + "h " +
            ((minutos < 10) ? "0" : "") + minutos.toString() + "min";
    }
}
