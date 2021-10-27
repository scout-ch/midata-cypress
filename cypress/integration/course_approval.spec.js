import { register, edit } from '../pageHelpers/event.js'
import { approve } from '../pageHelpers/pending_approvals.js'
import { imitate, quitImitation } from '../pageHelpers/person.js'
import { root_user, empty_approval, positive_approval } from '../support/constants.js'
import {
  GET_COURSE,
  GET_COURSE_KV,
  GET_COURSE_PARTICIPATION,
  GET_PERSON_IN_ABTEILUNG_BELOW,
  JSON_APPROVAL,
  GET_NAME
} from '../support/queries.js'
import { fill_form } from '../support/helpers.js'
import { course_approval_controls } from '../support/controls.js'

describe('Course approvals', function () {

  beforeEach(() => {
    cy.login(root_user.email, root_user.password)
  })

  it('can be issued via the UI or a request, the result is the same', function () {
    cy.appEval(GET_COURSE_PARTICIPATION).then(res => {
      cy.wrap(res.participation_id).as('participation_id')
      cy.wrap(res.event_id).as('event_id')
      cy.visit(`/de/groups/${res.group_id}/events/${res.event_id}/participations/${res.participation_id}`)
    })

    cy.contains('Freigeben').click()
    fill_form(course_approval_controls, empty_approval)
    cy.contains('Freigeben').last().click()

    cy.get('@participation_id').then((participation_id) => {
      cy.appEval(JSON_APPROVAL(participation_id)).as('json_ui')
    })

    cy.app('clean')
    cy.app('start_transaction')

    cy.login(root_user.email, root_user.password)

    cy.get('@participation_id').then((participation_id) => {
      approve(this.event_id, participation_id, empty_approval)
      cy.appEval(JSON_APPROVAL(participation_id)).then((res) => {
        expect(this.json_ui).to.deep.equal(res)
      })
    })
  })

  it('turn the warning badge into a success badge in the applications overview', function () {
    cy.appEval(GET_COURSE_PARTICIPATION).then(res => {
      cy.wrap(res.participation_id).as('participation_id')
      cy.wrap(res.event_id).as('event_id')
      const url = `/de/groups/${res.group_id}/events/${res.event_id}`
      cy.wrap(url).as('event_url')
      cy.appEval(GET_NAME(res.person_id)).then(res => {
        const full_name = `${res.last_name} ${res.first_name} / ${res.nickname}`
        cy.wrap(full_name).as('full_name')
      })
      cy.visit(`${url}/application_market`)
    })

    // check the badge
    cy.get('@full_name').then((full_name) => {
      cy.get(`tbody#participants tr:contains('${full_name}')`)
        .find('td:eq(3) > span').should('contain', '?').should('have.attr','title', 'Kursfreigabe ausstehend')
    })

    cy.get('@event_id').then((event_id) => {
      approve(event_id, this.participation_id, empty_approval)
    })

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
    })
    cy.get('@full_name').then((full_name) => {
      cy.get(`tbody#participants tr:contains('${full_name}')`)
        .find('td:eq(3) > span').should('contain', '✓').should('have.attr','title', 'Kursfreigabe bestätigt')
    })
  })

  it('are indicated as missing for new participations, and as confirmed after the necessary approvals are issued', function () {
    cy.appEval(GET_COURSE_KV).then(res => {
      const url = `/de/groups/${res.group_id}/events/${res.event_id}`
      cy.wrap(url).as('event_url')
      cy.wrap(res.event_id).as('event_id')
      cy.wrap(res.group_id).as('group_id')
      edit(res.event_id, {
        'state': 'application_open',
        'application_opening_at': Cypress.moment().subtract(10, 'days').format('DD.MM.YYYY'),
        'application_closing_at': Cypress.moment().add(10, 'days').format('DD.MM.YYYY'),
        'requires_approval_abteilung': '1',
        'requires_approval_region': '0',
        'requires_approval_kantonalverband': '1',
        'requires_approval_bund': '0'
      })
    })

    cy.get('@group_id').then((group_id) => {
      cy.appEval(GET_PERSON_IN_ABTEILUNG_BELOW(group_id)).then(res => {
        cy.wrap(res.id).as('person_id')
        const full_name = `${res.last_name} ${res.first_name} / ${res.nickname}`
        cy.wrap(full_name).as('full_name')
      })
    })

    // imitate a person and initiate the participation
    cy.get('@person_id').then((person_id) => {
      imitate(person_id)
      cy.wrap(register(this.event_id, 'Event::Course::Role::Participant')).as('participation_id')
      quitImitation(person_id)
    })

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
      cy.get(`tbody#applications:contains('${this.full_name}')`)
        .find('tr > td:eq(4) > span').should('contain','?')
    })

    cy.get('@participation_id').then(participation_id => {
      approve(this.event_id, participation_id, empty_approval) // approve on abteilung level
      approve(this.event_id, participation_id, empty_approval) // approve on canton level
    })

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
      cy.get(`tbody#applications:contains('${this.full_name}')`)
        .find('tr > td:eq(4) > span').should('contain', '✓')
    })
  })

  it('are correctly propagated to the approval overview', function () {
    cy.appEval(GET_COURSE_PARTICIPATION).then(res => {
      approve(res.event_id, res.participation_id, positive_approval)
      cy.visit(`/de/groups/${res.group_id}/events/${res.event_id}/approvals`)
      cy.contains('Bewertung').parent().should('contain', positive_approval.occupation_assessment)
    })
  })
})
