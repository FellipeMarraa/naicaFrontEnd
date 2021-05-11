import {Injectable} from "@angular/core";
import {WindowRefService} from "../../app/services/window-ref.service";
import {RestService} from "../../core/commons/services/rest.service";

@Injectable()
export class LocalIpService {

    constructor(private windowRefService: WindowRefService, private restService: RestService) { }

    getLocalIp(): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            let win: any = this.windowRefService.nativeWindow();

            //compatibility for firefox and chrome
            let myPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;

            if (!myPeerConnection) {

                //se o cliente não suporta a api WebRTC, pede o ip do cliente para o servidor
                //NOTA: para o sistema de atendimento, esse processo não será válido se os clientes
                //não estiverem na mesma rede que o servidor

                this.restService.get("/public/login/getClientIp", {responseType: 'text'})
                    .subscribe(ip => resolve(ip), err => reject(err));

                return;
            }

            let pc = new myPeerConnection({
                    iceServers: []
                }),
                noop = function () {
                },
                localIPs = {},
                ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                key;

            function iterateIP(ip) {
                if (!localIPs[ip]) resolve(ip);
                localIPs[ip] = true;
            }

            //create a bogus data channel
            pc.createDataChannel("");

            // create offer and set local description
            pc.createOffer().then(function (sdp) {
                sdp.sdp.split('\n').forEach(function (line) {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                });

                pc.setLocalDescription(sdp, noop, noop);
            }).catch(function (reason) {
                // An error occurred, so handle the failure to connect
                reject(reason);
            });

            //listen for candidate events
            pc.onicecandidate = function (ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            };

        });

    }

}
