import { apiconnector } from "../apiConnector";
import { userEndpoints } from "../apis";
import toast from "react-hot-toast";
export async function registerUser(data) {
  try {
    const res = await apiconnector("POST", userEndpoints.REGISTER, data);
    toast(
        "User registered successfully, Please verify your email to login",
        {
            type: "success",
            duration: 5000,
            position: "bottom-right",
            icon: "🎉",
        }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function loginUser(data) {
  try {
    const res = await apiconnector("POST", userEndpoints.LOGIN, data);
    if(!res.data.success){
        throw new Error(res.data.message);
    }

    
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function logoutUser(token) {
  try {
    const res = await apiconnector("POST", userEndpoints.LOGOUT, null, { Authorization: `Bearer ${token}` });

    if(!res.data.success){
      throw new Error(res.data.message);
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getProfile(token) {
  try {
    const res = await apiconnector("GET", userEndpoints.PROFILE, null, { Authorization: `Bearer ${token}` });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function updateProfile(data, token) {
  try {
    const res = await apiconnector("PUT", userEndpoints.UPDATE_PROFILE, data, { Authorization: `Bearer ${token}` });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function resendVerificationEmail(data) {
    toast.loading("Sending verification email...");
  try {
    const res = await apiconnector("POST", userEndpoints.RESEND_VERIFICATION, data);
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
  finally{
    toast.dismiss();
  }
}

export async function forgotPassword(data) {
  try {
    const res = await apiconnector("POST", userEndpoints.FORGOT_PASSWORD, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function resetPassword(token, data) {
  try {
    const url = userEndpoints.RESET_PASSWORD.replace(":token", token);
    const res = await apiconnector("POST", url, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
} 


export async function verifyEmail(token) {
  try {
    const res = await apiconnector("GET", userEndpoints.VERIFY_EMAIL + `?token=${token}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}