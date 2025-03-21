import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';

import { Place } from './place.model';
import { PlacesService } from './places.service';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  private placeService = inject(PlacesService);

  places = input.required<Place[]>();
  selectPlace = output<Place>();

  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }

  // onRemovePlace(place: Place) {
  //   const subscribtion = this.placeService.removeUserPlace(place).subscribe({
  //     next: (response) => {
  //       console.log(response);
  //     },
  //     error: (error) => {
  //       console.log('Some thing went wrong while deleting place');
  //     },
  //     complete: () => {
  //       console.log('Service Deletion complete...');
  //     },
  //   });
  //   this.destoryRef.onDestroy(() => {
  //     subscribtion.unsubscribe();
  //   });
  // }
}
