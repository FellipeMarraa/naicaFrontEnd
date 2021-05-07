import { Component, OnInit } from '@angular/core';
import {Aluno} from '../../../models/aluno';

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {

  dataSource: Aluno[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
