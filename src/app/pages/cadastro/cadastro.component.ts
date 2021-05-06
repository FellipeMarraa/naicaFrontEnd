import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

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
