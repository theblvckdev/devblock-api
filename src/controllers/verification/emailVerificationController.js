const { createHash } = require('crypto');
const { User } = require('../../../models');
const { Op } = require('sequelize');

const verifyEmail = async (req, res) => {
  try {
    const hashedEmailTOken = createHash('sha256')
      .update(req.params.verificationToken)
      .digest('hex');

    const user = await User.findOne({
      where: {
        email_verification_token: { [Op.eq]: hashedEmailTOken },
        email_verified_at: { [Op.eq]: null },
        email_verification_token_expires_at: { [Op.gt]: Date.now() },
      },
    });

    if (!user)
      return res.status(401).json({
        status: 'error',
        message: `Email verification token has expired`,
      });

    user.email_verified_at = Date.now();
    user.email_verification_token = null;
    user.email_verification_token_expires_at = null;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `Your email ${user.email}, has been verified`,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ status: 'error', error: err });
  }
};

module.exports = verifyEmail;
