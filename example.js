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

/**************************************************************
 * 
 * The purpose of this file is to serve as an example on how to use the tool.
 * Requires token authentication.
 * 
 * Example:
 *    node createToken.js <one-time event>
 *    node example.js /home/user/Documents/phonegapReady.zip
 * 
 *************************************************************/
var  
   apiWriter = require('./apiWriter'), //Loads writer module
   testObj;

if(process.argv.length<3){
   console.info("Usage: " + process.execPath + " " + process.argv[1] +  " /path/to/file.zip" );
   return;
}
testObj = {
   "title": 'My Test App', //hardcodes the title of the app.  Will be overriden by any name written in the config file (if any).
   "create_method": 'file' 
};

apiWriter.createFileBasedApp(process.argv[2], testObj);
