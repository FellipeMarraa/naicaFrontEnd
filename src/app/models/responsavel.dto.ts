import {Aluno} from './aluno';
import {AlunoDto} from './aluno.dto';

export class ResponsavelDto {
  id:string
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
  telefones: string;
  observacao: string;


  alunos: string[];
}
