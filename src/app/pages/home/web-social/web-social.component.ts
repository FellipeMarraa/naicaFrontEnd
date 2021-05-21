import {Component, OnInit, ViewChild} from '@angular/core';
import {AlunoService} from '../../../services/aluno.service';
import {Aluno} from '../../../models/aluno';
import {ToastrService} from 'ngx-toastr';
import {ObservableUtils} from "../../../classe/observable.utils";
import {Observable} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LocalUser} from "../../../models/local_user";
import {StorageService} from "../../../services/storage.service";
import {API_CONFIG} from "../../../config/api.config";
import {ConfirmationDialogService} from "../../../services/confirmation.dialog.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-web-social',
  templateUrl: './web-social.component.html',
  styleUrls: ['./web-social.component.css']
})
export class WebSocialComponent implements OnInit {
  displayedColumns = ['id', 'name', 'sexo', 'idadeAtual','desacompanhado','autorizadoBuscar'];
  dataSource: MatTableDataSource<Aluno>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  alunos: Aluno[] = [];
  paginaAtual: Number = 1;
  contador: Number = 5;
  filtro: string = "";

  of(observable: Observable<any>, successFn?: Function, errorFn?: Function) {
    const defaultHandleError = this.alunoService.handleError.bind(this);
    return ObservableUtils.of(observable, successFn, errorFn ? errorFn : defaultHandleError);
  }

  constructor(public toastr: ToastrService,
              public alunoService: AlunoService,
              public route: ActivatedRoute,
              public router: Router,
              public http: HttpClient,
              public storage: StorageService,
              public confirmationDialogService: ConfirmationDialogService
  ) {
    this.dataSource=new MatTableDataSource(this.alunos);
  }


  ngOnInit() {
    this.alunoService.list().subscribe(response => {
      this.alunos = response;
      console.log(this.alunos);
    }, error => {
      console.log(error);
    })
 this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showAluno(aluno_id: string) {
    let local: LocalUser = {
      id: aluno_id,
      token: ""
    }
    this.storage.setLocalUser(local);
    console.log(local);
    this.router.navigate(['/perfil-aluno/', local.id]);
  }

  onDelete(id: string) {
    this.confirmationDialogService.confirm("Deletar o registro", "Tem certeza de que deseja deletar?", "Sim", "Cancelar", "sm")
      .then((confirmed) => {
        if (confirmed) {
          this.http.delete(`${API_CONFIG.baseUrl}/alunos/delete/${id}`).subscribe(data => {
            this.toastr.success('Registro deletado com sucesso!');
            this.reloadComponent();
          })
        } else {
          this.reloadComponent();
        }

      }).catch(() => this.reloadComponent());

  }

  // filtrar(value: string) {
  //   if (!value) {
  //     this.alunos = this.alunos;
  //   } else {
  //     this.alunos = this.alunos.filter(x =>
  //       x.nome.trim().toLowerCase().includes(value.trim().toLowerCase())
  //     );
  //   }
  // }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/web-social']);
  }


  onChangePage($event: PageEvent) {

  }
}
