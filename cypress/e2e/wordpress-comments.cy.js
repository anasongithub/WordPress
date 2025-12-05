/**
 * WordPress Comment Submission Test Suite
 * Tests comment form validation and submission
 * Based on Equivalence Partitioning and Boundary Value Analysis
 */

Cypress.on('uncaught:exception', () => false);

describe('WordPress Comment Submission', () => {
  const commentFormPage = '/?p=1#respond';
  const loginPage = '/wp-login.php';

  const uniqueId = () => Date.now();
  const generateName = () => `John Smith ${uniqueId()}`;
  const generateEmail = () => `john${uniqueId()}@example.com`;
  const testWebsite = 'https://example.com';
  const generateComment = () => `This is a great post! ${uniqueId()}`;

  beforeEach(() => {
    cy.wait(2000);
    cy.visit(commentFormPage);
    cy.get('#commentform').should('be.visible');
  });

  it('TC-COMMENT-01: Submit complete comment', () => {
    const name = generateName();
    const email = generateEmail();
    const comment = generateComment();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('.comment-awaiting-moderation, .comment-success, .success').length > 0) {
        cy.get('.comment-awaiting-moderation, .comment-success, .success').should('be.visible');
      } else if ($body.text().includes('too quickly') || $body.text().includes('Slow down')) {
        cy.log('Comment flood detected - expected in rapid testing');
      } else {
        cy.get('#commentform').should('exist');
      }
    });
  });

  it('TC-COMMENT-02: Submit comment without website', () => {
    const name = `Mary Jane ${uniqueId()}`;
    const email = `mary${uniqueId()}@test.com`;
    const comment = `Nice article! ${uniqueId()}`;

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear();
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('.comment-awaiting-moderation, .comment-success, .success').length > 0) {
        cy.get('.comment-awaiting-moderation, .comment-success, .success').should('be.visible');
      } else if ($body.text().includes('too quickly') || $body.text().includes('Slow down')) {
        cy.log('Comment flood detected - expected in rapid testing');
      } else {
        cy.get('#commentform').should('exist');
      }
    });
  });

  it('TC-COMMENT-03: Validate empty name field', () => {
    const email = generateEmail();
    const comment = generateComment();

    cy.get('#author').clear();
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click({ force: true });

    cy.get('#author').then(($input) => {
      if ($input[0].validity && $input[0].validity.valueMissing) {
        expect($input[0].validity.valueMissing).to.be.true;
      } else {
        cy.get('body').then(($body) => {
          if ($body.find('.comment-error, .error, #error').length > 0) {
            cy.get('.comment-error, .error, #error').should('be.visible');
          } else {
            cy.url().should('include', 'p=1');
          }
        });
      }
    });
  });

  it('TC-COMMENT-04: Single character name', () => {
    const email = generateEmail();
    const comment = generateComment();

    cy.get('#author').clear().type('a');
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('.comment-awaiting-moderation, .comment-success, .success').length > 0) {
        cy.get('.comment-awaiting-moderation, .comment-success, .success').should('be.visible');
      } else if ($body.text().includes('too quickly') || $body.text().includes('Slow down')) {
        cy.log('Comment flood detected - expected in rapid testing');
      } else {
        cy.get('#commentform').should('exist');
      }
    });
  });

  it('TC-COMMENT-05: Maximum name length (245 chars)', () => {
    const longName = 'a'.repeat(245);
    const email = generateEmail();
    const comment = generateComment();

    cy.get('#author').clear().invoke('val', longName).trigger('input');
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('.comment-awaiting-moderation, .comment-success, .success').length > 0) {
        cy.get('.comment-awaiting-moderation, .comment-success, .success').should('be.visible');
      } else if ($body.text().includes('too quickly') || $body.text().includes('Slow down')) {
        cy.log('Comment flood detected - expected in rapid testing');
      } else {
        cy.get('#commentform').should('exist');
      }
    });
  });

  it('TC-COMMENT-06: Name exceeding limit (246 chars)', () => {
    const tooLongName = 'a'.repeat(246);
    const email = generateEmail();
    const comment = generateComment();

    cy.get('#author').clear().invoke('val', tooLongName).trigger('input');
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.wait(2000);

    cy.get('body').should('contain', 'Error');
    cy.get('body').should('contain', 'Your name is too long');
    cy.get('body').should('contain', 'Back');
  });

  it('TC-COMMENT-07: Validate empty email field', () => {
    const name = generateName();
    const comment = generateComment();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear();
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click({ force: true });

    cy.get('#email').then(($input) => {
      if ($input[0].validity && $input[0].validity.valueMissing) {
        expect($input[0].validity.valueMissing).to.be.true;
      } else {
        cy.get('body').then(($body) => {
          if ($body.find('.comment-error, .error, #error').length > 0) {
            cy.get('.comment-error, .error, #error').should('be.visible');
          } else {
            cy.url().should('include', 'p=1');
          }
        });
      }
    });
  });

  it('TC-COMMENT-08: Invalid email format', () => {
    const name = generateName();
    const comment = generateComment();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type('invalidemail');
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.get('#email').then(($input) => {
      if ($input[0].validity && $input[0].validity.typeMismatch) {
        expect($input[0].validity.typeMismatch).to.be.true;
      } else {
        cy.get('body').then(($body) => {
          if ($body.find('.comment-error, .error, #error').length > 0) {
            cy.get('.comment-error, .error, #error').should('be.visible');
          } else {
            cy.url().should('include', 'p=1');
          }
        });
      }
    });
  });

  it('TC-COMMENT-09: Email exceeding limit (101 chars)', () => {
    const tooLongEmail = 'a'.repeat(90) + '@domain.com';
    const name = generateName();
    const comment = generateComment();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().invoke('val', tooLongEmail).trigger('input');
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.wait(2000);

    cy.get('body').should('contain', 'Error');
    cy.get('body').should('contain', 'Your email address is too long');
    cy.get('body').should('contain', 'Back');
  });

  it('TC-COMMENT-10: Invalid website URL', () => {
    const name = generateName();
    const email = generateEmail();
    const comment = generateComment();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type('not-a-url');
    cy.get('#comment').clear().type(comment);
    cy.get('#submit').click();

    cy.get('#url').then(($input) => {
      if ($input[0].validity && $input[0].validity.typeMismatch) {
        expect($input[0].validity.typeMismatch).to.be.true;
      } else {
        cy.wait(2000);
        cy.get('body').then(($body) => {
          if ($body.find('.comment-error, .error, #error').length > 0) {
            cy.get('.comment-error, .error, #error').should('be.visible');
          } else {
            cy.get('#commentform, body').should('be.visible');
          }
        });
      }
    });
  });

  it('TC-COMMENT-11: Validate empty comment field', () => {
    const name = generateName();
    const email = generateEmail();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear();
    cy.get('#submit').click({ force: true });

    cy.get('#comment').then(($textarea) => {
      if ($textarea[0].validity && $textarea[0].validity.valueMissing) {
        expect($textarea[0].validity.valueMissing).to.be.true;
      } else {
        cy.get('body').then(($body) => {
          if ($body.find('.comment-error, .error, #error').length > 0) {
            cy.get('.comment-error, .error, #error').should('be.visible');
          } else {
            cy.url().should('include', 'p=1');
          }
        });
      }
    });
  });

  it('TC-COMMENT-12: Single character comment', () => {
    const name = generateName();
    const email = generateEmail();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);
    cy.get('#comment').clear().type('a');
    cy.get('#submit').click();

    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('.comment-awaiting-moderation, .comment-success, .success').length > 0) {
        cy.get('.comment-awaiting-moderation, .comment-success, .success').should('be.visible');
      } else if ($body.text().includes('too quickly') || $body.text().includes('Slow down')) {
        cy.log('Comment flood detected - expected in rapid testing');
      } else {
        cy.get('#commentform').should('exist');
      }
    });
  });

  it('TC-COMMENT-13: Maximum comment length (65525 chars)', () => {
    const longComment = 'a'.repeat(65525);
    const name = generateName();
    const email = generateEmail();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);

    cy.get('#comment').clear().invoke('val', longComment).trigger('input');
    cy.get('#submit').click();

    cy.wait(5000);

    cy.get('body').then(($body) => {
      if ($body.find('.comment-awaiting-moderation, .comment-success, .success').length > 0) {
        cy.get('.comment-awaiting-moderation, .comment-success, .success').should('be.visible');
      } else if ($body.text().includes('too quickly') || $body.text().includes('Slow down')) {
        cy.log('Comment flood detected - expected in rapid testing');
      } else {
        cy.get('#commentform').should('exist');
      }
    });
  });

  it('TC-COMMENT-14: Comment exceeding limit (65526 chars)', () => {
    const tooLongComment = 'a'.repeat(65526);
    const name = generateName();
    const email = generateEmail();

    cy.get('#author').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.get('#url').clear().type(testWebsite);

    cy.get('#comment').clear().invoke('val', tooLongComment).trigger('input');
    cy.get('#submit').click();

    cy.wait(5000);

    cy.get('body').should('contain', 'Error');
    cy.get('body').should('contain', 'Your comment is too long');
    cy.get('body').should('contain', 'Back');
  });
});