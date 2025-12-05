// cypress/e2e/wordpress-login.cy.js
// Basic login test for self-hosted WordPress
Cypress.on('uncaught:exception', () => false);

describe('Self-hosted WordPress Login', () => {
  it('logs in with admin credentials', () => {
    // Visit login page
    cy.visit('/wp-login.php');

    // Enter username and password - replace with test user created in staging
    cy.get('#user_login').should('be.visible').type('F@stians');
    cy.get('#user_pass').should('be.visible').type('8Wk5ujnODaxMLKp(wQ');
    cy.get('#wp-submit').click();

    // Assert dashboard URL
    cy.url().should('include', '/wp-admin');
    cy.get('#wpadminbar').should('be.visible');
  });
});
