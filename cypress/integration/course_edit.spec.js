import { edit } from '../pageHelpers/event.js'
import { root_user, jim_knopf_basiskurs as event } from '../support/constants.js'
import { GET_COURSE } from '../support/queries.js'

beforeEach(() => {
  cy.login(root_user.username, root_user.password)
})

describe('A course', function () {
  it('can be edited via the UI or a request, the result is the same', function () {
    cy.appEval(GET_COURSE).then(res => {
      const url = `/de/groups/${res.group_id}/events/${res.event_id}`
      cy.wrap(url).as('event_url')
      cy.wrap(res.event_id).as('event_id')
      cy.visit(`${url}/edit`)
    })

    cy.nearestInput('Ort / Adresse').focus().clear().type(event.additional_fields['location'])
    cy.nearestInput('Status').select('Offen zur Anmeldung')
    cy.nearestInput('Motto').focus().clear().type(event.additional_fields['motto'])
    cy.get('.nav-tabs').contains('Anmeldung').click()
    cy.nearestInput('Anmeldebeginn').focus().clear().type(event.additional_fields['application_opening_at'])
    cy.nearestInput('Anmeldeschluss').focus().clear().type(event.additional_fields['application_closing_at'])
    cy.nearestCheckbox('Empfehlung der Anmeldungen nötig durch', 'Abteilung').uncheck()
    cy.nearestCheckbox('Empfehlung der Anmeldungen nötig durch', 'Region').check()
    cy.nearestCheckbox('Empfehlung der Anmeldungen nötig durch', 'Kantonalverband').check()
    cy.nearestCheckbox('Empfehlung der Anmeldungen nötig durch', 'Bundesebene').uncheck()
    cy.contains('Speichern').first().click()

    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).as('json_ui')
    })

    cy.app('clean')
    cy.app('start_transaction')

    cy.login(root_user.username, root_user.password)

    cy.get('@event_id').then((id) => {
      edit(id, event.additional_fields)
    })

    // note: the JSON API does not return all fields, so there may still be differences
    // for example the requires_approval fields are not included
    // also note: newlines (e.g. in location) may cause problems due to encoding as either \n or \r\n
    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).then((response) => {
        expect(this.json_ui.body.events).to.deep.equal(response.body.events)
      })
    })
  })
})
