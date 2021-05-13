import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {AlunoService} from '../../services/aluno.service';
import {AlunoDto} from '../../models/aluno.dto';
import {ResponsavelDto} from '../../models/responsavel.dto';
import {ResponsavelService} from '../../services/responsavel.service';
import {ToastrService} from 'ngx-toastr';
import {Coordenador} from '../../models/coordenador';
import {Observable} from "rxjs/Rx";
import {ObservableUtils} from "../../classe/observable.utils";
import {Responsavel} from '../../models/responsavel';
import {Aluno} from '../../models/aluno';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  aluno: Aluno = {
    'id': '',
    'nome': '',
    'dataNascimento': Date.toString(),
    'idadeInicial': 0,
    'idadeAtual': 0,
    'escola': '',
    'responsaveis': [],
    'sexo': "",
    'nisAtendido': '',
    'dataMatricula': '',
    'desligado': false,
    'anoEscolar': '',
    'periodoEscolar': '',
    'desacompanhado': false,
    'autorizadoBuscar': ''
  };

  responsavel: Responsavel = {
    'id': '',
    'nome': '',
    'dataNascimento': Date.toString(),
    'cpf': '',
    'identidade': '',
    'dataEmissao': Date.toString(),
    'uf': '',
    'orgaoExpeditor': '',
    'ctps': '',
    'nisResponsavel': '',
    'endereco': '',
    'email': '',
    'telefones': '',
    'observacao': '',
    'alunos': []
  };



  constructor(
    public router: Router,
    public alunoService: AlunoService,
    public responsavelService: ResponsavelService,
    public toastr: ToastrService) {

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

  cadastrar() {

    this.aluno.responsaveis = [this.responsavel.id];
    this.responsavel.alunos = [this.aluno.id];

    this.alunoService.save(this.aluno)
      .subscribe(response => {
        response.responsaveis = this.aluno.responsaveis
          console.log(response);
        },
        error => {
          this.toastr.error('Não foi possível efetuar o cadastro do aluno');
        });

    this.responsavelService.save(this.responsavel)
      .subscribe(response => {
        response.alunos = this.aluno.responsaveis
          console.log(response);
        },
        error => {
          this.toastr.error('Não foi possível efetuar o cadastro do responsável');

        });



    // console.log(this.aluno);
    // console.log(this.responsavel);

  }




}


