export const recipeViewerRouterHelper = {
  PATH: 'viewer',

  route({ recipeIds }: { recipeIds: string[] }): {
    path: string[];
    queryParams: Record<string, string[]> | undefined;
  } {
    return {
      path: ['/', this.PATH],
      queryParams:
        recipeIds.length > 0
          ? {
              recipe_id: recipeIds,
            }
          : undefined,
    };
  },
};
