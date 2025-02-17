const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.webHook = catchAsync(async (req, res, next) => {
  const data = req.body;
  //   if (data.sender.name) {
  //     const user = data.sender.name;
  //     console.log(
  //       `Korisnik koji je poslao poruku je ${user}, a njegova poruka glasi ${data.message.text}`
  //     );
  //     res.status(200).json({
  //       status: "succcess",
  //       data,
  //       message: user,
  //     });
  //   } else {
  //     res.status(200).json({
  //       status: "succcess",
  //       data,
  //     });
  //   }
  console.log(data);
  res.status(200).json({
    status: "succcess",
    data,
  });
});
