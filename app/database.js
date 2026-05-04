import * as SQLite from 'expo-sqlite';

let db; 
export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('kidAppFinals.db'); 
    await setupDatabase(db); 
  }
  return db; 
};


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

      CREATE TABLE IF NOT EXISTS UsageLimit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            childId INTEGER,
            parentId INTEGER,
            allowedHours INTEGER,
            usedMinutes INTEGER,
            lastDate TEXT
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

CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  quiz_name VARCHAR(100) NOT NULL,
  right_answers INT DEFAULT 0,
  wrong_answers INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
    `);

  } catch (error) {
    console.error("Error setting up database:", error);
  }
};


export const findById = async (id) => {

  try {

    const result = await db.getFirstAsync(
      `SELECT * FROM users WHERE id = ?`,
      [id]);

    if (result) {
      return result; 
    } else {
      return null; 
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

export const addQuizResult = async (userId, quiz_name, rights,wrongs) => {
  try {
    console.log("save kr rahy?");
    
    const result = await db.runAsync(
      `INSERT INTO quiz_results (user_id, quiz_name, right_answers, wrong_answers)
VALUES (?,?,?,?)`,
      [userId, quiz_name, rights,wrongs],
    );

  } catch (error) {
    console.error("Error inserting quiz-result:", error);
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
  
    const result = await db.getAllAsync(
      'SELECT learned_index FROM progress WHERE user_id = ? AND screen = ?',
      [userId, screenName]
    );
    if (result) {
      return result; 
    } else {
      return null; 
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



export const loginUser = async (email, password, name) => {

  try {
  

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
      return result; 
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const findByEmail = async (email) => {

  try {
   
    const result = await db.getFirstAsync(
      `SELECT * FROM users WHERE email = ? AND role = ?`,
      [email, 'PARENT']
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

export const findImageByEmail = async (email) => {

  try {
   
    const result = await db.getFirstAsync(
      `SELECT * FROM user_pictures WHERE user_id = ? `,
      [email]
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

export const findAllByEmail = async (email) => {

  try {
    
    const result = await db.getAllAsync(
      `SELECT * FROM users WHERE email = ? AND role = ?`,
      [email, 'kid']
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

export const findAllByKidId = async (kidId) => {

  try {
    
    const result = await db.getAllAsync(
      `SELECT * FROM quiz_results  WHERE user_id = ? `,
      [kidId]
    );
    console.log('result');
    console.log(result);
    
    
    if (result) {
      return result; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error during finding kid quizes results:', error);
    return null;
  }
};

const findAllUageByParentId = async (parentId) => {

  try {

    const result = await db.getAllAsync(
      `SELECT * FROM UsageLimit WHERE parentId = ? `,
      [parentId]
    );

    if (result) {
      return result;
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error during find all usage limit:', error);
    return null;
  }
};


export const insertKidUsageLimit = async (parentId, childId) => {
  const existing =await getUsageTime(parentId).allowedHours;
  let allowedHours = 0;
  if(existing && existing>0){
    allowedHours = existing;
  }else{
    allowedHours = 1
  }
  const today = new Date().toISOString().split("T")[0];

  try {
    const result = await db.runAsync(
      `INSERT INTO UsageLimit (childId, parentId, allowedHours, usedMinutes, lastDate) 
         VALUES (?, ?, ?, 0, ?);`,
      [childId, parentId, allowedHours, today]
    );
    return result;
  } catch (error) {
    console.error('Error inserting insertKidUsageLimit:', error);
  }

};

export const getUsageTime = async (parentId) => {

  try {

    const result = await db.getFirstAsync(
      `SELECT allowedHours 
   FROM UsageLimit 
   WHERE parentId = ? 
   ORDER BY id DESC 
   LIMIT 1 `,
      [parentId]
    );

    if (result) {
      return result; 
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error during getUsageTime:', error);
    return null;
  }
};

export const updateParentUsageTime = async (parentId,newLimit) => {
  try {
    const result = await db.runAsync(
      `UPDATE UsageLimit SET allowedHours = ? WHERE parentId = ?`,
      [newLimit,parentId]
    );
    return result;
  } catch (error) {
    console.error('Error updated child use  time:', error);
  }
};

export const updateKidUsageTime = async (childId) => {
  try {
    const result = await db.runAsync(
      `UPDATE UsageLimit SET usedMinutes = usedMinutes+1 WHERE childId = ?`,
      [childId]
    );
    return result;
  } catch (error) {
    console.error('Error updated child use  time:', error);
  }
};


export const getKidUsageTime = async (kidId) => {

  try {

    const result = await db.getFirstAsync(
      `SELECT allowedHours 
   FROM UsageLimit 
   WHERE childId = ?`,
      [kidId]
    );

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error during getUsageTime:', error);
    return null;
  }
};

export const getKidUsage = async (kidId) => {

  try {
    const result = await db.getFirstAsync(
      `SELECT * 
   FROM UsageLimit 
   WHERE childId = ?`,
      [kidId]
    );

    if (result) {
      return result; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error during getUsageOfKid:', error);
    return null;
  }
};

export const truncateTest = async () => {
  try {
    

  } catch (error) {
    console.error('Error truncateTest:', error);
  }

};

export const resetUsageTime = async (childId) => {
  try {
    const today = new Date().toISOString().split("T")[0]; 

    const row = await db.getFirstAsync(
      `SELECT * FROM UsageLimit WHERE childId = ? `,
      [childId]
    );

    if (row) {
      if (row.lastDate !== today) {
        await db.runAsync(
          `UPDATE UsageLimit 
       SET usedMinutes = 0, lastDate = ? 
       WHERE childId = ? `,
          [today, childId]
        );
        console.log("Reset usage for new day");
      } else {
        console.log("Same day, keep tracking usage");
      }
    }
  } catch (error) {
    console.error('Error updated child use  time:', error);
  }
};