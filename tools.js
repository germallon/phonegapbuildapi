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

/*
 * Returns The extension for the given platform
 */
var getExtByPlatform = function(platform){
   var result = 'ext'; //default extension
   if(platform){ //prevent errors
   switch(platform){
      case 'android': result = 'apk'; break;
      case 'blackberry': result = 'jad'; break;//unsigned. Extension for unsigned blackberry applications is 'zip'
      case 'ios': result = 'ipa'; break;
      case 'symbian': result = 'wgz'; break;
      case 'webos': result = 'ipk'; break;
      case 'winphone': result = 'xap'; break;
      }
   }
   return result;
};

module.exports = {
   getExtByPlatform: getExtByPlatform
};