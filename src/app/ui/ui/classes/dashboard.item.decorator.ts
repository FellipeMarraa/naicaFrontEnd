import {Subject} from "rxjs";
import * as _ from "lodash";

export interface DashboarItemOptions {
    title: string,
    icon: string,
    sistemas?: string[],
    colSpan?: number | 'all',
    isChart?: boolean
}

export function DashboardItem(options: DashboarItemOptions) {

    return (target: any) => {
        if (_.isNil(options["isChart"])) {
            options["isChart"] = true;
        }
        target.prototype.options = options;
        return target;
    };

}

