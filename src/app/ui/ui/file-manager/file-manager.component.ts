import {CommonModule} from "@angular/common";
import {AfterViewChecked, Component, ElementRef, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {DxFileManagerComponent, DxFileManagerModule, DxResponsiveBoxModule} from 'devextreme-angular';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {ArquivoDigitalAnexoService} from './arquivo.digital.anexo.service';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {getUrlDownloadById, isMimeTypeDoc, isMimeTypeImage, isMimeTypePdf, SRCNOPREVIEW} from "./file-manager.util";
import CustomFileSystemProvider from "devextreme/file_management/custom_provider";
import FileSystemItem from "devextreme/file_management/file_system_item";
import {ArquivoDigitalVO} from "../../cadastros-gerais/classes/arquivo.digital.vo";
import {ArquivoDigitalReferencia} from "../../cadastros-gerais/classes/arquivo.digital.referencia";

declare var fileSaver: any;

@Component({
  selector: 'file-manager-arquivo-digital',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit, AfterViewChecked {

  @ViewChild(DxFileManagerComponent, { static: true })
  fileManager: DxFileManagerComponent | undefined;

  @ViewChild("video")
  video: ElementRef;

  @ViewChild("canvasSnapshot")
  canvasSnapshot: ElementRef;

  _remoteProvider: CustomFileSystemProvider | undefined;

  get remoteprovider(): CustomFileSystemProvider {
    if (!this._remoteProvider) {
      this._remoteProvider = new CustomFileSystemProvider({
        getItems: this.getItems,
        downloadItems: this.downloadItems
      });
    }
    return this._remoteProvider;
  }

  private _arquivos: ArquivoDigitalVO[] = [];
  private _arquivosId: number[] = [];
  popupCapturarImagemVisivel: boolean = false;

  @Input()
  arquivosRef: ArquivoDigitalReferencia[];

  /**
   * Obrigatório se arquivosRef for utilizado. Classe que representa um item.
   */
  @Input()
  arquivoRefType: any;

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

  srcUrl: any;
  srcNoPreview = SRCNOPREVIEW;

  styleHide = 'height: 100%; width: 100%; display: none;';
  styleShow = 'height: 100%; width: 100%; display: block;';
  pdfStyle = this.styleHide;
  imgStyle = this.styleHide;
  docStyle = this.styleHide;
  videoStyle = this.styleHide;
  audioStyle = this.styleHide;
  noPreviewStyle = this.styleShow;

  constructor() {
    this.displayDataPreview = this.displayDataPreview.bind(this);
    this.getItems = this.getItems.bind(this);
    this.downloadItems = this.downloadItems.bind(this);
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    if (this.fileManager){
      const adaptivityControl = this.fileManager.instance['_adaptivityControl'];
      const opened = adaptivityControl['_isDrawerOpened']();
      if (opened) {
        adaptivityControl.toggleDrawer(false, true);
      }
    }
  }

  displayDataPreview(e: any) {
    this.srcUrl = null;
    this.pdfStyle = this.styleHide;
    this.imgStyle = this.styleHide;
    this.docStyle = this.styleHide;
    this.noPreviewStyle = this.styleHide;
    if ( e && e.selectedItemKeys && e.selectedItemKeys.length === 1) {
      if ( isMimeTypePdf(String(e.selectedItems[0].dataItem.mimeType))) {
        this.pdfStyle = this.styleShow;
        this.srcUrl = getUrlDownloadById(e.selectedItemKeys[0]);
      }else if ( isMimeTypeImage(String(e.selectedItems[0].dataItem.mimeType))) {
        this.imgStyle = this.styleShow;
        this.srcUrl = getUrlDownloadById(e.selectedItemKeys[0]);
      }else if ( isMimeTypeDoc(String(e.selectedItems[0].dataItem.mimeType))) {
        this.docStyle = this.styleShow;
        this.srcUrl = 'http://homologweb.sonner.com.br:15527' + getUrlDownloadById(e.selectedItemKeys[0]);
      }else{
        this.noPreviewStyle = this.styleShow;
        console.log(e.selectedItems[0].dataItem.mimeType);
      }
    }else{
      this.noPreviewStyle = this.styleShow;
    }
  }

  getItems(parentDirectory: any): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      if (this._arquivos.length === 0) {
        /*this.restService.get(this.apiUrl, {responseType: ArquivoAnexo}).subscribe(value => {
          for (const arquivoDigitalVO of value.map((ad: ArquivoAnexo) => ad.infoArquivoDigital)) {
            const customFileSystemItem = new CustomFileSystemItem();
            customFileSystemItem.name = arquivoDigitalVO.nomeArquivo;
            customFileSystemItem.path = undefined;
            customFileSystemItem.key = String(arquivoDigitalVO.id);
            customFileSystemItem.hasSubDirectories = false;
            customFileSystemItem.isDirectory = false;
            customFileSystemItem.size = arquivoDigitalVO.tamanho;
            customFileSystemItem.dateModified = arquivoDigitalVO.dateCreate;
            customFileSystemItem.mimeType = arquivoDigitalVO.mimeType;
            this.items.push(customFileSystemItem);
          }

        });*/
        resolve(this._arquivos);
      }else {
        resolve(this._arquivos);
      }
    });
  }

  downloadItems(items: Array<FileSystemItem>) {
    if (1 === items.length) {
      this._downloadSingleFile(items[0]);
    } else {
      this._downloadMultipleFiles(items);
    }
  }

  _downloadSingleFile(file: any) {
    const content = ''; // this._getFileContent(file);
    const byteString = window.atob(content);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      array[i] = byteString.charCodeAt(i);
    }
    const blob = new window.Blob([arrayBuffer], {
      type: 'application/octet-stream'
    });
    fileSaver.saveAs(file.name, null, blob);
  }
  _downloadMultipleFiles(files: any[]) {
    // tslint:disable-next-line:variable-name
    /*const _this9 = this;
    const jsZip = getJSZip();
    const zip = new jsZip;
    files.forEach(function(file) {
      return zip.file(file.name, _this9._getFileContent(file), {
        base64: true
      });
    });
    const options = {
      type: 'blob',
      compression: 'DEFLATE',
      mimeType: 'application/zip'
    };
    const deferred = new _deferred.Deferred;
    if (zip.generateAsync) {
      zip.generateAsync(options).then(deferred.resolve);
    } else {
      deferred.resolve(zip.generate(options));
    }
    deferred.done(function(blob) {
      return _file_saver.fileSaver.saveAs('files.zip', null, blob);
    });*/
  }

}

@NgModule({
  declarations: [
    FileManagerComponent
  ],
  exports: [
    FileManagerComponent
  ],
  imports: [
      CommonModule,
      DxFileManagerModule,
      DxResponsiveBoxModule,
      NgxExtendedPdfViewerModule,
      NgxDocViewerModule
  ],
  providers: [ArquivoDigitalAnexoService]
})
export class FileManagerModulo { }
