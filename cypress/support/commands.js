// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
  Cypress.log({
    displayName: "Logging in",
    message: "as " + email
  })
  cy.getCSRFToken().then(token => {
    console.log("Token: ", token)
    cy.request({
      url: "/users/sign_in",
      method: "POST",
      form: true,
      body: {
        "person[email]": email,
        "person[password]": password,
        "authenticity_token": token,
        "person[remember_me]": "0",
        "utf8": "✓",
      },
      log: false,
    })
  })
})

Cypress.Commands.add("logout", () => {
  Cypress.log({
    displayName: "Logging out"
  })
  cy.getCSRFToken().then(token => {
    cy.request({
      url: "/users/sign_out",
      method: "POST",
      form: true,
      body: {
        "_method": "delete",
        "authenticity_token": token
      },
      log: false,
    })
  })
})

Cypress.Commands.add("getCSRFToken", () => {
  return cy.get("head", { log: false }).then($head => {
    let $metaTag = $head.get("meta[name=csrf-token]")
    if ($metaTag && $metaTag.hasOwnProperty("length" && $metaTag.length)) {
      return $metaTag.first().prop("content")
    } else {
      return cy.request({ url: "/", log: false }).then(response => {
        const $html = Cypress.$(response.body)
        return Cypress.$($html[11]).prop('content') // TODO: Fix hardcoded
      })
    }
  })
})

const escapeRegExp = (string) => {
  const escaped = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  return new RegExp(`^${escaped}$`)
}

/**
 * Finds the checkbox which is nearest to the given label in the UI. Supports multiple checkboxes
 * grouped together by specifying the checkbox label.
 * @param {string} label - The label of the input.
 * @param {string} checkbox_label - The label of the checkbox.
 */
Cypress.Commands.add('nearestCheckbox', { prevSubject: 'optional'}, (subject, label, checkbox_label) => {
  let message = label
  if (checkbox_label) {
    message = message + ` (${checkbox_label})`
  }
  Cypress.log({
    displayName: "Nearest Checkbox",
    message: message
  })
  let base
  if (subject) {
    base = cy.wrap(subject, { log: false }).contains(escapeRegExp(label), { log: false })
  } else {
    base = cy.contains(escapeRegExp(label), { log: false })
  }
  return base.closest('.control-group', { log: false }).contains(checkbox_label, { log: false }).find('input[type="checkbox"]', { log: false }).first({ log: false })
})

/**
 * Finds the input (text field, textarea, select) which is nearest to the given label in the UI.
 * @param {string} label - The label of the input.
 */
Cypress.Commands.add('nearestInput', { prevSubject: 'optional'}, (subject, label) => {
  Cypress.log({
    displayName: "Nearest Input",
    message: label
  })
  let base
  if (subject) {
    base = cy.wrap(subject, { log: false }).contains(escapeRegExp(label), { log: false })
  } else {
    base = cy.contains(escapeRegExp(label), { log: false })
  }
  return base.closest('.control-group', { log: false }).find('input:not([type="hidden"]), textarea, select', { log: false }).first({ log: false })
})

const getUrl = (url, regex) => {
  cy.request({url: url, followRedirect: false, log: false}).then(res => {
    let groupId = res.redirectedToUrl.match(regex)[1]
    return { url: res.redirectedToUrl, groupId: groupId}
  })
}

/**
 * Returns the URL and group id of the person specified by the id.
 * @param {integer} id - Database id of the person.
 */
Cypress.Commands.add('getPersonUrl', (id) => {
  return getUrl(`/de/people/${id}`, /de\/groups\/(\d+)\/people\/\d+/)
})

/**
 * Returns the URL and group id of the event specified by the id.
 * @param {integer} id - Database id of the event.
 */
Cypress.Commands.add('getEventUrl', (id) => {
  return getUrl(`/de/events/${id}`, /de\/groups\/(\d+)\/events\/\d+/)
})

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
