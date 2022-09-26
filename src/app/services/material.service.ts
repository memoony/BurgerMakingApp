import { Injectable } from '@angular/core';
import { materials } from 'src/data';
import { Material } from '../shared/models/Material';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  meatTypes: any[] = [];

  constructor() {}

  //* Tüm malzemeleri getiren metot.
  getMaterials(): Material {
    return materials;
  }

  getMeatTypes(): any[] {
    for (let i = 0; i < materials.burgerMaterials.length; i++) {
      if (
        materials.burgerMaterials[i].id == '4' ||
        materials.burgerMaterials[i].id == '5'
      ) {
        this.meatTypes.push(materials.burgerMaterials[i]);
      }
    }
    return this.meatTypes;
  }
}
