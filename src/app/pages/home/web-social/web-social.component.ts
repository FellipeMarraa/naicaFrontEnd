import {Component, OnInit} from '@angular/core';
import {AlunoService} from '../../../services/aluno.service';
import {Aluno} from '../../../models/aluno';
import CustomStore from 'devextreme/data/custom_store';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_CONFIG} from '../../../config/api.config';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import {keys} from '@material-ui/core/styles/createBreakpoints';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {
  dataSourceResponsaveis: any;
  dataSource: any;
  url: string;

  constructor(public toastr: ToastrService,
              public alunoService: AlunoService) {
    this.url = `${API_CONFIG.baseUrl}`;

    this.dataSource = AspNetData.createStore({
      key: "id",
      loadUrl: this.url + "/alunos/list",
      updateUrl: this.url + "/alunos/edit/" ,
      deleteUrl: this.url + "/alunos/delete/",
    });

    this.dataSourceResponsaveis = AspNetData.createStore({
      key: "id",
      loadUrl: this.url + "/responsaveis/list",
    });
  }


  ngOnInit(): void {

    console.log(this.dataSource);

  }



}
