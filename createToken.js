/**************************************************************************
 * Copyright (c) 2012 Adtec Productions, Inc.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Lesser GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 * Lesser GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License 
 * along with this program.  If not, see http://www.gnu.org/licenses/
 *************************************************************************/

var 
   URL = 'https://build.phonegap.com',
   METADATA_DIR = __dirname + '/metadata',
   OUTPUT_FILE = METADATA_DIR + '/token.json',
   req = require('request'),
   rl = require('readline'),
   fs = require('fs'),
   options = null,
   username = null,
   password = null,
   auth = null,
   rlInterface = null,
   terminate
   ;




terminate = function()
   {
   rlInterface.close();
   process.stdin.destroy();   
   };

   
rlInterface = rl.createInterface(process.stdin, process.stdout, null);

rlInterface.question("Please enter your Phonegap Build username: ", function(inputUsername){
   
   username = inputUsername.trim();
   
   rlInterface.question("Please enter your Phonegap Build password: ", function(pwd){
   
      password = pwd.trim();
      auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
      
      options = {  
         url : URL+"/token",    
         headers : { "Authorization" : auth } 
         }; 
      
      req.post(options, function (error, response, body) {
         
         if((error!==null) || (response.statusCode!=200))
            {
            console.log("AJAX error.  Your request could not be completed. Please verify your login credentials and network access.");   
            terminate();
            }
         var fs = require('fs');
         fs.writeFileSync(OUTPUT_FILE, body, 'utf8');
         
         terminate();
         }
      );
   });
      
});
