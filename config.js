export const TOKEN_SECRET = 'asdfe45we45w345wegw345werjktjwertkj'
export const MONGO_URI = process.env.DEV === 'DEV' ? "mongodb://localhost:27017/finazapp" : process.env.MONGO_URI
export const PORT = process.env.PORT || 8080
export const ORIGIN_URI = process.env.DEV === 'DEV' ? "http://localhost:3000" : process.env.ORIGIN_URI