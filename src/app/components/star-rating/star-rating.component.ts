import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { star, starHalf, starOutline }  from 'ionicons/icons';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StarRatingComponent  implements OnInit {

  @Input() rating: number = 0;  // Calificación inicial
  @Input() maxRating: number = 5;  // Calificación máxima
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();
  stars: number[] = [];

  @Input() starSize: string = '24px'; 
  constructor() {
    addIcons({ star, starHalf, starOutline });
   }

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  setRating(star: number) {
    this.rating = star;
    this.ratingChange.emit(this.rating);
  }

  getStarIcon(star: number): string {
    if (star <= this.rating) {
      return 'star';  // Estrella llena
    } else if (star - 5 === this.rating) {
      return 'star-half';  // Media estrella
    } else {
      return 'star-outline';  // Estrella vacía
    }
  }
  

}
