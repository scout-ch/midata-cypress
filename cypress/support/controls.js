export const login_controls = [
  {
    controls: [
      {
        type: 'input',
        label: 'Haupt-E-Mail',
        key: 'email'
      },
      {
        type: 'input',
        label: 'Passwort',
        key: 'password'
      }
    ]
  }
]

export const course_controls = [
  {
    tab_name: 'Allgemein',
    controls: [
      {
        type: 'input',
        label: 'Name',
        key: 'name'
      },
      {
        type: 'input',
        label: 'Kursnummer',
        key: 'number'
      },
      {
        type: 'selection',
        label: 'Kursart',
        options: {
          '3': 'BKPS (Basiskurs Pfadistufe)'
        },
        key: 'kind_id'
      },
      {
        type: 'input',
        label: 'Ort / Adresse',
        key: 'location'
      },
      {
        type: 'selection',
        label: 'Status',
        options: {
          'created': 'Erstellt',
          'confirmed': 'Bestätigt',
          'application_open': 'Offen zur Anmeldung',
          'application_closed': 'Anmeldung abgeschlossen',
          'assignment_closed': 'Zuteilung abgeschlossen',
          'canceled': 'Abgesagt',
          'completed': 'Qualifikationen erfasst',
          'closed': 'Abgeschlossen'
        },
        key: 'state'
      },
      {
        type: 'input',
        label: 'Motto',
        key: 'motto'
      }
    ]
  },
  {
    tab_name: 'Daten',
    controls: [
      {
        type: 'input',
        label: 'Von',
        key: 'dates_attributes][0][start_at_date'
      }
    ]
  },
  {
    tab_name: 'Anmeldung',
    controls: [
      {
        type: 'input',
        label: 'Anmeldebeginn',
        key: 'application_opening_at'
      },
      {
        type: 'input',
        label: 'Anmeldeschluss',
        key: 'application_closing_at'
      },
      {
        type: 'checkbox',
        label: 'Empfehlung der Anmeldungen nötig durch',
        keys: {
          'requires_approval_abteilung': 'Abteilung',
          'requires_approval_region': 'Region',
          'requires_approval_kantonalverband': 'Region',
          'requires_approval_bund': 'Bund'
        }
      }
    ]
  }
]

export const course_approval_controls = [
  {
    controls: [
      {
        type: 'input',
        label: 'Tätigkeit',
        key: 'current_occupation'
      },
      {
        type: 'input',
        label: 'Stufe',
        key: 'current_level'
      },
      {
        type: 'input',
        label: 'Wie bewährt er*sie sich dabei? z.B. Einsatz, Qualität des*der TN',
        key: 'occupation_assessment'
      },
      {
        type: 'input',
        label: 'Wo liegen seine*ihre Stärken?',
        key: 'strong_points'
      },
      {
        type: 'input',
        label: 'Wo sollte man ihn*sie fördern?',
        key: 'weak_points'
      },
      {
        type: 'input',
        label: 'Wünsche, Anregungen oder Bemerkungen an die Kursleitung',
        key: 'comment'
      }
    ]
  }
]
