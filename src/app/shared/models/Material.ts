import { BurgerMaterial } from "./BurgerMaterial";
import { Drink } from "./Drink";
import { Fry } from "./Fry";
import { Sauce } from "./Sauce";

export class Material {
  burgerMaterials!: BurgerMaterial[];
  fries!: Fry[];
  drinks!: Drink[];
  sauces!: Sauce[];
}
