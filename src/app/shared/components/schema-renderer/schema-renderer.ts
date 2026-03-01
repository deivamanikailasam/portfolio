import { Component, Input, ViewContainerRef, ViewChild, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContent, ComponentType } from '../../../core/models/content-schema';
import { PrimeNGTableComponent } from '../primeng-table/primeng-table';
import { PrimeNGCarouselComponent } from '../primeng-carousel/primeng-carousel';
import { PrimeNGStepperComponent } from '../primeng-stepper/primeng-stepper';
import { PrimeNGTabsComponent } from '../primeng-tabs/primeng-tabs';
import { PrimeNGDrawerComponent } from '../primeng-drawer/primeng-drawer';
import { CardComponent } from '../card/card.component';
import { ListComponent } from '../list/list.component';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-schema-renderer',
  imports: [CommonModule],
  template: `
    <div #container></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaRendererComponent implements AfterViewInit {
  @Input() content!: IContent;
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  private componentMap: Partial<Record<ComponentType, any>> = {
    table: PrimeNGTableComponent,
    carousel: PrimeNGCarouselComponent,
    stepper: PrimeNGStepperComponent,
    tabs: PrimeNGTabsComponent,
    drawer: PrimeNGDrawerComponent,
    card: CardComponent,
    list: ListComponent,
    form: FormComponent
  };

  ngAfterViewInit(): void {
    this.renderComponent();
  }

  private renderComponent(): void {
    if (!this.content) {
      console.error('Content is required for schema renderer');
      return;
    }

    const ComponentClass = this.componentMap[this.content.componentType];
    
    if (!ComponentClass) {
      console.warn(`Component type not found: ${this.content.componentType}. Available types: ${Object.keys(this.componentMap).join(', ')}`);
      return;
    }

    const componentRef = this.container.createComponent(ComponentClass);
    if (componentRef.instance && typeof componentRef.instance === 'object' && componentRef.instance !== null && 'data' in componentRef.instance) {
      (componentRef.instance as any).data = this.content.props;
    }
  }
}
