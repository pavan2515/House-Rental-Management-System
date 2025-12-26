const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const fileUpload = require("express-fileupload");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(fileUpload());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "hrms",
  connectionLimit: 10,
  supportBigNumbers: true,
  bigNumberStrings: true,
  authPlugins: {
    mysql_native_password: true,
  },
});

app.use(bodyParser.json());

app.post("/signup", (req, res) => {
  const user_id = req.body.userid;
  const first_name = req.body.firstname;
  const last_name = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  // Validate password match
  if (password !== req.body.confirm_password) {
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    // Log the hashed password to the console
    console.log("Hashed password:", hash);

    // Insert user into database
    const query =
      "INSERT INTO user (user_id, f_name, l_name, email, password) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      query,
      [user_id, first_name, last_name, email, hash],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).json({
              message: "User ID already taken. Please choose a different one.",
            });
          } else {
            throw err;
          }
        } else {
          // Redirect to the login page after successful signup
          res.redirect("/login.html");
        }
      }
    );
  });
});

app.post("/ownerdet", (req, res) => {
  const owner_id = req.body.owner_id;
  const user_id = req.body.user_id;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const ph_no = req.body.ph_no;

  // Add your database insertion logic here...
  const query =
    "INSERT INTO owner (owner_id, user_id, f_name, l_name, ph_no) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [owner_id, user_id, f_name, l_name, ph_no],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.redirect("/owner.html");
      }
    }
  );
});

app.post("/tenantdet", (req, res) => {
  const user_id = req.body.user_id;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;

  const ph_no = req.body.ph_no;

  // Add your database insertion logic here...
  const query =
    "INSERT INTO tenant ( user_id, f_name, l_name, ph_no) VALUES (?, ?, ?, ?)";
  connection.query(query, [user_id, f_name, l_name, ph_no], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/tenanthp.html");
    }
  });
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/homepage.html");
});

app.get("/home.jpg", (req, res) => {
  res.sendFile(__dirname + "/home.jpg");
});

app.get("/signup.html", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// ...
app.get("/tenantdet.html", (req, res) => {
  res.sendFile(__dirname + "/tenantdet.html");
});

// Add the following code for handling the login page
app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/owner.html", (req, res) => {
  res.sendFile(__dirname + "/owner.html");
});

app.get("/ownerdet.html", (req, res) => {
  res.sendFile(__dirname + "/ownerdet.html");
});

app.get("/house_details_form", (req, res) => {
  res.sendFile(__dirname + "/house.html");
});

app.get("/ownerhp.html", (req, res) => {
  res.sendFile(__dirname + "/ownerhp.html");
});

app.get("/tenanthp.html", (req, res) => {
  res.sendFile(__dirname + "/tenanthp.html");
});
// ...
app.get("/ownerview.html", (req, res) => {
  res.sendFile(__dirname + "/ownerview.html");
});
// ...
app.get("/next.html", (req, res) => {
  res.sendFile(__dirname + "/next.html");
});

app.get("/rent.html", (req, res) => {
  res.sendFile(__dirname + "/rent.html");
});

app.get("/lease.html", (req, res) => {
  res.sendFile(__dirname + "/lease.html");
});
app.get("/tenantview.html", (req, res) => {
  res.sendFile(__dirname + "/tenantview.html");
});

app.get("/tenantdet.html", (req, res) => {
  res.sendFile(__dirname + "/tenantdet.html");
});

app.post("/login-owner", (req, res) => {
  // adjust based on your form field names
  const owner_userid = req.body.owner_userid || req.body.tenant_userid;
  const owner_password = req.body.owner_password || req.body.tenant_password;

  console.log("Received login request for user_id:", owner_userid);
  console.log("Received password:", owner_password);
  // Your login logic here (check credentials, validate, etc.)
  const query = "SELECT * FROM user WHERE user_id = ?";
  connection.query(query, [owner_userid], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const hashedPassword = results[0].password;

    // Compare the provided password with the hashed password from the database
    bcrypt.compare(
      owner_password,
      hashedPassword,
      (compareErr, passwordMatch) => {
        if (compareErr || !passwordMatch) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Successful login
        res.redirect("/ownerhp.html");
      }
    );
  });
});
app.post("/login-tenant", (req, res) => {
  // adjust based on your form field names
  const tenant_userid = req.body.owner_userid || req.body.tenant_userid;
  const tenant_password = req.body.owner_password || req.body.tenant_password;

  console.log("Received login request for user_id:", tenant_userid);
  console.log("Received password:", tenant_password);
  // Your login logic here (check credentials, validate, etc.)
  const query = "SELECT * FROM user WHERE user_id = ?";
  connection.query(query, [tenant_userid], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const hashedPassword = results[0].password;

    // Compare the provided password with the hashed password from the database
    bcrypt.compare(
      tenant_password,
      hashedPassword,
      (compareErr, passwordMatch) => {
        if (compareErr || !passwordMatch) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Successful login
        res.redirect("/tenanthp.html");
      }
    );
  });
});

