import { apiconnector } from "../apiConnector";
import { carpoolEndpoints } from "../apis";

export async function getAllCarpools() {
  try {
    const res = await apiconnector("GET", carpoolEndpoints.GET_ALL_CARPOOLS);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function createCarpool(data, token) {
  try {
    const res = await apiconnector(
      "POST",
      carpoolEndpoints.CREATE_CARPOOL,
      data,
      { Authorization: `Bearer ${token}` }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function deleteCarpool(id, token) {
  try {
    const url = carpoolEndpoints.DELETE_CARPOOL.replace(":id", id);
    const res = await apiconnector(
      "DELETE",
      url,
      null,
      { Authorization: `Bearer ${token}` }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
} 