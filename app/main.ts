import {app, BrowserWindow, screen,ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import {sendMessage} from "./db/instagram/sendMessage";
import {Op} from "sequelize";
// import {SendModel} from "./db/model/sendModel";
const User = require('./db/model/User');
const ProfileToDmModel = require('./db/model/ProfileToDmModel');
const Proxy = require('./db/model/Proxy'); // Adjust the path to your Proxy model
// import pLimit from 'p-limit';
const sequelize = require('./db/db');
// const {  } = require('electron/main');
let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
    // win.webContents.openDevTools();

  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));
  app.whenReady().then(async () => {
    await sequelize.sync(); // Synchronize models with DB
    // Your Electron app logic
  });
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  ipcMain.on('email', async (e, opt) => {
    // const data = await TodoService.handleTodoFormSubmit(opt);
    // mainWindow.webContents.send('task:added', { task: data });
    console.log('email')
  });
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

//*************************************************Profile ************************

// Listen for "load-profiles" event
  ipcMain.on('load-profiles', async (event) => {
    try {
      // Retrieve all profiles from the database
      const profiles = await ProfileToDmModel.findAll({ attributes: ['id', 'userName', 'name'] });

      // Send the retrieved profiles back to the renderer process
      event.reply('load-profiles-reply', {
        success: true,
        message: 'Profiles loaded successfully.',
        profiles :profiles ,
      });
    } catch (error) {
      console.error('Error loading profiles:', error);
      event.reply('load-profiles-reply', {
        success: false,
        message: 'Failed to load profiles.',
        error,
      });
    }
  });

  // Listen for "add-profiles" event
  ipcMain.on('add-profiles', async (event, profileList) => {
    try {
      // Add the profiles if they don't already exist
      await ProfileToDmModel.addProfilesIfNotExist(profileList);

      // Retrieve the updated list of all profiles
      const allProfiles = await ProfileToDmModel.findAll({
        attributes: ['id', 'userName', 'name'], // Select only necessary fields
      });

      // Send the updated profile list back to the renderer
      event.reply('add-profiles-reply', {
        success: true,
        message: 'Profiles added successfully.',
        profiles: allProfiles,
      });
    } catch (error) {
      console.error('Error adding profiles:', error);
      event.reply('add-profiles-reply', {
        success: false,
        message: 'Error adding profiles.',
        error,
      });
    }
  });

  // Listen for "clear-profiles" event
  ipcMain.on('clear-profiles', async (event) => {
    try {
      // Clear all profiles
      await ProfileToDmModel.cleanProfiles();
      event.reply('clear-profiles-reply', {
        success: true,
        message: 'All profiles cleared successfully.',
      });
    } catch (error) {
      console.error('Error clearing profiles:', error);
      event.reply('clear-profiles-reply', {
        success: false,
        message: 'Error clearing profiles.',
        error,
      });
    }
  });
//****************************************************User ********************************
  ipcMain.on('load-users', async (event) => {
    try {
      // Retrieve all users from the database (replace this with actual logic)
      const users = await User.findAll({ attributes: ['id', 'userName', 'password'] });

      // Send the retrieved users back to the renderer process
      event.reply('load-users-reply', {
        success: true,
        message: 'Users loaded successfully.',
        users: users,
      });
    } catch (error) {
      console.error('Error loading users:', error);
      event.reply('load-users-reply', {
        success: false,
        message: 'Failed to load users.',
      });
    }
  });

// Listen for "add-users" event
  ipcMain.on('add-users', async (event, userList) => {
    try {
      // Add the users if they don't already exist
      console.log('userList')
      console.log(userList)
      await User.addUsersIfNotExist(userList);

      // Retrieve the updated list of all users
      const allUsers = await User.findAll({
        attributes: ['password', 'userName'], // Select only necessary fields
      });
      console.log('allUsers')
      console.log(allUsers)

      // Send the updated user list back to the renderer
      event.reply('add-users-reply', {
        success: true,
        message: 'Users added successfully.',
        users: allUsers
      });
    } catch (error) {
      console.error('Error adding users:', error);
      event.reply('add-users-reply', {
        success: false,
        message: 'Error adding users.',
        error
      });
    }
  });

// Listen for "clear-users" event
  ipcMain.on('clear-users', async (event) => {
    try {
      await User.clearAllUsers();
      event.reply('clear-users-reply', { success: true, message: 'All users cleared successfully.' });
    } catch (error) {
      console.error('Error clearing users:', error);
      event.reply('clear-users-reply', { success: false, message: 'Error clearing users.', error });
    }
  });
