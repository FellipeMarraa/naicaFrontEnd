import {Coordenador} from './coordenador';
import {Responsavel} from './responsavel';

export class AlunoDto {
  id: string
  nome: string;
  dataNascimento: string;
  idadeInicial: number;
  idadeAtual: number;
  escola: string;
  responsaveis: Responsavel[];
  sexo: boolean;
  nisAtendido: string;
  dataMatricula: string;
  desligado: boolean;
  anoEscolar: string;
  periodoEscolar: string;
  desacompanhado: boolean;
  autorizadoBuscar: string;
}
