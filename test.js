var apiWriter = require('./apiWriter'),
apiReader = require('./apiReader');
apiWriter.createAuthToken("germane@adtecinc.com:greb6161", {error: function(e){console.info("Error " + e);}, success:function(token){

   apiReader.downloadApp(token, 129719, 'android', '/home/g/Desktop/myApp.apk',
      {
      error:function(err){console.info(err);}, 
      success: function(reply){
         console.log("File download detected"); 
         }
      }
   );
}});