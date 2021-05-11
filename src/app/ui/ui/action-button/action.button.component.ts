import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";

@Component({
  selector: "action-button",
  template: `
    <div (click)="onClick($event)" style="display:flex; align-items: center;" class="{{ cssClass }}">
      <ng-content></ng-content>
    </div>
  `
})
export class ActionButtonComponent implements OnInit {
  constructor() {}

  @Input() cssClass: string;
  @Output() action = new EventEmitter<any>();

  ngOnInit() {}
  
  onClick(event){
    this.action.emit(event);
  }
}
