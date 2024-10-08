import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AngularMaterialModule } from './angularMaterial/angular-material.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    SidenavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    AngularMaterialModule,
    
  ],
  exports:[SidenavComponent, FooterComponent]
})
export class SharedModule { }
