# Modelo de Dados e Eventos

## Entidade Company

```text
id
name
segment
city
state
phone
website
instagram
google_maps_url
reviews_count
reviews_rating
units_count
source
icp_score
status
created_at
updated_at
```

## Entidade TestConversation

```text
id
company_id
channel
sent_at
first_response_at
response_time_seconds
conversation_started
conversation_finished
followup_count
last_followup_at
raw_messages
created_at
```

## Entidade AIAnalysis

```text
id
company_id
conversation_id
response_score
qualification_score
followup_score
scheduling_score
personalization_score
overall_service_score
pain_score
main_problem
secondary_problems
recommended_solution
summary
created_at
```

## Entidade Opportunity

```text
id
company_id
icp_score
pain_score
opportunity_score
priority
recommended_offer
status
created_at
```

## Entidade Outreach

```text
id
company_id
opportunity_id
campaign_id
message_version
audio_version
sent_at
delivered_at
read_at
responded_at
response_type
meeting_booked
created_at
```

## Entidade Meeting

```text
id
company_id
scheduled_at
held_at
show_status
pain_confirmed
urgency
budget_fit
decision_maker
next_step
close_probability
potential_value
created_at
```

## Entidade Deal

```text
id
company_id
meeting_id
status
product
value
proposal_sent_at
closed_at
paid_at
lost_reason
created_at
```

# Eventos principais

```text
company.created
company.icp_scored
company.icp_approved
company.icp_rejected
probe.sent
probe.response_received
probe.followup_received
probe.window_finished
analysis.completed
opportunity.created
opportunity.prioritized
outreach.generated
outreach.sent
outreach.delivered
outreach.read
outreach.replied
meeting.booked
meeting.held
proposal.sent
deal.won
deal.lost
```

Cada evento deve registrar timestamp para permitir cálculo de tempo entre etapas.
