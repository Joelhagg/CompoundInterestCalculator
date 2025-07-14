<script lang="ts">
import { onMount } from "svelte";
import Chart, { type ChartConfiguration, type ChartData } from 'chart.js/auto';

export let data;

const indexNames: Record<string, string> = {
	'SPY': ' S&P 500 ETF',
	'ACWI': 'iShares MSCI ACWI ETF',
	'EEM': 'iShares MSCI Emerging Markets ETF'
};

let returns: { symbol: string; annualizedReturn: number }[] = [];
let averageReturn = 0;

$: if (data) {
	returns = (data.returns ?? []).filter((item: any): item is { symbol: string; annualizedReturn: number } => item !== null);
	averageReturn = data.averageReturns;
}

let initialAmount = 0;
let monthlySavings = 0;
let years = 0;
let annualReturn = 0;
let chart: Chart | null = null;

const chartData: ChartData = {
	labels: ['years'],
	datasets: [
		{
			label: 'Results',
			data: [initialAmount, monthlySavings, years, annualReturn],
			backgroundColor: '#2A9D3F',
			borderColor: 'rgba(0, 0, 0, 0)',
			borderWidth: 1
		}
	]
};

const config: ChartConfiguration = {
	type: 'line',
	data: chartData,
	options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				ticks: {
					color: 'rgba(170, 170, 170)',
					font: { size: 12 },
				},
				grid: { display: false }
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: 'rgba(170, 170, 170)',
					font: { size: 12 },
				},
				grid: { display: false }
			}
		}
	}
};

const calculateCompoundInterest = (): number[] => {
	const months = years * 12;
	const monthlyReturn = annualReturn / 12 / 100;
	const balance: number[] = [];
	let total = initialAmount;
	for (let i = 0; i < months; i++) {
		balance.push(total);
		total = total * (1 + monthlyReturn) + monthlySavings;
	}
	return balance;
};

const updateChart = () => {
	if (chart) {
		const balance = calculateCompoundInterest();
		chart.data.labels = Array.from({ length: balance.length }, (_, i) => i);
		chart.data.datasets[0].data = balance;
		chart.update();
	}
};

const useAverageReturn = () => {
	if (averageReturn > 0) {
		annualReturn = averageReturn;
		updateChart();
	}
};

onMount(() => {
	const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
	if (ctx) {
		chart = new Chart(ctx, config);
	}
});
</script>

<section>

	<h1>Compound Interest Calculator</h1>

	<div class="chart-outer">
		<div class="chart-container">
			<canvas class="canvas" id="myChart"></canvas>
		</div>
	</div>

	<div class="input-wrapper">
		<div class="input-container">
			<label for="initialAmount">Starting savings amount</label>
			<input type="number" id="initialAmount" bind:value={initialAmount} on:input={updateChart} placeholder="">
		</div>
		<div class="input-container">
			<label for="monthlySavings">Montly savings</label>
			<input type="number" id="monthlySavings" bind:value={monthlySavings} on:input={updateChart} placeholder="">
		</div>
		<div class="input-container">
			<label for="years">Years</label>
			<input type="number" id="years" bind:value={years} on:input={updateChart} placeholder="">
		</div>
		<div class="input-container">
			<label for="annualReturn">Anual return %</label>
			<input type="number" id="annualReturn" step="0.1" bind:value={annualReturn} on:input={updateChart} placeholder="">
		</div>
	</div>

		<!-- 🧾 Visa API-datan -->
	<div class="return-info">
		<h2>Historical Annual Return: Annual growth including price changes and reinvested dividends.</h2>
		{#if returns.length === 0 || averageReturn === 0}
		<p style="color: #ffbaba;">
			Unable to fetch data for the selected index or period.<br>
			As a general reference, you can expect an average annual return of about <strong>7%</strong> for a diversified global portfolio based on historical performance.
		</p>
		{:else}
			{#each returns as item}
				<p>{indexNames[item.symbol] ?? item.symbol}: <strong>{item.annualizedReturn}%</strong></p>
			{/each}
			<p>
				Average annual return for {returns.length} indexes over the last 20 years: <strong>{averageReturn}% </strong>
				<button on:click={useAverageReturn}>Apply average return</button>
			</p>
		{/if}
	</div>
</section>

<style>
html, body, #svelte {
	height: 100%;
	margin: 0;
	padding: 0;
}

section {
	min-height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	/* overflow: hidden; */
}

h1 {
	width: 100%;
	text-align: center;
}


.chart-outer {
	width: 100vw;
	max-width: 1200px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 2rem;
	padding-left: 1rem;
	padding-right: 1rem;
	box-sizing: border-box;
}

.chart-container {
	width: 100%;
	height: 50vw;
	max-width: 1200px;
	max-height: 60vh;
	min-height: 300px;
	min-width: 300px;
	aspect-ratio: 2/1;
	background: #181818;
	border-radius: 12px;
	box-shadow: 0 2px 16px 0 #0004;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	box-sizing: border-box;
}

.canvas {
	width: 100% !important;
	height: 100% !important;
	display: block;
}

.input-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;

	gap: 0.25rem;
}

.input-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 150px;
	max-width: auto;
}

label {
	margin-bottom: 0.5rem;
	font-weight: bold;
	color: #FFF;
}

input {
	width: 100px;
	height: 50px;
	font-size: 1.25rem;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 6px;
	box-sizing: border-box;
}

.return-info {
	margin-top: 2rem;
	color: white;
}

button {
	background-color: #2A9D3F;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	cursor: pointer;
	font-size: 1rem;
	margin-left: 0.5rem;
}

@media (max-width: 600px) {
	.chart-outer {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
	.chart-container {
		min-width: 0;
		border-radius: 8px;
	}
	.return-info {
		margin-bottom: 1.5rem;
	}
	.input-container {
		font-size: 0.75rem;
	}
	.input-wrapper {


	}
	input {
		/* width: 100px;
		height: 40px;
		font-size: 1rem; */
	}
}

</style>
