import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  DoCheck,
  EmbeddedViewRef,
  EventEmitter,
  forwardRef,
  Input,
  isDevMode,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef
} from "@angular/core";

import * as $ from "jquery";
import * as _ from "lodash";
import { NgZone } from "@angular/core";

export class NgForEmphasisOfContext<T> {
  constructor(public $implicit: T, public ngForEmphasisOf: NgIterable<T>, public index: number, public count: number) {}

  get first(): boolean {
    return this.index === 0;
  }

  get last(): boolean {
    return this.index === this.count - 1;
  }

  get even(): boolean {
    return this.index % 2 === 0;
  }

  get odd(): boolean {
    return !this.even;
  }
}

/**
 * Similar ao ngFor mas com suporte á highlighting de itens.
 *
 * @author michael
 */
@Directive({ selector: "[ngForEmphasis][ngForEmphasisOf]" })
export class NgForEmphasisOf<T> implements DoCheck, OnChanges, AfterViewChecked {
  @Input() ngForEmphasisOf: NgIterable<T>;
  @Input()
  set ngForEmphasisTrackBy(fn: TrackByFunction<T>) {
    this._trackByFn = fn;
  }

  get ngForEmphasisTrackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }

  @Input()
  set ngForEmphasisSelector(selector: string) {
    this._selector = selector;
  }

  get ngForEmphasisSelector(): string {
    return this._selector;
  }

  @Input()
  set ngForEmphasisFilter(f: string) {
    this._filter = f;
  }

  get ngForEmphasisFilter(): string {
    return this._filter;
  }

  private _differ: IterableDiffer<T> | null = null;
  private _trackByFn: TrackByFunction<T>;
  private _selector: string;
  private _filter: string;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _template: TemplateRef<NgForEmphasisOfContext<T>>,
    private _differs: IterableDiffers,
    private ngZone: NgZone
  ) {}

  @Input()
  set ngForEmphasisTemplate(value: TemplateRef<NgForEmphasisOfContext<T>>) {
    if (value) {
      this._template = value;
    }
  }

  ngAfterViewChecked() {
    this.applyEmphasisFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("ngForEmphasisOf" in changes) {
      const value = changes["ngForEmphasisOf"].currentValue;
      if (!this._differ && value) {
        try {
          this._differ = this._differs.find(value).create(this.ngForEmphasisTrackBy);
        } catch (e) {
          throw new Error(
            `Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(
              value
            )}'. ngForEmphasis only supports binding to Iterables such as Arrays.`
          );
        }
      }
    }
  }

  ngDoCheck(): void {
    if (this._differ) {
      const changes = this._differ.diff(this.ngForEmphasisOf);
      if (changes) this._applyChanges(changes);
    }
  }

  private _applyChanges(changes: IterableChanges<T>) {
    const insertTuples: RecordViewTuple<T>[] = [];
    changes.forEachOperation((item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
      if (item.previousIndex == null) {
        const view = this._viewContainer.createEmbeddedView(
          this._template,
          new NgForEmphasisOfContext<T>(null!, this.ngForEmphasisOf, -1, -1),
          currentIndex
        );
        const tuple = new RecordViewTuple<T>(item, view);
        insertTuples.push(tuple);
      } else if (currentIndex == null) {
        this._viewContainer.remove(adjustedPreviousIndex);
      } else {
        const view = this._viewContainer.get(adjustedPreviousIndex)!;
        this._viewContainer.move(view, currentIndex);
        const tuple = new RecordViewTuple(item, <EmbeddedViewRef<NgForEmphasisOfContext<T>>>view);
        insertTuples.push(tuple);
      }
    });

    for (let i = 0; i < insertTuples.length; i++) {
      this._perViewChange(insertTuples[i].view, insertTuples[i].record);
    }

    for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
      const viewRef = <EmbeddedViewRef<NgForEmphasisOfContext<T>>>this._viewContainer.get(i);
      viewRef.context.index = i;
      viewRef.context.count = ilen;
    }

    changes.forEachIdentityChange((record: any) => {
      const viewRef = <EmbeddedViewRef<NgForEmphasisOfContext<T>>>this._viewContainer.get(record.currentIndex);
      viewRef.context.$implicit = record.item;
    });
  }

  private lastFilter: string;

  private applyEmphasisFilter() {
    const filter = this.ngForEmphasisFilter;
    const selector = this.ngForEmphasisSelector;

    if(this.lastFilter == filter){
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      $(selector).each(function() {
        let txt = $(this).text();
        if (!_.isEmpty(txt)) {
          if (!_.isEmpty(filter)) {
            var regex = new RegExp(filter, "gi");
            txt = txt.replace(regex, function(newValue) {
              return "<em>" + newValue + "</em>";
            });
          }

          // Substituir como HTML
          $(this).html(txt);
        }
      });
    });

    this.lastFilter = filter;
  }

  private _perViewChange(view: EmbeddedViewRef<NgForEmphasisOfContext<T>>, record: IterableChangeRecord<any>) {
    view.context.$implicit = record.item;
  }
}

class RecordViewTuple<T> {
  constructor(public record: any, public view: EmbeddedViewRef<NgForEmphasisOfContext<T>>) {}
}

export function getTypeNameForDebugging(type: any): string {
  return type["name"] || typeof type;
}
