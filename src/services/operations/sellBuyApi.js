import { apiconnector } from "../apiConnector";
import { sellBuyEndpoints } from "../apis";

export async function getAllSellBuyListings() {
  try {
    const res = await apiconnector("GET", sellBuyEndpoints.GET_ALL_LISTINGS);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function createSellBuyListing(formData, token) {
  try {
    const res = await apiconnector(
      "POST",
      sellBuyEndpoints.CREATE_LISTING,
      formData,
      { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function deleteSellBuyListing(id, token) {
  try {
    const url = sellBuyEndpoints.DELETE_LISTING.replace(":id", id);
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