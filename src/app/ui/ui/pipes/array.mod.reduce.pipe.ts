import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "arrayModReduce", pure: false })
export class ArrayModReducePipe implements PipeTransform {
  transform(array: any[], modNum: number): any {
    if (array) {
      let i = 0;
      let j = 0;
      let currentArray: any[];

      return array.reduce(function(prev, current) {
        if (i % modNum === 0) {
          prev.push([]);
          currentArray = prev[j];
          j++;
        }
        i++;
        currentArray.push(current);
        return prev;
      }, []);
    }

    return array;
  }
}
