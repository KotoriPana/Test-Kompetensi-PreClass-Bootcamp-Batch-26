const dbConnection = require("../connection/db");
const router = require("express").Router();

// Render type page
router.get("/list", function (req, res) {
  const query = "SELECT * FROM type_tb ORDER BY name DESC";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, types) => {
      if (err) throw err;

      return res.render("type/list", { title: "FEH Wiki > Type", types });
    });

    conn.release();
  });
});

// Handle add type from client
router.post("/list", function (req, res) {
  const { name } = req.body;

  const query = "INSERT INTO type_tb (name) VALUES (?)";

  if (name == "") {
    req.session.message = {
      type: "danger",
      message: "Please fulfill input",
    };
    res.redirect("list");
    return;
  }

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    // Execute query
    conn.query(query, [name], (err, results) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message: "Server error!",
        };

        res.redirect("list");
      } else {
        req.session.message = {
          type: "success",
          message: "Type added successfull.",
        };

        res.redirect("list");
      }
    });

    // Release connection back to pool
    conn.release();
  });
});

// Render edit type page
router.get("/edit/:id", function (req, res) {
  const { id } = req.params;

  const query = "SELECT * FROM type_tb WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) {
      throw err;
    }

    conn.query(query, [id], (err, results) => {
      if (err) throw err;

      const types = { ...results[0] };

      res.render("type/edit", { title: "FEH Wiki > Edit Type", types });
    });

    conn.release();
  });
});

// Handle update type
router.post("/edit/:id", function (req, res) {
  const { id, name } = req.body;

  const query = "UPDATE type_tb SET name = ? WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    // Execute query
    conn.query(query, [name, id], (err, results) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message: "Server error!",
        };

        res.redirect(`/type/edit/${id}}`);
      } else {
        req.session.message = {
          type: "success",
          message: "Type updated successfull.",
        };

        res.redirect("/type/list");
      }
    });

    // Release connection back to pool
    conn.release();
  });
});

// Handle delete type
router.get("/delete/:id", function (req, res) {
  const { id } = req.params;

  const query = "DELETE FROM type_tb WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message: err.message,
        };
        res.redirect("/type/list");
      }

      req.session.message = {
        type: "success",
        message: "Type successfully deleted",
      };
      res.redirect("/type/list");
    });

    conn.release();
  });
});

module.exports = router;
