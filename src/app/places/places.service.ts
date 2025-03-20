import { Injectable, inject, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  private httpClient = inject(HttpClient);

  loadAvailablePlaces() {
    return this.httpClient.get<{ places: Place[] }>(
      'http://localhost:3000/places'
    );
  }

  loadUserPlaces() {
    return this.httpClient.get<{ places: Place[] }>(
      'http://localhost:3000/user-places'
    );
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: placeId,
    });
  }

  removeUserPlace(place: Place) {}
}
