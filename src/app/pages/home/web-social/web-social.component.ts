import {Component, OnInit} from '@angular/core';
import {AlunoService} from '../../../services/aluno.service';
import {Aluno} from '../../../models/aluno';
import {ToastrService} from 'ngx-toastr';
import {ObservableUtils} from "../../../classe/observable.utils";
import {Observable} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LocalUser} from "../../../models/local_user";
import {StorageService} from "../../../services/storage.service";
import {API_CONFIG} from "../../../config/api.config";

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {

  alunos:Aluno[]=[] ;

  filtro: string = "";

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
    this.alunoService.list().subscribe(response=>{
      this.alunos=response;
      console.log(this.alunos);
    },error => {
      console.log(error);
    })

    this.filtrar(this.filtro);
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

  onDelete(id:string){
    this.http.delete(`${API_CONFIG.baseUrl}/alunos/delete/${id}`).subscribe(data=>{
      this.toastr.warning('Registro deletado com sucesso!');
    })
  }

  filtrar(value: string) {
    if(!value) {
      this.alunos = this.alunos;
    } else {
      this.alunos = this.alunos.filter(x =>
        x.nome.trim().toLowerCase().includes(value.trim().toLowerCase())
      );
    }
  }

}
