import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';

import { FavoritesPageComponent } from './favorites-page/favorites-page.component';

@NgModule({
  declarations: [FavoritesPageComponent],
  imports: [
    SharedModule
  ],
  exports: [FavoritesPageComponent]
})
export class FavoritesModule { }
