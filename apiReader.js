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
_URL = 'build.phonegap.com',


/******************************************************************
 * Executes the GET Phonegap API call,
 * and writes the output in a JSON-formatted file
 ******************************************************************/
getApiData = function(token, apiCall, callback){
   var
   https = require('https'), 
   options = null;
   
   options = {
      host: _URL,
      path: '/api/v1/' + apiCall + '?auth_token='+token
      };
   
   https.get(options, function(res){
      var replyData = '';
      res.on('data', function(data){
         replyData+= data;
         });
      res.on('end', function(){
         callback.success(JSON.parse(replyData));
         });
      }).on('error', function(e){
         console.log("AJAX Err. Message: " + e.message);
         if(callback.error && (callback.error instanceof Function)){callback.error(e.message);}
      });
   },

/******************************************************************
 * Downloads the file at the given URL and saves it in the provided
 * path.
 ******************************************************************/   
downloadFile = function(url, outputFilepath, callback){
   var req = require('request'),
   fs = require('fs');
   req.get(url).pipe(fs.createWriteStream(outputFilepath)).on('close', callback.success);//.on('end', function(){console.info("Detected end of stream"); callback.success();});
   
//   writeStream.on('error', function(e){
//      console.info("Error writing ")
//      console.log("I/O Err. Message: " + e.message);
//      if(callback.error && (callback.error instanceof Function)){callback.error(e.message);}
//   });
   
   
   
   
},
   
/******************************************************************
 *  Get a JSON-encoded representation of the authenticated user, 
 *  as well as a listing of associated resources.
 *  
 *  This should be the starting point for applications traversing 
 *  the PhoneGap Build API. It is aliased to 
 *  https://build.phonegap.com/api/v1.
 *  
 *  GET https://build.phonegap.com/api/v1/me 
 *****************************************************************/   
getUser = function(token, callback){
   getApiData(token, 'me', callback);
},

/******************************************************************
 *  Get a JSON-encoded representation of the authenticated user's 
 *  apps.
 *  
 *  API clients can follow the link attribute for each app to get 
 *  further details, including the associated signing keys and 
 *  collaborators.
 *  
 *  GET https://build.phonegap.com/api/v1/apps 
 *****************************************************************/ 
getApps = function(token, callback){
   getApiData(token, 'apps', callback);
   },

   
/******************************************************************
 *  Get a JSON-encoded representation of a particular app, if the 
 *  authenticated user has permission to access it.
 *  
 *  In addition to the fields provided in the list of all apps, 
 *  this detail view includes:
 *  
 *  keys: all of the keys that the app is currently being built with. 
 *    This will include the owner's default key for a platform, 
 *    if selected
 *    
 *  collaborators: each person who has access to this app, along 
 *    with their role, if the authenticated user is the owner of 
 *    the app. Collaborators who are registered with PhoneGap Build 
 *    are listed under active; collaborators you have invited who 
 *    have not yet created an account are listed as pending.
 *  
 *  GET https://build.phonegap.com/api/v1/apps/:id 
 *****************************************************************/
getAppById = function(token, appId, callback){
   getApiData(token, 'apps/' + appId, callback);
   },

/******************************************************************
 *  Get a JSON-encoded list of all the signing keys associated with 
 *  your account.
 *  
 *  This returns a short listing of all the associated keys--it's 
 *  very similar to the list you'll see when requesting /api/v1/me
 *  
 *  GET https://build.phonegap.com/api/v1/keys 
 *****************************************************************/
getKeys = function(token, callback){
   getApiData(token, 'keys', callback);
   },
   
   
/******************************************************************
 *  Get a JSON-encoded list of all the signing keys associated with 
 *  your account, for a specific platform. That platform can be one
 *  of ios, android, or blackberry.
 *  
 *  GET https://build.phonegap.com/api/v1/keys/:platform 
 *****************************************************************/
getPlatformKeys = function(platform){
   getApiData('keys/' + platform, METADATA_DIR + '/keys_' + platform + '.json');
   },
   
/******************************************************************
 *  Get a JSON-encoded representation of a single signing key.
 *  
 *  GET https://build.phonegap.com/api/v1/keys/:platform/:appId 
 *****************************************************************/
getPlatformKeyById = function(platform, appId){
   getApiData('keys/' + platform + '/' + appId, METADATA_DIR + '/keys_' + platform + '_' + appId + '.json');
   },

/******************************************************************
 *  Download the app package for the given platform; available 
 *  platforms are android, blackberry, ios, symbian, webos and 
 *  winphone.
 *  
 *  In the successful case, this API method will return a 302 
 *  redirect to the application binary - the actual body of the 
 *  response will point to the resource's correct location:
 *  
 *  If using the optional argument for the download location,
 *  please ensure that you are using the right extension for
 *  the platform you are downloading. 
 *  
 *  apk for Android
 *  ipa for iOS
 *  ipk for webOS
 *  jad for unsigned BlackBerry builds; zip if you've uploaded your BlackBerry signing keys
 *  wgz for Symbian
 *  xap for Windows Phone
 *  
 *  GET https://build.phonegap.com/api/v1/apps/:id/:platform 
 *****************************************************************/
downloadApp = function(token, appId, platform, outputFilepath, callback){
   var url= 'https://' + _URL + '/api/v1/apps/' + appId + '/' + platform + '?auth_token='+token;
   downloadFile(url, outputFilepath, callback);
   },
   
/*****************************************************************
 * Get the main icon associated with an app - this is either the 
 * biggest icon specified in your config.xml file, or an icon you 
 * have uploaded through the API or the PhoneGap Build web interface.
 * 
 * GET https://build.phonegap.com/api/v1/apps/:id/:icon
*****************************************************************/
downloadIcon = function(token, appId, outputFilepath, callback){
   var url= 'https://' + _URL + '/api/v1/apps/' + appId + '/icon';
   downloadFile(url, outputFilepath, callback);
   }
   ;

/******************************************************************
 *  Module Public Members
 *****************************************************************/
module.exports = {
   getUserData: getUser,
   getAppsData: getApps,
   getAppDataById: getAppById,
   getKeysData: getKeys,
   downloadApp: downloadApp
};