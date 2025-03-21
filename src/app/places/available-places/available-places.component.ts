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

  private placesService = inject(PlacesService);
  ngOnInit(): void {
    this.isLoadingData = this.placesService.isLoadingData;
    this.error = this.placesService.error;
    this.places = this.placesService.loadAvailablePlaces();
  }

  onSelectedPlace(place: Place) {
    this.placesService.addPlaceToUserPlaces(place);
  }
}
