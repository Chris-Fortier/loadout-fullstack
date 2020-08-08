- new compartment system
   - fix styling in edit mode
     - use the same item card component when in edit mode (the card just changes what features are rendered)
   - fix odd bug where it "brings" compartment names over when you navigate in edit mode
     - seems like I can't have it populate a defaultValue or value and also have it be the right value and be editable
     - I need it to populate the correct values, be editable and also focus on the value when a new compartment is made
     - make it focus name of a newly made compartment
   - TypeError: Cannot read property 'numDescendants' of undefined
     - I think this happens if I delete an item that contains subitems when it reprocesses the loadout still containing orphaned items
   - need a rollout before deleting a compartment (or modal?)
  - rename "compartment" to "group"?
  - upon deleting last compartment, put child items in root of parent item
- modal dialog boxes instead of rollouts?
  - delete item
  - unpack all
- need a "Cancel Move" icon (use a small Ghostbusters symbol)
- icon button for unpack all
- new loadout bar
  - links to the three "tabs"
    - Pack
    - Edit
    - Sharing
  - Refresh button
- rollout to show the items currently "picked up"
- add ability to "collapse" compartments

# before next Heroku push:
- test in dark and colors mode
- full test of making a new account and all the functionality shown in demo
- clear warnings

# current change
