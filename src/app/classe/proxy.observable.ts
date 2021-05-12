import {Observable, AsyncSubject, Subject} from "rxjs";

export class ProxyObservable {
  private __observable: Subject<any> = new AsyncSubject();
  private __output: Subject<any> = new AsyncSubject();

  constructor(observable: Observable<any>) {
    const self = this;

    const sub = observable.subscribe(
      data => {
        self.__observable.next(data);
      },
      err => {
        self.__observable.error(err);
      },
      () => this.__observable.complete()
    );
  }

  of(successFn?: Function, errorFn?: Function): Observable<any> {
    this.__observable.subscribe(
      result => {
        if (successFn) {
          successFn(result);
        }
        this.__output.next(result);
      },
      error => {
        if (errorFn) {
          errorFn(error);
        }
        this.__output.error(error);
      },
      () => this.__output.complete()
    );
    return this.__output;
  }

}
