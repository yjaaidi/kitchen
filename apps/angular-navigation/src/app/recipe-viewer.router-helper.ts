export const recipeViewerRouterHelper = {
  PATH: 'viewer',

  route({ recipeIds }: { recipeIds?: string[] } = {}): {
    path: string[];
    queryParams: Record<string, string[]> | undefined;
  } {
    return {
      path: ['/', this.PATH],
      queryParams: this.sharedQueryParams({ recipeIds }),
    };
  },

  sharedQueryParams({
    recipeIds = [],
  }: {
    recipeIds?: string[];
  } = {}): Record<string, string[]> | undefined {
    return recipeIds.length > 0 ? { recipe_id: recipeIds } : undefined;
  },
};
