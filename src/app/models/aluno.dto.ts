import {Coordenador} from './coordenador';
import {Responsavel} from './responsavel';
import {ResponsavelDto} from './responsavel.dto';

export interface AlunoDto {
  id: string
  nome: string;
  dataNascimento: string;
  idadeInicial: number;
  idadeAtual: number;
  escola: string;
  responsaveis: string[];
  sexo: string;
  nisAtendido: string;
  dataMatricula: string;
  desligado: boolean;
  anoEscolar: string;
  periodoEscolar: string;
  desacompanhado: boolean;
  autorizadoBuscar: string;
}
