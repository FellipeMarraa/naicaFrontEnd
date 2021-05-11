import {
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    Output, SimpleChanges, TemplateRef,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {ArquivoDigitalVO} from "../../cadastros-gerais/classes/arquivo.digital.vo";
import {ArquivoDigitalService} from "../services/arquivo.digital.service";
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {MessageBoxUiService} from "../services/message.box.ui.service";
import {WindowRefService} from "../../app/services/window-ref.service";
import {DxFileUploaderComponent, DxListComponent} from "devextreme-angular";
import {BaseComponent} from "../base-component/base.component";
import {ArquivoDigitalModeEnum} from "../../cadastros-gerais/classes/arquivo.digital.mode.enum";
import * as _ from "lodash";
import {JacksonService} from "@sonner/jackson-service-v2";
import {ArquivoDigitalReferencia} from "../../cadastros-gerais/classes/arquivo.digital.referencia";

@Component({
    selector: 'arquivo-digital',
    templateUrl: './arquivo.digital.component.html',
    styleUrls: ['./arquivo.digital.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArquivoDigitalComponent extends BaseComponent {

    private static _UPLOAD_URL = '/GRP/servlets/cadastrosgerais/uploadArquivoDigital';
    private static _DOWNLOAD_URL = '/GRP/servlets/cadastrosgerais/downloadArquivoDigital';

    DEFAULT_IMG = "/GRP/assets/images/gifs/anonymous.gif";
    CANVAS_WIDTH = 250;
    CANVAS_HEIGHT = 250;

    @ViewChild(DxFileUploaderComponent, { static: true })
    fileUploader: DxFileUploaderComponent;

    @ViewChild("video")
    video: ElementRef;

    @ViewChild("canvasSnapshot")
    canvasSnapshot: ElementRef;

    private _arquivos: ArquivoDigitalVO[] = [];
    private _arquivosId: number[] = [];
    private _form: Element;
    private _videoStream: any;

    uploadIsValid: boolean = true;
    validationError: any;

    popupCapturarImagemVisivel: boolean = false;

    photoWidth: number = this.CANVAS_WIDTH;
    photoHeight: number = this.CANVAS_HEIGHT;

    permiteOrdenacao: boolean = false;

    static get UPLOAD_URL() {
        return this._UPLOAD_URL;
    }

    static get DOWNLOAD_URL() {
        return this._DOWNLOAD_URL;
    }

    /**
     * Este input deve ser utilizado caso a entidade que contém um arquivo digital,
     * possua outros atributos editáveis, como ordem, descrição, tipo, etc.
     */
    @Input()
    arquivosRef: ArquivoDigitalReferencia[];

    /**
     * Obrigatório se arquivosRef for utilizado. Classe que representa um item.
     */
    @Input()
    arquivoRefType: any;

    /**
     * Utilizado apenas se arquivosRef for informado, é o template que será renderizado para cada item (por exemplo,
     * um form para preenchimento dos atributos extras). Deve conter o input 'let-item="item"' para acessar o item corrente.
     *
     * <ng-template #arqDigItemTemplate let-item="item">
     *     <dx-text-box [(value)]="item.descricao"></dx-text-box>
     * </ng-template>
     * <arquivo-digital [itemTemplate]="arqDigItemTemplate"
     *                  //demais atributo omitidos>
     * </arquivo-digital>
     */
    @Input()
    itemTemplate: TemplateRef<any>;

    @Input()
    set arquivosId(value: number[]) {
        this._arquivosId = value;
    }

    get arquivosId(): number[] {
        return this._arquivosId;
    }

    @Input()
    set arquivos(value: ArquivoDigitalVO[]) {
        this._arquivos = value;
    }

    get arquivos(): ArquivoDigitalVO[] {
        return this._arquivos;
    }

    exibirCapturarImagem() {
        this.pictureSrc = this.DEFAULT_IMG;
        this.photoWidth = this.CANVAS_WIDTH;
        this.photoHeight = this.CANVAS_HEIGHT;
        this.popupCapturarImagemVisivel = true;
    }

    @Output()
    arquivosChange: EventEmitter<ArquivoDigitalVO[]> = new EventEmitter<ArquivoDigitalVO[]>();

    @Output()
    arquivosIdChange: EventEmitter<number[]> = new EventEmitter<number[]>();

    @Output()
    arquivosRefChange: EventEmitter<ArquivoDigitalReferencia[]> = new EventEmitter<ArquivoDigitalReferencia[]>();

    @Input()
    arquivoUnico: boolean = false;

    @Input()
    permiteUpload: boolean = true;

    @Input()
    filtroTipo: string = "*";

    @Input()
    exibeArquivos: boolean = true;

    @Input()
    BtnExcluirSelecionados: boolean = true;

    @Input()
    BtnExcluirSelecionado: boolean = true;

    @Input()
    width = "48px";

    @Input()
    widthFileUploader: number | string = 400;

    @Input()
    marginLeftFileUploader: number = 0;

    @Input()
    height = "48px";

    // TODO: por hora, o modo IMAGE_PREVIEW_ONLY suporta apenas uma imagem. Portanto, 'unicoArquivo=true'. Ampliar suporte à múltiplas imagens.
    @Input()
    mode = ArquivoDigitalModeEnum.DEFAULT;

    private defaultImagesExtensions: string[] = ['bmp', 'jpg', 'jpeg', 'gif', 'png'];

    @Input()
    allowDefaultImagesExtension: boolean = false;

    @Input()
    allowedFileExtensions: string[] = [];

    @Input()
    showPreview: boolean = false;

    @Input()
    disabled: boolean = false;

    @Input()
    permiteCapturarImagem: boolean = false;

    @Input()
    multiple: boolean = false;

    modes: any = ArquivoDigitalModeEnum;

    progress: number = null;

    fileListDataSource: ArquivoDigitalVO[] = [];

    pictureSrc: string = this.DEFAULT_IMG;

    streamIniciado: boolean = false;

    @ViewChild("fileList")
    fileList: DxListComponent;
    urlSingleImg: any[];

    @ViewChild("form", { static: true })
    set form(form: ElementRef) {

        if (!form) {
            return;
        }

        this._form = form.nativeElement;

        this._form.addEventListener('submit', (event) => event.preventDefault());

    };

    constructor(private arquivoDigitalService: ArquivoDigitalService,
                private httpClient: HttpClient,
                private injector: Injector,
                private jacksonService: JacksonService,
                private messageBoxService: MessageBoxUiService,
                private windowRefService: WindowRefService) {
        super(injector);
    }

    protected doOnChanges(changes: SimpleChanges) {
        if (changes['arquivosId']) {
            let ids = changes['arquivosId'].currentValue;
            this.carregaArquivoDigitalVOList(ids);
        }

        if (changes['arquivos']) {
            this.updateFileListDataSource(changes['arquivos'].currentValue);
        }

        if (changes['arquivosRef']) {
            let refs = changes['arquivosRef'].currentValue;
            if (refs) {
                refs.sort((a, b) => (a.ordem ? a.ordem : 0) - (b.ordem ? b.ordem : 0));
            }
            let ids = refs ? refs.map(r => r.idArquivoDigital) : [];
            this._arquivosId = ids;
            this.carregaArquivoDigitalVOList(ids);
            if (refs) {
                this.permiteOrdenacao = true;
            }
        }
    }

    private carregaArquivoDigitalVOList(ids) {
        if (!this._.isEmpty(ids)) {
            this.arquivoDigitalService.getArquivoDigitalVOList(ids).subscribe(arquivos => {
                this._arquivos = arquivos;
                this.arquivosChange.emit(arquivos);
                this.updateFileListDataSource(arquivos);
                this.atualizaReferencias(arquivos);
            });
        } else {
            this.updateFileListDataSource([]);
            this.atualizaReferencias([]);
        }
    }

    getImageDS(ds: ArquivoDigitalVO[]) {
        return ds ? ds.map(data => `/GRP/servlets/filetypeimg?filename=${data.nomeArquivo}&id=${data.id}&width=${this.width}&height=${this.height}`) : null;
    }

    //https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
    getTamanhoArquivo(tamanho: number): string {
        let thresh = 1000;
        if (Math.abs(tamanho) < thresh) {
            return tamanho + ' B';
        }
        let units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let u = -1;
        do {
            tamanho /= thresh;
            ++u;
        } while (Math.abs(tamanho) >= thresh && u < units.length - 1);
        return tamanho.toFixed(1) + ' ' + units[u];
    }


    getCurrentValue(params): any {
        return this.arquivos;
    }


    submitForm(params) {
        let formData: any = new FormData((this._form as HTMLFormElement));
        let contentType = formData.entries().next().value[1].type;
        let nameFile = formData.entries().next().value[1].name;

        if(contentType == ""){
            let s = nameFile as string;
            contentType = s.substr(s.indexOf(".") + 1 ,3);
        }


        if (this.validateAllowedExtensions(contentType, nameFile)) {
            this.uploadIsValid = true;
            this.validationError = undefined;

            this.progress = 1;
            this.updateFileListDataSource(this.arquivos);

            let httpRequest = new HttpRequest('POST', ArquivoDigitalComponent.UPLOAD_URL, formData, {
                responseType: 'text',
                reportProgress: true
            });

            this.processaRequest(httpRequest);

        } else {
            this.progress = null;
            this.updateFileListDataSource(this.arquivos);
        }
    }

    updateFileListDataSource(arquivos: ArquivoDigitalVO[]) {
        this.fileListDataSource = [];
        if (this.progress) {
            this.fileListDataSource.push(new ArquivoDigitalVO());
        }
        arquivos.forEach(a => this.fileListDataSource.push(a));

        if(this.mode == this.modes.IMAGE_PREVIEW_ONLY) {
            if(this._.isEmpty(arquivos)) {
                this.urlSingleImg = [];
            } else {
                this.urlSingleImg = ['/GRP/servlets/filetypeimg?filename=' + this.fileListDataSource[0].nomeArquivo + '&id=' +  this.fileListDataSource[0].id + '&width=' + this.width + '&height=' + this.height];
            }
        }
    }

    formatProgress(value) {

        return 'Enviando arquivo: ' + Math.round(value * 100) + '%';

    }

    downloadFile(event: any, data: any) {
        event.event.preventDefault();
        event.event.stopPropagation();

        this.windowRefService.nativeWindow().location
            .replace(ArquivoDigitalComponent.DOWNLOAD_URL + "?forceDownload=true&id=" + data.id);
    }

    removeFile(event: any, data: any) {
        event.event.preventDefault();
        event.event.stopPropagation();

        let arquivos = this.arquivos.filter(a => a.id != data.id);
        let arquivosId = arquivos.map(a => a.id);

        if (this.arquivosRef) {
            this._arquivosId = arquivosId;
            this._arquivos = arquivos;
        }
        this.arquivosChange.emit(arquivos);
        this.arquivosIdChange.emit(arquivosId);
        this.atualizaReferencias(arquivos);
    }

    baixaSelecionados() {

        let arqList = this.fileList.selectedItems;

        if (arqList && arqList.length > 0) {

            let queryParam = arqList.map(a => a.id).join("&id=");

            this.windowRefService.nativeWindow().location
                .replace(ArquivoDigitalComponent.DOWNLOAD_URL + "?forceDownload=true&id=" + queryParam);

        }

    }

    excluirSelecionados() {

        let arqList = this.fileList.selectedItems;

        if (arqList) {

            let arqSet = new Set(arqList.map(a => a.id));
            let arquivos = this.arquivos.filter(a => !arqSet.has(a.id));
            let arquivosId = arquivos.map(a => a.id);

            if (this.arquivosRef) {
                this._arquivosId = arquivosId;
                this._arquivos = arquivos;
            }
            this.arquivosChange.emit(arquivos);
            this.arquivosIdChange.emit(arquivosId);
            this.atualizaReferencias(arquivos);

        }

    }

    validateAllowedExtensions(contentType: string, nameFile: any) {
        if (!contentType) {
            this.setValidationError("Arquivo com formato não suportado.");
            return false;
        }

         if (this.allowDefaultImagesExtension) {
            let allow = this.allowedExtensions(nameFile, this.defaultImagesExtensions);
            if (!allow) {
                this.setValidationError("Extensões de arquivos permitidos : [.bmp, .jpg, .jpeg, ,gif, .png]");
                return false;
            }
         }

         if (!_.isEmpty(this.allowedFileExtensions)) {
             let allow = this.allowedExtensions(nameFile, this.allowedFileExtensions);
             if (!allow) {
                 this.setValidationError("Extensões de arquivos permitidos : " + this.allowedFileExtensions.toString());
                 return false;
             }
         }

        return true;
    }

    private atualizaReferencias(arquivos: ArquivoDigitalVO[]) {
        if (this.arquivoRefType) {
            let refs = [];
            arquivos.forEach(arq => {
                let ref = null;
                if (this.arquivosRef) {
                    ref = this.arquivosRef.find(r => r.idArquivoDigital == arq.id);
                    if (!ref) {
                        ref = new this.arquivoRefType();
                        ref.idArquivoDigital = arq.id;
                    }
                } else {
                    ref = new this.arquivoRefType();
                    ref.idArquivoDigital = arq.id;
                }
                refs.push(ref);
            });
            let current = this.arquivosRef ? this.arquivosRef : [];
            if (!this._.isEqual(refs.map(r => r.idArquivoDigital), current.map(r => r.idArquivoDigital))) {
                refs.forEach((ref, idx) => ref.ordem = idx);
                this.arquivosRefChange.emit(refs);
            }
        }
    }

    private setValidationError(message: string) {
        if (this.uploadIsValid) {
            this.uploadIsValid = false;
            this.validationError = {message: message};
        }
    }


    private allowedExtensions(nameFile: string, extensions: string[]) {
        let allow: boolean = false;
        const regExp = /\.[0-9a-z]+$/i;
        const regExpExecArray = regExp.exec(nameFile);

        if(_.isEmpty(regExpExecArray)) {
           return false;
        }

        extensions.forEach(extension => {
            if (regExpExecArray[0] == "." + extension) {
                allow = true;
                return;
            }
        });
        return allow;
    }

    clearSingleImage(event: any) {
        this.arquivos = [];
    }

    initStream() {

        let win: any = this.windowRefService.nativeWindow();

        win.navigator.userMedia = win.navigator.getUserMedia ||
            win.navigator.webkitGetUserMedia ||
            win.navigator.mozGetUserMedia ||
            win.navigator.msGetUserMedia;

        if (!win.navigator.userMedia) {
            return false;
        }

        win.navigator.userMedia({video: true, audio: false}, (stream) => {
            if (win.navigator.mozGetUserMedia) {
                this.video.nativeElement.mozSrcObject = stream;
            } else {
                //let vendorURL = win.URL || win.webkitURL;
                this.video.nativeElement.srcObject = stream;
            }
            this.video.nativeElement.play();

            this._videoStream = stream;
        }, (err) => {
            this.popupCapturarImagemVisivel = false;
            this.messageBoxService.showError("Não foi possível acessar um dispositivo para captura de imagens.");
        });

        this.streamIniciado = false;
        let streaming = false;

        this.video.nativeElement.addEventListener('canplay', ev => {
            if (!streaming) {

                var height = this.video.nativeElement.videoHeight / (this.video.nativeElement.videoWidth/this.CANVAS_WIDTH);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = this.CANVAS_WIDTH / (4/3);
                }

                this.video.nativeElement.setAttribute('width', this.CANVAS_WIDTH);
                this.video.nativeElement.setAttribute('height', height);
                this.canvasSnapshot.nativeElement.setAttribute('width', this.CANVAS_WIDTH);
                this.canvasSnapshot.nativeElement.setAttribute('height', height);
                streaming = true;
                this.streamIniciado = true;
            }
        }, false);


        return true;

    }

    takeSnapshot() {

        let context = this.canvasSnapshot.nativeElement.getContext('2d');

        context.drawImage(this.video.nativeElement, 0, 0,
            this.video.nativeElement.width, this.video.nativeElement.height);

        this.photoWidth = this.video.nativeElement.width;
        this.photoHeight = this.video.nativeElement.height;

        let data = this.canvasSnapshot.nativeElement.toDataURL('image/png');
        this.pictureSrc = data;

    }

    closeStream() {
        if (this._videoStream) {
            if (this._videoStream.stop) {
                this._videoStream.stop();
            } else {
                this._videoStream.getTracks().forEach(function (t) {
                    t.stop();
                });
            }
            this._videoStream = null;
        }
    }

    uploadSnapshot() {
        let headers = new HttpHeaders();
        headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
        let formData = new URLSearchParams();
        formData.set("imageData", this.pictureSrc);
        let httpRequest = new HttpRequest('POST', ArquivoDigitalComponent.UPLOAD_URL, formData.toString(), {
            responseType: 'text',
            reportProgress: true,
            headers: headers
        });

        this.processaRequest(httpRequest);

        this.popupCapturarImagemVisivel = false;

    }

    private processaRequest(httpRequest: HttpRequest<any>) {
        this.httpClient.request(httpRequest).subscribe((event: any) => {

            if (event.type === HttpEventType.UploadProgress) {

                this.progress = Math.round(100 * event.loaded / event.total);

            } else if (event instanceof HttpResponse) {

                let respRegex = /.*"idArquivoDigital":"([0-9]+)",.*/;

                let match = respRegex.exec(event.body);
                let arqId = match[1];

                let novosArquivos = [];
                novosArquivos.push(arqId);

                if (!this.arquivoUnico && this._arquivosId) {
                    this._arquivosId.forEach(id => novosArquivos.push(id));
                }

                this.progress = null;

                if (this.arquivosRef) {
                    this._arquivosId = novosArquivos;
                }
                this.arquivosIdChange.emit(novosArquivos);
                this.carregaArquivoDigitalVOList(novosArquivos);

                (this._form as HTMLFormElement).reset();

            }

        }, err => {

            this.progress = null;
            this.updateFileListDataSource(this.arquivos);

            this.messageBoxService.showError("Falha ao enviar arquivo: Arquivo com tamanho acima do limite permitido, ou com formato não suportado.");

            console.log("Falha ao salvar arquivo digital", err);

        });
    }

    getRef(id: number): ArquivoDigitalReferencia {
        if (this.arquivosRef) {
            return this.arquivosRef.find(r => r.idArquivoDigital == id);
        }
        return null;
    }

    podeReordenarRegistro() {
        return !this.disabled && this.fileList && this.fileList.selectedItems.length == 1;
    }

    moveUp() {
        let arq = this.fileList.selectedItems[0];

        let index = this.arquivosRef.findIndex(r => r.idArquivoDigital == arq.id);
        if (index > 0) {
            let temp: any = this.arquivosRef[index - 1];
            this.arquivosRef[index - 1] = this.arquivosRef[index];
            this.arquivosRef[index] = temp;

            temp = this._arquivos[index - 1];
            this._arquivos[index - 1] = this._arquivos[index];
            this._arquivos[index] = temp;

            this.updateFileListDataSource(this._arquivos);

            this.arquivosRef.forEach((ref, idx) => ref.ordem = idx);
            this.arquivosRefChange.emit(this.arquivosRef);
        }
    }

    moveDown() {
        let arq = this.fileList.selectedItems[0];

        let index = this.arquivosRef.findIndex(r => r.idArquivoDigital == arq.id);
        if (index < this.arquivosRef.length - 1) {
            let temp: any = this.arquivosRef[index + 1];
            this.arquivosRef[index + 1] = this.arquivosRef[index];
            this.arquivosRef[index] = temp;

            temp = this._arquivos[index + 1];
            this._arquivos[index + 1] = this._arquivos[index];
            this._arquivos[index] = temp;

            this.updateFileListDataSource(this._arquivos);

            this.arquivosRef.forEach((ref, idx) => ref.ordem = idx);
            this.arquivosRefChange.emit(this.arquivosRef);
        }
    }

    onTemplateClick(event: MouseEvent) {
        event.cancelBubble = true;
        event.preventDefault();
        event.stopPropagation();
    }
}
