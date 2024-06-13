<script lang="ts">
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { onMount } from "svelte";
	import Chart, { type ChartConfiguration, type ChartData } from 'chart.js/auto';

	let initialAmount: number = 0;
	let monthlySavings: number = 0;
	let years: number = 0;
	let annualReturn: number = 0;
	let chart: Chart | null = null;

	const data: ChartData = {
		labels: ['Input 1', 'Input 2', 'Input 3', 'Input 4'],
    	datasets: [
			{
				label: 'Ränta på ränta kalkylator',
				data: [initialAmount, monthlySavings, years, annualReturn],
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			}
    	]
	};

	const config: ChartConfiguration = {
		type: 'line',
		data,
		options: {
			scales: {
				y: {
					beginAtZero: true
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

	onMount(() => {
		const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
		if (ctx) {
			chart = new Chart(ctx, config);
		}
	});


</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<!-- <h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter /> -->

	<h1>Ränta på ränta kalkylator</h1>

	<div class="chart-container">
		<canvas id="myChart" ></canvas>
	</div>

	<div>
		<input type="number" bind:value={initialAmount} on:input={updateChart} placeholder="input 1">
		<input type="number" bind:value={monthlySavings} on:input={updateChart} placeholder="input 2">
		<input type="number" bind:value={years} on:input={updateChart} placeholder="input 3">
		<input type="number" bind:value={annualReturn} on:input={updateChart} placeholder="input 4">
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

	.chart-container {
		width: 500px;
		height: 500px;
		margin: auto;
	}
</style>
