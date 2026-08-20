# Stream A - Architecture and Data

## Mission

Turn the spec into a concrete domain model and a first-pass schema that can support agents, instances, conversations, and warming.

## Instructions

1. Use the names in `execution/contracts.md` exactly.
2. Keep `agent` and `whatsapp_instance` as separate concepts.
3. Make lifecycle state explicit; do not infer it from connection state alone.
4. Favor tables and enums that map cleanly to the dashboard and webhook model.
5. Record every assumption that affects implementation order.

## Output

- entity map
- table-by-table draft
- key indexes
- migration sequence
- unresolved questions

