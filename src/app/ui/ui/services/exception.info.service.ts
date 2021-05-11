import {Injectable} from "@angular/core";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {Message} from "../classes/message";

@Injectable()
export class ExceptionInfoService {

    toMessages(ex: ExceptionInfo, editModelErrorMap?: Map<string, string>): Message[] {

        let mensagens: Message[] = [];

        if (ex.mensagens) {
            ex.mensagens.forEach(msg => {

                if (editModelErrorMap && msg.key) {
                    editModelErrorMap.set(msg.key, msg.message);
                } else {
                    mensagens.push({content: msg.message});
                }

            });
        }

        if (editModelErrorMap && editModelErrorMap.size > 0) {
            mensagens.push({content: "Foram encontrados erros na validação do formulário."});
        }

        if (mensagens.length == 0) {
            let details: string;
            if (ex.exceptionMessage) {
                details = ex.exceptionMessage + "\n";
            }

            details += ex.stackTrace;

            mensagens.push({content: "Falha ao processar requisição. Por favor, consulte seu suporte técnico.", details: details})
        }

        return mensagens;
    }

}
