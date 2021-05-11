import {Component, Input} from "@angular/core";
import {PullProgress} from "../classes/pull.progress";
import {getLayerStatusMessage, LayerStatusEnum} from "../classes/layer.status.enum";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "docker-pull-layer",
    styleUrls: ['docker.pull.layer.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: "./docker.pull.layer.component.html",
})
export class DockerPullLayerComponent {

    @Input()
    layer: PullProgress;

    getStatus()  {
        return (value) => 'Progresso: ' + this.layer.current + '/' + this.layer.total + ' (' + (Math.round(value * 100)) + '%)';;
    }

    getStatusName() {
        return getLayerStatusMessage(this.layer.status);
    }

    isComplete() {
        return this.layer.status == LayerStatusEnum.COMPLETED;
    }

}
