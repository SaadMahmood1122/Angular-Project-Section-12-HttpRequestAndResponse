import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isLoadingData = signal<boolean>(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  // Sending http get request
  ngOnInit(): void {
    this.isLoadingData.set(true);
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
        // error: this will execute when any error occure
        error: (error) => {
          //this.error.set(error.message);
          this.error.set('Some thing wents wrong while fetching data....');
        },
        //complete: This callback gets triggered when the HTTP request has finished,
        // regardless of whether it was successful or failed. It marks the completion of the observable stream.
        complete: () => {
          this.isLoadingData.set(false);
        },
      });

    // not necessory but good practice when component not using
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectedPlace(place: Place) {
    console.log('----sending request----');
    const subscription = this.httpClient
      .put('http://localhost:3000/user-places', { placeId: place.id })
      .subscribe({
        next: (response) => {
          console.log('----Response----');
          console.log(response);
        },
        error: (error) => {
          console.log('----Error occured----');
          console.log(error);
        },
        complete: () => {
          console.log('----Request completed----');
          subscription.unsubscribe();
        },
      });
  }
}
