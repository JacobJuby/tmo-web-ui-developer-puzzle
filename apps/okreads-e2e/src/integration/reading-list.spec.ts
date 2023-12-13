describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', async () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to undo my added book', async () => {
    cy.get('input[type="search"]').type('java');
    cy.get('form').submit();
    const readingListInitialCount = cy
      .get('[data-testing="reading-list-item"]')
      .its('length');
    cy.get('[data-testing="add-book"]:enabled')
      .type('javascript')
      .first()
      .should('exist')
      .click();
    cy.get('.mat-simple-snackbar-action button').click();
    cy.get('[data-testing="reading-list-item"]').should(
      'have.length',
      readingListInitialCount
    );
  });

  it('Then: I should be able to undo my removed book', async () => {
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('[data-testing="add-book"]:enabled')
      .type('javascript')
      .first()
      .should('exist')
      .click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    const readingListBeforeRemove = cy
      .get('[data-testing="reading-list-item"]')
      .its('length');
    cy.get('[data-testing="remove-book"]').click();
    cy.get('.mat-simple-snackbar-action button').click();
    cy.get('[data-testing="reading-list-item"]').should(
      'have.length',
      readingListBeforeRemove
    );
  });
});
