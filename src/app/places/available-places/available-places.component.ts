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
import { PlacesService } from '../places.service';
import { map } from 'rxjs';
import { ErrorService } from '../../shared/error.service';

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
  private placesService = inject(PlacesService);
  private errorService = inject(ErrorService);
  ngOnInit(): void {
    this.isLoadingData.set(true);
    const subscription = this.placesService
      .loadAvailablePlaces()
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
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
      subscription.unsubscribe();
    });
  }

  onSelectedPlace(place: Place) {
    console.log('----sending request----');
    const subscription = this.placesService
      .addPlaceToUserPlaces(place.id)
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
