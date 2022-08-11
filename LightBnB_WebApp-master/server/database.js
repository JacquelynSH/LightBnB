const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool ({
  user: "jacquelynhaug",
  password: "123",
  host: "localhost",
  port: "5432",
  database: "lightbnb"
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const sql = `SELECT * FROM users WHERE email = $1`;
 return pool.query(sql, [email])
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err;
  });
}

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const sql = `SELECT * FROM users WHERE id = $1`;
  return pool.query(sql, [id])
   .then((result) => {
     return result.rows[0];
   })
   .catch((err) => {
     return err;
   });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
    const newUser = Object.values(user)
    console.log("USER", newUser)
    const sql = `INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *;`
    return pool.query(sql, newUser)
     .then((result) => {
       return result.rows[0];
     })
     .catch((err) => {
       return err;
     });
  }
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const sql = (`SELECT reservations.id, users.name, users.id, properties.thumbnail_photo_url, properties.title, 
  properties.number_of_bedrooms, properties.number_of_bathrooms, properties.parking_spaces, 
  properties.cost_per_night, reservations.start_date, reservations.end_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  JOIN users ON reservations.guest_id = users.id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id, users.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `);
  return pool.query(sql, [guest_id, limit])
   .then((result) => {
     return result.rows;
   })
   .catch((err) => {
     return console.error(err.message);
   });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id ) {
    queryParams.push(options.owner_id);
    queryString += `WHERE properties.owner_id = $${queryParams.length} `
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `AND cost_per_night >= $${queryParams.length} `
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `AND cost_per_night <= $${queryParams.length} `
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND rating >= $${queryParams.length} `
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  // console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then((res) => res.rows)
  .catch((err) => console.log(err.message));
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const newProperty = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url,
  property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, 
  property.city, property.province, property.post_code];
  console.log(newProperty);
  const queryString = `INSERT INTO properties (owner_id, title, 
    description, thumbnail_photo_url, cover_photo_url, cost_per_night,
     parking_spaces, number_of_bathrooms, number_of_bedrooms, country, 
     street, city, province, post_code)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`;
    return pool.query(queryString, newProperty)
   .then((result) => {
     return result.rows;
   })
   .catch((err) => {
     console.error(err.message);
   });
}

exports.addProperty = addProperty;
