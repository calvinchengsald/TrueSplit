
describe('Whole App', () => {
    it('Flips between tabs', () => {
        cy.visit('')
        cy.get('[aria-label="Split, tab, 2 of 2"]').click()
        cy.url().should('include', '/Split')
        cy.contains('Split your bill!')

        cy.get('[aria-label="Tutorial, tab, 1 of 2"]').click()
        cy.url().should('include', '/Tutorial')
        cy.contains('How it works~')
    })
})

describe('Split Screen', () => {

    it('Add a new item', () => {
        cy.visit('')
        //change to split tab
        cy.get('[aria-label="Split, tab, 2 of 2"]').click()

        //click on the new item button
        cy.get('.r-backgroundColor-1uavh4e > :nth-child(1) > :nth-child(1)').click()
        //should have a new item appear
        cy.get('.r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz')
        //set the name of this new item -> Pokibowl
        cy.get('.r-flex-6wfxan > .css-textinput-1cwyjr8').type('Pokibowl').should('have.value', 'Pokibowl')
        //set the price to $10
        cy.get('.r-flex-dta0w2 > .css-textinput-1cwyjr8').type('10').should('have.value', '10').blur()
        cy.get('.r-flex-6wfxan > .css-textinput-1cwyjr8').should('have.value', 'Pokibowl')
        cy.get(':nth-child(1) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > :nth-child(4) > :nth-child(1) > .r-alignItems-1awozwy > [data-testid=iconIcon]')

        //Create another item
        cy.get('.r-backgroundColor-1uavh4e > :nth-child(1) > :nth-child(1)').click()
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz')
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-6wfxan > .css-textinput-1cwyjr8').type('Sushi').should('have.value', 'Sushi')
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-dta0w2 > .css-textinput-1cwyjr8').type('9.998').should('have.value', '9.998').blur()
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-6wfxan > .css-textinput-1cwyjr8').should('have.value', 'Sushi')
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-dta0w2 > .css-textinput-1cwyjr8').should('have.value', '9.99')
        



        // cy.contains('type').click()
        // // Should be on a new URL which includes '/commands/actions'
        // cy.url().should('include', '/commands/actions')

        // cy.get('.action-email')
        //     .type('fake@email.com')
        //     .should('have.value', 'fake@email.com')
    })
})
