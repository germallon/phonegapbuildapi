# PHONEGAP BUILD JS
 
### A client interface for the Phonegap Build API using javascript


##Dependencies:
* nodejs  Documentation available at http://nodejs.org
		  This tool was developed using v0.6.19, but previous versions might be supported.
* request (nodejs module).  Visit https://github.com/mikeal/request for additional details.
* mime    (nodejs module).  Visit https://github.com/bentomas/node-mime for additional details.

##Description
Phonegap Build JS is a client interface for the Phonegap Build API.  Given that the API interacts using JSON-formatted strings, Javascript seems like the logical choice to process its input and output.

A commandline interface that partially implements the API has been provided.  
<pre>
   node interface.js
</pre>

The interface allows you to interact with the API, but it is mainly provided to serve as an example on how to use the tool.  You are encouraged to implement your own driver that fits your needs.  Simply include the needed modules in your script.  

Here's an example on how to display the user data on standard output:

<pre>
   var reader = require('./apiReader');
   var writer = require('./apiWriter');

   writer.createAuthToken("my@email.com:myp4ssw0rd", {

      success:function(token){
 
         reader.getUserData(token, {
            success:function(userData){
               console.log(userData); //Output user data to stdin
               }, 
            error: function(errMsg){
               console.log("Error retrieving user data. Err: " + errMsg);
               }});         
         }, 
 
      error: function(errmsg){
         console.log("Error creating authentication token. Err: " + errMsg);
         }});
</pre>

