const missingPath = (req, res, next) => {
  const { url } = req;
  const removeLog = ["/favicon.ico"].includes(url);
  if (removeLog) {
    res.sendStatus(200);
    return;
  }
  //이미지 경로가 잘못되었는지 확인
  const isContent = url.includes("/images");
  const message = isContent ? "NOT_FOUND" : "MISSING_PATH";
  next(message);
};

module.exports = missingPath;
