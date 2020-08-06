- new compartment system
   - maybe new item should be up top of the section
   - fix styling in edit mode
   - fix odd bug where it "brings" compartment names over when you navigate in edit mode
     - seems like I can't have it populate a defaultValue or value and also have it be the right value and be editable
     - I need it to populate the correct values, be editable and also focus on the value when a new compartment is made
     - make it focus name of a newly made compartment
   - TypeError: Cannot read property 'numDescendants' of undefined
     - I think this happens if I delete an item that contains subitems when it reprocesses the loadout still containing orphaned items
   - need a rollout before deleting a compartment
  - rename "compartment" to "group"
  - add compartment buttons should be colored with the compartment color while add items are colored with the subitem color

# current change

