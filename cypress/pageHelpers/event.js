export const register = (eventID, role) => {
  cy.getEventUrl(eventID).then(res => {
    cy.getCSRFToken().then(token => {
      let post_data = {'event_role[type]': role,
        'event_participation[additional_information]': ''}
      post_data.authenticity_token = token
      cy.request({
        url: `${res.url}/participations`,
        method: 'POST',
        form: true,
        followRedirect: false,
        body: post_data
      }).then(res => {
        let participationId = res.redirectedToUrl.match(/de\/groups\/\d+\/events\/\d+\/participations\/(\d+)/)[1]
        cy.wrap({ url: res.redirectedToUrl, id: participationId}).as('participation')
      })
    })
  })
}

export const edit = (eventID, payload) => {
  cy.getEventUrl(eventID).then(res => {
    cy.getCSRFToken().then(token => {
      let post_data = {}
      Object.keys(payload).forEach(key => {
        post_data[`event[${key}]`] = payload[key]
      })
      post_data.authenticity_token = token
      post_data._method = 'patch'
      cy.request({
        url: res.url,
        method: 'POST',
        form: true,
        body: post_data
      })
    })
  })
}
