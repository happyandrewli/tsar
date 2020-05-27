import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { FavoriteList } from './favorites.model';
import { FavoritesState, FavoritesStore } from './favorites.store';

@Injectable({providedIn: 'root'})
export class FavoritesQuery extends QueryEntity<FavoritesState, FavoriteList> {
    selectTotal$ = this.selectAll().pipe(
        map(lists => lists.length)
    );
    constructor(protected store: FavoritesStore) {
        super(store);
    }
}
