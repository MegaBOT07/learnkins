import Certificate from "../models/Certificate.js";
import VerificationLog from "../models/VerificationLog.js";

// @desc    Verify a certificate by ID and log the verification
// @route   GET /api/verify/:certificateId
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const {
      certificateId
    } = req.params;
    const certificate = await Certificate.findOne({
      certificateId
    });
    if (!certificate) {
      return res.status(404).json({
        message: 'Certificate Not Found',
        isValid: false
      });
    }

    // Log the verification
    const log = new VerificationLog({
      certificateId: certificate._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      browser: req.headers['user-agent']
      // Note: Device and Country can be parsed from user-agent/ip using other libs if needed later
    });
    await log.save();

    // Increment verification count
    certificate.verificationCount += 1;
    certificate.lastVerifiedDate = Date.now();
    await certificate.save();
    if (certificate.status === 'Revoked') {
      return res.json({
        message: 'This certificate has been revoked.',
        isValid: false,
        status: certificate.status
      });
    }
    if (certificate.status === 'Expired') {
      return res.json({
        message: 'This certificate has expired.',
        isValid: false,
        status: certificate.status
      });
    }

    // Don't expose database ID
    const certData = certificate.toObject();
    delete certData._id;
    delete certData.__v;
    res.json({
      message: 'Certificate is Valid',
      isValid: true,
      data: certData
    });
  } catch (error) {
    next(error);
  }
};
export { verifyCertificate };