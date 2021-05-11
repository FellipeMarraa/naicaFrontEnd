import {AfterViewInit, Component, EventEmitter, Output} from "@angular/core";
import {WindowRefService} from "../../app/services/window-ref.service";

const RECAPTCHA_CLIENT_KEY = "6Ld5csgUAAAAALeZPIZo1Pz3K_nTqI8P0ZHLK4kx";

let idGen: number = 0;

@Component({
    selector: 're-captcha',
    templateUrl: './re.captcha.component.html'
})
export class ReCaptchaComponent implements AfterViewInit {

    private initialized = false;

    reCaptchaId: string = `reCaptchaComp${idGen++}`;

    constructor(private windowRefService: WindowRefService) {
    }

    @Output()
    responseChange: EventEmitter<string> = new EventEmitter<string>();

    reset() {
        if (this.initialized) {
            let win = this.windowRefService.nativeWindow() as any;

            win.grecaptcha.reset();

            this.responseChange.emit(null);
        }
    }

    ngAfterViewInit(): void {
        // this.init();
    }

    init() {
        let win = this.windowRefService.nativeWindow() as any;

        win.grecaptcha.render(this.reCaptchaId, {
            'sitekey': RECAPTCHA_CLIENT_KEY,
            'callback': (response) => this.responseChange.emit(response && response.trim().length ? response : null),
            'expired-callback': () => this.responseChange.emit(null)
        });

        this.initialized = true;
    }
}