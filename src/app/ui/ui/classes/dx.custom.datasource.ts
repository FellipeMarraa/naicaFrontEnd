import DataSource from "devextreme/data/data_source";
import {BehaviorSubject, Observable, Subject} from "rxjs";

/**
 * DataSource Devextreme que dá suporte ao 'loading' - para obtenção de dados remotos - quando dados a serem
 * retornados como Array do servidor estão encapsulados em um Observable.
 *
 * - Perceba que, no exemplo abaixo, a grid faz binding de dataSource, que é do tipo DxCustomDataSource<Employee> e não array.
 * - search(), ao ser invocado, faz assign de um novo DxCustomDataSource() informando, como argumento, o próprio
 * retorno de um método do service, cujo retorno é um Observable (o que ocorre geralmente com retornos do HttpClient, pelo service).
 * - Perceba também que não há subscribe() no retorno, já que é informado como argumento do construtor. Os callbacks
 * são, na verdade, informados logo em seguida no método of().
 *
 *
 * Se por algum motivo quizer obter o array em si, use:
 * const array = this.dataSource.items();
 *
 *
 * Exemplo:
 *
 *     @Component({
 *      selector: "app-root",
 *      templateUrl: "./app.component.html"
 *    })
 *     export class AppComponent {
 *      constructor(private service: MyService){}
 *
 *      search() {
 *        this.dataSource = new DxCustomDataSource(this.service.getData()).of(
 *          () => {
 *            // Pronto! Dados do array retornado do observable já configurados no DataSource.
 *            // Faça algo mais aqui...
 *          },
 *          (error) => {
 *            // Faça algo em caso de erro
 *          }
 *        );
 *      }
 *
 *      dataSource: DxCustomDataSource<Employee>;
 *    }
 *
 *
 *  // template html
 *  <dx-data-grid [dataSource]="dataSource">
 *     <dxi-column dataField="employeeId"></dxi-column>
 *     <dxi-column dataField="employeeName"></dxi-column>
 *  </dx-data-grid>
 *
 * @author michael
 */
export class DxCustomDataSource<T> extends DataSource {
    private __observable: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(observable: Observable<any>) {
        super({
            load: function(options?: any) {
                return new Promise((resolve, reject) => {
                    observable.subscribe(
                        (data) => {
                            const output = {
                                internal: true,
                                msg: "Data already set in underlying datasource"
                            };
                            resolve(data);
                            self.__observable.next(output);
                        },
                        (err) => {
                            const output = { internal: true, msg: err };
                            reject(err);
                            self.__observable.error(output);
                        }
                    );
                });
            }
        });
        const self = this;
    }

    of(successFn?: Function, errorFn?: Function) {
        this.__observable.subscribe(
            result => {
                if (result && result.internal) {
                    successFn(result.msg);
                }
            },
            error => {
                if (error && error.internal) {
                    errorFn(error.msg);
                }
            }
        );
        return this;
    }
}
