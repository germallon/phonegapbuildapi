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
METADATA_DIR = __dirname + '/metadata',

dataClient = require('./dataClient'),


/******************************************************************
 * Executes the GET Phonegap API call,
 * and writes the output in a JSON-formatted file
 ******************************************************************/
getApiData = function(apiCall, outputFile){
   var
   token = dataClient.getToken(),
   https = require('https'), 
   options = null;
   if(!token){
      console.log("Error: Unknown authentication token.");
      return;
      }

   options = {
      host: 'build.phonegap.com',
      path: '/api/v1/' + apiCall + '?auth_token='+token
      };
   
   https.get(options, function(res){
      res.on('data', function(data){
         var fs = require('fs');
         fs.writeFileSync(outputFile, data, 'utf8');
         });
      }).on('error', function(e){
         console.log("AJAX Err. Message: " + e.message);
      });
   },

/******************************************************************
 * Downloads the file at the given URL and saves it in the provided
 * path.
 ******************************************************************/   
downloadFile = function(url, outputFilepath){
   var req = require('request'),
   fs = require('fs');
   req.get(url).pipe(fs.createWriteStream(outputFilepath));
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
getUser = function(){
   getApiData('me', METADATA_DIR + '/me.json');
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
getApps = function(){
   getApiData('apps', METADATA_DIR + '/apps.json');
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
getAppById = function(appId){
   getApiData('apps/' + appId, METADATA_DIR + '/app_' + appId + '.json');
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
getKeys = function(){
   getApiData('keys', METADATA_DIR + '/keys.json');
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
downloadApp = function(appId, platform, outputFilepath){
   var tools = require('./tools'),
   token = dataClient.getToken(),
   url = null;
   
   if(!token){
      console.log("Error: Unknown authentication token.");
      return;
      } 
   if(!outputFilepath){ //set default name if output file is not given
      outputFilepath = './' + platform + "_ " + appId + "." + tools.getExtByPlatform(platform);
      } 
   url= 'https://build.phonegap.com/api/v1/apps/' + appId + '/' + platform + '?auth_token='+token;
   downloadFile(url, outputFilepath);
   },
   
/*****************************************************************
 * Get the main icon associated with an app - this is either the 
 * biggest icon specified in your config.xml file, or an icon you 
 * have uploaded through the API or the PhoneGap Build web interface.
 * 
 * GET https://build.phonegap.com/api/v1/apps/:id/:icon
*****************************************************************/
downloadIcon = function(appId, outputFilepath){
   var token = dataClient.getToken(),
   url = null;
   
   if(!token){
      console.log("Error: Unknown authentication token.");
      return;
      } 
   if(!outputFilepath){ //set default name if output file is not given
      outputFilepath = './icon_' + appId; //unknown extension
      }
   url= 'https://build.phonegap.com/api/v1/apps/' + appId + '/icon';
   downloadFile(url, outputFilepath);
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