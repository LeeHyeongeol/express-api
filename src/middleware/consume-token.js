const { User } = require("database/models");

const { decodeToken, setTokenCookie } = require("lib/token");
const { decodedToken } = require("../lib/token");

const refresh = async (res, refreshToken) => {
  try {
    const decoded = await decodedToken(refreshToken);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new Error("Invalid User error");
    }
    const tokens = await user.refreshUserToken(decoded.exp, refreshToken);
    setTokenCookie(res, tokens);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const consumeToken = async (req, res, next) => {
  //클라이언트에서 받은 access, refresh 점검
  const { access_token: accessToken, refresh_token: refreshToken } =
    req.cookies;

  try {
    if (!accessToken) {
      throw new Error("No access token");
    }
    const accessTokenData = await decodeToken(accesToken);
    const { id: userId } = accessTokenData.user;
    const user = await User.findByPk(userId);

    req.user = user;
    console.log("consumToken req", req);
  } catch (err) {
    if (!refreshToken) return next();
    try {
      // retry...
      const user = await refresh(res, refreshToken);
      req.user = user;
    } catch (e) {
      return next(e);
    }
  }
  return next();
};
