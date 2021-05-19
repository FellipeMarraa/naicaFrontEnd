import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AlunoService} from '../../services/aluno.service';
import {AlunoDto} from '../../models/aluno.dto';
import {ResponsavelService} from '../../services/responsavel.service';
import {ToastrService} from 'ngx-toastr';
import {Responsavel} from '../../models/responsavel';
import {Aluno} from '../../models/aluno';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {


  aluno: Aluno = {
    'id':"",
    'nome': '',
    'dataNascimento': Date.toString(),
    'idadeInicial': 0,
    'idadeAtual': 0,
    'escola': '',
    'responsavel': new Responsavel(),
    'sexo': "",
    'nisAtendido': '',
    'dataMatricula': '',
    'desligado': false,
    'anoEscolar': '',
    'periodoEscolar': '',
    'desacompanhado': false,
    'autorizadoBuscar': ''
  };


  constructor(
    public router: Router,
    public alunoService: AlunoService,
    public responsavelService: ResponsavelService,
    public toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  cadastroAtendido() {
    this.router.navigate(['cadastro']);
  }

  home() {
    this.router.navigate(['home']);
  }

  cadastrar() {

    this.alunoService.save(this.aluno)
      .subscribe(responseAluno => {
        },
        error => {
          this.toastr.error('Não foi possível efetuar o cadastro do aluno');
        });

  }


}


