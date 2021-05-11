import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {AutoSizeNodeService} from "./auto.size.node.service";
import {Resizable} from "../auto-size-container/resizable";

/**
 * Serviço responsável por referenciar containers dinâmicos em uma hierarquia de componentes.
 *
 * NOTA: Este serviço NÃO é um singleton, e portanto não deve ser declarado em um módulo,
 * mas sim em um componente que representa a raiz de uma hierarquia de componentes (Ex.: CrudComponent, PopupComponent)
 */
@Injectable()
export class AutoSizeService {

    private roots: AutoSizeNodeService[] = [];

    private nodeSet: Set<AutoSizeNodeService> = new Set();

    private resizeSubject = new Subject<boolean>();

    marginRootHeight: number = 0;

    constructor() {
        this.resizeSubject
            .pipe(
                debounceTime(100)
            )
            .subscribe(_ =>
                this.roots.forEach(c =>
                    c.resize(
                        {marginRootHeight: this.marginRootHeight}
                        )
                )
            );
    }

    register(parent: AutoSizeNodeService, node: AutoSizeNodeService, component: Resizable) {
        node.registerContainer(component);
        this.nodeSet.add(node);
        if (parent) {
            if (this.nodeSet.has(parent)) {
                parent.registerChild(node);
                return;
            }
        }
        this.roots.push(node);
    }

    remove(parent: AutoSizeNodeService, node: AutoSizeNodeService, component: Resizable) {
        this.nodeSet.delete(node);
        if (parent) {
            if (this.nodeSet.has(parent)) {
                parent.removeChild(node);
                return;
            }
        }
        let idx = this.roots.findIndex(r => r == node);
        if (idx >= 0) {
            this.roots.splice(idx, 1);
        }
    }

    resize() {
        this.resizeSubject.next(true);
    }

}