export const GET_COURSE = `begin
  event = Event::Course.last
  return {event_id: event.id, group_id: event.groups.first.id}
rescue StandardError => e
  return e
end`

export const GET_COURSE_KV = `begin
  event = Event::Course.joins(:groups).where(groups: { type: Group::Kantonalverband }).last
  return {event_id: event.id, group_id: event.groups.first.id}
rescue StandardError => e
  return e
end`

export const GET_PERSON_IN_ABTEILUNG_BELOW = (group_id) => `begin
  group = Group.find(${group_id})
  person = Person.joins("INNER JOIN groups ON groups.lft >= #{group.lft} AND groups.lft < #{group.rgt} AND groups.id = people.primary_group_id").last
  return {
    id: person.id,
    first_name: person.first_name,
    last_name: person.last_name,
    nickname: person.nickname
  }
rescue StandardError => e
  return e
end`

export const GET_NAME = (person_id) => `begin
  person = Person.find(${person_id})
  return {
    first_name: person.first_name,
    last_name: person.last_name,
    nickname: person.nickname
  }
rescue StandardError => e
  return e
end`

export const GET_COURSE_PARTICIPATION = `begin
  participation = Event::Participation
    .joins(:event, :application, :roles)
    .where(active: true,
      events: {
        type: Event::Course,
        requires_approval_abteilung: true,
        requires_approval_kantonalverband: false,
        requires_approval_region: false,
        requires_approval_bund: false
      },
      event_applications: { approved: false }
    ).last
  return {
    participation_id: participation.id,
    event_id: participation.event.id,
    group_id: participation.event.groups.first.id,
    person_id: participation.person.id
  }
rescue StandardError => e
  return e
end`

export const JSON_APPROVAL = (participation_id) => `begin
  Event::Approval.joins('INNER JOIN event_participations ON event_participations.application_id = event_approvals.application_id')
    .where('event_participations.id = ${participation_id} AND event_approvals.approved = true').as_json(except: :approved_at)
rescue StandardError => e
  return e
end`