// For now, let's send a response indicating success

// Add the following code to handle the form submission
// app.post('/signup', (req, res) => {
//   const user_id = req.body.userid;
//   const first_name = req.body.firstname;
//   const last_name = req.body.lastname;
//   const email = req.body.email;
//   const password = req.body.password;

//   // Validate password match
//   if (password !== req.body.confirm_password) {
//     res.status(400).json({ message: 'Passwords do not match' });
//     return;
//   }

//   // Hash the password
//   bcrypt.hash(password, 10, (err, hash) => {
//     if (err) throw err;

//     // Insert user into database
//     const query = 'INSERT INTO user (user_id, f_name, l_name, email, password) VALUES (?, ?, ?, ?, ?)';
//     connection.query(query, [user_id, first_name, last_name, email, hash], (err, result) => {
//       if (err) throw err;
//       res.json({ message: 'User signed up successfully' });
//     });
//   });
// });

app.post("/house_details", (req, res) => {
  const house_id = req.body.house_id;
  const owner_id = req.body.owner_id;
  const house_type = req.body.house_type;
  const address = req.body.address;
  const image_data = req.files.image_data.data.toString("base64"); // Convert image data to base64 string

  // Insert data into MySQL database along with the base64 encoded image
  const query =
    "INSERT INTO house_details (house_id, owner_id, house_type, address, image_data) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [house_id, owner_id, house_type, address, image_data],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into MySQL:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Data inserted into MySQL:", result);
        res.status(200).json({ message: "Form data submitted successfully" });
      }
    }
  );
});

