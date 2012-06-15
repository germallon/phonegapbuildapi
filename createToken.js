/**************************************************************************
 * Copyright (c) 2012 Adtec Productions, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 *      
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **************************************************************************/

var 
   URL = 'https://build.phonegap.com',
   METADATA_DIR = __dirname + '/.cache',
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
            return;
            }
         var fs = require('fs'),
         createDirAndWriteFile = function(){
            fs.mkdirSync(METADATA_DIR, 0777);
            fs.writeFileSync(OUTPUT_FILE, body, 'utf8');
            console.info("Authentication token created succesfully!");
         };
         
         try{
            var path = require('path');
            if(path.existsSync(METADATA_DIR)){
               var stats =  fs.lstatSync(METADATA_DIR);
               if(stats.isDirectory()){ //Directory exists.. Ready to write file
                  fs.writeFileSync(OUTPUT_FILE, body, 'utf8');
                  console.info("Authentication token created succesfully!");
               }
               else{
                  createDirAndWriteFile();
               }
            }
            else{ //Directory does not exists. Create directory and then write file.
               createDirAndWriteFile();
            }
         }catch(e){
            console.log(e);
            console.log("File System Error.  Please ensure you have write permissions in " + METADATA_DIR);
         }
         
         terminate();
         }
      );
   });
      
});
