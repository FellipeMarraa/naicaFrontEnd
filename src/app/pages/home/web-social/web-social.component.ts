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
import {ResponsavelService} from '../../../services/responsavel.service';

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {
  dataSourceResponsaveis: any;
  dataSource: Aluno[];
  url: string;

  // of(observable: Observable<any>, successFn?: Function, errorFn?: Function) {
  //   const defaultHandleError = this.alunoService.handleError.bind(this);
  //   return ObservableUtils.of(observable, successFn, errorFn ? errorFn : defaultHandleError);
  // }
  // aluno: AlunoDto[];

  constructor(public toastr: ToastrService,
              public alunoService: AlunoService,
              public responsavelService: ResponsavelService) {

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
   this.alunoService.list().subscribe(response => {
     this.dataSource = response;
     console.log(this.dataSource);

   }, error => {console.log(error)});

    // this.responsavelService.findAll().subscribe(response => {
    //   this.dataSource = response;
    //   console.log(this.dataSource);
    //
    // }, error => {console.log(error)});

  }


}
