import { createRecipe, Recipe } from '../recipe/recipe';

class RecipeMother {
  private _recipePictures = [
    {
      keyword: 'pizza-margherita',
      pictureUri:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=600&fit=crop',
    },
    {
      keyword: 'pasta-carbonara',
      pictureUri:
        'https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?w=600&h=600&fit=crop',
    },
    {
      keyword: 'chicken-curry',
      pictureUri:
        'https://images.unsplash.com/photo-1708782344490-9026aaa5eec7?w=600&h=600&fit=crop',
    },
    {
      keyword: 'fish-tacos',
      pictureUri:
        'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=600&fit=crop',
    },
    {
      keyword: 'caesar-salad',
      pictureUri:
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=600&fit=crop',
    },
    {
      keyword: 'tomato-soup',
      pictureUri:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop',
    },
    {
      keyword: 'grilled-cheese',
      pictureUri:
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=600&fit=crop',
    },
    {
      keyword: 'beef-stew',
      pictureUri:
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop',
    },
    {
      keyword: 'veggie-stir-fry',
      pictureUri:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop',
    },
    {
      keyword: 'chocolate-cake',
      pictureUri:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop',
    },
    {
      keyword: 'french-toast',
      pictureUri:
        'https://images.unsplash.com/photo-1639108094328-2b94a49b1c2e?w=600&h=600&fit=crop',
    },
    {
      keyword: 'mushroom-risotto',
      pictureUri:
        'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=600&fit=crop',
    },
    {
      keyword: 'club-sandwich',
      pictureUri:
        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop',
    },
    {
      keyword: 'quiche-lorraine',
      pictureUri:
        'https://images.unsplash.com/photo-1721460195314-b18fa6e64a10?w=600&h=600&fit=crop',
    },
    {
      keyword: 'greek-salad',
      pictureUri:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop',
    },
    {
      keyword: 'sushi-roll',
      pictureUri:
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=600&fit=crop',
    },
    {
      keyword: 'ramen-bowl',
      pictureUri:
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop',
    },
    {
      keyword: 'lamb-tagine',
      pictureUri:
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
    },
    {
      keyword: 'pad-thai',
      pictureUri:
        'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=600&fit=crop',
    },
    {
      keyword: 'pancakes',
      pictureUri:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop',
    },
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
    const recipePicture = [...this._recipePictures]
      .sort((a, b) => b.keyword.length - a.keyword.length)
      .find((recipePicture) => slug.includes(recipePicture.keyword));
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

  withIngredients(count: number): NestedRecipeMother {
    const ingredients = Array.from({ length: count }, (_, i) => ({
      name: `Ingredient ${i + 1}`,
    }));
    return this._extendWith({ ingredients });
  }

  withSteps(count: number): NestedRecipeMother {
    const steps = Array.from({ length: count }, (_, i) => `Step ${i + 1}`);
    return this._extendWith({ steps });
  }

  withId(id: string): NestedRecipeMother {
    return this._extendWith({ id });
  }

  private _extendWith(recipe: Partial<Recipe>) {
    return new NestedRecipeMother({ ...this._recipe, ...recipe });
  }
}

export const recipeMother = new RecipeMother();
