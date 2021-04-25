describe('Home page tests', () => {
  it('Tests if website renders', () => {
    cy.visit('http://localhost:3000');
  });
  it('Tests /ontology creates modal without a selectedNode', () => {
    cy.visit('http://localhost:3000/ontology');
    cy.contains('Du har ikke valgt en node i grafen');
  });
  it('Tests modal returns to home page', () => {
    cy.visit('http://localhost:3000/ontology');
    cy.contains('Tilbake til forsiden').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('Tests image routes to /ontology ', () => {
    cy.visit('http://localhost:3000');
    cy.get('[alt="Utrydde fattigdom"]').click();
    cy.url().should('eq', 'http://localhost:3000/ontology');
  });
  it('Test search bar shows results', () => {
    cy.visit('http://localhost:3000');
    cy.get('[placeholder="Søk..."]').click().type('luft');
    cy.contains('Luftkvalitetsmålinger i Trondheim');
  });
  it('Test search bar result redirect to /ontology', () => {
    cy.reload();
    cy.get('[placeholder="Søk..."]').click().type('luft');
    cy.contains('Luftkvalitetsmålinger i Trondheim').click();
    cy.url().should('eq', 'http://localhost:3000/ontology');
  });
});
