import {Component, OnInit} from '@angular/core';
import {AlunoService} from '../../../services/aluno.service';
import {Aluno} from '../../../models/aluno';
import CustomStore from 'devextreme/data/custom_store';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_CONFIG} from '../../../config/api.config';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import {keys} from '@material-ui/core/styles/createBreakpoints';
import {ToastrService} from 'ngx-toastr';
import {ObservableUtils} from "../../../classe/observable.utils";
import {Observable} from "rxjs/Rx";
import {AlunoDto} from "../../../models/aluno.dto";

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {
  dataSourceResponsaveis: any;
  dataSource: any;
  url: string;

  aluno:AlunoDto[];

  of(observable: Observable<any>, successFn?: Function, errorFn?: Function) {
    const defaultHandleError = this.alunoService.handleError.bind(this);
    return ObservableUtils.of(observable, successFn, errorFn ? errorFn : defaultHandleError);
  }

  constructor(public toastr: ToastrService,
              public alunoService: AlunoService) {

    // this.url = `${API_CONFIG.baseUrl}`;
    //
    // this.dataSource = AspNetData.createStore({
    //   key: "id",
    //   loadUrl: this.url + "/alunos/list",
    //   updateUrl: this.url + "/alunos/edit/" ,
    //   deleteUrl: this.url + "/alunos/delete/",
    // });

    // this.dataSourceResponsaveis = AspNetData.createStore({
    //   key: "id",
    //   loadUrl: this.url + "/responsaveis/list",
    // });
  }


  ngOnInit() {
   this.alunoService.findAll().subscribe(response=>{this.aluno=response;}, error => {console.log(error)});
    console.log(this.aluno);

  }


}
