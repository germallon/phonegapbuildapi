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
createApp = function(inputFile){
   //TODO: Implement
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