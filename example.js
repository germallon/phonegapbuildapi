
/*
 * 
 * This file's purpose is to serve as an example on how to use the tool.
 * Uses token authentication.
 * 
 * Example:
 *    node createToken.js <one-time event>
 *    node example.js /home/user/Documents/phonegapReady.zip
 * 
 */
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
