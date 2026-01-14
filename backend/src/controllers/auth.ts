import {
  createUser,
  findOneUser,
  updateUserById,
  userExists,
  validatePassword,
  findUserByMobile,
} from "../services/userService";
import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { sign } from "../util/jwt";
import { generateOTP, verifyOTP } from "../util/otp";
import { authConfig } from "../config/config";
// import { sendOTP } from "../helpers/mailHelper";
import { ApiError } from "../util/ApiError";
const omitData = ["password"];

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { mobile, name, surname } = req.body;
    const userExist = await userExists({mobile});
    if (userExist) {
      throw new ApiError(400, "Mobile is alredy used");
    }
    
    const user = await createUser({ mobile, name, surname });

    return res.status(200).json({
      data: user,
      error: false,
      // accessToken,
      msg: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

const sendUserOtp = async (user: any) => {
  // generate otp
  const otp = generateOTP(user.mobile);

  // const send = await sendOTP(user.email, otp);
  // send otp to email
  // if (!send) {
  //   throw new ApiError(400, "Failed to send OTP");
  // }
  return true;
}

export const requestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mobile } = req.body;

    // Check if user exists, create if not
    let user = await findUserByMobile(mobile);
    
    if (!user) {
      // Auto-register user on first OTP request
      user = await createUser({ mobile });
    }

    // Generate OTP (using static OTP for now)
    // In production, this would send via Twilio
    generateOTP(user.mobile);

    // For now, we're using static OTP, so we don't actually send it
    // In the future, this is where Twilio SMS would be sent
    // await sendOTPViaTwilio(mobile, authConfig.staticOTP);

    return res.status(200).json({
      msg: "OTP sent successfully",
      error: false,
      // In development, you might want to return the OTP for testing
      // Remove this in production!
      ...(process.env.NODE_ENV === 'development' && { 
        otp: authConfig.staticOTP 
      }),
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mobile, otp } = req.body;

    const user = await findUserByMobile(mobile);
    if (!user) {
      throw new ApiError(400, "Mobile number is incorrect");
    }

    // Verify OTP - check static OTP first, then verify generated OTP
    let isValid = false;
    if (otp === authConfig.staticOTP) {
      // Static OTP for development
      isValid = true;
    } else {
      // Verify generated OTP
      isValid = verifyOTP(user.mobile, otp);
    }

    if (!isValid) {
      return res.status(400).json({
        error: true,
        errorMsg: "OTP is Incorrect",
      });
    }

    const userData = omit(user?.toJSON(), omitData);
    // Include user ID and mobile in token for backend use
    const accessToken = sign({ 
      id: user.id,
      mobile: user.mobile,
      ...userData 
    });

    return res.status(200).json({
      data: user,
      access_token: accessToken,
      user: userData,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

// Alias for verifyOTP to maintain consistency
export const verifyOTPController = loginUser;

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const { email } = req.body;

  //   let user = await findOneUser({ email });
  //   if (!user) {
  //     throw new ApiError(400, "Email id is incorrect");
  //   }
  //   user = user?.toJSON();
  //   // generate otp
  //   const otp = generateOTP(user.mobile);

  //   // const send = await sendOTP(user.email, otp);
  //   // send otp to email
  //   // if (!send) {
  //   //   throw new ApiError(400, "Failed to send OTP");
  //   // }

  //   return res.status(200).json({
  //     msg: "Email sent sucessfully",
  //     error: false,
  //   });
  // } catch (err) {
  //   next(err);
  // }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const { email, otp, password } = req.body;

  //   let user = await findOneUser({ email });
  //   if (!user) {
  //     throw new ApiError(400, "Email id is incorrect");
  //   }
  //   user = user?.toJSON();
  //   const isValid = verifyOTP(user.email, otp);

  //   if (!isValid) {
  //     return res.status(400).send({
  //       error: true,
  //       errorMsg: "OTP is Incorrect",
  //     });
  //   }

  //   const updated = await updateUserById({ password }, user.id);

  //   return res.status(200).json({
  //     updated: updated[0],
  //     msg: updated[0] ? "Password reseted successfully" : "Failed to reset",
  //     error: false,
  //   });
  // } catch (err) {
  //   next(err);
  // }
};
