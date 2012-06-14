# PHONEGAP BUILD JS
 
### A client interface for the Phonegap Build API using javascript


##Dependencies:
* nodejs  Documentation available at http://nodejs.org
		  This tool was developed using v0.6.19, but previous versions might be supported.
* request (nodejs module).  Visit https://github.com/mikeal/request for additional details.

##Description
Phonegap Build JS is a client interface for the Phonegap Build API.  Given that the API interacts using JSON-formatted strings, Javascript seems like the logical choice to process its input and output.
The client uses the authentication token for all requests.  Therefore, you must generate a token by running the createToken utility before using the interface.  This is a one-time event.

<pre>
  node createToken.js
</pre>

An simple example driver has been included to help you understand how to run the tool (example.js).  You can write your own driver to make the tool fit your own needs, and fully interact with the Phonegap API.  

### The authentication token will be saved in the metadata folder.  We are looking for better ways to store this information, without creating additional dependencies.  In the meantime, please protect your data.









