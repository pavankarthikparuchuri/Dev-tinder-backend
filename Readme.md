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

# API List

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/interested/:userid
- POST /request/send/ignored/:userid
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users in the platform
  status: ignore, interested, accepted, rejected

# currently we are handling all the apis in a single file, now we wil be creating router which will route the requests to the specified path.

- we will be using express router to create a router.
- using router we can manage our apis effeciently by grouping apis to different routers
- we will be grouping multiple apis to multiple routers and the routers would be handling the routes
- routers are created to manage routes

# we can also chain the responses

- example
- res
  .cookie("token", null, {
  expires: new Date(Date.now()),
  })
  .send("logout successful");

# Similar to schema methods, we can also create schema pre

- pre is kind of like a middleware

- connectionSchema.pre("save", function(){
  const connectionRequest = this;
  }), here we have created a middleware using pre which will be called when we try to save a model instance

- the above method will be called pre save
- we can use this pre for logging and monitoring

# Indexing

- indexing helps in optimizing querying.
- having indexing on the attributes helps in fetching those results faster
- if there are millions of records and lets say we are fetching based on first name without indexing it takes so much time than fetching when there is indexing
- when we add unique as a schema type to any attribute, then mongodb automatically creates indexing for that

- you can create mongo db indexes using schema type options

  - index:- boolean, whether to define an index on this property
  - unique:- boolean, whether to define a unique index on this property
  - sparse:- boolean, whether to define a sparse index on this property

- when we want the query results to be faster for a set of attributes, then we should be doing compound indexing.
- connectionSchema.index({ fromUserId: 1, toUserId: 1 }); this will make the queries having requests with body only fromuserid and touserid requests faster.

# logical db queries

- $and, $or, $not, $not

# Thought process while creating post and get apis

- we should validate the data before adding it to the database in post
- we should make sure that there is no data leak in get apis

# populate and ref

- ref is used to link to collections
- in the schema we can add ref property to the attribute and the value for this ref property should be a Model name
- populate is used to fetch the data from the referenced collection

# Pagination

- /feed?page=1&limit=10 => first 10 users 1-10 => .skip(0) & .limit(10)
- /feed?page=2&limit=10 => 11-20 => .skip(1 \* 10) & limit(10)
- /feed?page=3&limit=10 => 21-30 => .skip(2\*10) & .limit(10)

- there are two functions in mongodb which are helpful to achieve this those are skip and limit
- skip to skip the documents and limit tells how many documents are needed
