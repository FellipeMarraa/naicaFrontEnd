import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DomHandler } from "../../app/services/dom.handler";

@Component({
  selector: "classic-modal",
  templateUrl: "./classic.modal.component.html"
})
export class ClassicModalComponent implements OnInit {
  @Input() modalTitle;
  @Input() cssClass;
  @Output() onClose = new EventEmitter<any>();

  constructor(private domHandler: DomHandler, private elementRef: ElementRef) {}

  ngOnInit() {}

  close() {
    this.domHandler.hideByElementRef(this.elementRef);
    this.onClose.emit();
  }
}
