import {Component, Input, ViewEncapsulation} from "@angular/core";
import {SistemaInfoVO} from "../../home/menu/classes/sistema.info.vo";

@Component({
    selector: 'system-flag',
    templateUrl: './system.flag.component.html',
    styleUrls: ['./system.flag.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SystemFlagComponent {

    @Input()
    system: SistemaInfoVO;

    @Input()
    isCurrentSystem: boolean = false;

}