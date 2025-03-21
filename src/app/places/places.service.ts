import { DestroyRef, Injectable, inject, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private availablePlaces = signal<Place[]>([]);
  loadedUserPlaces = this.availablePlaces.asReadonly();
  userSelectedPlaces = this.userPlaces.asReadonly();
  isLoadingData = signal<boolean>(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);

  loadAvailablePlaces() {
    this.isLoadingData.set(true);
    const subscribtion = this.httpClient

      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log(places);
          this.availablePlaces.set(places);
        },
        error: (error) => {
          // this.error.set('Some thing wents wrong while fetching data....');
          this.errorService.showError(
            'Some thing wents wrong while fetching data....'
          );
        },
        complete: () => {
          this.isLoadingData.set(false);
        },
      });
    this.destroyRef.onDestroy(() => {
      subscribtion.unsubscribe();
    });
    return this.availablePlaces;
  }

  loadUserSelectedPlaces() {
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/user-places')
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log('----Response----');
          console.log(places);
          this.userPlaces.set(places);
        },
        error: (error) => {
          console.log('----Error occured----');
          console.log(error);
          this.errorService.showError(
            'Some thing wents wrong while fetching User Selected places'
          );
        },
        complete: () => {
          console.log('----Request completed----');
          subscription.unsubscribe();
        },
      });
    return this.userPlaces;
  }

  addPlaceToUserPlaces(place: Place) {
    let oldePlaces = this.userPlaces();
    const newPlaces = [...(oldePlaces || []), place];
    console.log('SelectedPlace', place);
    //debugger;
    this.userPlaces.set(newPlaces);
    console.log('----sending request----');
    const subscription = this.httpClient
      .put<{ places: Place[] }>('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log('----Response----');
          console.log(places);
        },
        error: (error) => {
          console.log('----Error occured----');
          console.log(error);
          this.errorService.showError(
            'Some thing wents wrong while fetching User Selected places'
          );
        },
        complete: () => {
          console.log('----Request completed----');
          subscription.unsubscribe();
        },
      });
  }

  removeUserPlace(place: Place) {
    const filteredPlase = this.userPlaces().filter(
      (uPlace) => uPlace.id !== place.id
    );
    this.userPlaces.set(filteredPlase);
    const subscribtion = this.httpClient
      .delete(`http://localhost:3000/user-places/${place.id}`)
      .subscribe({
        next: () => {},
        error: (error) => {
          console.log('----Error occured----');
          console.log(error);
          this.errorService.showError(
            'Some thing wents wrong while fetching User Selected places'
          );
        },
        complete: () => {
          console.log('----Request completed----');
          subscribtion.unsubscribe();
        },
      });
  }
}
