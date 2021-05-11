import {Component, Input, OnInit} from "@angular/core";
import {Publicidade} from "../../core/publicidade/publicidade";
import {PublicidadeService} from "../services/publicidade.service";
import {UsuarioPublicidadeService} from "../services/usuario.publicidade.service";

import {ViewEncapsulation} from "@angular/core"
import {WindowRefService} from "../../app/services/window-ref.service";

@Component({
    selector: 'publicidade',
    styleUrls: ['publicidade.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: './publicidade.component.html'
})
export class PublicidadeComponent implements OnInit {

    visible: boolean = false;

    publicidade: Publicidade;

    index: number;

    private _publicidadeList: Publicidade[];

    constructor(private publicidadeService: PublicidadeService,
                private usuarioPubliciadeService: UsuarioPublicidadeService,
                private windowRefService: WindowRefService) {
    }

    @Input()
    get publicidadeList(): Publicidade[] {
        return this._publicidadeList;
    }

    set publicidadeList(value: Publicidade[]) {
        this._publicidadeList = value;
        if (value && value.length) {
            this.publicidade = value[0];
            this.index = 0;
            this.visible = true;
        }
    }

    ngOnInit(): void {

        this.publicidadeService.getNaoVisualizados().subscribe(publicidadeList =>
            this.publicidadeList = publicidadeList);

    }

    proximo() {
        this.index = this.index + 1;
        this.publicidade = this._publicidadeList[this.index];
    }

    anterior() {
        this.index = this.index - 1;
        this.publicidade = this._publicidadeList[this.index];
    }

    notificaVisualizados() {

        this.usuarioPubliciadeService.registraVisualizacao(this._publicidadeList)
            .subscribe();

    }

    abrirLink(publicidade: Publicidade) {
        if (publicidade.conteudo) {
            this.windowRefService.nativeWindow().open(publicidade.conteudo, '_blank');
        }
    }
}