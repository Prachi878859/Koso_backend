const db = require("../config/db");

const PowerStation = {
  // Find all power stations with pagination
  findAll: (callback) => {
    const sql = `
      SELECT * FROM plant_data 
      ORDER BY power_station_name ASC
    `;
    db.query(sql, callback);
  },

  // Find power station by ID
  findById: (id, callback) => {
    const sql = "SELECT * FROM plant_data WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Find by power station name
  findByName: (name, callback) => {
    const sql = "SELECT * FROM plant_data WHERE power_station_name = ?";
    db.query(sql, [name], callback);
  },

  // Create new power station
  create: (data, callback) => {
  const sql = `
    INSERT INTO plant_data (
      power_station_name, 
      pipe_dia_d2, 
      pipe_dia_unit, 
      t2p,
      p1,
      p1_unit,
      t1,
      t1_unit,
      p2,
      tcrh,
      w_crh,
      w_crh_unit,
      tw,
      ww,
      t_mix,
      plant_type, 
      critical_type, 
      plant_mcr, 
      heat_rate_value, 
      heat_rate_unit, 
      production_cost, 
      production_cost_currency, 
      custom_currency, 
      sell_price_per_mwh
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    data.power_station_name,
    data.pipe_dia_d2,
    data.pipe_dia_unit,
    data.t2p,
    data.p1,
    data.p1_unit,
    data.t1,
    data.t1_unit,
    data.p2,
    data.tcrh,
    data.w_crh,
    data.w_crh_unit,
    data.tw,
    data.ww,
    data.t_mix,
    data.plant_type,
    data.critical_type,
    data.plant_mcr,
    data.heat_rate_value,
    data.heat_rate_unit,
    data.production_cost,
    data.production_cost_currency,
    data.custom_currency,
    data.sell_price_per_mwh
  ], callback);
},


  // Update power station
  update: (id, data, callback) => {
    const sql = `
      UPDATE plant_data SET 
        power_station_name = ?, 
        pipe_dia_d2 = ?, 
        pipe_dia_unit = ?, 
        t2p = ?, 
        plant_type = ?, 
        critical_type = ?, 
        plant_mcr = ?, 
        heat_rate_value = ?, 
        heat_rate_unit = ?, 
        production_cost = ?, 
        production_cost_currency = ?, 
        custom_currency = ?, 
        sell_price_per_mwh = ? 
      WHERE id = ?
    `;
    
    db.query(sql, [
      data.power_station_name,
      data.pipe_dia_d2,
      data.pipe_dia_unit,
      data.t2p,
      data.plant_type,
      data.critical_type,
      data.plant_mcr,
      data.heat_rate_value,
      data.heat_rate_unit,
      data.production_cost,
      data.production_cost_currency,
      data.custom_currency,
      data.sell_price_per_mwh,
      id
    ], callback);
  },

  // Delete power station by ID
  delete: (id, callback) => {
    const sql = "DELETE FROM plant_data WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Check if power station name exists
  nameExists: (name, excludeId = null, callback) => {
    let sql = "SELECT COUNT(*) as count FROM plant_data WHERE power_station_name = ?";
    const params = [name];
    
    if (excludeId) {
      sql += " AND id != ?";
      params.push(excludeId);
    }
    
    db.query(sql, params, callback);
  },

  // Search power stations
  search: (query, callback) => {
    const sql = `
      SELECT * FROM plant_data 
      WHERE power_station_name LIKE ? 
      OR plant_type LIKE ? 
      OR critical_type LIKE ?
      ORDER BY power_station_name ASC
    `;
    const searchTerm = `%${query}%`;
    db.query(sql, [searchTerm, searchTerm, searchTerm], callback);
  },

  // Paginate power stations
  paginate: (limit, offset, callback) => {
    const sql = "SELECT * FROM plant_data ORDER BY power_station_name ASC LIMIT ? OFFSET ?";
    db.query(sql, [limit, offset], callback);
  },

  // Get statistics
  getStats: (callback) => {
    const sql = `
      SELECT 
        COUNT(*) as totalStations,
        plant_type,
        COUNT(*) as count_by_type
      FROM plant_data 
      GROUP BY plant_type
    `;
    db.query(sql, callback);
  },

  // Find by power station name (exact match)
findByNameExact: (name, callback) => {
  const sql = "SELECT * FROM plant_data WHERE power_station_name = ?";
  db.query(sql, [name], callback);
},

// Find by power station name (case-insensitive)
findByNameCI: (name, callback) => {
  const sql = "SELECT * FROM plant_data WHERE LOWER(power_station_name) = LOWER(?)";
  db.query(sql, [name], callback);
},

// Find power stations containing name (partial match)
findByPartialName: (name, callback) => {
  const sql = "SELECT * FROM plant_data WHERE power_station_name LIKE ? ORDER BY power_station_name ASC";
  db.query(sql, [`%${name}%`], callback);
}
};

module.exports = PowerStation;