import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PantryPage } from './pantry.page';

import { PantryPageRoutingModule } from './pantry-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PantryPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [PantryPage],
})
export class PantryPageModule {}