//*********************************************** PROXY *****************************
  ipcMain.on('load-proxies', async (event) => {
    try {
      // Retrieve all proxies from the database
      const proxies = await Proxy.findAll({
        attributes: ['id', 'address', 'port', 'userName', 'password'],
      });

      // Send the retrieved proxies back to the renderer process
      event.reply('load-proxies-reply', {
        success: true,
        message: 'Proxies loaded successfully.',
        proxies: proxies,
      });
    } catch (error) {
      console.error('Error loading proxies:', error);
      event.reply('load-proxies-reply', {
        success: false,
        message: 'Failed to load proxies.',
        error,
      });
    }
  });
// Add proxies if they don't exist
  ipcMain.on('add-proxies', async (event, proxyList) => {
    try {
      // Add proxies to the database
      for (const proxy of proxyList) {
        await Proxy.addProxyIfNotExist(proxy);
      }

      // Retrieve the updated list of all proxies
      const allProxies = await Proxy.findAll({
        attributes: ['id', 'address', 'port', 'userName', 'password'],
      });

      // Send the updated proxy list back to the renderer process
      event.reply('add-proxies-reply', {
        success: true,
        message: 'Proxies added successfully.',
        proxies: allProxies,
      });
    } catch (error) {
      console.error('Error adding proxies:', error);
      event.reply('add-proxies-reply', {
        success: false,
        message: 'Error adding proxies.',
        error,
      });
    }
  });
  // Clear all proxies
  ipcMain.on('clear-proxies', async (event) => {
    try {
      const deletedCount = await Proxy.clearAllProxies();

      // Send confirmation back to the renderer process
      event.reply('clear-proxies-reply', {
        success: true,
        message: `All ${deletedCount} proxies cleared successfully.`,
      });
    } catch (error) {
      console.error('Error clearing proxies:', error);
      event.reply('clear-proxies-reply', {
        success: false,
        message: 'Error clearing proxies.',
        error,
      });
    }
  });

  const createSendModels = async () => {
    try {
      // Fetch data from the database
      const profilesToDm = await ProfileToDmModel.findAll({
        attributes: ['userName', 'name'],
      });
      const logins = await User.findAll({
        attributes: ['userName', 'password'],
      });
      const allProxies = await Proxy.findAll({
        attributes: ['id', 'address', 'port','userName','password'],
      });

      // Divide profilesToDm evenly among logins
      const chunkSize = Math.ceil(profilesToDm.length / logins.length); // Determine chunk size
      const dividedProfiles = logins.map((_, index) => {
        return profilesToDm.slice(index * chunkSize, (index + 1) * chunkSize);
      });

      // Create SendModel for each login
      const sendModels = logins.map((login, index) => {
        const proxy = allProxies[index % allProxies.length]; // Assign proxies in a round-robin fashion
        return   {'login':login,'dividedProfiles':dividedProfiles[index] || [] ,'proxy':proxy
        };
      });

      return sendModels;
    } catch (error) {
      console.error('Error creating SendModels:', error);
      throw error;
    }
  };

// // Example Usage
//   createSendModels().then((sendModels) => {
//     console.log('SendModels:', sendModels);
//   }).catch((error) => {
//     console.error('Error:', error);
//   });

  function processTasksConcurrently(tasks, concurrency) {
    let index = 0; // Track the current task index
    let activeTasks = 0; // Track the number of active tasks
    const results = []; // Store results of all tasks
    const totalTasks = tasks.length;

    return new Promise((resolve, reject) => {
      // Function to process the next task
      function processNext() {
        if (index >= totalTasks && activeTasks === 0) {
          // All tasks completed
          return resolve(results);
        }

        // If no tasks are left or concurrency limit is reached, do nothing
        if (index >= totalTasks || activeTasks >= concurrency) {
          return;
        }

        // Start the next task
        const taskIndex = index++;
        activeTasks++;
        tasks[taskIndex]()
          .then((result) => {
            results[taskIndex] = result;
            activeTasks--;
            processNext(); // Trigger the next task
          })
          .catch((error) => {
            reject(error); // Stop all on error
          });

        // Continue to fill the thread pool
        processNext();
      }

      // Start initial tasks up to the concurrency limit
      for (let i = 0; i < concurrency; i++) {
        processNext();
      }
    });
  }
  ipcMain.on('send-message', (event, message) => {
    console.log('Received message:', message);
    createSendModels().then((sendModels) => {
      const tasks = sendModels.map(value => () => sendMessage(value, message));
      // Process tasks with a concurrency of 5
      processTasksConcurrently(tasks, 5)
        .then(() => {
          event.reply('message-received', {
            success: true,
            message: 'Message received successfully!.',
          });
        })
        .catch(error => {
          console.error('Error sending messages:', error);
          event.reply('message-received', {
            success: false,
            message: 'Error clearing proxies.',
            error,
          });
        });

    }).catch((error) => {
      console.error('Error:', error);
    });


    // Optionally, send a response back to the renderer
  });
} catch (e) {
  // Catch Error
  // throw e;
}
