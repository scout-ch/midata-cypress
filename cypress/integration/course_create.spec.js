import { create } from '../pageHelpers/event.js'
import { root_user, jim_knopf_basiskurs as event } from '../support/constants.js'
import { replace_empty_strings_with_null, get_reset_auto_increment_query } from '../support/helpers.js'

const RESET_AUTO_INCREMENT = get_reset_auto_increment_query([ 'Event', 'Event::Date' ])

describe('A course', function () {
  it('can be created via the UI or a request, the result is the same', function () {
    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT) // auto increment values are not reset by transactions
    cy.app('start_transaction')
  	cy.login(root_user.username, root_user.password)

    cy.visit('/de/groups/1/events/course')
    cy.contains('Kurs erstellen').click()
    cy.contains('Speichern').should('be.visible')
    cy.nearestInput('Name').focus().clear().type(event.required_fields['name'])
    cy.nearestInput('Kursnummer').focus().clear().type(event.required_fields['number'])
    cy.nearestInput('Kursart').select('BKPS (Basiskurs Pfadistufe)')
    cy.get('.nav-tabs').contains('Daten').click()
    cy.nearestInput('Von').focus().clear().type(event.required_fields['dates_attributes][0][start_at_date'])
    cy.contains('Speichern').first().click()
    cy.contains(`Anlass ${event.required_fields['name']} wurde erfolgreich erstellt.`).should('be.visible')

    cy.url().as('event_url')

    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).as('json_ui')
    })

    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT)
    cy.app('start_transaction')

    cy.login(root_user.username, root_user.password)

    create(1, event.required_fields)

    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).then((response) => {
        const unified_response = replace_empty_strings_with_null(response.body.events)
        const unified_json_ui = replace_empty_strings_with_null(this.json_ui.body.events)
        expect(unified_response).to.deep.equal(unified_json_ui)
      })
    })
  })
})
