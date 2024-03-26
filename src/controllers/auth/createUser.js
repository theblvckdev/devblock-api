const bcrypt = require('bcryptjs');
const { randomBytes, createHash } = require('crypto');
const { User } = require('../../../models');
const sendEmailVerificationMail = require('../../mail/emailVerificationMail');

const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(499)
      .json({ status: 'error', message: 'All fields are required' });

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
        message: `This email address ${email} is already in use, please use another email address`,
      });

    // check if client password pass required password combination
    let passwordRegex =
      /^(?=.*[!@#$%^&*()\-_=+{};:,<.>?[\]'"\\|\/])(?=.*[a-zA-Z0-9]).{8,}$/;

    if (!passwordRegex.test(password))
      return res.status(401).json({
        status: 'error',
        message:
          'Password must be at least 8 characters long, and have a symbol',
      });

    // hash client password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user data in db
    const user = await User.create({
      name: username,
      username,
      email,
      password: hashedPassword,
      email_verification_token: hashedEmailToken,
      email_verification_token_expires_at: Date.now() + 30 * 60 * 1000,
    });

    // send verification email with nodemailer
    const verificationURL = `${req.protocol}://localhost:3000/api/auth/verify-email/${emailToken}`;

    sendEmailVerificationMail({
      email: user.email,
      subject: `[Action Required]: Verify Your Lumo Email`,
      verificationURL,
    });

    res.status(201).json({
      status: 'success',
      message: `User account created, check ${user.email} for verification mail`,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ status: 'error', error: err });
  }
};

module.exports = createUser;
