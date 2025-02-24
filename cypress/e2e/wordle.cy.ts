describe('Wordle Game', () => {
  beforeEach(() => {
    cy.visit('/')
    // Force dark mode for consistent testing
    cy.get('html').invoke('addClass', 'dark')
  })

  it('allows typing and color cycling', () => {
    // Type "STARE" using keyboard
    cy.contains('button', 'S').click()
    cy.contains('button', 'T').click()
    cy.contains('button', 'A').click()
    cy.contains('button', 'R').click()
    cy.contains('button', 'E').click()

    // Cycle first letter through colors
    cy.get('.grid-rows-6 > div').first()
      .find('.grid-cols-5 > div').first()
      .as('firstCell')
      .click() // white -> yellow
      .should('have.class', 'bg-yellow-300')
      .click() // yellow -> green
      .should('have.class', 'bg-green-500')
      .click() // green -> gray
      .should('have.class', 'bg-gray-400')
      .click() // gray -> white
      .should('have.class', 'bg-white')

    // Check word list updates
    cy.get('@firstCell').click() // white -> yellow
    cy.get('.font-mono').should('have.length.gt', 0)
  })

  it('handles help modal', () => {
    // Open help modal
    cy.get('button[title="Help"]').click()
    cy.contains('How to Play').should('be.visible')
    
    // Close via X button
    cy.contains('button', '✕').click()
    cy.contains('How to Play').should('not.be.visible')
    
    // Open and close via backdrop
    cy.get('button[title="Help"]').click()
    cy.get('.fixed.inset-0').click({ force: true })
    cy.contains('How to Play').should('not.be.visible')
  })

  it('toggles dark mode', () => {
    cy.get('html').should('have.class', 'dark')
    cy.get('button[title="Toggle dark mode"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })
})
