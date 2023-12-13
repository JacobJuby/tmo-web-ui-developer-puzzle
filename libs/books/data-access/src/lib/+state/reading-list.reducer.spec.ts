import { OKREADS_CONSTANTS } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B'),
        error: OKREADS_CONSTANTS.READING_LIST_ADD_FAILURE,
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
      expect(result.error).toEqual(
        OKREADS_CONSTANTS.READING_LIST_ADD_FAILURE
      );
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C'),
        error: OKREADS_CONSTANTS.READING_LIST_REMOVE_FAILURE,
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
      expect(result.error).toEqual(
        OKREADS_CONSTANTS.READING_LIST_REMOVE_FAILURE
      );
    });

    it('failedMarkBookAsFinished should set error into the state', () => {
      const action = ReadingListActions.failedMarkBookAsFinished({
        error: OKREADS_CONSTANTS.MARK_BOOK_AS_FINISHED_FAILED,
      });

      const result: State = reducer(state, action);
      expect(result.error).toEqual(
        OKREADS_CONSTANTS.MARK_BOOK_AS_FINISHED_FAILED
      );
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
