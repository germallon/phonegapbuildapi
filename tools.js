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