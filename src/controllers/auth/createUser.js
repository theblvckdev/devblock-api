const bcrypt = require('bcryptjs');
const { randomBytes, createHash } = require('crypto');
const { User } = require('../../../models');
const sendEmailVerificationMail = require('../../mail/emailVerificationMail');
const jwtToken = require('../../utils/signJWT');

const createUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password)
    return res
      .status(499)
      .json({ status: 'error', message: 'All fields are required' });

  // hash client password
  const hashedPassword = await bcrypt.hash(password, 10);

  // hash email token before sending verification token to mail
  const emailToken = randomBytes(7).toString('base64').replaceAll('/', 'B');
  const hashedEmailToken = createHash('sha256')
    .update(emailToken)
    .digest('hex');

  try {
    // check if user with client email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(403).json({
        status: 'error',
        message: `This email ${email} is already in user, please try again`,
      });

    // create user data in db
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      email_verification_token: hashedEmailToken,
      email_verification_token_expires_at: Date.now() + 30 * 60 * 1000,
    });

    // send verification email with nodemailer
    const verificationURL = `${req.protocol}://localhost:3000/api/user/verify-email/${emailToken}`;

    sendEmailVerificationMail({
      email: user.email,
      subject: `[Action Required]: Verify Your Lumo Email`,
      verificationURL,
    });

    const signJwt = jwtToken(user.id);

    res.status(201).json({
      status: 'success',
      message: `User account created, check ${user.email} for verification mail`,
      jwtToken: signJwt,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ status: 'error', error: err });
  }
};

module.exports = createUser;
