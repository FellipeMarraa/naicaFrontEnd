import {DateRangeVO} from "../classes/date.range.vo";
import {DateUtils} from "./date.utils";

export class DateRangeUtils {

    static buildDateRange(date: Date): DateRangeVO {
        let dateRange: DateRangeVO = new DateRangeVO();

        dateRange.lower = DateUtils.clearTime(date, true);
        dateRange.upper = DateUtils.clearTime(date, false);

        return dateRange;
    }
}
