import * as SQLite from 'expo-sqlite';

let db; // This will hold the reference to the SQLite database

// Function to initialize the database
export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('kidAppFinals.db'); // Open or create the database
    await setupDatabase(db); // Set up the database (create tables, insert data, etc.)
  }
  return db; // Return the database reference
};

// Function to set up the database (create table, insert data, etc.)
const setupDatabase = async (db) => {
  try {

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        UNIQUE (email, role, name)
      );

      CREATE TABLE IF NOT EXISTS user_pictures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        image_uri TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  screen TEXT NOT NULL,
  learned_index INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS screenDone (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  screen TEXT NOT NULL,
  isDone INTEGER NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
    `);

  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

// Function to handle login request
export const findById = async (id) => {

  try {

const  result = await db.getFirstAsync(
        `SELECT * FROM users WHERE id = ?`,
        [id]);
    
    if (result) {
      return result; // User found, return the user data
    } else {
      return null; // No user found with the provided credentials
    }
  } catch (error) {
    console.error('Error during findbyid:', error);
    return null;
  }
};

export const saveProgressToDB = async (userId, screen, index) => {
  try {
    const result = await db.runAsync(
      `INSERT OR REPLACE INTO progress (user_id, screen, learned_index) VALUES (?, ?, ?)`,
      [userId, screen, index],
    );

  } catch (error) {
    console.error("Error inserting user picture:", error);
  }
};

export const markDone = async (userId, screen, isDone) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO screenDone (user_id, screen, isDone) VALUES (?, ?, ?)`,
      [userId, screen, isDone],
    );

  } catch (error) {
    console.error("Error inserting user picture:", error);
  }
};

export const hasDone = async (userId, screen) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT isDone FROM screenDone WHERE user_id = ? AND screen = ?`,
      [userId, screen]
    );

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error during find:', error);
    return null;
  }
};


export const kidDoneScreens = async (userId, isDone) => {
  try {
    const result = await db.getAllAsync(
      `SELECT screen FROM screenDone WHERE user_id = ? AND isDone = ?`,
      [userId, isDone]
    );

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error during find:', error);
    return null;
  }
};



export const loadProgressFromDB = async (userId, screenName) => {
  try {
    // Execute the query to find the user by email and password
    const result = await db.getAllAsync(
      'SELECT learned_index FROM progress WHERE user_id = ? AND screen = ?',
      [userId, screenName]
    );
    if (result) {
      return result; // User found, return the user data
    } else {
      return null; // No user found with the provided credentials
    }
  } catch (error) {
    console.error('Error during load progress from db:', error);
    return null;
  }
};


export const insertUserPicture = async (userId, base64Image) => {
  try {
    await db.runAsync(
      `INSERT INTO user_pictures (user_id, image_uri) VALUES (?, ?)`,
      [userId, base64Image]
    );
  } catch (error) {
    console.error("Error inserting user picture:", error);
  }
};


// Function to fetch all items from the database
export const fetchUsers = async () => {
  if (!db) {
    console.error("Database is not initialized!");
    return [];
  }

  try {
    const result = await db.getAllAsync('SELECT * FROM users');
    return result || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const update = async (payload) => {
  const { id, name, age, email, password, role } = payload;

  try {
    const result = await db.runAsync(
      `UPDATE users SET name = ?, age = ?, password = ? WHERE id = ?`,
      [name, age, password, id]
    );
    return result;
  } catch (error) {
    console.error('Error updated user:', error);
  }
};

export const updateParent = async (payload) => {
  const { id, name, age, email, password } = payload;

  try {
    const result = await db.runAsync(
      `UPDATE users SET name = ?, age = ?, password = ?, email = ? WHERE id = ?`,
      [name, age, password, email, id]
    );
    return result;
  } catch (error) {
    console.error('Error updated user:', error);
  }
};

export const updatePassword = async (payload) => {
  try {
    const result = await db.runAsync(
      `UPDATE users SET password = ? WHERE email = ?`,
      [payload.password, payload.email]
    );
    return result;
  } catch (error) {
    console.error('Error updating password:', error);
  }
};



export const deleteUser = async (id) => {

  try {
    const result = await db.runAsync(
      `DELETE FROM users WHERE id = ?;`,
      [id]
    );
    return result;
  } catch (error) {
    console.error('Error updated user:', error);
  }
};

export const insertUser = async (payload) => {

  const { name, age, email, password, role } = payload;

  try {
    const result = await db.runAsync(
      `INSERT INTO users (name, age, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [name, age, email, password, role]
    );
    return result;
  } catch (error) {
    console.error('Error inserting user:', error);
  }
};


// Function to handle login request
export const loginUser = async (email, password, name) => {

  try {
    // Execute the query to find the user by email and password

    let result;
    if (name && name != null) {
      result = await db.getFirstAsync(
        `SELECT * FROM users WHERE email = ? AND password = ? AND name = ? `,
        [email, password, name]);
    } else {
      result = await db.getFirstAsync(`SELECT * FROM users WHERE email = ? AND password = ?  `,
        [email, password]);
    }

    if (result) {
      return result; // User found, return the user data
    } else {
      return null; // No user found with the provided credentials
    }
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const findByEmail = async (email) => {

  try {
    // Execute the query to find the user by email and password
    const result = await db.getFirstAsync(
      `SELECT * FROM users WHERE email = ? AND role = ?`,
      [email, 'PARENT']
    );

    if (result) {

      return result; // User found, return the user data
    } else {
      return null; // No user found with the provided credentials
    }
  } catch (error) {
    console.error('Error during find:', error);
    return null;
  }
};

export const findImageByEmail = async (email) => {

  try {
    // Execute the query to find the user by email and password
    const result = await db.getFirstAsync(
      `SELECT * FROM user_pictures WHERE user_id = ? `,
      [email]
    );

    if (result) {
      return result; // User found, return the user data
    } else {
      return null; // No user found with the provided credentials
    }
  } catch (error) {
    console.error('Error during find:', error);
    return null;
  }
};

export const findAllByEmail = async (email) => {

  try {
    // Execute the query to find the user by email and password
    const result = await db.getAllAsync(
      `SELECT * FROM users WHERE email = ? AND role = ?`,
      [email, 'kid']
    );

    if (result) {
      return result; // User found, return the user data
    } else {
      return null; // No user found with the provided credentials
    }
  } catch (error) {
    console.error('Error during find:', error);
    return null;
  }
};