import * as moment from "moment";
import {unitOfTime} from "moment";

export class DateUtils {
    static buildDate(ano: number, mes: number, dia: number) : Date {
        return new Date(ano, mes, dia, 0, 0, 0)
    }

    static format(date: Date, pattern: string) {
        return moment(date.getTime()).format(pattern);
    }

    static toMoment(date: Date) {
        return moment(date.getTime());
    }

    static isValid(dateAsString: string, patternOftheDate: string): boolean {
        var m = moment(dateAsString, patternOftheDate);
        return m && m.isValid ? m.isValid() : false;
    }

    static parse(dateAsString: string, patternOftheDate?: string): Date {
        return moment(dateAsString, patternOftheDate).toDate();
    }

    static dayOfYear(date: Date) {
        return DateUtils.toMoment(date).dayOfYear();
    }

    static dayOfMonth(date: Date) {
        return DateUtils.toMoment(date).date();
    }

    static dayOfWeek(date: Date) {
        return DateUtils.toMoment(date).day();
    }

    static weekOfMonth(date: Date) {
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return Math.ceil((date.getDate() + firstDay) / 7);
    }

    static weekOfYear(date: Date) {
        return DateUtils.toMoment(date).week();
    }

    static mes(date: Date) {
        return Math.ceil(6 / (12 / DateUtils.getMes(date)));
    }

    static bimestre(date: Date) {
        return Math.ceil(6 / (12 / DateUtils.getMes(date)));
    }

    // trimestre - 1 to 4
    static quarter(date: Date) {
        return DateUtils.toMoment(date).quarter();
    }

    static quadrimestre(date: Date) {
        return Math.ceil(3 / (12 / DateUtils.getMes(date)));
    }

    static semestre(date: Date) {
        return Math.ceil(2 / (12 / DateUtils.getMes(date)));
    }

    static quinzena(date: Date) {
        return Math.ceil(2 / (31 / DateUtils.getDay(date)));
    }

    static getDay(date: Date) {
        return DateUtils.toMoment(date).date();
    }

    static getDaylast(date: Date): number {
        return DateUtils.toMoment(date).daysInMonth();
    }

    static getYear(date: Date) {
        return DateUtils.toMoment(date).year();
    }

    // 0-based | December = 11
    static getMonth(date: Date) {
        return DateUtils.toMoment(date).month();
    }

    // 1-based | December = 12
    static getMes(date: Date) {
        return DateUtils.toMoment(date).month() + 1;
    }

    static getHour(date: Date) {
        return DateUtils.toMoment(date).hour();
    }

    static getMinute(date: Date) {
        return DateUtils.toMoment(date).minute();
    }

    static getSecond(date: Date) {
        return DateUtils.toMoment(date).second();
    }

    static getMillis(date: Date) {
        return DateUtils.toMoment(date).millisecond();
    }

    static isBefore(date1: Date, date2: Date) {
        return DateUtils.toMoment(date1).isBefore(DateUtils.toMoment(date2));
    }

    static isSame(date1: Date, date2: Date) {
        return DateUtils.toMoment(date1).isSame(DateUtils.toMoment(date2));
    }

    static isAfter(dataAnterior: Date, date2: Date) {
        return DateUtils.toMoment(dataAnterior).isAfter(DateUtils.toMoment(date2));
    }

    static isSameOrBefore(date1: Date, date2: Date) {
        return DateUtils.toMoment(date1).isSameOrBefore(DateUtils.toMoment(date2));
    }

    static isSameOrAfter(date1: Date, date2: Date) {
        return DateUtils.toMoment(date1).isSameOrAfter(DateUtils.toMoment(date2));
    }

    static isBetween(compareDate: Date, date1: Date, date2: Date, granularity?: unitOfTime.StartOf, inclusivity?: "()" | "[)" | "(]" | "[]") {
        return DateUtils.toMoment(compareDate).isBetween(DateUtils.toMoment(date1), DateUtils.toMoment(date2), granularity, inclusivity);
    }

    static getDate(ano: number): Date {
        return new Date(ano, 0, 1, 0, 0, 0,0);
    }

    static firstDayOfMonth(ano: number, mes: number): Date {
        return new Date(ano, mes - 1, 1, 0, 0, 0,0);
    }

    static firstDayOfMonthDate(data): Date {
        const m = moment(data.getTime());
        return new Date(m.year(), m.month(), 1, 0, 0, 0,0);
    }

    static firstDayOfYear(data: number): Date {
        return new Date(data, 0, 1, 0, 0, 0,0);
    }

    static firstDayOfYearDate(data): Date {
        const m = moment(data.getTime());
        return new Date(m.year(), 0, 1, 0, 0, 0,0);
    }

    static isDate(target) {
        return target && target instanceof Date;
    }

    static daysOfMonth(ano: number, mes: number): number {
        const data = new Date(ano, mes - 1, 1, 0, 0, 0,0);
        return moment(data).daysInMonth()
    }

