import {DateType, JacksonType} from "@sonner/jackson-service-v2";

@JacksonType("DateRangeVO")
export class DateRangeVO {

    @DateType()
    lower: Date;

    @DateType()
    upper: Date;

    equals(dateRange: DateRangeVO) {
        return (this.upper && this.lower && dateRange && dateRange.upper == this.upper && dateRange.lower == this.lower);
    }

    equalsTime(dateRange: DateRangeVO) {
        return (this.upper && this.lower && dateRange && dateRange.upper.getTime() == this.upper.getTime() && dateRange.lower.getTime() == this.lower.getTime());
    }
}
