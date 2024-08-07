import path from "path";

const config = {
  SERVER: "Atlas",
  PORT: 5050,
  // DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)), // Linux / Mac
  DIRNAME: path.dirname(
    new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")
  ), // Win
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  // MONGODB_URI: 'mongodb://127.0.0.1:27017/coder_53160',
  ATLAS_URI:
    "mongodb+srv://oscarfrisc:8B8NmzurFWopuw2U@proyectto.46qcvto.mongodb.net/sample_mflix",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  SECRET: "lkskwlkr",
  GITHUB_CLIENT_ID: "Iv23lie2ROiexrHH3gpo",
  GITHUB_CLIENT_SECRET: "2cdb350364a97a037e2765eec50eb7494c0bb01d",
  GITHUB_CALLBACK_URL: "http://localhost:5050/sessions/ghlogincallback",
};

export default config;
