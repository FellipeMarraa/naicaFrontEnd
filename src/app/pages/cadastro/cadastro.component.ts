import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {AlunoService} from '../../services/aluno.service';
import {AlunoDto} from '../../models/aluno.dto';
import {ResponsavelDto} from '../../models/responsavel.dto';
import {ResponsavelService} from '../../services/responsavel.service';
import {ToastrService} from 'ngx-toastr';
import {Coordenador} from '../../models/coordenador';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  aluno: AlunoDto = {
    "id" : null,
    "nome":"",
    "dataNascimento": Date.toString(),
    "idadeInicial":0,
    "idadeAtual": 0,
    "escola":"",
    "responsaveis": [],
    "sexo": false,
    "nisAtendido": "",
    "dataMatricula": "",
    "desligado": false,
    "anoEscolar": "",
    "periodoEscolar": "",
    "desacompanhado": false,
    "autorizadoBuscar": ""
  };

  responsavel: ResponsavelDto = {
    "id": null,
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
    "telefones": "",
    "observacao": "",
    "alunos": []
  };

  constructor(
    public router: Router,
              public alunoService: AlunoService,
              public responsavelService: ResponsavelService,
              public toastUiService: ToastrService) {

  }

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

      this.alunoService.insert(this.aluno)
        .subscribe(response => {
            // this.router.navigate(['home']);

          },
          error => {});

    this.aluno.responsaveis = [this.responsavel];


    this.responsavelService.insert(this.responsavel)
      .subscribe(response => {
          // this.router.navigate(['home']);

        },
        error => {});

    this.responsavel.alunos = [this.aluno];


    console.log(this.aluno);
    console.log(this.responsavel);

  }
}


