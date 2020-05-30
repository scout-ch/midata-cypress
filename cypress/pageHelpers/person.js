export const imitate = (personID) => {
  cy.getPersonUrl(personID).then(res => {
    cy.getCSRFToken().then(token => {
      cy.request({
        url: `${res.url}/impersonate`,
        method: 'POST',
        form: true,
        body: {
          '_method': 'post',
          'authenticity_token': token
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        Cypress.log({
          displayName: 'Imitating',
          message: `person ${personID} from group ${res.groupId}`
        })
      })
    })
  })
}

export const quitImitation = (personID) => {
  cy.getPersonUrl(personID).then(res => {
    cy.getCSRFToken().then(token => {
      cy.request({
        url: `${res.url}/impersonate`,
        method: 'POST',
        form: true,
        body: {
          '_method': 'delete',
          'authenticity_token': token
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        Cypress.log({
          displayName: 'Stopped imitating',
          message: `person ${personID} from group ${res.groupId}`
        })
      })
    })
  })
}
