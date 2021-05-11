import {Injectable} from "@angular/core";
import {Resizable} from "../auto-size-container/resizable";

/**
 * Representa um container dinâmico em uma hierarquia de componentes.
 *
 * NOTA: Este serviço NÃO é um singleton, e portanto não deve ser declarado em um módulo,
 * mas sim pelo próprio AutoSizeContainerComponent.
 */
@Injectable()
export class AutoSizeNodeService {

    private component: Resizable;
    private children: AutoSizeNodeService[] = [];

    registerContainer(component: Resizable) {
        this.component = component;
    }

    registerChild(child: AutoSizeNodeService) {
        this.children.push(child);
    }

    removeChild(child: AutoSizeNodeService) {
        this.children.splice(this.children.findIndex(c => c == child), 1);
    }

    resize(options?: {marginRootHeight:number}) {
        this.component.adjust(options);
        setTimeout(() => {
            this.children.forEach(c => c.resize(options));
        });
    }

}