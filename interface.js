var 
   _program = require('commander'),
   _req = require('request'),
   _dataClient = require('./dataClient');
   URL = 'https://build.phonegap.com',
   _outputFile, 
   
   _MENU = 
      {
      getUserData: {name: "Get User Data", idx: 0},
      getAppsData: {name: "Get All Apps Data", idx: 1},
      getAppDataById: {name: "Get App Data by ID", idx: 2},
      getKeysData: {name: "Get Keys Data", idx: 3},
      downloadApp: {name: "Download App", idx: 4},
      quit:  {name: "Quit", idx: 5}
      }
   
   _token = null,
   
/*
 * Ends the program
 */
quit = function(){
   process.stdin.destroy();
},

doMenuOption = function (menuOption){
   switch(menuOption){
   case _MENU.getUserData.idx:
      _dataClient.getUserData(_token, );      
      break;
   case getAppsData.idx:
      break;
   case getAppDataById.idx:
      break;
   case getKeysData.idx:
      break;
   case downloadApp.idx:
      break;
   case _MENU.quit.idx:
      quit();
      break;
   default:
      showMenu();
      break;
   }
}

showMenu = function(){
   
   console.log('\n\nPlease choose one of the following options');
   var menuList = [], menuKeys = Object.keys(_MENU);
   for(var i=0; i<menuKeys.length; i++){menuList.push(_MENU[menuKeys[i]].name);}
   
   _program.choose(menuList, function(menuOption){
      doMenuOption(menuOption);
   });
},

doLogin = function(loginCredentials){
   auth = "Basic " + new Buffer(loginCredentials).toString("base64");
   options = {  
      url : URL+"/token",    
      headers : { "Authorization" : auth } 
      }; 
   
   _req.post(options, function (error, response, body) {
      if((error!==null) || (response.statusCode!=200))
         {
         console.log("AJAX error.  Your request could not be completed. Please verify your login credentials and network access.");   
         quit();
         return;
         }
      _token = JSON.parse(body).token;
      showMenu();
   });
},

/*Gets login credentials */
getLoginCredentials = function(){
   _program.prompt("Phonegap Build Username: ", function(username){
      _program.password("Password: ", "*", function(password){
         pwd = password.trim();
         doLogin(username+":"+password);
      });
   });
},

init = function(){
   getLoginCredentials();
};

_program
   .version('0.0.1')
   .option('-u, --user <username:pwd>', 'Specify login credentials', String, '')
   .parse(process.argv);

if(_program.user){
   doLogin(_program.user);
}
else{
   init();
}


