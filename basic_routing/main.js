const http = require("http");
const httpStatus = require("http-status-codes");
const port = 3000;
const getJSONString = obj => {return JSON.stringify(obj, null, 2);};
const RouteResponseMap = { "/info": "<h1>Info Page</h1>",
			   "/contact": "<h1>Contact Us</h1>",
			   "/about": "<h1>Learn More About Us.</h1>",
			   "/hello": "<h1>Say helloby emailing us here</h1>",
			   "/error": "<h1>Sorry the page you are looking for is not here.</h1>"
			 };
const app = http.createServer();
const contentType = {"Content-Type": "text\html"};

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
		    
		    if(req.url === "/error"){
		      res.writeHead(httpStatus.NOT_FOUND, contentType);
		      res.end("<h1>404 NOT FOUND</h1>");
		    }
		    else if(RouteResponseMap[req.url])
		      res.end(RouteResponseMap[req.url]);
		    else
		      res.end("<h1>Welcome</h1>");
		  });
app.listen(port);
console.log(`The server has started and is listening on port ${port}`);
