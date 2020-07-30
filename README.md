# Loadout

## Local Installation After Cloning

Do this stuff once per machine after cloning the project.

-  Install .env file
-  Install Heroku CLI on the computer if you haven't already.
-  In the project folder:
   -  `heroku login`, then log in with browser
   -  `heroku git:remote -a loadoutapp`
   -  `npm i cors`
   -  `npm install jsonwebtoken`
   -  ...
-  In \client:
   -  `npm i date-fns` (or can this be installed in root?)
   -  `npm i jwt-decode`
   -  ...

## Running the App Locally

-  Both of these command are done from the project folder:
   -  `npm run server` runs the server
   -  `npm run client` runs the client

## Deployment

-  `git push heroku master` Push latest git commit to Heroku
-  `heroku open` Open the heroku page in a browser

## User Manual

### Sharing a Loadout

-  The creator of a loadout is given full permissions to the loadouts they create.
-  Anyone a loadout is shared with can remove themselves from the loadout, unless they are an admin (this is to ensure there is always at least one admin to every loadout).
-  Anyone assigned “can pack” permissions can
   -  pack and
   -  pack items in the loadout.
-  Anyone assigned “can edit” permissions can
   -  add,
   -  delete and
   -  rename items within the loadout and
   -  rename the loadout itself.
-  Anyone assigned “is admin” permissions can
   -  share the loadout with others,
   -  assign or remove permissions to others,
   -  and delete the loadout.
   -  Admin cannot remove admin permissions from themselves, but can assign admin permissions to another user who can them remove the admin permission from the original user.
   -  Admin cannot remove themselves from the loadout unless they give ownership of the loadout to someone else via the method indicated above. (There must always be at least one admin for a loadout.)

## Developer Manual

### Item Statuses

0. unpacked (unresolved)
1. packed (resolved)
2. not bringing (resolved) (not added yet)
3. need to acquire (unresolved) (not added yet)
4. compartment (not added yet)
   -  This is for something that is the same physical item as its parent, for example a zippered compartment on a backpack.
   -  not counted as resolved or unresolved
   -  not counted as an item
   -  inherits the same level number as its parent
   -  status not changeable by user in pack mode
