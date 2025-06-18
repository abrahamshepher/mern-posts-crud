import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  let token;

  // Check for token in cookies first
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // Check for token in Authorization header
  else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized. Logged In Again",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized. Logged In Again",
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
