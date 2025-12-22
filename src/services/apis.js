const BASE_URL = import.meta.env.VITE_BASE_URL;

export const userEndpoints = {
    REGISTER: `${BASE_URL}/api/v1/user/register`,
    LOGIN: `${BASE_URL}/api/v1/user/login`,
    LOGOUT: `${BASE_URL}/api/v1/user/logout`,
    UPDATE_PROFILE: `${BASE_URL}/api/v1/user/update-profile`,
    PROFILE: `${BASE_URL}/api/v1/user/profile`,
    RESEND_VERIFICATION: `${BASE_URL}/api/v1/user/resend-verification`,
    FORGOT_PASSWORD: `${BASE_URL}/api/v1/user/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/api/v1/user/reset-password/:token`,
    VERIFY_EMAIL: `${BASE_URL}/api/v1/user/verify-email`,
}


export const attendanceEndpoints = {
    GET_ATTENDANCE: `${BASE_URL}/api/v1/attendance/getAttendance`,
    GET_SUBJECT_ATTENDANCE: `${BASE_URL}/api/v1/attendance/getSubjectAttendance/:subject`,
    UPDATE_ATTENDANCE: `${BASE_URL}/api/v1/attendance/updateAttendance`,
    DELETE_SUBJECT: `${BASE_URL}/api/v1/attendance/deleteSubject/:subject`,
    CLEAR_ALL: `${BASE_URL}/api/v1/attendance/clearAll`,
    ADD_SUBJECT: `${BASE_URL}/api/v1/attendance/addSubject`,
}

export const carpoolEndpoints = {
    CREATE_CARPOOL: `${BASE_URL}/api/v1/carpool/createCarpool`,
    GET_ALL_CARPOOLS: `${BASE_URL}/api/v1/carpool/getAllCarpools`,
    DELETE_CARPOOL: `${BASE_URL}/api/v1/carpool/deleteCarpool/:id`,
}

export const lostFoundEndpoints = {
    GET_ITEMS: `${BASE_URL}/api/v1/lost-found/getItems`,
    ADD_ITEM: `${BASE_URL}/api/v1/lost-found/addItem`,
    DELETE_ITEM: `${BASE_URL}/api/v1/lost-found/deleteItem/:id`,
}

export const sellBuyEndpoints = {
    GET_ALL_LISTINGS: `${BASE_URL}/api/v1/sellbuys/getAllListings`,
    CREATE_LISTING: `${BASE_URL}/api/v1/sellbuys/createListing`,
    DELETE_LISTING: `${BASE_URL}/api/v1/sellbuys/deleteListing/:id`,
}
