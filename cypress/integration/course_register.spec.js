import { edit, register } from '../pageHelpers/event.js'
import { root_user } from '../support/constants.js'
import { replace_empty_strings_with_null, get_reset_auto_increment_query } from '../support/helpers.js'
import { GET_COURSE } from '../support/queries.js'

const RESET_AUTO_INCREMENT = get_reset_auto_increment_query([ 'Event::Participation' ])

describe('A course participation', function () {
  it('can be created via the UI or a request, the result is the same', function () {
    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT) // auto increment values are not reset by transactions
    cy.app('start_transaction')
		cy.login(root_user.username, root_user.password)

    cy.appEval(GET_COURSE).then(res => {
      const url = `/de/groups/${res.group_id}/events/${res.event_id}`
      cy.wrap(url).as('event_url')
      cy.wrap(res.event_id).as('event_id')
    })

    cy.wrap({'application_opening_at': Cypress.moment().subtract(10, 'days').format('DD.MM.YYYY'),
      'application_closing_at': Cypress.moment().add(10, 'days').format('DD.MM.YYYY'),
      'state': 'application_open'}).as('event_fields')

    // ensure that registering is possible
    cy.get('@event_fields').then((fields) => {
      edit(this.event_id, fields)
    })

    cy.get('@event_url').then((url) => {
      cy.visit(url)
    })

    cy.contains('Anmelden').click()
    cy.contains('Weiter').first().click()
    cy.contains('Anmelden').click()

    cy.url().as('participation_url')

    cy.get('@participation_url').then((url) => {
      cy.request(`${url}.json`).as('json_ui')
    })

    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT)
    cy.app('start_transaction')

    cy.login(root_user.username, root_user.password)

    cy.get('@event_fields').then((fields) => {
      edit(this.event_id, fields)
    })

    cy.get('@event_id').then((id) => {
      register(id, 'Event::Course::Role::Participant')
    })

    cy.get('@participation_url').then((url) => {
      cy.request(`${url}.json`).then((response) => {
        const unified_response = replace_empty_strings_with_null(response.body.event_participations)
        const unified_json_ui = replace_empty_strings_with_null(this.json_ui.body.event_participations)
        expect(unified_response).to.deep.equal(unified_json_ui)
      })
    })
  })

})
