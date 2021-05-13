import {Responsavel} from './responsavel';
import {ResponsavelDto} from './responsavel.dto';

export class Aluno {
  id:string
  nome: string;
  dataNascimento: string;
  idadeInicial: number;
  idadeAtual: number;
  escola: string;
  responsavel: Responsavel;
  sexo: string;
  nisAtendido: string;
  dataMatricula: string;
  desligado: boolean;
  anoEscolar: string;
  periodoEscolar: string;
  desacompanhado: boolean;
  autorizadoBuscar: string;
}
