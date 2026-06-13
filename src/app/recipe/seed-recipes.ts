import { Recipe } from './recipe';
import { recipeMother } from '../testing/recipe.mother';

export function createSeedRecipes(): Recipe[] {
  return [
    recipeMother.withBasicInfo('Burger').withIngredients(5).withSteps(4).build(),
    recipeMother.withBasicInfo('Salad').withIngredients(3).withSteps(2).build(),
    recipeMother.withBasicInfo('Beer').withIngredients(2).withSteps(1).build(),
    recipeMother.withBasicInfo('Pizza Margherita').withIngredients(6).withSteps(5).build(),
    recipeMother.withBasicInfo('Pasta Carbonara').withIngredients(7).withSteps(6).build(),
    recipeMother.withBasicInfo('Chicken Curry').withIngredients(10).withSteps(8).build(),
    recipeMother.withBasicInfo('Fish Tacos').withIngredients(8).withSteps(5).build(),
    recipeMother.withBasicInfo('Caesar Salad').withIngredients(4).withSteps(3).build(),
    recipeMother.withBasicInfo('Tomato Soup').withIngredients(5).withSteps(4).build(),
    recipeMother.withBasicInfo('Grilled Cheese').withIngredients(3).withSteps(2).build(),
    recipeMother.withBasicInfo('Beef Stew').withIngredients(12).withSteps(7).build(),
    recipeMother.withBasicInfo('Veggie Stir Fry').withIngredients(9).withSteps(4).build(),
    recipeMother.withBasicInfo('Chocolate Cake').withIngredients(8).withSteps(6).build(),
    recipeMother.withBasicInfo('Pancakes').withIngredients(5).withSteps(3).build(),
    recipeMother.withBasicInfo('French Toast').withIngredients(4).withSteps(3).build(),
    recipeMother.withBasicInfo('Sushi Roll').withIngredients(6).withSteps(5).build(),
    recipeMother.withBasicInfo('Ramen Bowl').withIngredients(11).withSteps(6).build(),
    recipeMother.withBasicInfo('Greek Salad').withIngredients(6).withSteps(2).build(),
    recipeMother.withBasicInfo('Lamb Tagine').withIngredients(10).withSteps(7).build(),
    recipeMother.withBasicInfo('Mushroom Risotto').withIngredients(7).withSteps(5).build(),
    recipeMother.withBasicInfo('Club Sandwich').withIngredients(6).withSteps(3).build(),
    recipeMother.withBasicInfo('Quiche Lorraine').withIngredients(8).withSteps(5).build(),
    recipeMother.withBasicInfo('Pad Thai').withIngredients(9).withSteps(6).build(),
    recipeMother
      .withBasicInfo('Burger')
      .withId('rec_burger-2')
      .withIngredients(4)
      .withSteps(3)
      .build(),
    recipeMother
      .withBasicInfo('Salad')
      .withId('rec_salad-2')
      .withIngredients(5)
      .withSteps(2)
      .build(),
  ];
}
