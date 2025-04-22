import app from "./app.js";

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`serve is running on ${port}`);
});
