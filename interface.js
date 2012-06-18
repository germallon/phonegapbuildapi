var 
   _program = require('commander'),
   _req = require('request'),
   _apiReader = require('./apiReader'),
   
   URL = 'https://build.phonegap.com',
   
   _MENU = 
      {
      getUserData: {name: "Get User Data", idx: 0},
      getAppsData: {name: "Get All Apps Data", idx: 1},
      getAppDataById: {name: "Get App Data by ID", idx: 2},
      getKeysData: {name: "Get Keys Data", idx: 3},
      downloadApp: {name: "Download App", idx: 4},
      quit:  {name: "Quit", idx: 5}
      },
      
   _PLATFORMLIST = {
      android:    {name:"android", idx: 0},
      blackberry: {name:"blackberry", idx: 1},
      ios:        {name:"ios", idx: 2},
      symbian:    {name:"symbian", idx: 3},
      webos:      {name:"webos", idx: 4},
      winphone:   {name:"winphone", idx: 5}
   },
   
   _token = null,
   
/*
 * Ends the program
 */
quit = function(){
   process.stdin.destroy();
},

stdErrorHandler = function(errorMsg){
   if(errorMsg){
      console.log(errorMsg);
   }
   else{
      console.log("Unknown Error");
   }
   showMenu();
},


doMenuOption = function (menuOption){
   var i;
   switch(menuOption){
      case _MENU.getUserData.idx:
         _apiReader.getUserData(_token, {success: function(data){
            console.log(data);
            showMenu();
            }, error: stdErrorHandler});
         break;
         
      case _MENU.getAppsData.idx:
         _apiReader.getAppsData(_token, {success: function(data){
            console.log(data);
            showMenu();
            }, error: stdErrorHandler});
         break;
      case _MENU.getAppDataById.idx:
         _program.prompt("App ID: ", function(appId){
            _apiReader.getAppDataById(_token, appId, {success: function(data){
               console.log(data);
               showMenu();
               }, error: stdErrorHandler});
         });
         break;
      case _MENU.getKeysData.idx:
         _apiReader.getKeysData(_token, {success: function(data){
            console.log(data);
            showMenu();
            }, error: stdErrorHandler});
         break;
      case _MENU.downloadApp.idx:
         _program.prompt("App ID: ", function(appId){
            
            var platformList=[], platformKeys = Object.keys(_PLATFORMLIST);
            for(i=0; i<platformKeys.length; i++){platformList.push(_PLATFORMLIST[platformKeys[i]].name);}
            
            console.log('\nPlatform:');
            _program.choose(platformList, function(platformIdx){
            
               _program.prompt("Output filepath: ", function(outFpath){
                  _apiReader.downloadApp(_token, appId, platformList[platformIdx], outFpath, {success: function(data){
                     console.log("File successfully downloaded to: " + data);
                     showMenu();
                     }, error: stdErrorHandler});
                  });
               });
            
            });
            
            
      
      
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


