# Dev Tinder Backend

- Created express js server

# Route Handler

- res.send("route handler 1");
- if we dont send the response back the request would be on loop and gets timedout after sometime
- there can be multiple route handlers for the same route
- to go to the next route handler we need to use next();
- when we use next then express would be expecting route handler next.
