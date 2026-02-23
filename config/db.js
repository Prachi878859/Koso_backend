const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "urztzyrv_pms", 
//   password: process.env.DB_PASSWORD || "PMS@321%&*#!()", 
//   database: process.env.DB_NAME || "urztzyrv_pms_db",
//   charset: "utf8mb4"
// });


const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root", 
  password: process.env.DB_PASSWORD || "", 
  database: process.env.DB_NAME || "koso_application",
  charset: "utf8mb4"
});



db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: " + err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database " );
});
db.on("error", (err) => {
  console.error("❌ Database error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Reconnecting to database...");
  } else {
    throw err;
  }
});

db.execute = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results, fields) => {
      if (err) {
        console.error('❌ Database Query Error:', err);
        reject(err);
      } else {
        resolve([results, fields]);
      }
    });
  });
};

module.exports = db;