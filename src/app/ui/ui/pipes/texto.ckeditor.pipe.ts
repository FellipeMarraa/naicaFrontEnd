import { Pipe, PipeTransform } from '@angular/core';

/**
 * @author debora
 */

@Pipe({
    name: 'TextoCkeditorPipe'
})
export class TextoCkeditorPipe implements PipeTransform {
    transform(value: string): string {
        if (value){
            return value.replace(/(<([^>]+)>)/ig,"");

        }
        return value;
    }
}