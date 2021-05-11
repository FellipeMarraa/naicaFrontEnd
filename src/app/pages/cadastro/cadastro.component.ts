import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Aluno} from '../../models/aluno';
import {isBoolean} from 'devextreme/core/utils/type';
import {Responsavel} from '../../models/responsavel';
import {AlunoService} from '../../services/aluno.service';
import {AlunoDto} from '../../models/aluno.dto';
import {ResponsavelDto} from '../../models/responsavel.dto';
import {ResponsavelService} from '../../services/responsavel.service';
import {ToastrService} from 'ngx-toastr';
import {AbstractCrud} from '../../ui/ui/crud/abstract.crud';
import {Coordenador} from '../../models/coordenador';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent extends AbstractCrud<Coordenador, any> {

  aluno: AlunoDto = {
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

  responsavel: ResponsavelDto = {
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

  constructor(injector: Injector,
    public router: Router,
              public alunoService: AlunoService,
              public responsavelService: ResponsavelService,
              public toastUiService: ToastrService) {
    super(injector);
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

    this.responsavel.alunos = this.aluno;

    this.responsavelService.insert(this.responsavel)
      .subscribe(response => {
          // this.router.navigate(['home']);

        },
        error => {

        });

    console.log(this.aluno);
    console.log(this.responsavel);

  }
}


