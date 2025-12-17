import {
  createUser,
  findOneUser,
  updateUserById,
  userExists,
  validatePassword,
} from "../services/userService";
import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { sign } from "../util/jwt";
import { generateOTP, verifyOTP } from "../util/otp";
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mobile, otp } = req.body;

    const user = await findOneUser({ mobile });
    if (!user) {
      throw new ApiError(400, "Email id is incorrect");
    }

    // const validPassword = await validatePassword(user.email, password);
    // if (!validPassword) {
    //   throw new ApiError(400, "Password is incorrect");
    // }
    // const userData = omit(user?.toJSON(), omitData);
    // const accessToken = sign({ ...userData });
    const isValid = verifyOTP(user.mobile, otp);

    if (!isValid) {
      return res.status(400).send({
        error: true,
        errorMsg: "OTP is Incorrect",
      });
    }

    const userData = omit(user?.toJSON(), omitData);
    const accessToken = sign({ ...userData });

    return res.status(200).json({
      data: user,
      access_token: accessToken,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

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
