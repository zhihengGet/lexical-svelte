export const getKb = (text: string) => {
	return new TextEncoder().encode(JSON.stringify(text)).length / 1024;
};
export const getMB = (text: string) => {
	return new TextEncoder().encode(JSON.stringify(text)).length / 1024 / 1024;
};
