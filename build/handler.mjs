import express from "express";
const app = express();
void async function main() {
  app.get("/test", (req, res) => {
    res.send("Hello World");
  });
}();
const handler = app;
export {
  handler
};
