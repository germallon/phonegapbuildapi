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
_fs = require('fs'),
_https = require('https'),
_mime = require('mime'),
_req = require('request'),
_URL = 'build.phonegap.com'

encodeFieldHeader = function(boundary, name, value){
   var result = [
     "--" + boundary + "\r\n",
     "Content-Disposition: form-data; name=\"", 
     "" + name + "\"\r\n\r\n" + value + "\r\n",
     ].join("");
   return result;
},

encodeFileHeader = function(boundary, type, name, filename){
   var result = [
      "--" + boundary + "\r\n",
      "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n",
      "Content-Type: " + type + "\r\n\r\n"
     ].join("");
   return result;
},


postMultipart = function(token, postData, boundary, apiCall, callback){
   var 
   len = 0, i=0,
   options = null, 
   request = null;
   
   for( i=0; i<postData.length; i++){
      len += postData[i].length;
   }
   
   options = {
      host: _URL,
      path: '/api/v1/' + apiCall + '?auth_token='+token,
      method: 'POST',
      headers:{
         'Content-Type': 'multipart/form-data; boundary=' + boundary,
         'Content-Length': len
      }
   };
   
   request = _https.request(options, function(response){
      var replyData = '';
      response.on('data', function(chunk){
         replyData+= chunk;
      });
      response.on('end', function(){
         callback.success(replyData);
      });
      response.on('error', function(e){
         callback.error(e.message);
      });
   });
   
   for( i=0; i<postData.length; i++){
      request.write(postData[i]);
   }
   request.end(); 
   
},

initMultipartUpload = function(token, inputFile, reqData, apiCall, fieldName, callback){
   var  
   boundary = 'bound' + Math.random(),
   postData = [], 
   fileReader = null,
   fileContents = '';
   
   if(reqData){postData.push(new Buffer(encodeFieldHeader(boundary, "data", JSON.stringify(reqData)), 'ascii'))};
   postData.push(new Buffer(encodeFileHeader(boundary, _mime.lookup(inputFile), fieldName, inputFile), 'ascii'));
   fileReader = _fs.createReadStream(inputFile, {encoding: 'binary'});
   fileReader.on('data', function(fileData){ fileContents+= fileData;});
   fileReader.on('end', function(){
      postData.push(new Buffer(fileContents, 'binary'));
      postData.push(new Buffer("\r\n--" + boundary + "--", 'ascii'));
      postMultipart(token, postData, boundary, apiCall, callback);
      });
},

 
 /******************************************************************
 *
 *  Create a new File-based App.
 *  
 *  Required parameters
 *  
 *  title: You must specify a title for your app - if a title is also 
 *         specified in a config.xml in your package, the one in the 
 *         config.xml file will take preference.
 *  create_method: use "file" for this method
 *  
 *  Optional parameters
 *  
 *  package: Sets the package identifier for your app. This can also be 
 *           done after creation, or in your config.xml file. 
 *           Defaults to com.phonegap.www
 *  version: Sets the version of your app. This can also be done after 
 *           creation, or in your config.xml file. Defaults to 0.0.1
 *  description: Sets the description for your app. This can also be 
 *               done after creation, or in your config.xml file. 
 *               Defaults to empty.
 *  debug: Builds your app in debug mode. Defaults to false.
 *  keys: Set the signing keys to use for each platform you wish to sign. 
 *  private: Whether your app can be publicly downloaded. Defaults to 
 *           true during beta period; will default to false once the 
 *           beta period is complete
 *  phonegap_version: Which version of PhoneGap your app uses. See 
 *                    config.xml for details on which are supported, 
 *                    and which one is currently the default
 *  
 * File-backed applications
 * 
 * To create a file-backed application, set the create_method parameter 
 * to file, and include a zip file, a tar.gz file, or an index.html 
 * file in the multipart body of your post, with the parameter name file.
 * 
 *    POST https://build.phonegap.com/api/v1/apps
 *****************************************************************/ 
_createFileBasedApp = function(token, inputFile, dataObj, callback){
   initMultipartUpload(token, inputFile, dataObj, 'apps', "file", callback);
},

/******************************************************************
 *    Updating a file-based application
 *    
 *    If the application has been created from a file upload, you 
 *    can include a new index.html, zip file, or tar.gz file as the 
 *    file parameter in your request to update the contents.
 *   
 *    PUT https://build.phonegap.com/api/v1/apps/:id
 *****************************************************************/
_updateFileBasedApp = function(token, inputFile, appId, callback){
   var apiPath = '/api/v1/apps/' + appId + '?auth_token=' + token;
   _fs.createReadStream(inputFile).pipe(_req.put('https://build.phonegap.com' + apiPath))
   .on('error', function(e){callback.error(e.message);})
   .on('close', callback.success);
   
},

/******************************************************************
 * POST https://build.phonegap.com/api/v1/apps/:id/:icon
 * 
 * Sets an icon file for a given app. Send a png file as the icon 
 * parameter in your post.
 * If you want to have multiple icons for different resolutions, you 
 * should not use this API method. Instead, include the different 
 * icon files in your application package and specify their use 
 * in your config.xml file.
 * 
 * The response will have a 201 created status, and the 
 * application will be queued for building.
******************************************************************/
_uploadAppIcon = function(token, appId, inputFile, callback){
   initMultipartUpload(token, inputFile, null, 'apps/' + appId + "/icon", "icon", callback);
},

/******************************************************************
 * POST https://build.phonegap.com/api/v1/apps/:id/build
 * 
 * Queue new builds for a specified app. The older builds will be 
 * discarded, while new ones are queued.
 * The builds will use the most current app contents, as well as 
 * the selected signing keys. The response will have a 202 (accepted) 
 * status.
 * 
 * To choose which platforms to build, include those as a JSON encoded 
 * parameter in your post
 * 
 * Once the builds are queued, you will want to watch the results of 
 * GET /api/v1/apps/:id to see when each platform's status changes 
 * from pending (to complete or error).
 * 
 ******************************************************************/
//rebuildApp = function(token, appId, dataObj, callback){
//   
//},

_createAuthToken = function(rawCredentials, callback){
   var
   auth = "Basic " + new Buffer(rawCredentials).toString("base64"),
   options = {  
      url : 'https://'+_URL+"/token",    
      headers : { "Authorization" : auth } 
      }; 
   
   _req.post(options, function (error, response, body) {
      if((error!==null) || (response.statusCode!=200))
         {
         var errStr = "AJAX error.  Your request could not be completed. Please verify your login credentials and network access.  statusCode: " + response.statusCode;
         if(JSON.parse(body) && JSON.parse(body).error){errStr +="\n" + JSON.parse(body).error;}
         callback.error(errStr);
         return;
         }
      callback.success(JSON.parse(body).token);
      });
}
;


module.exports = {
   createFileBasedApp:_createFileBasedApp,
   updateFileBasedApp:_updateFileBasedApp,
   uploadAppIcon: _uploadAppIcon,
   createAuthToken: _createAuthToken,
};