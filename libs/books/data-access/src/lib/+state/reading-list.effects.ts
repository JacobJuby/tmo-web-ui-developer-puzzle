import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { Book, OKREADS_CONSTANTS, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>(`${OKREADS_CONSTANTS.READING_LIST_API}`)
          .pipe(
            map((data) =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            ),
            catchError((error) =>
              of(ReadingListActions.loadReadingListError({ error }))
            )
          )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, undo }) => {
        const addedBook = {
          ...book,
          isAdded: true,
        };
        return this.http
          .post(`${OKREADS_CONSTANTS.READING_LIST_API}`, addedBook)
          .pipe(
            map(() =>
              ReadingListActions.confirmedAddToReadingList({
                book: addedBook,
                undo: !!undo,
              })
            ),
            catchError((error) =>
              of(ReadingListActions.failedAddToReadingList({ error }))
            )
          );
      })
    )
  );

  confirmAddBook$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.confirmedAddToReadingList),
        tap(({ book, undo }) => {
          if (!undo) {
            const { id, ...rest } = book;
            const item: ReadingListItem = {
              bookId: book.id,
              ...rest,
            };

            this.openMatSnackBar(
              OKREADS_CONSTANTS.SNACKBAR_CONSTANT.SNACKBAR_BOOK +
                `${book.title}` +
                OKREADS_CONSTANTS.SNACKBAR_CONSTANT.ADDED_ACTION,
              OKREADS_CONSTANTS.SNACKBAR_CONSTANT.UNDO_ACTION,
              ReadingListActions.removeFromReadingList({
                item,
                undo: true,
              })
            );
          }
        })
      ),
    {
      dispatch: false,
    }
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, undo }) =>
        this.http
          .delete(`${OKREADS_CONSTANTS.READING_LIST_API}/${item.bookId}`)
          .pipe(
            map(() =>
              ReadingListActions.confirmedRemoveFromReadingList({
                item,
                undo: !!undo,
              })
            ),
            catchError((error) =>
              of(ReadingListActions.failedRemoveFromReadingList({ error }))
            )
          )
      )
    )
  );

  confirmRemoveBook$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.confirmedRemoveFromReadingList),
        tap(({ item, undo }) => {
          if (!undo) {
            const { bookId, ...rest } = item;
            const book: Book = {
              id: item.bookId,
              ...rest,
            };

            this.openMatSnackBar(
              OKREADS_CONSTANTS.SNACKBAR_CONSTANT.SNACKBAR_BOOK +
                `${item.title}` +
                OKREADS_CONSTANTS.SNACKBAR_CONSTANT.REMOVED_ACTION,
              OKREADS_CONSTANTS.SNACKBAR_CONSTANT.UNDO_ACTION,
              ReadingListActions.addToReadingList({
                book,
                undo: true,
              })
            );
          }
        })
      ),
    {
      dispatch: false,
    }
  );

  openMatSnackBar = (
    message: string,
    actionText: string,
    action: TypedAction<string>
  ) => {
    this.matSnackBar
      .open(message, actionText, {
        duration: OKREADS_CONSTANTS.SNACKBAR_CONSTANT.SNACKBAR_DURATION,
      })
      .onAction()
      .subscribe(() => {
        this.store.dispatch(action);
      });
  };

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private matSnackBar: MatSnackBar,
    private readonly store: Store
  ) {}
}
