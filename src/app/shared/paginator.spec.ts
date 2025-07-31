import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PaginatorComponent } from './paginator.ng';

// Test host component to test inputs and outputs
@Component({
  template: `
    <app-paginator
      [total]="total"
      [offset]="offset" 
      [limit]="limit"
      (offsetChange)="onOffsetChange($event)">
    </app-paginator>
  `
})
class TestHostComponent {
  total = 0;
  offset = 0;
  limit = 5;
  lastEmittedOffset?: number;

  onOffsetChange(newOffset: number): void {
    this.lastEmittedOffset = newOffset;
  }
}

describe('PaginatorComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent],
      declarations: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  describe('Previous button disabled state', () => {
    it('should disable previous button when on first page', () => {
      // mount Paginator with offset = 0, limit = 5, and total = 10
      component.offset = 0;
      component.limit = 5;
      component.total = 10;
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector('[data-testid="previous-button"]');
      
      // assert previous button is disabled
      expect(previousButton.disabled).toBe(true);
    });

    it('should enable previous button when not on first page', () => {
      component.offset = 5;
      component.limit = 5;
      component.total = 10;
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector('[data-testid="previous-button"]');
      
      expect(previousButton.disabled).toBe(false);
    });
  });

  describe('Next button disabled state', () => {
    it('should disable next button when on last page', () => {
      // mount Paginator with offset = 5, limit = 5, and total = 10
      component.offset = 5;
      component.limit = 5;
      component.total = 10;
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector('[data-testid="next-button"]');
      
      // assert next button is disabled
      expect(nextButton.disabled).toBe(true);
    });

    it('should enable next button when not on last page', () => {
      component.offset = 0;
      component.limit = 5;
      component.total = 10;
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector('[data-testid="next-button"]');
      
      expect(nextButton.disabled).toBe(false);
    });
  });

  describe('offsetChange emission', () => {
    it('should emit offsetChange when next button is clicked', () => {
      // mount Paginator with offset = 0, limit = 5, and total = 10
      component.offset = 0;
      component.limit = 5;
      component.total = 10;
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector('[data-testid="next-button"]');
      
      // click next button
      nextButton.click();
      
      // assert offsetChange is emitted with value 5
      expect(component.lastEmittedOffset).toBe(5);
    });

    it('should emit offsetChange when previous button is clicked', () => {
      // mount Paginator with offset = 10, limit = 5, and total = 15
      component.offset = 10;
      component.limit = 5;
      component.total = 15;
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector('[data-testid="previous-button"]');
      
      // click previous button
      previousButton.click();
      
      // assert offsetChange is emitted with value 5
      expect(component.lastEmittedOffset).toBe(5);
    });

    it('should not emit offsetChange when previous button is clicked on first page', () => {
      component.offset = 0;
      component.limit = 5;
      component.total = 10;
      component.lastEmittedOffset = undefined;
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector('[data-testid="previous-button"]');
      
      previousButton.click();
      
      expect(component.lastEmittedOffset).toBeUndefined();
    });

    it('should not emit offsetChange when next button is clicked on last page', () => {
      component.offset = 5;
      component.limit = 5;
      component.total = 10;
      component.lastEmittedOffset = undefined;
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector('[data-testid="next-button"]');
      
      nextButton.click();
      
      expect(component.lastEmittedOffset).toBeUndefined();
    });
  });

  describe('Page display', () => {
    it('should display correct page numbers', () => {
      component.offset = 5;
      component.limit = 5;
      component.total = 15;
      fixture.detectChanges();

      const paginatorInfo = fixture.nativeElement.querySelector('.paginator-info');
      
      expect(paginatorInfo.textContent).toContain('Page 2 of 3');
    });

    it('should handle edge case with total less than limit', () => {
      component.offset = 0;
      component.limit = 5;
      component.total = 3;
      fixture.detectChanges();

      const paginatorInfo = fixture.nativeElement.querySelector('.paginator-info');
      const nextButton = fixture.nativeElement.querySelector('[data-testid="next-button"]');
      
      expect(paginatorInfo.textContent).toContain('Page 1 of 1');
      expect(nextButton.disabled).toBe(true);
    });
  });
});