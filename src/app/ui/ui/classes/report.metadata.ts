
export function ReportMetadata(compId: string, reportFilterType: Function) {

    return (target: any) => {

        target.prototype.compId = compId;
        target.prototype.reportFilterType = reportFilterType;

        return target;
    }

}
