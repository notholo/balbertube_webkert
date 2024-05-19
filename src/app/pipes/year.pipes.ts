import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'year'
})
export class YearPipe implements PipeTransform {
  transform(value: string): string {
    // Ha a value üres vagy null, üres stringgel térjünk vissza
    if (!value) {
      return '';
    }
    
    // Az első 4 karaktert vegyük ki a value-ból, mivel azok az évszámot jelentik
    return value.substring(0, 4);
  }
}