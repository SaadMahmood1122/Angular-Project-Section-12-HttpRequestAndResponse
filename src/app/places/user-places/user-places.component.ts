import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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
  private httpClient = inject(HttpClient);
  // Sending http get request
  ngOnInit(): void {
    this.isLoadingData.set(true);
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/user-places')
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
        error: (error) => {
          this.error.set('Some thing wents wrong while fetching data....');
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
