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
- parameters for handlers, (req, res), (req, res, next), (err, req, res, next)

# Mongoose

- To connect our nodejs application to the cluster we would be using mongoose.

# Schema

- It is an identity for the documents
- It is like a heading, tells what can be stored inside a collection
- Schema maps to the collection and defines the shape of the documents within that collection
- This gives the structure to the collection

# Model

- To use our schema definiton, we need to convert our schema to model
- To do so, we need to write mongoose.model(modelName, schemaName)
- model can be considered as a class through which we can create new instances.

# JSON vs Javascript Object

- JSON is a format in which the data is stored, javascript object is a datastructure in javascript.
- JSON is of type string(text) format and Javascript object is of Javascript object type
- syntax rules:- must use double quotes in JSON for keys and string, and can use single/double/no quotes for keys
- JSON.parse() is used to convert JSON to js object and JSON.stringify is used to convert JS object to JSON.
- JSON doesnot support comments and functions.
- JSON is used for apis, files and data exchange and JSobjects are user for logic and manipulation.
- {"name": "Alice", "age": 25} --> JSON, {name: 'Alice', age: 25} --> JS Object
- JSON is only meant for data representation.

# How to fetch the payload coming from the client at the server.

- We will mostly be using JSON format to send the data and recieve data.
- when the client is sending the data in json format and the server is not able to read that json data.
- we need to use a middleware to read that json data and convert it into a javascript object and give it to us.
- express provides a middleware called express.json middleware
- inorder to use this middleware we need to to write app.use(express.json())
- if we dont mention any route then the middleware will be called for all the routes.
- This express.json reads the JSON converts it into a JS object and adds that JS object back to the req.body
- only the fields present in the scehema will be added/updated, adding fields not present in the schema won't get reflected into the db.

# Schema types

- required, unique, min, max, minLength, maxLength, validate, timestamps, trim, default, lowercase

# validator package can be used to sanitize and validate strings

# we can also add api level validations

# to encrypt the passwords in the database we can use bcrypt

# JWT token authentication

- json web token

- when user tries to login, the server validates the credentials and generates a jwt token and puts it in a cookie and sends back.
- once the client receives the cookies, the browser stores the cookie and this cookie will be used to validate any further requests to check whether the requests are from an authorised source and processes the request and sends the response back.
- if the token gets expired the validation fails and user will be redirected to login page
- jwt can be considered as a encrypted hash which has secrets embedded in it
- jwt has three part header, payload, signature
- we can use jsonwebtoken to create jwt tokens, verify them
- similar to bcrypt.hash, compare here we have sign, verify
- jwt.sign(data that we want to embed in the hash, secret key)

# Auth middleware

- we can write a middle to handle authentication and we can attach the user info the req object so that the next handler can utilize it if wanted.

# token expiration

- we can add expiresIn key to expire a token while creating the jwt.
- example
  - const token = jwt.sign({ \_id: encryptedPassword.\_id }, "DEV@Tinder$790", {
    expiresIn: "7d",
    });

# Mongoose schema methods

- we can write methods inside the schema and we can use those methods for the document element.
