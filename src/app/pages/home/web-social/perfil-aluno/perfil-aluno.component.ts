import {Component, OnInit} from '@angular/core';
import {Aluno} from "../../../../models/aluno";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AlunoService} from "../../../../services/aluno.service";
import {StorageService} from "../../../../services/storage.service";
import {LocalUser} from "../../../../models/local_user";

@Component({
  selector: 'app-perfil-aluno',
  templateUrl: './perfil-aluno.component.html',
  styleUrls: ['./perfil-aluno.component.css']
})
export class PerfilAlunoComponent implements OnInit {

  aluno:any;
  dadosReadOnly: boolean=true;
  habilitarEdit: boolean=false;

  constructor(private route:ActivatedRoute,
              private http:HttpClient,
              private alunoService: AlunoService,
              private router:Router,
              private storage: StorageService ) { }

  ngOnInit() {
    let localStorage=this.storage.getLocalUser();
    this.alunoService.findById(localStorage.id).subscribe(data=>{
      console.log(data);
      this.aluno=data;
      console.log(this.aluno);
    })
  }

  // editAluno(aluno_id:string){
  //   let local:LocalUser={
  //     id:aluno_id,
  //     token:""
  //   }
  //   this.storage.setLocalUser(local);
  //   console.log(local);
  //   this.router.navigate(['/aluno-edit/',local.id]);
  // }


  editAluno(){


  }

  updateStart($event: MouseEvent) {
    this.habilitarEdit=true;
    this.dadosReadOnly=false;
  }

  saveUpdate($event: MouseEvent) {
    this.habilitarEdit=false;
    this.dadosReadOnly=true;
    // this.alunoService.update(this.aluno).subscribe(alunoAtualizado=>{
    //   if (alunoAtualizado){
    //     console.log('Aluno Atualizado');
    //   }else{
    //     console.log('Error');
    //   }
    //       })
  }
}
