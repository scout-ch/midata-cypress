export const root_user = {
  email: 'hitobito-pbs@puzzle.ch',
  password: 'hito42bito'
}

export const kunz_user = {
  email: 'kunz@puzzle.ch',
  password: 'hito42bito'
}

export const jim_knopf_basiskurs = {
  required_fields: {
    'name': 'Jim Knopf auf Hoher See',
    'number': '42',
    'dates_attributes][0][start_at_date': '01.04.2020',
    'type': 'Event::Course',
    'kind_id': '3'
  },
  additional_fields: {
    'location': 'Hohe See',
    'state': 'application_open',
    'motto': 'Jim Knopf und die wilden 13',
    'application_opening_at': '01.01.2020',
    'application_closing_at': '01.03.2020',
    'requires_approval_abteilung': '0',
    'requires_approval_region': '1',
    'requires_approval_kantonalverband': '1',
    'requires_approval_bund': '0',
  }
}

export const empty_approval = {
  'current_occupation': '-',
  'current_level': '-',
  'occupation_assessment': '-',
  'strong_points': '-',
  'weak_points': '-',
  'comment': '-'
}

export const positive_approval = {
  'current_occupation': 'Leiterin',
  'current_level': 'Pfadistufe',
  'occupation_assessment': 'Tip töppeli',
  'strong_points': '-',
  'weak_points': '-',
  'comment': '-'
}
