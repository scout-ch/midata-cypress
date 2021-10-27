import { edit } from '../pageHelpers/event.js'
import { root_user, jim_knopf_basiskurs as event } from '../support/constants.js'
import { replace_empty_strings_with_null, fill_form } from '../support/helpers.js'
import { GET_COURSE } from '../support/queries.js'
import { course_controls } from '../support/controls.js'

describe('A course', function () {
  it('can be edited via the UI or a request, the result is the same', function () {
    cy.login(root_user.email, root_user.password)
    cy.appEval(GET_COURSE).then(res => {
      const url = `/de/groups/${res.group_id}/events/${res.event_id}`
      cy.wrap(url).as('event_url')
      cy.wrap(res.event_id).as('event_id')
      cy.visit(`${url}/edit`)
    })

    fill_form(course_controls, event.additional_fields)
    cy.contains('Speichern').first().click()

    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).as('json_ui')
    })

    cy.app('clean')
    cy.app('start_transaction')

    cy.login(root_user.email, root_user.password)

    cy.get('@event_id').then((id) => {
      edit(id, event.additional_fields)
    })

    // note: the JSON API does not return all fields, so there may still be differences
    // for example the requires_approval fields are not included
    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).then((response) => {
        const unified_response = replace_empty_strings_with_null(response.body.events)
        const unified_json_ui = replace_empty_strings_with_null(this.json_ui.body.events)
        expect(unified_response).to.deep.equal(unified_json_ui)
      })
    })
  })
})
