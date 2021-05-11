import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({ name: "subArrayKeyFilter", pure: false })
export class SubArrayKeyFilterPipe implements PipeTransform {
  transform(array: any[], arrayKey: string, elementKey: string, value: any): any {
    if (array && arrayKey && elementKey) {
      return array.filter(element => {
        if (element[arrayKey]) {
          const subarray: any[] = element[arrayKey];
          let arrayMatched = false;

          for (var i = 0; i < subarray.length; i++) {
            const subElement = subarray[i];
            delete subElement.ignoredByFilter;

            if (subElement[elementKey]) {
              const match = new RegExp(".*" + (value || "") + ".*", "i").test(subElement[elementKey]);

              if (!match) {
                subElement.ignoredByFilter = true;
              } else {
                arrayMatched = true;
              }
            }
          }

          return arrayMatched;
        }
      });
    }

    return array;
  }
}
