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
METADATA_DIR = __dirname+'/.cache',
TOKEN_FILE_LOC = METADATA_DIR + 'token.json',
USER_FILE_LOC = METADATA_DIR + '/me.json',

getToken = function(){
   var fs = require('fs'),
   path = require('path'),
   buffer = null, 
   jsonBuffer = null;
   if(!path.existsSync(TOKEN_FILE_LOC)){
      return null;
   }
   buffer = fs.readFileSync(TOKEN_FILE_LOC);
   jsonBuffer = JSON.parse(buffer);
   return (jsonBuffer && jsonBuffer.token)? jsonBuffer.token : null;
},

getUser = function()
   {
   var fs = require('fs'),
   path = require('path'),
   buffer = null, 
   jsonBuffer = null;
   if(!path.existsSync(USER_FILE_LOC)){
      console.log("Error: The user file @ " + USER_FILE_LOC + " does not exist. Run apiReader.getUserData() to generate the user file.");
      return null;
   }
   buffer = fs.readFileSync(USER_FILE_LOC);
   jsonBuffer = JSON.parse(buffer);
   return jsonBuffer? jsonBuffer : null;
   },

getApps = function()
   {
   var user = getUser();
   if (!user){
      console.log("Error: Could not retrieve user data.");
      return null;
      }
   return user.apps;
   },
   
getAppIdList = function()
   {
   var result = [];
   var apps = getApps();
   if((!apps)||(!apps.all)){
      console.log("Error: Could not retrieve apps data.");
      return result;
      }
   for(var i=0; i<apps.all.length; i++){
      result.push(apps.all[i].id);
      }
   
   return result;
   
   }
;

module.exports = {
   getToken: getToken,
   getUser: getUser,
   getApps: getApps,
   getAppIdList: getAppIdList
};
