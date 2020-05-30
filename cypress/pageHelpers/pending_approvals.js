export const approve = (eventID, participationID, payload) => {
  cy.getEventUrl(eventID).then(res => {
    cy.getCSRFToken().then(token => {
      let post_data = {'decision': 'approve'}
      Object.keys(payload).forEach(key => {
        post_data[`event_approval[${key}]`] = payload[key]
      })
      post_data.authenticity_token = token
      cy.request({
        url: `${res.url}/participations/${participationID}/approvals`,
        method: 'POST',
        form: true,
        body: post_data
      })
    })
  })
}
