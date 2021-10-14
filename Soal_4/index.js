// Import package
const http = require("http");
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");

const app = express();
const hbs = require("hbs");

// Import routes
const heroesRoute = require("./routes/heroes");
const typeRoute = require("./routes/type");

// Import db connection
const dbConnection = require("./connection/db");

app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// HTML form parser
app.use(express.urlencoded({ extended: false }));

// Set views location to app
app.set("views", path.join(__dirname, "views"));

// Set template / view engine
app.set("view engine", "hbs");

// Register view partials
hbs.registerPartials(path.join(__dirname, "views/partials"));

// User cookie
app.use(
  session({
    cookie: {
      maxAge: 3 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

// Use flash for sending message
app.use(flash());

// Setup flash message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Render index page
app.get("/", function (req, res) {
  const query = "SELECT h.id, h.name, t.name AS type, h.photo FROM heroes_tb AS h JOIN type_tb AS t ON h.type_id = t.id ORDER BY h.name";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, heroes) => {
      if (err) throw err;

      res.render("index", { title: "FEH Wiki", heroes });
    });
  });
});

// Render detail heroes page
app.get("/detail/:id", function (req, res) {
  const { id } = req.params;

  const query = "SELECT h.id, h.name, t.name AS type, h.photo FROM heroes_tb AS h JOIN type_tb AS t ON h.id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, hero) => {
      if (err) throw err;

      const heroes = { ...hero[0] };

      return res.render(`detail`, { title: "FEH Wiki > Heroes Detail", heroes });
    });

    conn.release();
  });
});

// Mount routes
app.use("/type", typeRoute);
app.use("/heroes", heroesRoute);

// Create HTTP server
const server = http.createServer(app);
const port = 4000;
server.listen(port, () => {
  console.log("server running on port: ", port);
});
