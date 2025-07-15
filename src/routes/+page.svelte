<script lang="ts">
import { onMount } from "svelte";
import Chart from 'chart.js/auto';

export let data;

const indexNames: Record<string, string> = {
    'SPY': 'S&P 500 ETF',
    'ACWI': 'iShares MSCI ACWI ETF',
    'EEM': 'iShares MSCI Emerging Markets ETF'
};

let returns: any = [];
let averageReturn = 0;
let initialAmount = 0;
let monthlySavings = 0;
let years = 0;
let annualReturn = 0;
let chart: Chart | null = null;

// Uppdatera returns och averageReturn när data ändras
$: if (data) {
    returns = (data.returns ?? []).filter(Boolean);
    averageReturn = data.averageReturns;
}

// Räkna ut saldo över tid
function calculateCompoundInterest() {
    const months = years * 12;
    const monthlyReturn = annualReturn / 12 / 100;
    let total = initialAmount;
    return Array.from({ length: months }, (_, i) => (total = total * (1 + monthlyReturn) + monthlySavings));
}

// Uppdatera grafen
function updateChart() {
    if (chart) {
        const balance = calculateCompoundInterest();
        chart.data.labels = balance.map((_, i) => i);
        chart.data.datasets[0].data = balance;
        chart.update();
    }
}

// Sätt genomsnittlig avkastning
function useAverageReturn() {
    if (averageReturn > 0) {
        annualReturn = averageReturn;
        updateChart();
    }
}

// Initiera grafen
onMount(() => {
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Balance',
                    data: [],
                    backgroundColor: '#2A9D3F',
                    borderColor: '#2A9D3F',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: '#aaa', font: { size: 12 } }, grid: { display: false } },
                    y: { beginAtZero: true, ticks: { color: '#aaa', font: { size: 12 } }, grid: { display: false } }
                }
            }
        });
    }
});
</script>

<section>
    <h1 class="header">Compound Interest Calculator</h1>

    <div class="chart-outer">
        <div class="chart-container">
            <canvas class="canvas" id="myChart"></canvas>
        </div>
    </div>

    <div class="input-wrapper">
        {#each [
            { id: 'initialAmount', label: 'Starting savings amount', bind: initialAmount },
            { id: 'monthlySavings', label: 'Monthly savings', bind: monthlySavings },
            { id: 'years', label: 'Years', bind: years },
            { id: 'annualReturn', label: 'Annual return %', bind: annualReturn, step: 0.1 }
        ] as input}
            <div class="input-container">
                <label for={input.id}>{input.label}</label>
                <input
                    type="number"
                    id={input.id}
                    bind:value={input.bind}
                    step={input.step}
                    on:input={updateChart}
                    placeholder=""
                />
            </div>
        {/each}
    </div>

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
                Average annual return for {returns.length} indexes over the last 20 years: <strong>{averageReturn}%</strong>
                <button on:click={useAverageReturn}>Use this value</button>
            </p>
        {/if}
    </div>
</section>

<style>
html, body, #svelte {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

section {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
}

h1 {
    width: 100%;
    text-align: center;
}

.chart-outer {
    width: 100%;
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
    width: 180px;
}

label {
    font-size: 0.8rem;
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
    margin: 1rem;
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
    .header { font-size: 1.5rem; }
    .chart-outer { padding-left: 0.5rem; padding-right: 0.5rem; }
    .chart-container { min-width: 0; border-radius: 8px; }
    input { width: 100px; height: 40px; font-size: 1rem; }
    .return-info { font-size: 0.75rem; }
    .input-container { font-size: 0.75rem; }
    button { font-size: 0.75rem; padding: 0.25rem 0.5rem; margin: 0.5rem 0; }
}

</style>