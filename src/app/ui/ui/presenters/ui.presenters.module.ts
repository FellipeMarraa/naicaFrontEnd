import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../core/auth/guard/auth.guard";
import {GwtPresenterComponent} from "../../gwt/gwt-presenter/gwt.presenter.component";
import {GwtPresentersModule} from "../../gwt/gwt-presenter/gwt.presenters.module";

//ATENÇÃO: Essa classe foi gerada automaticamente com base nos arquivos *Menu.Bin
//Considere utilizar o projeto http://gitlab.sonner.com.br/sonner/grp-gwt-angular-router-gen para atualizar as rotas abaixo,
//ao invés de fazer uma alteração manual.

const routes: Routes = [
    {
        path: "cotacaopreco/cadastro/cotacao-preco-list/:params",
        component: GwtPresenterComponent,
        canActivate: [AuthGuard],
        data: [{ presenterName: "br.com.sonner.ui.cotacaopreco.cadastro.CotacaoPrecoListPresenter", title: "Cotação de Preço (GWT)"}]
    },
    {
        path: "cotacaopreco/cadastro/cotacao-preco-edit/:params",
        component: GwtPresenterComponent,
        canActivate: [AuthGuard],
        data: [{ presenterName: "br.com.sonner.ui.cotacaopreco.cadastro.CotacaoPrecoEditPresenter", title: "Cotação de Preço (GWT)"}]
    }];
@NgModule({
    imports: [GwtPresentersModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UiPresentersModule { }
