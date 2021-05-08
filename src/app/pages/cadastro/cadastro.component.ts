import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Aluno} from '../../models/aluno';
import {isBoolean} from 'devextreme/core/utils/type';
import {Responsavel} from '../../models/responsavel';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  aluno: Aluno = {
    "nome":"",
    "dataNascimento": Date.toString(),
    "idadeInicial":0,
    "idadeAtual": 0,
    "escola":"",
    "responsavel":"",
    "sexo": false,
    "nisAtendido": "",
    "dataMatricula": "",
    "desligado": false,
    "anoEscolar": "",
    "periodoEscolar": "",
    "desacompanhado": false,
    "autorizadoBuscar": ""
  };

  responsavel: Responsavel = {
    "nome":"",
    "dataNascimento": Date.toString(),
    "cpf": "",
    "identidade": "" ,
    "dataEmissao": Date.toString() ,
    "uf": "" ,
    "orgaoExpeditor": "" ,
    "ctps": "" ,
    "nisResponsavel": "" ,
    "endereco": "" ,
    "email":"" ,
    "telefone": [],
    "observacao": "",
    "alunos": this.aluno
  };

  constructor(public router: Router) { }

  ngOnInit(): void {
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

  home() {
    this.router.navigate(['home']);
  }

  cadastrar(){
    this.responsavel.alunos = this.aluno;
    console.log(this.aluno);
    console.log(this.responsavel);

  }
}


