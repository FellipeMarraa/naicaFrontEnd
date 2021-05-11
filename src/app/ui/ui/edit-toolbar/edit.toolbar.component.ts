import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: "edit-toolbar",
  template: `
  <toolbar cssClass="{{cssClass}}" [showLeftSection]="showLeftSection" [showRightSection]="showRightSection">
      <toolbar-left-section cssClass="{{leftSectionCssClass}}">
          <div class="{{titleCssClass}}">{{ title }}</div>
      </toolbar-left-section>
      <toolbar-right-section cssClass="{{rightSectionCssClass}}">
            <div *ngIf="saveCloseButtonShow" [ngStyle]="{'order': saveCloseButtonOrder}" title="{{saveCloseButtonTitle}}">
                <action-button (action)="onSaveCloseButtonAction($event)" cssClass="{{saveCloseButtonCssClass}} {{allButtonsCssClass}}">
                    <dx-button
                        icon="{{saveCloseButtonIconClass}}"
                        text="{{saveCloseButtonText}}">
                    </dx-button> 
                </action-button>
            </div>
            <div *ngIf="saveButtonShow" [ngStyle]="{'order': saveButtonOrder}" title="{{saveButtonTitle}}">
                <action-button (action)="onSaveButtonAction($event)" cssClass="{{saveButtonCssClass}} {{allButtonsCssClass}}">
                    <dx-button
                        icon="{{saveButtonIconClass}}"
                        text="{{saveButtonText}}">
                    </dx-button> 
                </action-button>
            </div>
            <div *ngIf="cancelButtonShow" [ngStyle]="{'order': cancelButtonOrder}" title="{{cancelButtonTitle}}">
                <action-button (action)="onCancelButtonAction($event)" cssClass="{{cancelButtonCssClass}} {{allButtonsCssClass}}">
                    <dx-button
                        icon="{{cancelButtonIconClass}}"
                        text="{{cancelButtonText}}">
                    </dx-button> 
                </action-button>
            </div>
            <div *ngIf="deleteButtonShow" [ngStyle]="{'order': deleteButtonOrder}" title="{{deleteButtonTitle}}">
                <action-button (action)="onDeleteButtonAction($event)" cssClass="{{deleteButtonCssClass}} {{allButtonsCssClass}}">
                    <dx-button
                        icon="{{deleteButtonIconClass}}"
                        text="{{deleteButtonText}}">
                    </dx-button> 
                </action-button>
            </div>
            <div *ngIf="newButtonShow" [ngStyle]="{'order': newButtonOrder}" title="{{newButtonTitle}}">
                <action-button (action)="onNewButtonAction($event)" cssClass="{{newButtonCssClass}} {{allButtonsCssClass}}">
                    <dx-button
                        icon="{{newButtonIconClass}}"
                        text="{{newButtonText}}">
                    </dx-button> 
                </action-button>
            </div>
            <div *ngIf="closeButtonShow" [ngStyle]="{'order': closeButtonOrder}" title="{{closeButtonTitle}}">
                <action-button (action)="onCloseButtonAction($event)" cssClass="{{closeButtonCssClass}} {{allButtonsCssClass}}">
                    <dx-button
                        icon="{{closeButtonIconClass}}"
                        text="{{closeButtonText}}">
                    </dx-button> 
                </action-button>
            </div>
            <ng-content></ng-content>
      </toolbar-right-section>
  </toolbar>
  `
})
export class EditToolbarComponent implements OnInit {
  constructor() {}

  /**
   * general
   */
  @Input() cssClass: string;

  @Input() rightSectionCssClass: string;

  @Input() leftSectionCssClass: string;

  @Input() showLeftSection: boolean = true;

  @Input() showRightSection: boolean = true;

  @Input() title;

  @Input() titleCssClass;

  @Input() allButtonsCssClass;

  /**
   * right section buttons
   */
  @Input() saveCloseButtonCssClass;

  @Input() saveButtonCssClass;

  @Input() cancelButtonCssClass;

  @Input() deleteButtonCssClass;

  @Input() newButtonCssClass;

  @Input() closeButtonCssClass;

  /**
   * save/close button
   */
  @Input() saveCloseButtonIconClass = "fa fa-save";
  @Input() saveCloseButtonText = "Salvar/Fechar";
  @Input() saveCloseButtonOrder = 0;
  @Input() saveCloseButtonShow = true;
  @Input() saveCloseButtonTitle = "Salvar/Fechar";

  /**
   * save button
   */
  @Input() saveButtonIconClass = "fa fa-file";
  @Input() saveButtonText = "Salvar";
  @Input() saveButtonOrder = 1;
  @Input() saveButtonShow = true;
  @Input() saveButtonTitle = "Salvar";

  /**
   * cancel button
   */
  @Input() cancelButtonIconClass = "fa fa-ban";
  @Input() cancelButtonText = "Cancelar";
  @Input() cancelButtonOrder = 2;
  @Input() cancelButtonShow = true;
  @Input() cancelButtonTitle = "Cancelar";

  /**
   * delete button
   */
  @Input() deleteButtonIconClass = "fa fa-trash";
  @Input() deleteButtonText = "Excluir";
  @Input() deleteButtonOrder = 3;
  @Input() deleteButtonShow = true;
  @Input() deleteButtonTitle = "Excluir";

  /**
   * new button
   */
  @Input() newButtonIconClass = "fa fa-plus-square";
  @Input() newButtonText = "Novo";
  @Input() newButtonOrder = 4;
  @Input() newButtonShow = true;
  @Input() newButtonTitle = "Novo";

  /**
   * close button
   */
  @Input() closeButtonIconClass = "fa fa-times-circle";
  @Input() closeButtonText = "Fechar";
  @Input() closeButtonOrder = 5;
  @Input() closeButtonShow = true;
  @Input() closeButtonTitle = "Fechar";

  /**
   * listeners
   */
  @Output() saveCloseButtonAction = new EventEmitter<any>();
  @Output() saveButtonAction = new EventEmitter<any>();
  @Output() deleteButtonAction = new EventEmitter<any>();
  @Output() cancelButtonAction = new EventEmitter<any>();
  @Output() newButtonAction = new EventEmitter<any>();
  @Output() closeButtonAction = new EventEmitter<any>();

  onDeleteButtonAction(event) {
    this.deleteButtonAction.emit(event);
  }

  onCancelButtonAction(event) {
    this.cancelButtonAction.emit(event);
  }

  onSaveButtonAction(event) {
    this.saveButtonAction.emit(event);
  }

  onSaveCloseButtonAction(event) {
    this.saveCloseButtonAction.emit(event);
  }

  onNewButtonAction(event) {
    this.newButtonAction.emit(event);
  }

  onCloseButtonAction(event) {
    this.closeButtonAction.emit(event);
  }

  ngOnInit() {}
}
