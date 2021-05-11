import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {GoogleDriveService} from "../services/google.drive.service";
import {DomHandler} from "../../app/services/dom.handler";
import {GoogleDriveFileTypeEnum} from "../../cadastros-gerais/classes/google.drive.file.type.enum";
import {Observable, of, Subscription, timer} from "rxjs";
import {ArquivoGoogleDocs} from "../../cadastros-gerais/classes/arquivo.google.docs";
import {map, mergeMap} from "rxjs/operators";

const PING_INTERVAL = 60000;

/**
 * Permite a edição de documentos usando o google docs
 *
 * Note que devido a natureza da integração com o docs, este componente
 * possui uma API programática, e não reativa. Isto é, a interação não é feita via
 * atributos de input e output, mas sim via métodos públicos, são eles:
 *
 * - loadEditor(): cria o arquivo no google drive e carrega o editor. Caso
 * esteja sendo editado um arquivo já existente, o atributo idArquivoDigital
 * deve ser informado antes
 *
 * - commitFile(): deve ser invocado para transformar o arquivo no drive em um
 * arquivo digital no grp-web. Geralmente é invocado no método beforeSave() de
 * um crud. Nesse caso, o Observable retornado pelo commitFile(), deve ser retornado
 * também no beforeSave().
 *
 * NOTA: Caso o atributo readOnly seja setado como true, os métodos acima não
 * precisam ser invocados.
 *
 *
 *
 */
import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'google-docs',
    styleUrls: ['google.docs.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `<div #container style="width:100%;height:100%"></div>`
})
export class GoogleDocsComponent implements AfterViewInit, OnDestroy, OnChanges {

    @Input()
    idArquivoDigital: number;

    @Input()
    fileType: GoogleDriveFileTypeEnum = GoogleDriveFileTypeEnum.TEXTO;

    @Input()
    savePrint: boolean = false;

    @ViewChild("container", { static: true })
    container: ElementRef;

    @Input()
    set readOnly(value: boolean) {
        this._readOnly = value;
        if (this._frame && this._doc) {
            this.clearContent();
            this.createFrame('NORMAL');
        }
    }

    constructor(private googleDriveService: GoogleDriveService,
                private domHandler: DomHandler) { }

    private _viewInitialized: boolean = false;

    private _doc: ArquivoGoogleDocs;

    private _readOnly: boolean = false;

    private _frame: any;

    private pingTimerSubscription: Subscription;

    loadEditor(): void {

        if (this._doc && this.idArquivoDigital == this._doc.idArquivoDigital) {
            return;
        }

        if (this.pingTimerSubscription) {
            this.pingTimerSubscription.unsubscribe();
            this.pingTimerSubscription = null;
        }

        if (this._readOnly && !this.idArquivoDigital) {
            this.clearContent();
            this.createFrame('WARNING');
            return;
        }

        this.clearContent();
        this.createFrame('LOADING');

        this.googleDriveService.create(this.fileType, this.idArquivoDigital).subscribe(doc => {

            this._doc = doc;

            this.clearContent();
            this.createFrame('NORMAL');

            this.pingTimerSubscription = timer(PING_INTERVAL, PING_INTERVAL).pipe(
                mergeMap(() => this.googleDriveService.ping(this._doc.id))
            ).subscribe(doc => {
                this._doc = doc;
            }, err => {
                console.error(err);
            })

        }, err => {

            console.error(err);

            this.createFrame('ERROR');

        });

    }

    commitFile(): Observable<number> {

        if (!this._frame) {
            if (this._doc) {
                return of(this._doc.idArquivoDigital)
            } else if (this.idArquivoDigital) {
                return of(this.idArquivoDigital);
            }
            return of(null);
        }

        this.domHandler.jQuery(this._frame).blur();

        return timer(200).pipe(
            mergeMap(() => this.googleDriveService.commit(this._doc.id, this.savePrint)),
            map((doc: ArquivoGoogleDocs) => doc.idArquivoDigital));

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (!this._readOnly || !this._viewInitialized) {
            return;
        }

        if (changes['idArquivoDigital'] || changes['fileType']) {
            this.loadEditor();
        }

    }

    ngAfterViewInit(): void {
        this._viewInitialized = true;
        if (this._readOnly) {
            this.loadEditor();
        }
    }

    ngOnDestroy(): void {
        if (this.pingTimerSubscription) {
            this.pingTimerSubscription.unsubscribe();
        }
    }

    clearContent(): void {
        const $ = this.domHandler.jQuery();
        const containerElem = this.container.nativeElement;

        $(containerElem).empty();
    }

    private createFrame(type: 'NORMAL'|'LOADING'|'ERROR'|'WARNING'): void {
        const $ = this.domHandler.jQuery();
        const containerElem = this.container.nativeElement;

        let url;

        if (type == 'NORMAL') {
            url = this._readOnly ? this._doc.viewerLink : this._doc.fileLink;
        } else if (type == 'LOADING') {
            url = "/GRP/assets/loading-google-drive.html";
        } else if (type == 'WARNING') {
            url = "/GRP/assets/warning-google-drive.html";
        } else {
            url = "/GRP/assets/error-google-drive.html";
        }

        this._frame = $(`<iframe src="${url}" style="width: 100%; height: 100%;" frameborder="0" scrolling="no"></iframe>`);

        this._frame.appendTo($(containerElem));

    }


}