import { edit } from '../pageHelpers/event.js'
import { root_user, unspunne_sicherheitsmodul_wasser as event } from '../support/constants.js'

describe('A course', function () {

  beforeEach(() => {
		cy.login(root_user.username, root_user.password)
	})

  it('can be edited via the UI or a request, the result is the same', function () {
    cy.getEventUrl(event.id).then((res) => {
      cy.wrap(res.url).as('event_url')
    })

    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/edit`)
    })
    cy.nearestInput('Name').focus().clear().type(event.fields['name'])
    cy.nearestInput('Ort / Adresse').focus().clear().type(event.fields['location'])
    cy.nearestInput('Status').select('Offen zur Anmeldung')
    cy.nearestInput('Motto').focus().clear().type(event.fields['motto'])
    cy.get('.nav-tabs').contains('Anmeldung').click()
    cy.nearestInput('Anmeldebeginn').focus().clear().type(event.fields['application_opening_at'])
    cy.nearestInput('Anmeldeschluss').focus().clear().type(event.fields['application_closing_at'])
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

    edit(event.id, event.fields)

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
