import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AlunoService} from '../../services/aluno.service';
import {AlunoDto} from '../../models/aluno.dto';
import {ResponsavelService} from '../../services/responsavel.service';
import {ToastrService} from 'ngx-toastr';
import {Responsavel} from '../../models/responsavel';
import {Aluno} from '../../models/aluno';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  formGroup: FormGroup;
  aluno: Aluno = {
    'id':"",
    'nome': '',
    'dataNascimento': "",
    'idadeInicial': null,
    'idadeAtual': null,
    'escola': '',
    'responsavel': new Responsavel(),
    'sexo': "",
    'nisAtendido': '',
    'dataMatricula': '',
    'desligado': '',
    'anoEscolar': '',
    'periodoEscolar': '',
    'desacompanhado': '',
    'autorizadoBuscar': ''
  };

  constructor(
    public router: Router,
    public alunoService: AlunoService,
    public responsavelService: ResponsavelService,
    public toastr: ToastrService,
    public formBuilder:FormBuilder) {

    this.formGroup=this.formBuilder.group({
      nome:["", Validators.required] ,
      dataNascimento: ["", Validators.required],
      idadeInicial: ["", Validators.required],
      idadeAtual: ["", Validators.required],
      escola: ["", Validators.required],
      responsavel: [""],
      sexo: ["", Validators.required],
      nisAtendido:[""] ,
      dataMatricula: ["", Validators.required],
      desligado: [false],
      anoEscolar: ["", Validators.required],
      periodoEscolar: ["", Validators.required],
      desacompanhado: [false],
      autorizadoBuscar:[ '']
    })

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
    if (!this.formGroup.valid){
      this.toastr.error('Não foi possível efetuar o cadastro do aluno');
    }else{
      this.alunoService.save(this.aluno)
        .subscribe(responseAluno => {
            this.toastr.success("Aluno Cadastrado");
          },
          error => {
          });
    }


  }


  onSubmit(value: any) {

  }
}


