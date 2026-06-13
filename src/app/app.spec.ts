import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe/recipe-repository.fake';
import { createSeedRecipes } from './recipe/seed-recipes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideRecipeRepositoryFake()],
    }).compileComponents();

    TestBed.inject(RecipeRepositoryFake).setRecipes(createSeedRecipes());
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render nav and home demo links', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('nav[aria-label="Demo navigation"]')).toBeTruthy();
    expect(root.textContent).toContain('Common Performance Issues');
    expect(root.textContent).toContain('Slow Synchronization');
    expect(root.textContent).toContain('Slow Filtering');
    expect(root.textContent).toContain('Network Congestion');
  });
});
