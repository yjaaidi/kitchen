import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import type { Recipe } from '../recipe/recipe';

interface MealPlannerContextValue {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  canAddRecipe: (recipe: Recipe) => boolean;
}

const MealPlannerContext = createContext<MealPlannerContextValue | null>(null);

const LOCAL_STORAGE_KEY = 'meals';

function getStorage(): Storage | null {
  try {
    const s = globalThis.localStorage;
    if (s && typeof s.getItem === 'function') return s;
  } catch {
    /* SSR / restricted env */
  }
  return null;
}

function loadMeals(): Recipe[] {
  const storage = getStorage();
  if (!storage) return [];
  const raw = storage.getItem(LOCAL_STORAGE_KEY);
  if (raw == null) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMeals(meals: Recipe[]) {
  getStorage()?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meals));
}

export function MealPlannerProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(loadMeals);

  const canAddRecipe = useCallback(
    (recipe: Recipe) => !recipes.some((r) => r.id === recipe.id),
    [recipes]
  );

  const addRecipe = useCallback(
    (recipe: Recipe) => {
      setRecipes((prev) => {
        if (prev.some((r) => r.id === recipe.id)) return prev;
        const next = [...prev, recipe];
        saveMeals(next);
        return next;
      });
    },
    []
  );

  return (
    <MealPlannerContext value={{ recipes, addRecipe, canAddRecipe }}>
      {children}
    </MealPlannerContext>
  );
}

export function useMealPlanner(): MealPlannerContextValue {
  const ctx = useContext(MealPlannerContext);
  if (!ctx) {
    throw new Error('useMealPlanner must be used within a MealPlannerProvider');
  }
  return ctx;
}
