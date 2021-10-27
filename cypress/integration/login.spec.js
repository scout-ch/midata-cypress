import { kunz_user } from '../support/constants.js'
import { fill_form } from '../support/helpers.js'
import { login_controls } from '../support/controls.js'

const testLogin = () => {
  cy.visit('/')
  fill_form(login_controls, kunz_user)
  return cy.get('form').contains('Anmelden').click()
}
const urlPattern = /groups\/\d+\/people\/\d+\.html$/

describe('The login page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })

  it('successfully logs in a valid user', () => {
    testLogin()
    cy.url().should('not.contain', 'users/sign_in')
  })

  it('correctly redirects after login', () => {
    testLogin()
    cy.url().should('match', urlPattern)
  })

  it('correctly redirects after logout', () => {
    testLogin()
    cy.url().should('match', urlPattern)
    cy.logout()
    cy.visit('/')
    cy.url().should('not.match', urlPattern)
  })
})
