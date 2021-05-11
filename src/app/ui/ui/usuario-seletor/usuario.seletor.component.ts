import {Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {Usuario} from "../../core/auth/classes/model/usuario";
import {BaseComponent} from "../base-component/base.component";
import {UsuarioService} from "../../core/auth/services/usuario.service";
import {UsuarioFilterVO} from "../../core/auth/classes/usuario.filter.vo";

@Component({
    selector: "usuario-autocomplete",
    template: `
        <autocomplete
                [placeholder]="placeholder"
                [items]="dataSource"
                (onQueryChanged)="onQueryChanged($event)"
                [(selected)]="value"
                [width]="width"
                [maxItemCount]="maxItemCount"
                [validationGroup]="validationGroup"
                [isRequired]="isRequired"
                [disabled]="disabled">
        </autocomplete>
    `
})
export class UsuarioAutocompleteComponent extends BaseComponent {

    dataSource: Usuario[];

    private _value: Usuario;

    // <-------------------------------- Inputs -------------------------------->
    @Input()
    placeholder: string = 'Digite o usuario';

    @Input()
    width: number = 500;

    @Input()
    disabled: boolean=false;

    @Input()
    maxItemCount: number;

    @Input()
    matriculas: string[];

    // <-------------------------------- Emitters -------------------------------->
    @Output()
    valueChange: EventEmitter<Usuario> = new EventEmitter<Usuario>();

    // <-------------------------------- Get And Setters -------------------------------->
    @Input()
    get value(): Usuario {
        return this._value;
    }

    set value(value: Usuario) {
        this._value = value;
        this.valueChange.emit(value);
    }


    // <-------------------------------- Methods -------------------------------->

    constructor(private mainService: UsuarioService,
                private injector: Injector) {
        super(injector);
    }

    onQueryChanged(nome: string) {
        if (nome.length >= 3) {
            let filter = new UsuarioFilterVO();
            filter.nome = nome;
            filter.matriculas = this.matriculas;
            this.mainService.list(filter)
                .subscribe(usuario => {
                    this.dataSource = usuario;
                });
        } else {
            this.dataSource = [];
        }
    }
}
