import {Injectable} from "@angular/core";
import {MensagemNotificacaoService} from "../../home/websocket/services/mensagem.notificacao.service";

@Injectable()
export class PopupService {

    constructor(private mensagemNotificacaoService: MensagemNotificacaoService) {
    }

    private activePopups: Set<string> = new Set<string>();

    popupAtivo(popupId: string) {
        this.activePopups.add(popupId);
        if (this.activePopups.size > 0) {
            this.mensagemNotificacaoService.setPainelVisivel(false);
        }
    }

    popupInativo(popupId: string) {
        this.activePopups.delete(popupId);
        if (this.activePopups.size == 0) {
            this.mensagemNotificacaoService.setPainelVisivel(true);
        }
    }
}