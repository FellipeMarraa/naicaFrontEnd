import { Component, OnInit } from '@angular/core';
import {Aluno} from "../../../../models/aluno";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG} from "../../../../config/api.config";
import {AlunoService} from "../../../../services/aluno.service";
import {StorageService} from "../../../../services/storage.service";
import {LocalUser} from "../../../../models/local_user";

@Component({
  selector: 'app-perfil-aluno',
  templateUrl: './perfil-aluno.component.html',
  styleUrls: ['./perfil-aluno.component.css']
})
export class PerfilAlunoComponent implements OnInit {

  alunos:Aluno[];
  aluno:any;

  constructor(private route:ActivatedRoute,
              private http:HttpClient,
              private alunoService: AlunoService,
              private router:Router,
              private storage: StorageService ) { }

  ngOnInit() {
    let localStorage=this.storage.getLocalUser();
    this.alunoService.findById(localStorage.id).subscribe(data=>{
      this.alunos=data['nome'];
      console.log(this.alunos);
    })
    this.alunoService.findById(localStorage.id).subscribe(data=>{
      this.aluno=data;
      console.log(this.alunos);
    })


    // this.getAluno(this.route.snapshot.params['id']);
    // this.alunos=[];
    // this.alunoService.list().subscribe(response=>{
    //   this.alunos=response;
    // },error => {
    //   console.log(error);
    // })
  }

  editAluno(aluno_id:string){
    let local:LocalUser={
      id:aluno_id,
      token:""
    }
    this.storage.setLocalUser(local);
    console.log(local);
    this.router.navigate(['/aluno-edit/',local.id]);
  }

  // getAluno(id){
  //   this.alunoService.findById(id).subscribe(data =>{
  //     this.aluno=data;
  //   })
  // }

  // deleteAluno(id){
  //   this.alunoService.delete(id).subscribe(data =>{
  //     this.router.navigate(['/web-social']);
  //   })
  // }

}
