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
fs = require('fs'),
https = require('https'),
dataClient = require('./dataClient'),
mime = require('mime'),

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


postMultipart = function(postData, boundary, apiCall){
   var 
   token = dataClient.getToken(),
   len = 0, i=0,
   options = null, 
   request = null;
   
   if(!token){
      console.log("Error: Unknown authentication token.");
      return;    
      }
   
   for( i=0; i<postData.length; i++){
      len += postData[i].length;
   }
   
   options = {
      host: 'build.phonegap.com',
      path: '/api/v1/' + apiCall + '?auth_token='+token,
      method: 'POST',
      headers:{
         'Content-Type': 'multipart/form-data; boundary=' + boundary,
         'Content-Length': len
      }
   };
   
   request = https.request(options, function(response){
      response.on('data', function(chunk){
         //TODO:  Do something w/ response data
      })
   });
   
   for( i=0; i<postData.length; i++){
      request.write(postData[i]);
   }
   request.end(); 
   
},

initMultipartUpload = function(inputFile, reqData, apiCall){
   var  
   boundary = 'bound' + Math.random(),
   postData = [], 
   fileReader = null,
   fileContents = '';
   
   postData.push(new Buffer(encodeFieldHeader(boundary, "data", JSON.stringify(reqData)), 'ascii'));
   postData.push(new Buffer(encodeFileHeader(boundary, mime.lookup(inputFile), "file", inputFile), 'ascii'));
   fileReader = fs.createReadStream(inputFile, {encoding: 'binary'});
   fileReader.on('data', function(fileData){ fileContents+= fileData;});
   fileReader.on('end', function(){
      postData.push(new Buffer(fileContents, 'binary'));
      postData.push(new Buffer("\r\n--" + boundary + "--", 'ascii'));
      postMultipart(postData, boundary, apiCall);
      });
},

createApp = function(inputFile, dataObj){
   initMultipartUpload(inputFile, dataObj, 'apps');
},

updateAppFromFile = function(inputFile, appId){
   var fs = require('fs'),
   dataClient = require('.dataClient'),
   
   token = dataClient.getToken(), //TODO:  Use file extraction instead
   req = require('request'),
   apiPath = '/api/v1/apps/' + appId + '?auth_token=' + token;
   fs.createReadStream(inputFile).pipe(req.put('https://build.phonegap.com' + apiPath));
};


module.exports = {
   createApp:createApp,
   updateAppFromFile:updateAppFromFile
};