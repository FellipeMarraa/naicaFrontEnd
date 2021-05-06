import { Component, OnInit } from '@angular/core';
import {style} from '@angular/animations';
import {Aluno} from '../models/aluno';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSource: Aluno[] = [{"nome": "Fellipe Marra",
    "idade": 20,
    "escola": "Messias"}]

  ;

  constructor() { }

  ngOnInit(): void {
  }

  ocultaDiv(divi1){

    let display =  document.getElementById(divi1).style.display;
    if(display == "none"){
      document.getElementById(divi1).style.display = "block";
    }else{
      document.getElementById(divi1).style.display = "none";
    }

    if (divi1 == 'div-web-social'){
      if (divi1 == "block"){
        document.getElementById('div-relacao-de-alunos').style.display = "none";
      }else{
        document.getElementById(divi1).style.display;
      }
    }
    if (divi1 == 'div-relacao-de-alunos'){
      if (divi1 == "block"){
        document.getElementById('div-web-social').style.display = "none";
      }else{
        document.getElementById(divi1).style.display;
      }
    }
}

}
