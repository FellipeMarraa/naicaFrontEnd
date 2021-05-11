import {Injectable} from '@angular/core';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import {CustomFileSystemItem} from './custom-file-system-item';
import FileSystemItem from 'devextreme/file_management/file_system_item';
import {RestService} from "../../core/commons/services/rest.service";
import {ArquivoAnexo} from "../../documento/classes/arquivo.anexo";

declare var fileSaver: any;

@Injectable()
export class ArquivoDigitalAnexoService{
  // 3344412  3343119  3342224 3338100 3344105
  apiUrl = '/GRP/webservices/documento/arquivosanexos/3344105';
  objects: ArquivoAnexo[] = [];
  restRemoteFileSystem: CustomFileSystemProvider | undefined;
  private items: any[];

  constructor(public restService: RestService) {
    this.items = [];
    this.getItems = this.getItems.bind(this);
    this.downloadItems = this.downloadItems.bind(this);
    this.getObjects();
  }

  getObjects(){
    if (this.objects.length === 0) {
      this.restService.get(this.apiUrl, {responseType: ArquivoAnexo}).subscribe(value => {
        this.objects.push(value);
      });
    }
    return this.objects;
  }

  getCustomFileSystemProvider() {
    if (!this.restRemoteFileSystem) {
      this.restRemoteFileSystem = new CustomFileSystemProvider({
        getItems: this.getItems,
        downloadItems: this.downloadItems
      });
    }
    return this.restRemoteFileSystem;
  }

  getItems(parentDirectory: any): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      if (!this.items){
        this.items = [];
      }
      if (this.items.length === 0) {
        this.restService.get(this.apiUrl, {responseType: ArquivoAnexo}).subscribe(value => {
          for (const arquivoDigitalVO of value.map((ad: ArquivoAnexo) => ad.arquivoDigitalVO)) {
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
          resolve(this.items);
        });
      }else {
        resolve(this.items);
      }
    });
  }

  renameItem(item: FileSystemItem, newName: string){
    /*const url = this.apiUrl + '/renameitem/' + newName;
    const customFileSystemItem = new CustomFileSystemItem();
    customFileSystemItem.name = item.name;
    customFileSystemItem.path = item.path;
    customFileSystemItem.key = item.key;
    customFileSystemItem.hasSubDirectories = item.hasSubDirectories;
    customFileSystemItem.isDirectory = item.isDirectory;
    return new Promise((resolve, reject) => {
      this.restService.post(url, {responseType: CustomFileSystemItem, data: customFileSystemItem }).subscribe(value => {
        resolve(value);
      }, error => reject(error));
    });*/
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
