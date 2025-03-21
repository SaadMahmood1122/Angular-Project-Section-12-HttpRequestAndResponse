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

  private placeService = inject(PlacesService);
  ngOnInit(): void {
    this.places = this.placeService.loadUserSelectedPlaces();
  }
  selectPlace(place: Place) {
    this.placeService.addPlaceToUserPlaces(place);
  }
}
