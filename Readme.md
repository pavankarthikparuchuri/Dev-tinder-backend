# Dev Tinder Backend

- Created express js server

# Route Handler

- res.send("route handler 1");
- if we dont send the response back the request would be on loop and gets timedout after sometime
- there can be multiple route handlers for the same route
- to go to the next route handler we need to use next();
- when we use next then express would be expecting route handler next.
- we can club multiple route handlers using [].
- there will be no change in behaviour, thisn will behave the same way as without the []
- app.use(path, rH1, rH2, rH3, rH4) same as app.use(path, [rH1, rH2], rH3, rH4) same as app.use(path, [rH1, rH2, rH3, rH4])
- route handlers are functions that are used to handle the routes, that are actually sending the response.
- all other intermediate callbacks are called middlewares
- GET /users => express checks all the app.xxx("routes") functions, if it finds any matching routes it will call that functions and if it finds any route handler it sends the response and stops execution;
- It will go from middleware to middleware (middleware chain) and if it finds a request handler or route handler or response handler and it handles the route, if it doesnot find any route handler then it gives 404 error
- Middleware are intermediate functions that gets executed before handling the request
- we can handle authorization using middlewares and once the user gets authorized we can use next() to call the corresponding matching handlers.
- app.all and app.use are mostly same, but app.use matches subpaths like /user/\* but app.all matches exact path and app.use is used for middlewares generally and app.all is generally used for route handling.
