import {Injectable} from "@angular/core";
import {TabPanelComponent} from "../tab-panel/tab-panel.component";
import {TabViewMode} from "../tab-panel/tab.component";

/**
 * Representa um painel de abas em uma hierarquia de componentes.
 *
 * NOTA: Este serviço NÃO é um singleton, e portanto não deve ser declarado em um módulo,
 * mas sim pelo próprio TabPanelComponent.
 */
@Injectable()
export class TabPanelNodeService {

    private container: TabPanelComponent;
    private children: TabPanelNodeService[] = [];

    parent: TabPanelNodeService;

    registerContainer(container: TabPanelComponent) {
        this.container = container;
    }

    registerChild(child: TabPanelNodeService) {
        this.children.push(child);
    }

    removeChild(child: TabPanelNodeService) {
        this.children.splice(this.children.findIndex(c => c == child), 1);
    }

    notifyViewMode(viewMode: TabViewMode, notifyContainer: boolean) {
        if (notifyContainer) {
            this.container.rootViewModeChanged(viewMode);
        }
        this.children.forEach(c => c.notifyViewMode(viewMode, true));
    }

    getRootViewMode(): TabViewMode {
        if (this.parent) {
            return this.parent.getRootViewMode();
        }
        return this.container.viewMode;
    }

}