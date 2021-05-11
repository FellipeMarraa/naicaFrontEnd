import { Pipe, PipeTransform } from "@angular/core";
import * as _ from 'lodash';

@Pipe({ name: "arrayKeyFilter", pure: false })
export class ArrayKeyFilterPipe implements PipeTransform {
  transform(array: any[], key: string, value: any): any {
    if (array && key && !_.isEmpty(value)) {
      return array.filter(function(element) {
        if(key.indexOf(",")>=0){
          let retorno :boolean = false;
          const keys = key.split(",");
          keys.forEach(function(v) {
              if (element[v]) {
                  if(new RegExp(".*" + value + ".*", "i").test(element[v])){
                    retorno = true;
                  }
              }
          });
          return retorno;
        } else {
            if (element[key]) {
                return new RegExp(".*" + value + ".*", "i").test(element[key]);
            }
        }
      });
    }

    return array;
  }
}
