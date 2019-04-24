module.exports = class Util {
	static delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static formatNumber(number) {
		return Number.parseFloat(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
	}
};