import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacaoAlunoComponent } from './relacao-aluno.component';

describe('RelacaoAlunoComponent', () => {
  let component: RelacaoAlunoComponent;
  let fixture: ComponentFixture<RelacaoAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelacaoAlunoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacaoAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
