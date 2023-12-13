import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { OKREADS_CONSTANTS, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>(OKREADS_CONSTANTS.READING_LIST_API)
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
      concatMap(({ book }) =>
        this.http.post(OKREADS_CONSTANTS.READING_LIST_API, book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList()),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ book, error }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http
          .delete(`${OKREADS_CONSTANTS.READING_LIST_API}/${item.bookId}`)
          .pipe(
            map(() => ReadingListActions.confirmedRemoveFromReadingList()),
            catchError((error) =>
              of(
                ReadingListActions.failedRemoveFromReadingList({ item, error })
              )
            )
          )
      )
    )
  );

  markBookAsFinished$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.markBookAsFinished),
      concatMap(({ item }) =>
        this.http
          .put<ReadingListItem[]>(
            `${OKREADS_CONSTANTS.READING_LIST_API}/${item.bookId}/finished`,
            ''
          )
          .pipe(
            map(() => ReadingListActions.init()),
            catchError(() =>
              of(
                ReadingListActions.failedMarkBookAsFinished({
                  error: OKREADS_CONSTANTS.MARK_BOOK_AS_FINISHED_FAILED,
                })
              )
            )
          )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
