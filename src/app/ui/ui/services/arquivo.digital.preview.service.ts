import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Observable} from "rxjs";

@Injectable()
export class ArquivoDigitalPreviewService {

    private arqSubject: Subject<number|string> = new Subject<number|string>();

    getObservable(): Observable<number|string> {
        return this.arqSubject;
    }

    preview(idArq: number) {
        this.arqSubject.next(idArq);
    }

    previewUrl(url: string) {
        this.arqSubject.next(url);
    }

}