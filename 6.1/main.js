const http = require("http");
const httpStatus = require("http-status-codes");
const fs = require("fs");
const port = 3000;
const getJSONString = obj => {return JSON.stringify(obj, null, 2);};
const RouteMap = { "/": "views/index.html"
			 };
const contentType = {"Content-Type": "text\html"};
const getViewUrl = (url) => { return `views${url}.html`;};
const app = http.createServer();

app.on("request", (req,res) => {
		    var body = [];
		    req.on("data", (bodyData) => {body.push(bodyData)});
		    req.on("end", () => {body = Buffer.concat(body).toString();
		                         console.log(`Request Body Contents: ${body}`);
					});
		    console.log(`Method: ${getJSONString(req.method)}`);
		    console.log(`URL: ${getJSONString(req.url)}`);
		    console.log(`Headers: ${getJSONString(req.headers)}`);
		    
		    res.writeHead(httpStatus.OK, contentType);
		    let viewUrl = getViewUrl(req.url); 
		    fs.readFile(viewUrl, (error,data) => { if(error){
		    					     res.writeHead(httpStatus.NOT_FOUND);
							     res.write("<h1>FILE NOT FOUND</h1>");
							   }
							   else{
							     res.writeHead(httpStatus.OK, contentType);
							     res.write(data);
							   }
		                                           res.end();
						         }); 
		  });
app.listen(port);
console.log(`The server has started and is listening on port ${port}`);
