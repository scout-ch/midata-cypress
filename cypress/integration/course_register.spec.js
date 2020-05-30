import { edit, register } from '../pageHelpers/event.js'
import { root_user, zürich_basiskurs_pfadistufe as event } from '../support/constants.js'

const replace_empty_strings_with_null = (object) => {
  let newObject
  if (Array.isArray(object)) {
    newObject = [{}]
  } else {
    newObject = {}
  }
  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (value === null) {
      newObject[key] = value
    } else if (typeof value == "string" && value.length == 0) {
      newObject[key] = null
    } else if (typeof value == "object") {
      newObject[key] = replace_empty_strings_with_null(value)
    } else {
      newObject[key] = value
    }
  });
  return newObject
}

const RESET_AUTO_INCREMENT = `new_id = Event::Participation.maximum(:id).next; ActiveRecord::Base.connection.execute("ALTER TABLE event_participations AUTO_INCREMENT = #{new_id};")`

describe('A course participation', function () {
  it('can be created via the UI or a request, the result is the same', function () {
    cy.app('clean')
    cy.appEval(RESET_AUTO_INCREMENT) // auto increment values are not reset by transactions
    cy.app('start_transaction')
		cy.login(root_user.username, root_user.password)

    cy.getEventUrl(event.id).then((res) => {
      cy.wrap(res.url).as('event_url')
    })

    cy.wrap({'application_opening_at': Cypress.moment().subtract(10, 'days').format('DD.MM.YYYY'),
      'application_closing_at': Cypress.moment().add(10, 'days').format('DD.MM.YYYY'),
      'state': 'application_open'}).as('event_fields')

    // ensure that registering is possible
    cy.get('@event_fields').then((fields) => {
      edit(event.id, fields)
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
      edit(event.id, fields)
    })

    register(event.id, 'Event::Course::Role::Participant')

    cy.get('@participation_url').then((url) => {
      cy.request(`${url}.json`).then((response) => {
        const unified_response = replace_empty_strings_with_null(response.body.event_participations)
        const unified_json_ui = replace_empty_strings_with_null(this.json_ui.body.event_participations)
        expect(unified_response).to.deep.equal(unified_json_ui)
      })
    })
  })

})
