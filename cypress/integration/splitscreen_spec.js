
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
        //set the price to $10
        cy.get('.r-flex-dta0w2 > .css-textinput-1cwyjr8').type('10').should('have.value', '10').blur()
        //set the name of this new item -> Pokibowl
        cy.get('.r-flex-6wfxan > .css-textinput-1cwyjr8').type('Pokibowl').should('have.value', 'Pokibowl')
        cy.get('.r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > :nth-child(4)').click()
        cy.get('.r-flex-6wfxan > .css-textinput-1cwyjr8').should('have.value', 'Pokibowl')
        cy.get(':nth-child(1) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > :nth-child(4) > :nth-child(1) > .r-alignItems-1awozwy > [data-testid=iconIcon]')

        //Create another item
        cy.get('.r-backgroundColor-1uavh4e > :nth-child(1) > :nth-child(1)').click()
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz')
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-dta0w2 > .css-textinput-1cwyjr8').type('9.99').should('have.value', '9.99').blur()
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-6wfxan > .css-textinput-1cwyjr8').type('Sushi').should('have.value', 'Sushi')
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-6wfxan > .css-textinput-1cwyjr8').should('have.value', 'Sushi')
        cy.get(':nth-child(2) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > .r-flex-dta0w2 > .css-textinput-1cwyjr8').should('have.value', '9.99')
        



        // cy.contains('type').click()
        // // Should be on a new URL which includes '/commands/actions'
        // cy.url().should('include', '/commands/actions')

        // cy.get('.action-email')
        //     .type('fake@email.com')
        //     .should('have.value', 'fake@email.com')
    })

    it('Add a new User', () => {
        cy.get('.r-transitionDuration-eafdt9').click()
        cy.get('.r-margin-1dumxj3 > .css-textinput-1cwyjr8').type('Calvin').should('have.value','Calvin')
        
        cy.get('.r-backgroundColor-1uavh4e > :nth-child(1) > :nth-child(2)').click()
        cy.get(':nth-child(2) > .r-paddingBottom-k8qxaj > :nth-child(1) > .r-margin-1dumxj3 > .css-textinput-1cwyjr8').type('Jenny').should('have.value','Jenny')
    })

    // it('has red value problems' , () => {
    //     cy.viewport(500,1000)
    //     cy.contains('Please fix bill values in Red')
    //     cy.get(':nth-child(4) > .css-textinput-1cwyjr8').type('21.00').should('have.value','21.00')
    //     cy.get(':nth-child(4) > :nth-child(2) > .css-textinput-1cwyjr8').type('0')
    // })

    it('Draggable Items ', () => {
        //move sushi to calvin
        cy.get(':nth-child(1) > :nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > :nth-child(1) > :nth-child(1) > .css-view-1dbjc4n > [data-testid=iconIcon]')
            .trigger('mousedown')
            .trigger('mousemove', { which: 1, pageX: 50, pageY: 450 })
            .trigger('mouseup')
        cy.get(':nth-child(1) > .r-paddingBottom-k8qxaj').contains('100%').contains('1')
        //move pokebowl to calvin
        cy.get(':nth-child(1) > .r-backgroundColor-1dqr3rk > .r-flexDirection-18u37iz > :nth-child(1) > :nth-child(1) > .css-view-1dbjc4n > [data-testid=iconIcon]')
            .trigger('mousedown')
            .trigger('mousemove', { which: 1, pageX: 50, pageY: 450 })
            .trigger('mouseup')
        
        //move another sushi to calvin
        cy.get(':nth-child(1) > :nth-child(1) > .r-backgroundColor-19kfsom > .r-flexDirection-18u37iz > :nth-child(1) > :nth-child(1) > .css-view-1dbjc4n > [data-testid=iconIcon]')
            .trigger('mousedown')
            .trigger('mousemove', { which: 1, pageX: 50, pageY: 450 })
            .trigger('mouseup')
        cy.get(':nth-child(1) > .r-paddingBottom-k8qxaj').contains('100%')
        //move sushi to jenny
        cy.get(':nth-child(1) > :nth-child(1) > .r-backgroundColor-19kfsom > .r-flexDirection-18u37iz > :nth-child(1) > :nth-child(1) > .css-view-1dbjc4n > [data-testid=iconIcon]')
            .trigger('mousedown')
            .trigger('mousemove', { which: 1, pageX: 150, pageY: 450 })
            .trigger('mouseup')
        cy.get(':nth-child(1) > .r-paddingBottom-k8qxaj').contains('67%')
        cy.get(':nth-child(2) > .r-paddingBottom-k8qxaj').contains('33%')
    })
})
