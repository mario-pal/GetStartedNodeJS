const http = require("http"),
      httpStatusCodes = require("http-status-codes"),
      fs = require("fs"),
      router = require("./router"),
      plainTextCT = {"Content-Type": "text\plain"},
      htmlCT = {"Content-Type": "text\html"},
      customReadFile = (file, res) => {
                                        fs.readFile(`./${file}`, (errors, data) => {
                                                                                      if(errors){
                                                                                        console.log("Error reading the file...");
                                                                                      }
                                                                                      res.end(data);
                                                                                   }
                                                   );
                                      },
      port = 3000;

router.get("/", (req,res) => {
  res.writeHead(httpStatusCodes.OK, plainTextCT);
  res.end("INDEX");
});

router.get("/index.html", (req,res) => {
  res.writeHead(httpStatusCodes.OK, htmlCT);
  customReadFile("views/index.html", res);
});

router.post("/", (req,res) => {
  res.writeHead(httpStatusCodes.OK, plainTextCT);
  res.end("POSTED");
});

http.createServer(router.handle).listen(port);
console.log(`The server is listening on port number: ${port}`);
