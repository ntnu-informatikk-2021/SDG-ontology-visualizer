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
  it('Click livet på land and check for menu', () => {
    cy.get('#svgGraph').scrollIntoView();
    cy.contains('text', 'Livet på land').parent().children('circle').click().parent().children('g');
  });
  it('Expand livet på land', () => {
    cy.contains('text', 'Livet på land')
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
  it('Check for utrydde fattigdom after expand', () => {
    cy.contains('text', 'Utrydde fattigdom');
  });
  it('Check for trygghet og beredskap button after expand', () => {
    cy.contains('button', 'Trygghet og beredskap');
  });
  it('Check for trygghet og beredskap header after button click', () => {
    cy.contains('button', 'Trygghet og beredskap').click();
    cy.contains('button', 'Gå til Trygghet og beredskap').click();
    cy.contains('h2', 'Trygghet og beredskap');
  });
  it('Click show subgoals and check for subgoal nodes', () => {
    cy.contains('button', 'Vis').click();
    cy.contains('span', 'Vis delmål').parent().click();
    cy.contains('text', '1.b');
  });
  it('Click show subgoals again and check for removed nodes', () => {
    cy.contains('span', 'Vis delmål').parent().click();
    cy.contains('text', '1.b').should('not.exist');
  });
});
