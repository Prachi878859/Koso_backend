const PowerStation = require("../models/PowerStationModel");

const powerStationController = {
  
  // Get All Power Stations
  getAllPowerStations: (req, res) => {
    PowerStation.findAll((error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching power stations",
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Power stations retrieved successfully",
        data: results,
        count: results.length
      });
    });
  },

  // Get Single Power Station by ID
  getPowerStationById: (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Power station ID is required"
      });
    }

    PowerStation.findById(id, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching power station",
          error: error.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Power station not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Power station retrieved successfully",
        data: results[0]
      });
    });
  },

  // Create New Power Station
  createPowerStation: (req, res) => {
    try {
      const {
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
} = req.body;

console.log("BODY =>", req.body);

      // Validate required fields
      if (!power_station_name) {
        return res.status(400).json({
          success: false,
          message: "Power station name is required"
        });
      }

      // Check if power station name already exists
      PowerStation.nameExists(power_station_name, null, (existsError, existsResults) => {
        if (existsError) {
          return res.status(500).json({
            success: false,
            message: "Database error",
            error: existsError.message
          });
        }

        if (existsResults[0].count > 0) {
          return res.status(400).json({
            success: false,
            message: "Power station name already exists"
          });
        }

        // Prepare data object
        const powerStationData = {
          power_station_name: power_station_name.trim(),
          pipe_dia_d2: pipe_dia_d2 || null,
          pipe_dia_unit: pipe_dia_unit || null,
          t2p: t2p || null,
          plant_type: plant_type || null,
          critical_type: critical_type || null,
          plant_mcr: plant_mcr || null,
          heat_rate_value: heat_rate_value || null,
          heat_rate_unit: heat_rate_unit || null,
          production_cost: production_cost || null,
          production_cost_currency: production_cost_currency || null,
          custom_currency: custom_currency || null,
          sell_price_per_mwh: sell_price_per_mwh || null,
          p1: p1 || null,
p1_unit: p1_unit || null,
t1: t1 || null,
t1_unit: t1_unit || null,
p2: p2 || null,
tcrh: tcrh || null,
w_crh: w_crh || null,
w_crh_unit: w_crh_unit || null,
tw: tw || null,
ww: ww || null,
t_mix: t_mix || null,
        };

        // Create new power station
        PowerStation.create(powerStationData, (createError, results) => {
          if (createError) {
            console.error("Power station creation error:", createError);
            return res.status(500).json({
              success: false,
              message: "Error creating power station",
              error: createError.message
            });
          }

          console.log(`✅ Power station created successfully with ID: ${results.insertId}`);

          // Fetch the newly created record
          PowerStation.findById(results.insertId, (fetchError, fetchResults) => {
            if (fetchError) {
              return res.status(201).json({
                success: true,
                message: "Power station created successfully",
                data: {
                  id: results.insertId,
                  ...powerStationData
                }
              });
            }

            return res.status(201).json({
              success: true,
              message: "Power station created successfully",
              data: fetchResults[0]
            });
          });
        });
      });
    } catch (error) {
      console.error("Server error in createPowerStation:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

  // Update Power Station
  updatePowerStation: (req, res) => {
    try {
      const { id } = req.params;
      const {
        power_station_name,
        pipe_dia_d2,
        pipe_dia_unit,
        t2p,
        plant_type,
        critical_type,
        plant_mcr,
        heat_rate_value,
        heat_rate_unit,
        production_cost,
        production_cost_currency,
        custom_currency,
        sell_price_per_mwh
      } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Power station ID is required"
        });
      }

      if (!power_station_name) {
        return res.status(400).json({
          success: false,
          message: "Power station name is required"
        });
      }

      // Check if power station exists
      PowerStation.findById(id, (checkError, checkResults) => {
        if (checkError) {
          return res.status(500).json({
            success: false,
            message: "Error checking power station",
            error: checkError.message
          });
        }

        if (checkResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Power station not found"
          });
        }

        // Check if new name already exists (excluding current record)
        PowerStation.nameExists(power_station_name, id, (existsError, existsResults) => {
          if (existsError) {
            return res.status(500).json({
              success: false,
              message: "Database error",
              error: existsError.message
            });
          }

          if (existsResults[0].count > 0) {
            return res.status(400).json({
              success: false,
              message: "Power station name already exists"
            });
          }

          // Prepare update data
          const updateData = {
            power_station_name: power_station_name.trim(),
            pipe_dia_d2: pipe_dia_d2 !== undefined ? pipe_dia_d2 : checkResults[0].pipe_dia_d2,
            pipe_dia_unit: pipe_dia_unit !== undefined ? pipe_dia_unit : checkResults[0].pipe_dia_unit,
            t2p: t2p !== undefined ? t2p : checkResults[0].t2p,
            plant_type: plant_type !== undefined ? plant_type : checkResults[0].plant_type,
            critical_type: critical_type !== undefined ? critical_type : checkResults[0].critical_type,
            plant_mcr: plant_mcr !== undefined ? plant_mcr : checkResults[0].plant_mcr,
            heat_rate_value: heat_rate_value !== undefined ? heat_rate_value : checkResults[0].heat_rate_value,
            heat_rate_unit: heat_rate_unit !== undefined ? heat_rate_unit : checkResults[0].heat_rate_unit,
            production_cost: production_cost !== undefined ? production_cost : checkResults[0].production_cost,
            production_cost_currency: production_cost_currency !== undefined ? production_cost_currency : checkResults[0].production_cost_currency,
            custom_currency: custom_currency !== undefined ? custom_currency : checkResults[0].custom_currency,
            sell_price_per_mwh: sell_price_per_mwh !== undefined ? sell_price_per_mwh : checkResults[0].sell_price_per_mwh
          };

          // Update power station
          PowerStation.update(id, updateData, (updateError, updateResults) => {
            if (updateError) {
              return res.status(500).json({
                success: false,
                message: "Error updating power station",
                error: updateError.message
              });
            }

            // Fetch updated record
            PowerStation.findById(id, (fetchError, fetchResults) => {
              if (fetchError) {
                return res.status(200).json({
                  success: true,
                  message: "Power station updated successfully",
                  data: {
                    id: id,
                    ...updateData
                  }
                });
              }

              return res.status(200).json({
                success: true,
                message: "Power station updated successfully",
                data: fetchResults[0]
              });
            });
          });
        });
      });
    } catch (error) {
      console.error("Server error in updatePowerStation:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

  // Delete Power Station
  deletePowerStation: (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Power station ID is required"
      });
    }

    // Check if power station exists
    PowerStation.findById(id, (checkError, checkResults) => {
      if (checkError) {
        return res.status(500).json({
          success: false,
          message: "Error checking power station",
          error: checkError.message
        });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Power station not found"
        });
      }

      // Delete power station
      PowerStation.delete(id, (deleteError, deleteResults) => {
        if (deleteError) {
          return res.status(500).json({
            success: false,
            message: "Error deleting power station",
            error: deleteError.message
          });
        }

        return res.status(200).json({
          success: true,
          message: "Power station deleted successfully",
          deletedId: id
        });
      });
    });
  },

  // Search Power Stations
  searchPowerStations: (req, res) => {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    PowerStation.search(query.trim(), (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error searching power stations",
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Search results",
        data: results,
        count: results.length
      });
    });
  },

  // Get Statistics
  getStatistics: (req, res) => {
    PowerStation.getStats((error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching statistics",
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Statistics retrieved successfully",
        data: results
      });
    });
  },

  // Bulk Create Power Stations (optional)
  bulkCreatePowerStations: (req, res) => {
    try {
      const { stations } = req.body; // Array of power station objects
      
      if (!stations || !Array.isArray(stations) || stations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Array of power stations is required"
        });
      }

      let createdCount = 0;
      let errorCount = 0;
      const errors = [];
      const createdStations = [];

      // Process each station sequentially
      const processStation = (index) => {
        if (index >= stations.length) {
          return res.status(201).json({
            success: true,
            message: `Bulk creation completed. Created: ${createdCount}, Failed: ${errorCount}`,
            created: createdStations,
            errors: errors.length > 0 ? errors : undefined
          });
        }

        const station = stations[index];
        
        if (!station.power_station_name) {
          errors.push({
            index: index,
            error: "Power station name is required",
            data: station
          });
          errorCount++;
          processStation(index + 1);
          return;
        }

        // Check if name exists
        PowerStation.nameExists(station.power_station_name, null, (existsError, existsResults) => {
          if (existsError) {
            errors.push({
              index: index,
              error: existsError.message,
              data: station
            });
            errorCount++;
            processStation(index + 1);
            return;
          }

          if (existsResults[0].count > 0) {
            errors.push({
              index: index,
              error: "Power station name already exists",
              data: station
            });
            errorCount++;
            processStation(index + 1);
            return;
          }

          // Create station
          PowerStation.create(station, (createError, createResults) => {
            if (createError) {
              errors.push({
                index: index,
                error: createError.message,
                data: station
              });
              errorCount++;
            } else {
              createdStations.push({
                id: createResults.insertId,
                ...station
              });
              createdCount++;
            }
            
            processStation(index + 1);
          });
        });
      };

      // Start processing
      processStation(0);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

  getPowerStationByName: (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Power station name is required"
      });
    }

    const searchName = name.trim();
    
    // Optional query parameter for exact/partial search
    const { exact = 'true', caseSensitive = 'false' } = req.query;

    if (exact === 'true') {
      // Exact match search
      if (caseSensitive === 'true') {
        // Case-sensitive exact match
        PowerStation.findByNameExact(searchName, (error, results) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Error fetching power station",
              error: error.message
            });
          }

          if (results.length === 0) {
            return res.status(404).json({
              success: false,
              message: `Power station '${searchName}' not found`
            });
          }

          return res.status(200).json({
            success: true,
            message: "Power station retrieved successfully",
            data: results[0]
          });
        });
      } else {
        // Case-insensitive exact match
        PowerStation.findByNameCI(searchName, (error, results) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Error fetching power station",
              error: error.message
            });
          }

          if (results.length === 0) {
            return res.status(404).json({
              success: false,
              message: `Power station '${searchName}' not found`
            });
          }

          return res.status(200).json({
            success: true,
            message: "Power station retrieved successfully",
            data: results[0]
          });
        });
      }
    } else {
      // Partial match search
      PowerStation.findByPartialName(searchName, (error, results) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Error searching power stations",
            error: error.message
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: `No power stations found matching '${searchName}'`
          });
        }

        return res.status(200).json({
          success: true,
          message: "Power stations retrieved successfully",
          data: results,
          count: results.length
        });
      });
    }
  } catch (error) {
    console.error("Server error in getPowerStationByName:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
},
};



module.exports = powerStationController;