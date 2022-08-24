const jwt = require("jsonwebtoken");

const { SECRET_KEY, CLIENT_HOST, API_HOST } = process.env;

//환경변수가 존재하는지 확인
if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  console.log("process.env", process.env);
  throw new Error("MISSING_ENVAR");
}

const IS_DEV = process.env.NODE_ENV !== "production";

// 토큰 생성
const generateToken = (payload, options) => {
  const jwtOptions = {
    issuer: API_HOST,
    expiresIn: "30d",
    ...options,
  };
  //토큰의 만료기간이 없는 경우 해당 옵션을 삭제하고 남은 옵션으로 토큰 생성
  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const decodedToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

// 토큰 해독
const setTokenCookie = (res, tokens) => {
  const { accessToken, refreshToken } = tokens;

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    domain: IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 60 * 60 * 24 * 30,
    //개발 환경일 때는 http 환경이므로 false, 운영환경일 때는 https를 사용하므로 true
    secure: !IS_DEV,
  });
};

module.exports = {
  generateToken,
  decodedToken,
  setTokenCookie,
};
