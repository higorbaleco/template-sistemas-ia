# Stream B - Connector and Warming

## Mission

Define the service boundary for WhatsApp connectivity, delivery acknowledgement, reconnection, and warming cycles.

## Instructions

1. The connector owns transport and session state.
2. The warming service owns ramp-up logic and scheduling.
3. Business logic must not sleep inside the connector worker.
4. Use explicit events for delivery success, failure, reconnect, and block signals.
5. Preserve the distinction between operational traffic and warming traffic.

## Output

- connector responsibilities
- warming loop
- job queue shape
- failure heuristics
- block detection notes

