import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AlunoService} from '../../services/aluno.service';
import {AlunoDto} from '../../models/aluno.dto';
import {ResponsavelService} from '../../services/responsavel.service';
import {ToastrService} from 'ngx-toastr';
import {Responsavel} from '../../models/responsavel';
import {Aluno} from '../../models/aluno';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {map, startWith} from "rxjs/operators";


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  formGroup: FormGroup;

  estados: string [] = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ]

  aluno: Aluno = {
    'id': "",
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
  filterEstados: Observable<string[]>;

  formControl= new FormControl();

  constructor(
    public router: Router,
    public alunoService: AlunoService,
    public responsavelService: ResponsavelService,
    public toastr: ToastrService,
    public formBuilder: FormBuilder) {

    this.formGroup = this.formBuilder.group({
      nome: ["", Validators.required],
      dataNascimento: ["", Validators.required],
      idadeInicial: ["", Validators.required],
      idadeAtual: ["", Validators.required],
      escola: ["", Validators.required],
      responsavel: [""],
      sexo: ["", Validators.required],
      nisAtendido: [""],
      dataMatricula: ["", Validators.required],
      desligado: ["", Validators.required],
      anoEscolar: ["", Validators.required],
      periodoEscolar: ["", Validators.required],
      desacompanhado: ["", Validators.required],
      autorizadoBuscar: [''],
      nomeResponsavel: ['', Validators.required],
      dataNascimentoResponsavel: ['', Validators.required],
      cpf: ['', Validators.required],
      identidade: ['', Validators.required],
      dataEmissao: ['', Validators.required],
      uf: ['', Validators.required],
      orgaoExpeditor: ['', Validators.required],
      ctps: [''],
      nisResponsavel: [''],
      endereco: ['', Validators.required],
      email: [''],
      telefone: ['', Validators.required]
    })

  }

  ngOnInit() {
    this.filterEstados=this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value:string):string[]{
    const filterValue=value.toLowerCase();
    return this.estados.filter(estado => estado.toLowerCase().includes(filterValue));
  }

  cadastroAtendido() {
    this.router.navigate(['cadastro']);
  }

  home() {
    this.router.navigate(['home']);
  }

  cadastrar() {
    if (!this.formGroup.valid) {
      this.toastr.error('Todos os campos sao obrigatorios');
    } else {
      this.alunoService.save(this.aluno)
        .subscribe(responseAluno => {
            this.toastr.success("Aluno Cadastrado");
            this.router.navigate(['web-social']);
          },
          error => {
          });
    }

  }


}


