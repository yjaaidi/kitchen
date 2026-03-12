# Ashes to Ashes, Specs to Specs: A Farewell to Old Testing Tools

This branch contains examples of some Vitest testing patterns that should help you write tests that are more robust and cheaper to maintain.

## Related Resources

- 📚 [Talk Slides](https://drive.google.com/open?id=1ElFjpt4ppRcoWze9oqa3Op65z6oO-kv1)
- 📖 [Free Angular Testing Cookbook](https://cookbook.marmicode.io)
- ✅ [Pragmatic Angular Testing Video Course](https://courses.marmicode.io/pragmatic-angular-testing)

## Examples

### Fakes & Object Mothers

- [Usage example](./apps/whiskmate/src/app/recipe/recipe-search.browser.spec.ts)
- [RecipeRepositoryFake](./apps/whiskmate/src/app/recipe/recipe-repository/recipe-repository.fake.ts)
- [recipeMother](./apps/whiskmate/src/app/recipe/recipe.mother.ts)

### Fakes contract testing

- [RecipeRepository contract](./apps/whiskmate/src/app/recipe/recipe-repository/recipe-repository.contract.ts)
- [RecipeRepositoryFake test](./apps/whiskmate/src/app/recipe/recipe-repository/recipe-repository.fake.spec.ts)
- [RecipeRepository wide test](./apps/whiskmate/src/app/recipe/recipe-repository/recipe-repository.wide.spec.ts)

### Fake timers

- [RecipeFilter test](./apps/whiskmate/src/app/recipe/recipe-filter.browser.spec.ts)

### Fake Fast-Forward mode

- [RecipeSearch test](./apps/whiskmate/src/app/recipe/recipe-search.browser.spec.ts)

### Jest to Vitest Browser Mode Migration

- [RecipeSearch Vites Browser Mode test](./apps/whiskmate/src/app/recipe/recipe-search.browser.spec.ts)
- [RecipeSearch Jest test](./apps/whiskmate/src/app/recipe/recipe-search.jest.ts)

- [RecipeFilter Vitest Browser Mode test](./apps/whiskmate/src/app/recipe/recipe-filter.browser.spec.ts)
- [RecipeFilter Jest test](./apps/whiskmate/src/app/recipe/recipe-filter.jest.ts)
