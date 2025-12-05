import { createRecipe } from '../recipe/recipe';
import { Recipe } from '../recipe/recipe';

class RecipeMother {
  private _recipePictures = [
    {
      keyword: 'beer',
      pictureUri:
        'https://shop.ninkasi.fr/259-large_default/ninkasi-french-ipa-75cl.jpg',
    },
    {
      keyword: 'burger',
      pictureUri:
        'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
    },
    {
      keyword: 'salad',
      pictureUri:
        'https://www.ninkasi.fr/wp-content/uploads/2022/10/lyonnaise.png',
    },
  ];

  withBasicInfo(name: string): NestedRecipeMother {
    const slug = name
      .toLowerCase()
      .replace(/ +/g, '-')
      .replace(/([^\w-])/g, '');
    return new NestedRecipeMother(
      createRecipe({
        id: `rec_${slug}`,
        name,
        description: `A delicious ${name}.`,
        ingredients: [],
        pictureUri: this._derivatePictureUri(slug),
        steps: [],
      }),
    );
  }

  private _derivatePictureUri(slug: string) {
    const recipePicture = this._recipePictures.find((recipePicture) =>
      slug.includes(recipePicture.keyword),
    );
    return recipePicture
      ? recipePicture.pictureUri
      : `https://placeholder.marmicode.io/${slug}.jpg`;
  }
}

class NestedRecipeMother {
  constructor(private _recipe: Readonly<Recipe>) {}

  build() {
    return this._recipe;
  }

  withSomeIngredients(): NestedRecipeMother {
    return this._extendWith({
      ingredients: [
        {
          name: 'Salt',
        },
        {
          name: 'Pepper',
        },
      ],
    });
  }

  private _extendWith(recipe: Partial<Recipe>) {
    return new NestedRecipeMother({ ...this._recipe, ...recipe });
  }
}

export const recipeMother = new RecipeMother();
