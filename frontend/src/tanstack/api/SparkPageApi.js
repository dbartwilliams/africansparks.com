// SparkPageApi.js
import api from "../http/axiosClient.js";

// Base URL for Spark API, update if needed
const SPARKPAGE_URL = "/sparks";

export const getSparkById = async (sparkId) => {
  try {
    const response = await api.get(`${SPARKPAGE_URL}/${sparkId}`);
    return response.data; // axios already returns parsed JSON in data
  } catch (error) {
    // Optional: throw a nicer error
    throw new Error(
      error.response?.data?.message || "Failed to fetch Spark"
    );
  }
};
