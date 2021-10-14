const dbConnection = require("../connection/db");
const router = require("express").Router();
const uploadFile = require("../middlewares/uploadFile");
const pathFile = "http://localhost:4000/uploads/";

// Render add heroes page
router.get("/add", function (req, res) {
  const query1 = "SELECT h.id, h.name, t.name AS type, h.photo, FROM heroes_tb AS h JOIN type_tb AS t ON h.type_id = t.id ORDER BY m.name";
  const query2 = "SELECT * FROM type_tb ORDER BY name";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query1, (err, heroes) => {
      conn.query(query2, (err, types) => {
        if (err) throw err;

        return res.render("heroes/add", { title: "FEH Wiki > Add Heroes", heroes, types });
      });
    });

    conn.release();
  });
});

// Handle add heroes from client
router.post("/add", uploadFile("photo"), function (req, res) {
  const { name, type_id } = req.body;
  let photo = req.file.filename;

  const query = "INSERT INTO heroes_tb (name, type_id, photo) VALUES (?,?,?)";

  if (name == "" || type_id == "" || photo == "") {
    req.session.message = {
      type: "danger",
      message: "Please fulfill input",
    };
    res.redirect("add");
    return;
  }

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    // Execute query
    conn.query(query, [name, type_id, photo], (err, results) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message: "Server error!",
        };

        res.redirect("list");
      } else {
        req.session.message = {
          type: "success",
          message: "Heroes added successfull.",
        };

        res.redirect("add");
      }
    });

    // Release connection back to pool
    conn.release();
  });
});

// Render edit heroes page
router.get("/edit/:id", function (req, res) {
  const { id } = req.params;

  const query1 = "SELECT * FROM heroes_tb WHERE id = ?";
  const query2 = "SELECT * FROM type_tb ORDER BY name";

  dbConnection.getConnection((err, conn) => {
    if (err) {
      throw err;
    }

    conn.query(query1, [id], (err, hero) => {
      conn.query(query2, [id], (err, types) => {
        if (err) throw err;

        const heroes = {
          ...hero[0],
          photo: pathFile + hero[0].photo,
        };

        res.render("heroes/edit", { title: "FEH Wiki > Edit Heroes", heroes, types });
      });
    });

    conn.release();
  });
});

// Handle update heroes
router.post("/edit/:id", uploadFile("photo"), function (req, res) {
  const { id, name, type_id, oldImage } = req.body;

  let photo = oldImage.replace(pathFile, "");

  if (req.file) {
    photo = req.file.filename;
  }

  const query = "UPDATE heroes_tb SET name = ?, type_id = ?, photo = ? WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    // Execute query
    conn.query(query, [name, type_id, photo, id], (err, results) => {
      if (err) {
        console.log(err);

        req.session.message = {
          type: "danger",
          message: "Server error!",
        };

        res.redirect(`/heroes/edit/${id}}`);
      } else {
        req.session.message = {
          type: "success",
          message: "Heroes updated successfull.",
        };

        res.redirect("/");
      }
    });

    // Release connection back to pool
    conn.release();
  });
});

// Handle delete Heroes
router.get("/delete/:id", function (req, res) {
  const { id } = req.params;

  const query = "DELETE FROM heroes_tb WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message: err.message,
        };
        res.redirect("/");
      }

      req.session.message = {
        type: "success",
        message: "Heroes successfully deleted",
      };
      res.redirect("/");
    });

    conn.release();
  });
});

// Render infantry heroes page
router.get("/infantry", function (req, res) {
  const query = "SELECT h.id, h.name, t.name AS type, h.photo FROM heroes_tb AS h JOIN type_tb AS t ON h.type_id = t.id WHERE h.type_id = 1 ORDER BY h.name";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, heroes) => {
      if (err) throw err;

      return res.render("heroes/infantry", { title: "FEH Wiki > Infantry Heroes", heroes });
    });

    conn.release();
  });
});

// Render cavalry heroes page
router.get("/cavalry", function (req, res) {
  const query = "SELECT h.id, h.name, t.name AS type, h.photo FROM heroes_tb AS h JOIN type_tb AS t ON h.type_id = t.id WHERE h.type_id = 2 ORDER BY h.name";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, heroes) => {
      if (err) throw err;

      return res.render("heroes/cavalry", { title: "FEH Wiki > Cavalry Heroes", heroes });
    });

    conn.release();
  });
});

// Render infantry heroes page
router.get("/flying", function (req, res) {
  const query = "SELECT h.id, h.name, t.name AS type, h.photo FROM heroes_tb AS h JOIN type_tb AS t ON h.type_id = t.id WHERE h.type_id = 3 ORDER BY h.name";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, heroes) => {
      if (err) throw err;

      return res.render("heroes/flying", { title: "FEH Wiki > Flying Heroes", heroes });
    });

    conn.release();
  });
});

// Render infantry heroes page
router.get("/armored", function (req, res) {
  const query = "SELECT h.id, h.name, t.name AS type, h.photo FROM heroes_tb AS h JOIN type_tb AS t ON h.type_id = t.id WHERE h.type_id = 4 ORDER BY h.name";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, heroes) => {
      if (err) throw err;

      return res.render("heroes/armored", { title: "FEH Wiki > Armored Heroes", heroes });
    });

    conn.release();
  });
});

module.exports = router;
