import { register, edit } from '../pageHelpers/event.js'
import { approve } from '../pageHelpers/pending_approvals.js'
import { imitate, quitImitation } from '../pageHelpers/person.js'
import { root_user, user_dicta as dicta, user_necessitatibus as necessitatibus, user_ipsam as ipsam,
         bern_leitpfadikurs, empty_approval } from '../support/constants.js'

describe('Course approvals', function () {

  beforeEach(() => {
		cy.login(root_user.username, root_user.password)
	})

  it('can be issued via the UI or a request, the result is the same', function () {
    const QUERY = `begin
      Event::Approval.joins('INNER JOIN event_participations ON event_participations.application_id = event_approvals.application_id')
        .where('event_participations.id = ${dicta.event.participation_id}').as_json(except: :approved_at)
    rescue StandardError => e
      return e
    end`

    cy.getEventUrl(dicta.event.id).then((res) => {
      cy.visit(`${res.url}/participations/${dicta.event.participation_id}`)
    })
    cy.contains('Freigeben').click()
    cy.nearestInput('Tätigkeit').type('-')
    cy.nearestInput('Stufe').type('-')
    cy.nearestInput('Wie bewährt er/sie sich dabei? z.B. Einsatz, Qualität des/der TN').type('-')
    cy.nearestInput('Wo liegen seine/ihre Stärken?').type('-')
    cy.nearestInput('Wo sollte man ihn/sie fördern?').type('-')
    cy.nearestInput('Wünsche, Anregungen oder Bemerkungen an die Kursleitung').type('-')
    cy.contains('Freigeben').last().click()

    cy.appEval(QUERY).as('json_ui')

    cy.app('clean')
    cy.app('start_transaction')

    cy.login(root_user.username, root_user.password)

    approve(dicta.event.id, dicta.event.participation_id, empty_approval)

    cy.appEval(QUERY).then((res) => {
      expect(this.json_ui).to.deep.equal(res)
    })
  })

  it('turn the warning badge into a success badge in the applications overview', function () {
    const full_name = `${dicta.last_name} ${dicta.first_name} / ${dicta.nickname}`

    cy.getEventUrl(dicta.event.id).then((res) => {
      cy.wrap(res.url).as('event_url')
    })

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
    })
    cy.get(`tbody#participants tr:contains('${full_name}')`)
      .find('td:eq(3) > span').should('contain', '?').should('have.attr','title', 'Kursfreigabe ausstehend')

    approve(dicta.event.id, dicta.event.participation_id, empty_approval)

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
    })
    cy.get(`tbody#participants tr:contains('${full_name}')`)
      .find('td:eq(3) > span').should('contain', '✓').should('have.attr','title', 'Kursfreigabe bestätigt')
  })

  it('are indicated as missing for new participations, and as confirmed after the necessary approvals are issued', function () {
    const full_name = `${ipsam.last_name} ${ipsam.first_name} / ${ipsam.nickname}`

    cy.getEventUrl(bern_leitpfadikurs.id).then((res) => {
      cy.wrap(res.url).as('event_url')
    })

    edit(bern_leitpfadikurs.id, {
      'state': 'application_open',
      'application_opening_at': Cypress.moment().subtract(10, 'days').format('DD.MM.YYYY'),
      'application_closing_at': Cypress.moment().add(10, 'days').format('DD.MM.YYYY'),
      'requires_approval_abteilung': '0',
      'requires_approval_region': '1',
      'requires_approval_kantonalverband': '1',
      'requires_approval_bund': '0'
    })

    // imitate a person and initiate the participation
    imitate(ipsam.id)
    register(bern_leitpfadikurs.id, 'Event::Course::Role::Participant')
    quitImitation(ipsam.id)

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
      cy.get(`tbody#applications:contains('${full_name}')`)
        .find('tr > td:eq(4) > span').should('contain','?')
    })

    cy.get('@participation').then(participation => {
      approve(bern_leitpfadikurs.id, participation.id, empty_approval) // approve on region level
      approve(bern_leitpfadikurs.id, participation.id, empty_approval) // approve on canton level
    })

    // check the badge
    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/application_market`)
      cy.get(`tbody#applications:contains('${full_name}')`)
        .find('tr > td:eq(4) > span').should('contain', '✓')
    })
  })

  it('are correctly propagated to the approval overview', function () {
    approve(necessitatibus.event.id, necessitatibus.event.participation_id, necessitatibus.event.fields)
    cy.getEventUrl(necessitatibus.event.id).then((res) => {
      cy.visit(`${res.url}/approvals`)
    })
    cy.contains('Bewertung').parent().should('contain', necessitatibus.event.fields.occupation_assessment)
  })
})
