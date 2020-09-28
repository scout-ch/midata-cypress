import { create } from '../pageHelpers/event.js'
import { root_user, jim_knopf_basiskurs as event } from '../support/constants.js'
import { replace_empty_strings_with_null, get_reset_auto_increment_query, fill_form } from '../support/helpers.js'
import { course_controls } from '../support/controls.js'

const RESET_AUTO_INCREMENT = get_reset_auto_increment_query([ 'Event', 'Event::Date' ])

describe('A course', function () {
  it('can be created via the UI or a request, the result is the same', function () {
    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT) // auto increment values are not reset by transactions
    cy.app('start_transaction')
    cy.login(root_user.email, root_user.password)

    cy.visit('/de/groups/1/events/course')
    cy.contains('Kurs erstellen').click()
    cy.contains('Speichern').should('be.visible')
    fill_form(course_controls, event.required_fields)
    cy.contains('Speichern').first().click()
    cy.contains(`Anlass ${event.required_fields['name']} wurde erfolgreich erstellt.`).should('be.visible')

    cy.url().as('event_url')

    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).as('json_ui')
    })

    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT)
    cy.app('start_transaction')

    cy.login(root_user.email, root_user.password)

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
