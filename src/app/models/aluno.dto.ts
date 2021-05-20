import {Coordenador} from './coordenador';
import {Responsavel} from './responsavel';
import {ResponsavelDto} from './responsavel.dto';

export interface AlunoDto {
  id:string;
  nome: string;
  dataNascimento: string;
  idadeInicial: number;
  idadeAtual: number;
  escola: string;
  responsavel: Responsavel;
  sexo: string;
  nisAtendido: string;
  dataMatricula: string;
  desligado: string;
  anoEscolar: string;
  periodoEscolar: string;
  desacompanhado: string;
  autorizadoBuscar: string;

}
