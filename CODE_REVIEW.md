## Code Review Comments

### Issues Identified

1. Subscribed to getAllBooks but it is not unsubscribed, which will cause memory leaks. Use Observable of getAllBooks and async pipe in html to solve this (book-search.component.ts)
2. As formatDate function is called from html for each book, the calculations will happen every time when the template is rendered which will reduce the performance. Use Angular Date Pipes instead (book-search.component.html) as it removes unnecessary calculations and DOM updates.
3. Search for a valid term and once result populates, clear the search term. You can see teh results clears but on entering a new character old search results populates. This can be fixed by adding search form valueChanges or  by clearing the search result on clearing the search term. 
4. Ngrx store is not handled properly. Mentioning the issues under Improvements
5. Wrong html naming convention let b of readingList$. Instead of b use a meaningful variable name like 'book' (reading-list.component.html, book-search.component.html)
6. Fix testcase failures. Lint issues as the tsconfig is not updated. 
7. Avoid hard codings like api urls in effects, action messages, html labels etc
8. E2e test commented will be implemented as part of Task2

### Improvements Identified

1. failedRemoveFromReadingList and failedAddToReadingList actions can be updated to set error to store.
2. failedAddToReadingList and failedRemoveFromReadingList are not implemented in reading list reducer
3. Error handling is not done. Can remove searchBooks from books reducer and set serchTerm to store along with searchBookSuccess & searchBooksFailure actions
4. HTML content can be read from a json/constant file
5. Improve test case coverage
6. A 'Clear' button can be added to clear the search term

### Issues Fixed

1. Removed subscription to getAllBooks and created an observable books$ and used | async in html for subscription (book-search.component.ts and book-search.component.html) (Issues #1)
2. Used Date Pipe instead of formatDate function in book-search.component.html (Issues #2)
3. Fixed html naming convension. Changed from b to book (Issues #5)
4. Testcase and lint issues
5. Added failedAddToReadingList and failedRemoveFromReadingList in reading list reducer (Improvements #1, Issues #6)
6. Added confirmedRemoveFromReadingList and confirmedAddToReadingList actions to reducer. 

### Accessibility Issues Idenfified & Fixed

* **Issues Idenified using Lighthouse**
    a. Buttons do not have an accessible name. Add `aria-label` attribute to fix it
    b. Background and foreground colors do not have a sufficient contrast ratio: this is for the input placeholder
* **Issues Identfied manually**
    a. Aria label missing for input elements
    b. tabindex is not added on search books html
    c. role not added for button
    d. role and alt not added for img element
    e. The book content in search result tile is not readable. 