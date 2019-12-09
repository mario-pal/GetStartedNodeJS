const http = require("http");
const httpStatus = require("http-status-codes");
const fs = require("fs");
const port = 3000;
const getJSONString = obj => {return JSON.stringify(obj, null, 2);};
const contentType = {"Content-Type": "text\html"};
const sendErrorResponse = res => {
                                   res.writeHead(httpStatus.NOT_FOUND,{"Content-Type": "text\html"});
																	 res.write("<h1>File Not Found!</h1>");
																	 res.end();
	                               }
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

				let url = req.url;

				if(url.indexOf(".html") !== -1){
					res.writeHead(httpStatus.OK, contentType);
				  customReadFile(`./views${url}`, res);
		  	}else if (url.indexOf(".js") !== -1) {
				  res.writeHead(httpStatus.OK, {"Content-Type": "text/javascript"});
				  customReadFile(`./public/js${url}`, res);
			  }else{
          sendErrorResponse(res);				
			  }

		  });
app.listen(port);
console.log(`The server has started and is listening on port ${port}`);

const customReadFile = (file_path,res) => {
	                                          if(fs.existsSync(file_path)){
																							fs.readFile(file_path, (error, data) => {
																																						            if(error){
																																													console.log(error);
																																													sendErrorResponse(res);
																																													return;
																																												}
																																												res.write(data);
																																												res.end();
																																											});
																						}else{
																							sendErrorResponse(res);
																						}
                                          };
