export const root_user = {
  username: 'hitobito-pbs@puzzle.ch',
  password: 'hito42bito'
}

export const unspunne_sicherheitsmodul_wasser = {
  id: 113,
  fields: {
    'name': 'Jim Knopf auf Hoher See',
    'location': 'Hohe See',
    'state': 'application_open',
    'motto': 'Jim Knopf und die wilden 13',
    'application_opening_at': '01.01.2020',
    'application_closing_at': '31.12.2020',
    'requires_approval_abteilung': '0',
    'requires_approval_region': '1',
    'requires_approval_kantonalverband': '1',
    'requires_approval_bund': '0',
    'application_conditions': '', // so that it is not null
    'cost': ''
  }
}

export const zürich_basiskurs_pfadistufe = {
  id: 91
}

export const bern_leitpfadikurs = {
  id: 84
}

export const user_in = {
  id: 485,
  first_name: 'Wilhelm',
  last_name: 'Busch',
  nickname: 'In',
  event: {
    id: 83,
    participation_id: 806
  }
}

export const user_aliquid = {
  id: 280,
  first_name: 'Catharina',
  last_name: 'Schroder',
  nickname: 'Aliquid'
}

export const user_necessitatibus = {
  id: 479,
  first_name: 'Fine',
  last_name: 'Rosenauer',
  nickname: 'Necessitatibus',
  event: {
    id: 94,
    participation_id: 937,
    fields: {
      'current_occupation': 'Leiterin',
      'current_level': 'Pfadistufe',
      'occupation_assessment': 'Tip töppeli',
      'strong_points': '-',
      'weak_points': '-',
      'comment': '-'
    }
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
