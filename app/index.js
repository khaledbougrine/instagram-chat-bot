const ig = require("./db/instagram/instagram");
const msgsNumber = 10;
const TimeBetweenMessages = 10000;
const pathToimage = './picture.png';
let message ="Hello ";
const USERNAME = 'khaled123456739'; // Replace with your Instagram username
const PASSWORD = '3Alouch@1998.';
(async ()=>{

        await ig.initialize();

        if( await ig.load_cookies() )
        {
          console.log('cookies loaded succesfully :D');
        }
        else
        {
          console.log("couldn't load cookies.. loging and creating new cookies : ");
          await ig.login(USERNAME, PASSWORD);
          await ig.save_cookies();
        }
        // await ig.followFollwersOfAUser(600, 40000, "kingtemaki");
        // await ig.extract_users("blabla", MyprofileUrl);
        // await ig.loadusers();
        await ig.sendMessages(message, null, TimeBetweenMessages, msgsNumber);



    debugger;
})()

//"//h4/button[contains(text(),'View all')]"