// Update your "/api/house-details" route
app.get("/api/house-details", (req, res) => {
  const query = `
    SELECT 
      hd.house_id,
      hd.owner_id,
      hd.house_type,
      hd.address,
      hd.image_data,
      r.r_price,
      r.advance_amt,
      l.l_price,
      l.period
    FROM 
      house_details hd 
    LEFT JOIN 
      rent r ON hd.house_id = r.house_id AND hd.owner_id = r.owner_id
    LEFT JOIN 
      lease l ON hd.house_id = l.house_id AND hd.owner_id = l.owner_id;
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching data from MySQL:", err);
      res.status(500).json({ error: "Error fetching data from the database" });
      return;
    }
    res.json(result);
  });
});



// Add this route to handle updating house details
app.put("/api/update-house/:houseId/:ownerId", (req, res) => {
  const houseId = req.params.houseId;
  const ownerId = req.params.ownerId;
  const updatedData = req.body;

  console.log(
    "Received update request for house_id:",
    houseId,
    " and owner_id:",
    ownerId
  );
  console.log("Updated data:", updatedData);

  // Implement your logic to update the database with the edited data
  const query =
    "UPDATE house_details SET ? WHERE house_id = ? AND owner_id = ?";
  connection.query(query, [updatedData, houseId, ownerId], (err, result) => {
    if (err) {
      console.error("Error updating data in the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ message: "House details updated successfully" });
    }
  });
});

//Delete house details
app.delete("/api/delete-house/:houseId/:ownerId", (req, res) => {
  const houseId = req.params.houseId;
  const ownerId = req.params.ownerId;

  // Start a transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error("Error starting transaction:", beginTransactionErr);
      res.status(500).json({ error: "Error starting transaction" });
      return;
    }

    // Delete from house_details table
    const deleteHouseQuery =
      "DELETE FROM house_details WHERE house_id = ? AND owner_id = ?";
    connection.query(
      deleteHouseQuery,
      [houseId, ownerId],
      (deleteHouseErr, deleteHouseResult) => {
        if (deleteHouseErr) {
          // Rollback the transaction if there is an error
          connection.rollback(() => {
            console.error("Error deleting from house_details:", deleteHouseErr);
            res
              .status(500)
              .json({ error: "Error deleting from house_details" });
          });
          return;
        }

        // Delete from rent table
        const deleteRentQuery =
          "DELETE FROM rent WHERE house_id = ? AND owner_id = ?";
        connection.query(
          deleteRentQuery,
          [houseId, ownerId],
          (deleteRentErr, deleteRentResult) => {
            if (deleteRentErr) {
              // Rollback the transaction if there is an error
              connection.rollback(() => {
                console.error("Error deleting from rent:", deleteRentErr);
                res.status(500).json({ error: "Error deleting from rent" });
              });
              return;
            }

            // Delete from lease table
            const deleteLeaseQuery =
              "DELETE FROM lease WHERE house_id = ? AND owner_id = ?";
            connection.query(
              deleteLeaseQuery,
              [houseId, ownerId],
              (deleteLeaseErr, deleteLeaseResult) => {
                if (deleteLeaseErr) {
                  // Rollback the transaction if there is an error
                  connection.rollback(() => {
                    console.error("Error deleting from lease:", deleteLeaseErr);
                    res
                      .status(500)
                      .json({ error: "Error deleting from lease" });
                  });
                  return;
                }

                // Commit the transaction if all queries were successful
                connection.commit((commitErr) => {
                  if (commitErr) {
                    console.error("Error committing transaction:", commitErr);
                    res
                      .status(500)
                      .json({ error: "Error committing transaction" });
                    return;
                  }

                  // Respond with success
                  res.json({ success: true });
                });
              }
            );
          }
        );
      }
    );
  });
});

app.post("/rent_details", (req, res) => {
  const house_id = req.body.house_id;
  const owner_id = req.body.owner_id;

  const rent_price = req.body.rent_price;
  const advance_amount = req.body.advance_amount;

  // Add your database insertion logic here...
  const query =
    "INSERT INTO rent (house_id,owner_id, r_price, advance_amt) VALUES (?,?, ?, ?)";
  connection.query(
    query,
    [house_id, owner_id, rent_price, advance_amount],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json({ message: "Rent details added successfully" });
      }
    }
  );
});

app.post("/lease-details", (req, res) => {
  const house_id = req.body.house_id;
  const owner_id = req.body.owner_id;

  const lease_price = req.body.lease_price;
  const period = req.body.period;

  // Add your database insertion logic here...
  const query =
    "INSERT INTO lease (house_id,owner_id, period, l_price) VALUES (?,?, ?, ?)";
  connection.query(
    query,
    [house_id, owner_id, period, lease_price],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into MySQL:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Data inserted into MySQL:", result);

        // You can send a response or redirect after successful submission
        // res.send("Form data submitted successfully");
        res.json({ message: "Form data submitted successfully" });
      }
    }
  );
});

app.get('/houses/:option', (req, res) => {
  const option = req.params.option;
  const searchAddress = req.query.address || '';

  let query = `
    SELECT 
      owner.f_name, 
      owner.l_name, 
      owner.ph_no, 
      house_details.house_type, 
      house_details.address, 
      rent.r_price, 
      rent.advance_amt, 
      lease.l_price, 
      lease.period,
      house_details.image_data
    FROM 
      owner
    INNER JOIN 
      house_details ON owner.owner_id = house_details.owner_id
    LEFT JOIN 
      rent ON 
        house_details.house_id = rent.house_id AND
        house_details.owner_id = rent.owner_id
    LEFT JOIN 
      lease ON 
        house_details.house_id = lease.house_id AND
        house_details.owner_id = lease.owner_id
  `;

  if (option === 'rent') {
    query += ' WHERE rent.r_price IS NOT NULL';
  } else if (option === 'lease') {
    query += ' WHERE lease.l_price IS NOT NULL';
  }

  if (searchAddress) {
    query += ` AND house_details.address LIKE '%${searchAddress}%'`;
  }

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// API endpoint to fetch house images
app.get('/images/:ownerId/:houseId', (req, res) => {
  const ownerId = req.params.ownerId;
  const houseId = req.params.houseId;

  // Fetch image data based on owner and house IDs
  connection.query('SELECT image_data FROM house_details WHERE owner_id = ? AND house_id = ?', [ownerId, houseId], (err, result) => {
    if (err) {
      console.error('Error fetching image data:', err);
      res.status(500).json({ error: 'Error fetching image data' });
    } else {
      if (result.length > 0) {
        const imageData = result[0].image_data;

        // Set the Content-Type header to image/jpeg
        res.setHeader('Content-Type', 'image/jpeg');
        // Send the image data as a buffer
        res.end(Buffer.from(imageData, 'base64'));
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    }
  });
});



const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});