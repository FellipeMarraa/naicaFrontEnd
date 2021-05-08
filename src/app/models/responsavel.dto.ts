import {Aluno} from './aluno';

export class ResponsavelDto {


  nome: string ;
  dataNascimento: string ;
  cpf: string ;
  identidade: string ;
  dataEmissao: string ;
  uf: string ;
  orgaoExpeditor: string ;
  ctps: string ;
  nisResponsavel: string ;
  endereco: string ;
  email:string ;
  telefone: string[];
  observacao: string;
  alunos: Aluno;


}
