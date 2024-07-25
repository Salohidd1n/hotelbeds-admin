import CryptoJS from 'crypto-js';

export default function generateSignature() {
	const timestamp = Math.floor(Date.now() / 1000);
	return {
		key: CryptoJS.HmacSHA256(
			`${import.meta.env.VITE_API_KEY}${timestamp}`,
			import.meta.env.VITE_API_SECRET,
		).toString(),
		timestamp: timestamp.toString(),
	};
}