    static lastDayOfMonth(ano: number, mes: number): Date {
        const data = new Date(ano, mes - 1, 1, 0, 0, 0,0);
        const retorno = new Date(ano, mes - 1, moment(data).daysInMonth(), 0, 0, 0,0);
        return retorno;
    }

    static lastDayOfMonthDate(data: Date): Date {
        const m = moment(data.getTime());
        return new Date(m.year(), m.month(), m.daysInMonth(), 0, 0, 0,0);
    }

    static lastDayOfYearDate(data: Date): Date {
        const m = moment(data.getTime());
        return new Date(m.year(), 11, 31, 0, 0, 0,0);
    }

    static byMilliSeconds(timeInMillis: number) {
        return new Date(timeInMillis);
    }

    static setHourMinuteSecond(date: Date, hour: number, minute: number, second: number): Date {
        const m = DateUtils.toMoment(date);
        m.set('hour', hour);
        m.set('minute', minute);
        m.set('second', second);
        m.set('milliseconds', 0);
        return m.toDate();
    }

    /**
     * Compara a DataA com a DataB, sem considerar o Time
     * Retorna
     * -1 se a<b
     *  0 se a==b
     *  1 se a>b
     * @param a
     * @param b
     */
    static compareDate(a: Date, b: Date): number {
        const aa = DateUtils.clearTime(a, true).getTime();
        const bb = DateUtils.clearTime(b, true).getTime();
        if(aa<bb) return -1;
        if(aa==bb) return 0;
        if(aa>bb) return 1;
    }

    /**
     * Verifica se um Date é igual ao outro.
     * Nao compara Time
     * @param a
     * @param b
     */
    static isEqualDate(a: Date, b: Date): boolean {
        return DateUtils.clearTime(a, true).getTime() == DateUtils.clearTime(b, true).getTime();
    }

    /**
     * Verifica se um DateTime é igual ao outro
     * @param a
     * @param b
     */
    static isEqualDateTime(a: Date, b: Date): boolean {
        return a.getTime() == b.getTime();
    }

    /**
     * Cria uma nova data com valor em 1900-01-01
     */
    static resetDate(): Date {
        return moment("1900 01 01 00:00:00", "YYYY-MM-DD hh:mm:ss").toDate();
    }

    static clearTime(now: Date, inicio: boolean): Date {
        const m = DateUtils.toMoment(now);
        if (inicio) {
            m.set('hour', 0);
            m.set('minute', 0);
            m.set('second', 0);
            m.set('millisecond', 0);
        } else {
            m.set('hour', 23);
            m.set('minute', 59);
            m.set('second', 59);
            m.set('millisecond', 999);
        }
        return m.toDate();
    }

    static addDays(date: Date, numDaysToAdd: number) {
        return moment(date).add(numDaysToAdd, 'day').toDate();
    }

    static addYears(date: Date, numYearsToAdd: number) {
        return moment(date).add(numYearsToAdd, 'year').toDate();
    }

    static lastDayOfYear(year: number): Date {
        return moment("31-12-" + year || DateUtils.getYear(new Date()), "DD-MM-YYYY").toDate();
    }

    static diffBetweenTwoDates(start: Date, end: Date) {
        return moment.duration(moment(end).diff(moment(start)));
    }

    static diffBetweenTwoDatesAsMonths(start: Date, end: Date) {
        return moment.duration(moment(end).diff(start)).asMonths();
    }

    static diffBetweenTwoDatesAsYears(start: Date, end: Date) {
        return moment.duration(moment(end).diff(start)).asYears();
    }

    static diffBetweenTwoDatesAsDays(start: Date, end: Date) {
        return moment.duration(moment(end).diff(start)).asDays();
    }

    static diffBetweenTwoDatesAsHours(start: Date, end: Date) {
        return moment.duration(moment(end).diff(start)).asHours();
    }

    static diffBetweenTwoDatesAsSeconds(start: Date, end: Date) {
        return moment.duration(moment(end).diff(start)).asSeconds();
    }

    static diffBetweenTwoDatesAsMinutes(start: Date, end: Date) {
        return moment.duration(moment(end).diff(start)).asMinutes();
    }

    static modifyDate(date: Date, option: { day?: number, month?: number, year?: number }) {
        if (!option.day) option.day = DateUtils.getDay(date);
        if (!option.month) option.month = DateUtils.getMonth(date);
        if (!option.year) option.year = DateUtils.getYear(date);

        return new Date(option.year, option.month, option.day);
    }

    /**
     * Metodo verifica a diferença de horas entre duas data
     * @param start
     * @param end
     */
    static diffHoursTwoDatesDate(start: Date, end: Date) {
        return this.setHourMinuteSecond(this.buildDate(this.getYear(end), this.getMonth(end), this.getDay(end) ),
            ((this.getHour(end) - this.getHour(start)) < 0 ? this.getHour(end) - this.getHour(start) * -1 : this.getHour(end) - this.getHour(start)),
        this.getMinute(end) - this.getMinute(start), this.getSecond(end) - this.getSecond(start));
    }

}
