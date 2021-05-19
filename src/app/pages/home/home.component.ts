import { Component, OnInit } from '@angular/core';
import {style} from '@angular/animations';
import {Aluno} from '../../models/aluno';
import {Router} from '@angular/router';
import {StorageService} from "../../services/storage.service";
import {LocalUser} from "../../models/local_user";
import {AlunoService} from "../../services/aluno.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alunos: Aluno[];


  constructor(public router: Router,
              public storage:StorageService,
              public alunoService: AlunoService) { }

  ngOnInit() {
    this.alunos=[];
    this.alunoService.list().subscribe(response=>{
      this.alunos=response;
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
    this.router.navigate(['/web-social'])
  }

  webSocial() {
    this.router.navigate(['web-social']);
  }

  relacaoAtendido() {
    this.router.navigate(['relacao-atendidos']);
  }

  cadastroAtendido() {
    this.router.navigate(['cadastro']);
  }

}
