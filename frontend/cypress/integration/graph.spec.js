describe('Graph tests', () => {
  it('Start from homepage', () => {
    cy.visit('http://localhost:3000');
    cy.get('[alt="Utrydde fattigdom"]').click();
    cy.url().should('eq', 'http://localhost:3000/ontology');
  });
  it('Check if node exists', () => {
    cy.contains('text', 'Utrydde fattigdom').parent().children('circle');
  });
  it('Check if sosialt exits', () => {
    cy.contains('text', 'Sosialt').parent().children('circle');
  });
  it('Click sosialt and check for menu', () => {
    cy.contains('text', 'Sosialt').parent().children('circle').click().parent().children('g');
  });
  it('Expand sosialt', () => {
    cy.contains('text', 'Sosialt')
      .parent()
      .children('circle')
      .click()
      .parent()
      .children('g')
      .children('g')
      .next()
      .next()
      .next()
      .click();
  });
  it('Check for digitalisering after expand', () => {
    cy.contains('text', 'Digitalisering');
  });
  it('Check for digitalisering button after expand', () => {
    cy.contains('button', 'Digitalisering');
  });
  it('Check for digitalisering header after button click', () => {
    cy.contains('button', 'Digitalisering').click();
    cy.contains('button', 'Gå til Digitalisering').click();
    cy.contains('h2', 'Digitalisering');
  });
  it('Click show subgoals and check for subgoal nodes', () => {
    cy.contains('span', 'Vis delmål').parent().click();
    cy.contains('text', '1.b');
  });
  it('Click show subgoals again and check for removed nodes', () => {
    cy.contains('span', 'Vis delmål').parent().click();
    cy.contains('text', '1.b').should('not.exist');
  });
});
