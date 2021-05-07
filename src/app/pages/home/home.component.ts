import { Component, OnInit } from '@angular/core';
import {style} from '@angular/animations';
import {Aluno} from '../../models/aluno';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  webSocial() {
    this.router.navigate(['web-social']);
  }

  relacaoAtendido() {
    this.router.navigate(['relacao-atendidos']);
  }

  cadastroAtendido() {
    this.router.navigate(['cadastro']);
  }

}
