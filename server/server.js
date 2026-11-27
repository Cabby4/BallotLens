

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`BallotLens server running on port ${PORT}`);
});