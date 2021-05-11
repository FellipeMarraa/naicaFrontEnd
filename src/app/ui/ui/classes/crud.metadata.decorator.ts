/**
 * Irá prover o identificador único do component, e as instancias de Model e Filter.
 *
 * Exemplo:
 *
 * @Component({
  selector: "system-crud",
  template: `
    <crud   listToolbarTitle="title" editToolbarTitle="editTitle">
        ...
    </crud>
    `
    })
 @CrudMetadata('SistemaCrudComponent', [Sistema, SistemFilterVO])
 export class SistemaCrudComponent extends AbstractCrud<Sistema, SistemFilterVO> implements OnInit {}
 *
 * @param compId - identificador único do componente. Deve ser o mesmo que o parâmetro 'component' informado no item de menu correspondente (arquivo .bin)
 * @param modelTypes - array onde o primeiro elemento é o tipo da classe de 'model' e o segundo do tipo do 'filter'.
 * @author michael
 */
import {Subject} from "rxjs";

export function CrudMetadata(compId: string, modelTypes: [any, any]) {

    return (target: any) => {

        target.prototype.compId = compId;
        target.prototype.filterSubject = new Subject();
        if (modelTypes) {
            const model = modelTypes[0];
            const filter = modelTypes[1];
            target.prototype.filterConstructor = filter;
            target.prototype.modelConstructor = model;
        }
        return target;
    };

}
