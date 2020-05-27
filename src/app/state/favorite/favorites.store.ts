import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FavoriteList } from './favorites.model';

export interface FavoritesState extends EntityState<FavoriteList> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'favorites' })
export class FavoritesStore extends EntityStore<FavoritesState, FavoriteList> {
    constructor() {
        super();
    }
}
