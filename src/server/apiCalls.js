"use server";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getProduct(id) {
	try {
		const res = await axios.get(`${API_URL}/product/${id}`);
		if (res.status !== 200) {
			throw new Error("failed to get product");
		}
		return res
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log(error.response?.data);
		} else {
			console.log(error);
		}
	}
}
