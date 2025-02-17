const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // limitira velicinu req-a
//const rateLimit = require("express-rate-limit"); // limitira broj req u odredjenom intervalu vremena
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");

const app = express();
const allowedOrigins = [
  "https://beocin.rs.212-200-255-44.oblaci.rs",
  "https://beocin.rs",
  "http://localhost:3004",
  "https://manage-it.online",
];

// Konfiguracija CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"], // Dozvoli specifične metode
  })
);
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const imageRouter = require("./routes/imageRoutes");
const tagRouter = require("./routes/tagRoutes");
const featuredPostRouter = require("./routes/featuredPostRoutes");
const fileRouter = require("./routes/fileRoutes");
const advertisementRouter = require("./routes/advertisementRoutes");

const viberRouter = require("./routes/viberRouter");

console.log(process.env.NODE_ENV);
// GLOBAL MIDDLEWARES

// Development login
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: "20mb" }));

// Data sanitization against NoSQL query injection
app.use("/api/v1/users", mongoSanitize());

// Data sanitization agaist XSS
app.use("/api/v1/users", xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["visits", "commentsCount"],
  })
);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../adminpanel/assets"))
);
app.use("/login", express.static(path.join(__dirname, "../adminpanel")));
app.use("/vesti", express.static(path.join(__dirname, "../adminpanel")));
app.use("/srl", express.static(`${__dirname}/../srl`));
app.use("/eng", express.static(`${__dirname}/../eng`));
app.use(express.static(`${__dirname}/..`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/image", imageRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/featuredPost", featuredPostRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/advertisement", advertisementRouter);

app.use("/api/v1/kosnica", viberRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} on this server SLADJAAAA!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
