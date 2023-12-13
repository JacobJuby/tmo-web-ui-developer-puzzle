import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Book } from '@tmo/shared/models';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  clearSearch,
  searchBooks,
  addToReadingList,
} from '@tmo/books/data-access';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store : MockStore;
  const book: Book = {
    id: '12345',
    title: 'JavaScript',
    authors: ['Author'],
    description: 'Learn JavaScript',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({
          initialState: { books: { entities: [] }}
        })
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call searchBooks', () => {
      const searchBooksSpy = jest.spyOn(component, 'searchBooks');
      component.searchForm.setValue({ term: 'javascript' });
      component.ngOnInit();
      component.searchForm.valueChanges.subscribe(() => {
        expect(searchBooksSpy).toHaveBeenCalledWith(
          searchBooks({ term: 'javascript' })
        );
      });
    });
  });

  describe('searchExample', () => {
    it('should set search term value as javascript', () => {
      component.searchExample();
      expect(component.searchForm.value.term).toEqual('javascript');
    });
  });

  describe('searchBooks', () => {
    it('should dispatch searchBooks action after 500ms when search term is entered', fakeAsync(() => {
      component.searchForm.setValue({ term: 'test' });
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      tick(500);
      expect(dispatchSpy).toHaveBeenCalledWith(searchBooks({ term: 'test' }));
    }));

    it('should dispatch clearSearch action after 500ms when search term is cleared', fakeAsync(() => {
      component.searchForm.setValue({ term: '' });
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      tick(500);
      expect(dispatchSpy).toHaveBeenCalledWith(clearSearch());
    }));
  });

  describe('addBookToReadingList', () => {
    it('should dispatch addToReadingList action when addBookToReadingList component function is invoked', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.addBookToReadingList(book);
      expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({ book }));
    });
  });

  describe('ngOnDestroy()', () => {
    it('should unsubscribe the subscriptions when component is destroyed', fakeAsync(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.ngOnDestroy();
      component.searchForm.setValue({ term: 'test' });
      tick(500);
      expect(dispatchSpy).not.toHaveBeenCalled();
    }));
  });
});
