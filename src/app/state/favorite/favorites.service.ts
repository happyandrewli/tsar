import { Injectable } from '@angular/core';
import { FavoriteList } from './favorites.model';
import { FavoritesStore } from './favorites.store';

@Injectable({providedIn: 'root'})
export class FavoritesService {
    constructor(private favoritesStore: FavoritesStore) {}
    
    add(favoriteList: FavoriteList) {
        this.favoritesStore.upsert(favoriteList.name, {
            name: favoriteList.name,
            seriesNames: favoriteList.seriesNames
        });
    }

    remove(listName: string) {
        this.favoritesStore.remove(listName);
    }
}
