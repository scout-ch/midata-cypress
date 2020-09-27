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
