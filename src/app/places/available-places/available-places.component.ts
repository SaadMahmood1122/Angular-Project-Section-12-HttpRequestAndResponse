import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

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
  private destroyRef = inject(DestroyRef);

  private httpClient = inject(HttpClient);
  // Sending http get request
  ngOnInit(): void {
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(map((respData) => respData.places))
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
      });
    // not necessory but good practice when component not using
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
