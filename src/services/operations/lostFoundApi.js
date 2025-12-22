import { apiconnector } from "../apiConnector";
import { lostFoundEndpoints } from "../apis";

export async function getLostFoundItems() {
  try {
    const res = await apiconnector("GET", lostFoundEndpoints.GET_ITEMS);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function addLostFoundItem(formData, token) {
  try {
    const res = await apiconnector(
      "POST",
      lostFoundEndpoints.ADD_ITEM,
      formData,
      { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function deleteLostFoundItem(id, token) {
  try {
    const url = lostFoundEndpoints.DELETE_ITEM.replace(":id", id);
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