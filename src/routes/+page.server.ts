
import type { PageServerLoad } from "./api/$types";

export const load: PageServerLoad = async () => {
  // Största och bredaste index för USA, Sverige, världen, tillväxt
  const symbols = [
  'SPY',        // ✅ S&P 500 ETF (USA, inkluderar utdelningar via "Adjusted Close")
  'ACWI',       // ✅ iShares MSCI ACWI ETF (Globalt, inkluderar utdelningar)
  'EEM'         // ✅ iShares MSCI Emerging Markets ETF (Tillväxtmarknader, utdelningar ingår)
]

  const endDate = Math.floor(Date.now() / 1000);
  const startDate = Math.floor(new Date(new Date().setFullYear(new Date().getFullYear() - 20)).getTime() / 1000);

  const fetchReturns = async (symbol: string) => {
	try {
	  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1mo&period1=${startDate}&period2=${endDate}`;
	  const res = await fetch(url);
	  const data = await res.json();
	  const prices = data.chart?.result?.[0]?.indicators?.adjclose?.[0]?.adjclose ?? [];
	  const valid = prices.filter((p: number | null) => typeof p === 'number');
	  const first = valid[0], last = valid[valid.length - 1];
	  if (typeof first === 'number' && typeof last === 'number' && valid.length > 1 && first !== 0) {
		const totalReturn = (last - first) / first;
		const annualizedReturn = (Math.pow(1 + totalReturn, 1 / 20) - 1) * 100;
		return { symbol, annualizedReturn: parseFloat(annualizedReturn.toFixed(2)) };
	  }
	} catch (err) {
	  console.error(`Error fetching ${symbol}:`, err);
	}
	return null;
  };

  const results = (await Promise.all(symbols.map(fetchReturns))).filter(Boolean);
  const averageReturns = results.reduce((acc, curr) => acc + (curr?.annualizedReturn ?? 0), 0) / results.length;
  return {
	returns: results,
	averageReturns: parseFloat(averageReturns.toFixed(2))
  };
};