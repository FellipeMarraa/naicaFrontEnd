// import {Component, enableProdMode, NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {DxTreeListModule} from 'devextreme-angular';
// import {
//     CentralCompraConfiguracao,
//     CompraCentralService,
//     SituacaoAtivoInativoEnum,
//     TipoConfiguracaoCentralCompraEnum
// } from "../../compras/services/cadastros/compra.central.service";
//
//
// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
//
//
// import {ViewEncapsulation} from "@angular/core"

// @Component({

//     selector: 'tree-list',
//     templateUrl: "./tree.list.component.html",
//     styleUrls: ["./tree.list.component.scss"],
//     encapsulation: ViewEncapsulation.None,

//     providers: [CompraCentralService],
//     preserveWhitespaces: true
// })
// export class TreeListComponent {
//     tipos: TipoConfiguracaoCentralCompraEnum[];
//     situacao: SituacaoAtivoInativoEnum[];
//     valores: CentralCompraConfiguracao[];
//
//     constructor(compraCentralService: CompraCentralService) {
//         this.tipos = compraCentralService.getTipoConfiguracaoCentralCompraEnum();
//         this.situacao = compraCentralService.getSituacaoAtivoInativoEnum();
//         this.valores = compraCentralService.getCentralCompraConfiguracao();
//
//     }
//
// }
//
//
// @NgModule({
//     imports: [
//         BrowserModule,
//         DxTreeListModule
//     ],
//     declarations: [TreeListComponent],
//     bootstrap: [TreeListComponent]
// })
// export class AppModule {
// }
//
// platformBrowserDynamic().bootstrapModule(AppModule);
