import {EnumType, JacksonType} from "@sonner/jackson-service-v2";
import {LayerStatusEnum} from "./layer.status.enum";



@JacksonType("PullProgress")
export class PullProgress {

    layerId: string;

    progressPct: number;

    current: string;

    total: string;

    @EnumType(LayerStatusEnum)
    status: LayerStatusEnum;

}
