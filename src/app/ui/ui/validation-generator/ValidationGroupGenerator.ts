let sequencial: number = 0;

export class ValidationGroupGenerator {

    static next() {
        sequencial = sequencial + 1;
        return `validationGroup_${sequencial}`;
    }

}
