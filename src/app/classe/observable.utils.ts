import {Observable} from "rxjs";
import {ProxyObservable} from "./proxy.observable";

export class ObservableUtils {

  public static of(observable: Observable<any>, successFn?: Function, errorFn?: Function) {
    const proxy: ProxyObservable = new ProxyObservable(observable);
    return proxy.of(successFn, errorFn);
  }

}
