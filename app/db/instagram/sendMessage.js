const { IgApiClient } = require('instagram-private-api');
const { HttpsProxyAgent } = require('https-proxy-agent');
 // Replace with your Instagram password
const RECIPIENT_USERNAME = 'kingtemaki'; // Replace with the recipient's username
// const RECIPIENT_USERNAME = 'jozef_djerba_'; // Replace with the recipient's username

// async function sendMessage(sendModel,message) {
//
//   const MESSAGE = message;
//   const recipients = sendModel.dividedProfiles.map(value => value.dataValues.userName);
//   const USERNAME = sendModel.login.userName; // Replace with your Instagram username
//   const PASSWORD = sendModel.login.password;
//   const proxy = sendModel.proxy;
//
//   const browserArgs = [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--disable-dev-shm-usage', // Reduce memory usage
//     '--disable-gpu', // Disable GPU for headless mode
//     '--disable-background-timer-throttling', // Prevent throttling in the background
//     '--disable-backgrounding-occluded-windows', // Ensure consistent execution in the background
//     '--disable-renderer-backgrounding', // Keep renderer threads active
//   ];
//
//   // Use the proxy only if useProxy is true
//   if (proxy && proxy.dataValues.address && proxy.dataValues.port && proxy.dataValues.userName && proxy.dataValues.password) {
//     const proxyUrl = `${proxy.dataValues.address}:${proxy.dataValues.port}`;
//     browserArgs.push(`--proxy-server=${proxyUrl}`);
//   }
//   const browser = await puppeteer.launch({
//     headless: true, // Set to true for headless mode
//     args: browserArgs,
//   });
//
//
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1200, height: 800 });
//   // Block images and videos from loading
//   await page.setRequestInterception(true);
//   page.on('request', (request) => {
//     const resourceType = request.resourceType();
//     if (resourceType === 'image' || resourceType === 'media' || resourceType === 'video') {
//       request.abort(); // Abort image/video/media requests
//     } else {
//       request.continue(); // Continue with other requests
//     }
//   });
//
//   // Authenticate proxy
//   console.log('proxy && proxy.dataValues.username && proxy.dataValues.password')
//   console.log(proxy && proxy.dataValues.userName && proxy.dataValues.password)
//   if (proxy && proxy.dataValues.userName && proxy.dataValues.password) {
//     console.log('eeeeeeeeeeeeeeeeeeeee')
//     await page.authenticate({
//     username: proxy.dataValues.userName,
//     password: proxy.dataValues.password
//   });
//     }
//   try {
//     // Navigate to Instagram
//     await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });
//
//     // Log in to Instagram
//     await page.type('input[name="username"]', USERNAME, { delay: 100 });
//     await page.type('input[name="password"]', PASSWORD, { delay: 100 });
//     await page.click('button[type="submit"]');
//     await page.waitForNavigation({ waitUntil: 'networkidle2' });
//
//     // Find and click the "Not Now" button inside the main tag
//     const buttonClicked = await page.evaluate(() => {
//       const main = document.querySelector('main'); // Select the <main> element with role="main"
//       if (main) {
//         console.log('main')
//         // Find the div with role="button" and text "Not Now" inside the <main> element
//         const buttonDiv = Array.from(main.querySelectorAll('div[role="button"]')).find(
//           (div) => div.textContent.trim() === 'Not Now'
//         );
//         if (buttonDiv) {
//           buttonDiv.click(); // Click the "Not Now" button
//           return true;
//         }
//       }
//       return false;
//     });
//     if (buttonClicked) {
//       console.log('"Not Now" button clicked.');
//     } else {
//       console.log('"Not Now" button not found inside the main tag.');
//     }
//     // Go to recipient's profile
//     for (const RECIPIENT_USERNAME of recipients) {
//       console.log('RECIPIENT_USERNAME')
//       console.log(RECIPIENT_USERNAME)
//
//       await page.goto(`https://www.instagram.com/${RECIPIENT_USERNAME}/`, {waitUntil: 'networkidle2'});
//       await page.evaluate(() => {
//         // Click on the div with role="button" inside the header
//         const header = document.querySelector('header'); // Select the header
//         if (header) {
//           // Find the div with role="button" containing the text "Message"
//           const buttonDiv = Array.from(header.querySelectorAll('div[role="button"]')).find(
//             (div) => div.textContent.trim() === 'Message'
//           );
//
//           if (buttonDiv) {
//             buttonDiv.click(); // Click the div
//             return true; // Indicate that the click action succeeded
//           }
//         }
//
//         console.log('No button with role="button" found in the header.');
//       });
//
//
//       // Handle "Turn On Notifications" popup
//       // const dialogExists = await page.waitForSelector('div[role="dialog"]', {timeout: 3000})
//       //   .then(() => true)
//       //   .catch(() => false);
//
//       // if (dialogExists) {
//       //   console.log('Dialog appeared. Checking for "Not Now" button...');
//       //
//       //   // Find and click the "Not Now" button inside the dialog
//       //   const notNowButton = await page.evaluate(() => {
//       //     const dialog = document.querySelector('div[role="dialog"]');
//       //     if (dialog) {
//       //       const button = Array.from(dialog.querySelectorAll('button')).find(
//       //         (btn) => btn.textContent.trim() === 'Not Now'
//       //       );
//       //       if (button) {
//       //         button.click(); // Click the "Not Now" button
//       //         return true;
//       //       }
//       //     }
//       //     return false;
//       //   });
//       //
//       //   if (notNowButton) {
//       //     console.log('"Not Now" button clicked.');
//       //
//       //   } else {
//       //     console.log('"Not Now" button not found in the dialog.');
//       //   }
//       // } else {
//       //   console.log('No notification dialog appeared within the timeout period.');
//       // }
//       // Type and send the message
//       await page.waitForSelector('[aria-label="Message"]');
//       await page.type('[aria-label="Message"]', MESSAGE, {delay: 100});
//       await page.keyboard.press('Enter');
//     }
//     console.log('Message sent successfully!');
//   } catch (error) {
//     console.error('An error occurred:', error);
//   } finally {
//     await browser.close();
//   }
// }
async function sendMessage(sendModel, message) {

  const recipients = sendModel.dividedProfiles.map(value => value.dataValues.userName);
  console.log('recipients')
  console.log(recipients)
  const USERNAME = sendModel.login.userName; // Replace with your Instagram username
  const PASSWORD = sendModel.login.password;
  console.log(USERNAME)
  console.log(PASSWORD)
  const proxy = sendModel.proxy;
  const ig = new IgApiClient();
  const proxyUrl = 'http://'+proxy.dataValues.userName +':'+proxy.dataValues.password+'@'+proxy.dataValues.address+':'+proxy.dataValues.port;
  console.log('proxyUrl')
  console.log(proxyUrl)
  ig.request.defaults.agent = new HttpsProxyAgent(proxyUrl);

  ig.state.generateDevice(USERNAME);

  // Log in to Instagram
  await ig.account.login(USERNAME, PASSWORD);

  // List of usernames to send DMs to
  // const recipients = ['username1', 'username2', 'username3'];

  // Message to send

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  for (const recipient of recipients) {
    try {
      const userId = await ig.user.getIdByUsername(recipient);
      const thread = await ig.entity.directThread([userId]);
      await thread.broadcastText(message);
      console.log(`Message sent to ${recipient}`);
      await delay(2000); // Wait 2 seconds before sending the next message
    } catch (error) {
      console.error(`Failed to send message to ${recipient}:`, error.message);
    }
  }

}
// async function sendMessage(sendModel, message) {
//   const MESSAGE = message;
//   const recipients = sendModel.dividedProfiles.map(value => value.dataValues.userName);
//   const USERNAME = sendModel.login.userName;
//   const PASSWORD = sendModel.login.password;
//   const proxy = sendModel.proxy;
//
//   const browserArgs = [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--disable-dev-shm-usage',
//     '--disable-gpu',
//     '--disable-background-timer-throttling',
//     '--disable-backgrounding-occluded-windows',
//     '--disable-renderer-backgrounding',
//   ];
//
//   if (proxy && proxy.dataValues.address && proxy.dataValues.port) {
//     const proxyUrl = `${proxy.dataValues.address}:${proxy.dataValues.port}`;
//     browserArgs.push(`--proxy-server=${proxyUrl}`);
//   }
//
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: browserArgs,
//   });
//
//
//
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1200, height: 800 });
//
//   // Block non-essential resources
//   await page.setRequestInterception(true);
//   page.on('request', request => {
//     const resourceType = request.resourceType();
//     if (['image', 'media', 'video'].includes(resourceType)) {
//       request.abort();
//     } else {
//       request.continue();
//     }
//   });
//   if (proxy && proxy.dataValues.userName && proxy.dataValues.password) {
//     console.log('eeeeeeeeeeeeeeeeeeeee')
//     await page.authenticate({
//       username: proxy.dataValues.userName,
//       password: proxy.dataValues.password
//     });
//   }
//
//   try {
//     // Navigate to Instagram and log in
//     await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });
//     await page.type('input[name="username"]', USERNAME);
//     await page.type('input[name="password"]', PASSWORD);
//     await page.click('button[type="submit"]');
//     await page.waitForNavigation({ waitUntil: 'networkidle2' });
//
//     // Handle "Not Now" button
//     await page.evaluate(() => {
//       const button = Array.from(document.querySelectorAll('button')).find(
//         btn => btn.textContent.trim() === 'Not Now'
//       );
//       if (button) button.click();
//     });
//
//     // Send messages in parallel
//     await Promise.all(
//       recipients.map(async recipient => {
//         const recipientPage = await browser.newPage();
//         await recipientPage.goto(`https://www.instagram.com/${recipient}/`, { waitUntil: 'networkidle2' });
//
//         const notificationPopupSelector = 'div[role="dialog"]';
//         const popupWaitTimeout = 2000; // Adjust the timeout as needed (in milliseconds)
//
//
//         const messageButtonClicked = await recipientPage.evaluate(() => {
//           const header = document.querySelector('header');
//           if (header) {
//             const button = Array.from(header.querySelectorAll('div[role="button"]')).find(
//               div => div.textContent.trim() === 'Message'
//             );
//             if (button) {
//               button.click();
//               return true;
//             }
//           }
//           return false;
//         });
//
//         if (messageButtonClicked) {
//           const notificationPopupDismissed = await Promise.race([
//             recipientPage.waitForSelector(notificationPopupSelector, { timeout: popupWaitTimeout })
//               .then(async () => {
//                 console.log('Notification popup detected.');
//                 // Dismiss the popup
//                 const dismissed = await recipientPage.evaluate(() => {
//                   const dialog = document.querySelector('div[role="dialog"]');
//                   if (dialog) {
//                     const button = Array.from(dialog.querySelectorAll('button')).find(
//                       btn => btn.textContent.trim() === 'Not Now'
//                     );
//                     if (button) {
//                       button.click();
//                       return true;
//                     }
//                   }
//                   return false;
//                 });
//                 return dismissed;
//               })
//               .catch(() => false), // If no popup appears within the timeout, proceed
//           ]);
//           await recipientPage.waitForSelector('[aria-label="Message"]');
//           await recipientPage.type('[aria-label="Message"]', MESSAGE);
//           await recipientPage.keyboard.press('Enter');
//         }
//
//         await recipientPage.close();
//       })
//     );
//
//     console.log('Messages sent successfully!');
//   } catch (error) {
//     console.error('An error occurred:', error);
//   } finally {
//     await browser.close();
//   }
// }


module.exports = { sendMessage };
