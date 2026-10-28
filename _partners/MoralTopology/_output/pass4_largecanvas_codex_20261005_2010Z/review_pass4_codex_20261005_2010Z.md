# Pass4 — Large desktop canvas

Both workspaces now use up to 3600px width. The >=2300px desktop breakpoint gives
the guided graph 1640px height and full-model graph 1700px, leaving >=1600px of
actual canvas height after Plotly margins. At 3840x2160, browser DOM measurements
are 3022x1622 guided and 3017x1604 full model. At 390x844, the guided graph remains
340px tall and document scroll width is 375px. No numerical code changed.

Local preview restarted on 8150; header reports 1.2.1. Validation uses rendered
browser dimensions rather than additional tests for static styling.
