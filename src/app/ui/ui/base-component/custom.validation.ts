/**
 * Função de validação
 *
 * @param value - valor a ser validado
 * @param isValid - estado atual da validação
 *
 * @returns resultado da validação. Retorne um Promise para validação assíncrona.
 */
export type CustomValidation = (value: any, isValid: boolean) => CustomValidationResult|Promise<CustomValidationResult>;

/**
 * Resposta de um processo de validação.
 *
 * Nota: Use a notação literal para construir instâncias dessa interface. Exemplos:
 *
 *   let result = (isValid: true}:
 *   let result = {isValid: false, errorMessage: 'O valor está errado'};
 */
export interface CustomValidationResult {

    isValid: boolean;

    errorMessage?: string;

}
