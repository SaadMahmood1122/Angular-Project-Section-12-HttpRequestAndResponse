import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { map } from 'rxjs';
import { PlacesService } from '../places.service';
import { ErrorService } from '../../shared/error.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isLoadingData = signal<boolean>(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private placeService = inject(PlacesService);
  private errorService = inject(ErrorService);
  ngOnInit(): void {
    this.isLoadingData.set(true);
    const subscription = this.placeService
      .loadUserPlaces()
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
        error: (error) => {
          this.error.set('Ops some thing went wrong');
          this.errorService.showError(
            'Some thing went Wrong while fetching user favrite places'
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
}
