import {Component, Input} from "@angular/core";
import {PullProgress} from "../classes/pull.progress";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "docker-pull",
    styleUrls: ['docker.pull.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: "./docker.pull.component.html",
})
export class DockerPullComponent {

    private _progress: PullProgress[] = [];

    private layersIdxMap: Map<string, number> = new Map();

    get progress(): PullProgress[] {
        return this._progress;
    }

    @Input()
    set progress(value: PullProgress[]) {

        if (value) {

            value.forEach(layer => this.addProgress(layer));

        }

    }

    addProgress(progress: PullProgress) {

        let idx = this.layersIdxMap.get(progress.layerId);
        if (idx !== undefined) {
            this._progress[idx] = progress;
        } else {
            this._progress.push(progress);
            this.layersIdxMap.set(progress.layerId, this._progress.length - 1)
        }

    }

    clear() {
        this._progress = [];
        this.layersIdxMap = new Map();
    }

    getLayerId(idx, layer) {
        return layer.layerId;
    }

}
