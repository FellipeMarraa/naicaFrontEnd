import {Component, OnInit} from '@angular/core';
import {AlunoService} from '../../../services/aluno.service';
import {Aluno} from '../../../models/aluno';
import {ToastrService} from 'ngx-toastr';
import {ObservableUtils} from "../../../classe/observable.utils";
import {Observable} from "rxjs/Rx";
import {ResponsavelService} from '../../../services/responsavel.service';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG} from "../../../config/api.config";
import {LocalUser} from "../../../models/local_user";
import {StorageService} from "../../../services/storage.service";
import {Responsavel} from "../../../models/responsavel";

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {

  alunos:Aluno[] ;

  of(observable: Observable<any>, successFn?: Function, errorFn?: Function) {
    const defaultHandleError = this.alunoService.handleError.bind(this);
    return ObservableUtils.of(observable, successFn, errorFn ? errorFn : defaultHandleError);
  }

  constructor(public toastr: ToastrService,
              public alunoService: AlunoService,
              public route:ActivatedRoute,
              public router: Router,
              public http: HttpClient,
              public storage: StorageService) {
  }

  ngOnInit() {
    this.alunos=[];
    this.alunoService.list().subscribe(response=>{
      this.alunos=response;
      console.log(this.alunos);
    },error => {
      console.log(error);
    })

    }

  showAluno(aluno_id:string){
    let local:LocalUser={
      id:aluno_id,
      token:""
    }
    this.storage.setLocalUser(local);
    console.log(local);
    this.router.navigate(['/perfil-aluno/',local.id]);
  }


    //  this.alunoService.list().subscribe(response => {
   //   this.aluno = response;
   //   console.log(response);
   //
   // }, error => {console.log(error)});

    // this.responsavelService.findAll().subscribe(response => {
    //   this.dataSource = response;
    //   console.log(this.dataSource);
    //
    // }, error => {console.log(error)});



  getAluno(id:string){
    // id= this.id;
    // console.log(id);
    //
    // this.http.get(`${API_CONFIG.baseUrl}/alunos/${id}`).subscribe(data=>{
    //   console.log(data);
    //   this.aluno=data;
    // })
  }

  onEdit(index:string){
   //  index=this.aluno.id;
   // this.router.navigate(['/perfil-aluno/'+index]);
  }

  onDelete(index:string){
    // index=this.alunoModel.id;
    // this.aluno.splice(index,1);
  }

}
