import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

/* Can't use `test.each` with Web Test Runner,
 * so let's fallback to a simple for loop. */
for (let i = 0; i < 10; i++) {
  it(`ok ${i}`, async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual(
      'Burger',
    );
  });
}
