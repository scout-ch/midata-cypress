export const replace_empty_strings_with_null = (object) => {
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
    } else if (typeof value == "string" && value.includes('\r\n')) {
      // newlines may cause problems due to encoding as either \n or \r\n
      newObject[key] = value.replace(/\r\n/g, '\n')
    } else if (typeof value == "object") {
      newObject[key] = replace_empty_strings_with_null(value)
    } else {
      newObject[key] = value
    }
  });
  return newObject
}

export const get_reset_auto_increment_query = (entities) => {
  let query = '';
  entities.forEach((entity) => {
    query += `entity_table_name = \'${entity}\'.constantize.table_name;
      new_id = ${entity}.maximum(:id).next;
      ActiveRecord::Base.connection.execute("ALTER TABLE #{entity_table_name} AUTO_INCREMENT = #{new_id};");
    `
  })
  return query
}

export const fill_form = (controls, fields) => {
  const fields_keys = Object.keys(fields)
  const filtered_controls = controls.map(tab => {
    tab['controls'] = tab.controls.filter(control => {
      let keep = false
      control.type === 'checkbox' ?
      Object.keys(control.keys).forEach(key => {
        keep = keep || fields_keys.includes(key)
      }) :
      keep = keep || Object.keys(fields).includes(control.key)
      return keep
    })
    return tab
  })
  filtered_controls.forEach(tab => {
    tab.tab_name && cy.get('.nav-tabs').contains(tab.tab_name).click()
    tab.controls.forEach(control => {
      switch(control.type) {
        case 'input':
          cy.nearestInput(control.label).focus().clear().type(fields[control.key])
          break
        case 'selection':
          cy.nearestInput(control.label).select(control.options[fields[control.key]])
          break
        case 'checkbox':
          Object.keys(control.keys).forEach(key => {
            if (!fields_keys.includes(key)) {
              return
            } else if (fields[key] === '0') {
              cy.nearestCheckbox(control.label, control.keys[key]).uncheck()
            } else if (fields[key] === '1') {
              cy.nearestCheckbox(control.label, control.keys[key]).check()
            }
          })
          break
        default:
          throw new Error('Unknown control type')
      }
    })
  });
}
