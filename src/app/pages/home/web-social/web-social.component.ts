import {Component, Injector} from '@angular/core';
import {AlunoService} from '../../../services/aluno.service';
import {Aluno} from '../../../models/aluno';

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent {

  aluno:Aluno;
  dataSource:Aluno[]=[];

  constructor(
              public alunoService: AlunoService) {

  }

  ngOnInit(): void {
    this.alunoService.findAll(this.dataSource);
    console.log(this.dataSource);
  }

}
