import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {AlunoService} from "../../../../../services/aluno.service";
import DevExpress from "devextreme";
import data = DevExpress.data;
import {API_CONFIG} from "../../../../../config/api.config";
import {StorageService} from "../../../../../services/storage.service";

@Component({
  selector: 'app-edit-aluno',
  templateUrl: './edit-aluno.component.html',
  styleUrls: ['./edit-aluno.component.css']
})
export class EditAlunoComponent implements OnInit {

  aluno:any;

  constructor(private httpClient:HttpClient,
              private route:ActivatedRoute,
              private router:Router,
              private alunoService:AlunoService,
              private storage:StorageService) { }

  ngOnInit() {
    let localStorage=this.storage.getLocalUser();

    this.alunoService.findById(localStorage.id).subscribe(data=>{
      this.aluno=data;
      console.log(this.aluno);
    })
  }

  getAluno(id){
    this.alunoService.findById(id).subscribe(data =>{
      this.aluno=data;
    });
  }

  updateAluno(id:number){
    this.httpClient.put(`${API_CONFIG.baseUrl}/alunos/edit/${id}`,id).subscribe(data=>{
      let id= data['_id'];
      this.router.navigate(['/perfil-aluno',id]);
    })

    // this.alunoService.update(id).subscribe(data=>{
    // let id=data['_id'];
    // this.router.navigate(['/perfil-aluno',id]);
    // },error => {
    //   console.log(error);
    // });

  }
}
