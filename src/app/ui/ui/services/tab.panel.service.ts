import {Injectable} from "@angular/core";
import {TabPanelComponent} from "../tab-panel/tab-panel.component";
import {TabViewMode} from "../tab-panel/tab.component";
import {TabPanelNodeService} from "./tab.panel.node.service";

/**
* Serviço responsável por referenciar painéis de abas em uma hierarquia de componentes.
*
* NOTA: Este serviço NÃO é um singleton, e portanto não deve ser declarado em um módulo,
* mas sim em um componente que representa a raiz de uma hierarquia de componentes (Ex.: CrudComponent, PopupComponent)
*/
@Injectable()
export class TabPanelService {

    roots: TabPanelNodeService[] = [];

    nodeSet: Set<TabPanelNodeService> = new Set();

    register(parent: TabPanelNodeService, node: TabPanelNodeService, container: TabPanelComponent) {
        node.registerContainer(container);
        this.nodeSet.add(node);
        if (parent) {
            if (this.nodeSet.has(parent)) {
                node.parent = parent;
                parent.registerChild(node);
                return;
            }
        }
        container.parentTab = null;
        this.roots.push(node);
    }

    remove(parent: TabPanelNodeService, node: TabPanelNodeService, container: TabPanelComponent) {
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

    notifyViewMode(node: TabPanelNodeService, viewMode: TabViewMode) {
        let idx = this.roots.findIndex(t => t == node);
        if (idx >= 0) {
            this.roots[idx].notifyViewMode(viewMode, false);
        }
    }

    isRoot(node: TabPanelNodeService) {
        let idx = this.roots.findIndex(t => t == node);
        return idx >= 0;
    }

}