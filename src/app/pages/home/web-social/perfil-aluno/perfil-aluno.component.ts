import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AlunoService} from '../../../../services/aluno.service';
import {StorageService} from '../../../../services/storage.service';

@Component({
  selector: 'app-perfil-aluno',
  templateUrl: './perfil-aluno.component.html',
  styleUrls: ['./perfil-aluno.component.css']
})
export class PerfilAlunoComponent implements OnInit {

  aluno:any;
  dadosReadOnly: boolean = true;
  habilitarEdit: boolean = false;

  constructor(private route:ActivatedRoute,
              private http:HttpClient,
              private alunoService: AlunoService,
              private router:Router,
              private storage: StorageService ) { }

  ngOnInit() {

console.log(this.habilitarEdit);
    let localStorage=this.storage.getLocalUser();
    this.alunoService.findById(localStorage.id).subscribe(data=>{
      console.log(data);
      this.aluno=data;
      console.log(this.aluno);
    })
  }



  updateStart($event: MouseEvent) {
    this.habilitarEdit = true;
    this.dadosReadOnly = false;
  }

  saveUpdate($event: MouseEvent) {
    this.habilitarEdit=false;
    this.dadosReadOnly=true;
    this.alunoService.update(this.aluno).subscribe(alunoAtualizado=>{
      if (alunoAtualizado){
        console.log('Aluno Atualizado');
      }else{
        console.log('Error');
      }
          })
  }
}
