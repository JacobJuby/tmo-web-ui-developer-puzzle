describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to search books by title', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').submit();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });

  xit('Then: I should see search results as I am typing', () => {
    // TODO: Implement this test!
  });
});

describe('When: Use the add a book to reading list', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to mark a book as finished', () => {
    cy.get('[data-testing="search-book"]').type('script');
    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-testing="add-book"]:enabled').first().click();
    cy.get('[data-testing="reading-list"]').should(
      'have.length.greaterThan',
      0
    );
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="mark-as-finished"]').last().click();
    cy.get('.reading-list-item-finished-text').should('exist');
    cy.get('.reading-list-item-finished-text').should(
      'contain.text',
      'Finished On:'
    );
    cy.get('[data-testing="add-book"]').should('contain.text', 'Finished');
  });
});
