import { state, DONUT_MOCK_DATA } from './state.js';
import { TRANSLATIONS, convertDigitsToBengali, formatDisplayNumber } from './translations.js';

export function initDonutChart() {
  // --- Donut Chart Rendering ---
  const donutCanvas = document.getElementById("held-donut-chart");
  if (donutCanvas) {
    if (state.charts.donut) {
      state.charts.donut.destroy();
    }
    
    const donutCtx = donutCanvas.getContext("2d");
    const donutVal = DONUT_MOCK_DATA[state.dashboard.donutVehicle || "Jeep"];

    // Update header text value
    const headerValEl = document.getElementById("donut-header-held-val");
    if (headerValEl) {
      headerValEl.innerText = state.language === 'bn' ? convertDigitsToBengali(donutVal.held) : donutVal.held;
    }

    state.charts.donut = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['UR', 'Att', 'Sur'],
        datasets: [{
          data: [donutVal.ur, donutVal.att, donutVal.sur],
          backgroundColor: [
            'rgba(186, 230, 253, 0.85)', // UR: soft blue
            'rgba(254, 215, 170, 0.85)', // Att: soft orange
            'rgba(233, 213, 255, 0.85)'  // Sur: soft lavender
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: {
                family: "'Inter', sans-serif",
                size: 11,
                weight: '600'
              },
              color: '#475569'
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                let val = context.raw || 0;
                if (state.language === 'bn') {
                  label = label === 'UR' ? 'অচল' : (label === 'Att' ? 'সংযুক্ত' : 'উদ্বৃত্ত');
                  return label + ': ' + convertDigitsToBengali(val);
                }
                return label + ': ' + val;
              }
            }
          }
        }
      }
    });
  }
}

export function initLineChart() {
  // --- Line Chart Rendering ---
  const lineCanvas = document.getElementById("total-exp-line-chart");
  if (lineCanvas) {
    if (state.charts.line) {
      state.charts.line.destroy();
    }

    const lineCtx = lineCanvas.getContext("2d");
    const lineVal = state.dashboard.lineChartData || { altData: [], data: [], alt: 0, total: 0 };

    // Calculate dynamic Y-axis scaling based on min/max of active dataset
    const allVals = [];
    if (lineVal.altData && Array.isArray(lineVal.altData)) {
      lineVal.altData.forEach(v => { if (v !== null && v !== undefined) allVals.push(Number(v)); });
    }
    if (lineVal.data && Array.isArray(lineVal.data)) {
      lineVal.data.forEach(v => { if (v !== null && v !== undefined) allVals.push(Number(v)); });
    }

    let yConfig = { min: 0, max: 100, stepSize: 20 };
    if (allVals.length > 0) {
      const dataMin = Math.min(...allVals);
      const dataMax = Math.max(...allVals);
      
      const r = dataMax - dataMin;
      if (r <= 0) {
        const val = dataMin > 0 ? dataMin : 10000;
        const power = Math.floor(Math.log10(val / 4));
        const step = Math.pow(10, power) || 2000;
        const minVal = Math.max(0, val - 2 * step);
        yConfig = { min: minVal, max: minVal + 5 * step, stepSize: step };
      } else {
        const ratioWeights = {
          1.0: 1.0,
          2.0: 1.0,
          5.0: 1.0,
          10.0: 1.0,
          2.5: 0.8,
          1.5: 0.6,
          3.0: 0.5,
          4.0: 0.5,
          6.0: 0.4,
          8.0: 0.4,
          1.2: 0.3
        };
        const power = Math.floor(Math.log10(r / 4));
        const candidates = [];
        const cleanRatios = Object.keys(ratioWeights).map(Number);
        for (const p of [power - 1, power, power + 1]) {
          for (const ratio of cleanRatios) {
            const val = Math.round(ratio * Math.pow(10, p) * 1e6) / 1e6;
            if (!candidates.includes(val)) {
              candidates.push(val);
            }
          }
        }
        candidates.sort((a, b) => a - b);

        const getCleanlinessScore = (val) => {
          let score = 0;
          if (Math.abs(val / 10000 - Math.round(val / 10000)) < 1e-9) score += 1.0;
          else if (Math.abs(val / 5000 - Math.round(val / 5000)) < 1e-9) score += 0.6;
          else if (Math.abs(val / 2000 - Math.round(val / 2000)) < 1e-9) score += 0.3;
          else if (Math.abs(val / 1000 - Math.round(val / 1000)) < 1e-9) score += 0.1;
          return score;
        };

        let best = null;
        for (const c of candidates) {
          const lower = Math.max(dataMin - c, dataMax - 5 * c);
          const upper = Math.min(dataMin, dataMax - 4 * c);
          if (lower <= upper) {
            const stepDiv = c / 10;
            const startK = Math.ceil(lower / stepDiv);
            const endK = Math.floor(upper / stepDiv);
            
            const localCandidates = [lower, upper];
            if (startK <= endK) {
              for (let k = startK; k <= endK; k++) {
                localCandidates.push(k * stepDiv);
              }
            }
            
            const uniqueCandidates = Array.from(new Set(localCandidates));
            
            let bestStart = null;
            let bestScore = -1;
            
            for (const x of uniqueCandidates) {
              if (x < lower || x > upper) continue;
              if (dataMin >= 0 && x < 0) continue;
              
              let score = 0;
              // Check relationship to c for min tick x
              if (Math.abs(x / c - Math.round(x / c)) < 1e-9) score += 1.5;
              else if (Math.abs(x / (c / 2) - Math.round(x / (c / 2))) < 1e-9) score += 0.8;
              else if (Math.abs(x / (c / 5) - Math.round(x / (c / 5))) < 1e-9) score += 0.6;
              else if (Math.abs(x / (c / 10) - Math.round(x / (c / 10))) < 1e-9) score += 0.3;
              
              // Check relationship to c for max tick y = x + 5 * c
              const y = x + 5 * c;
              if (Math.abs(y / c - Math.round(y / c)) < 1e-9) score += 1.5;
              else if (Math.abs(y / (c / 2) - Math.round(y / (c / 2))) < 1e-9) score += 0.8;
              else if (Math.abs(y / (c / 5) - Math.round(y / (c / 5))) < 1e-9) score += 0.6;
              else if (Math.abs(y / (c / 10) - Math.round(y / (c / 10))) < 1e-9) score += 0.3;
              
              // Add number cleanliness scores
              score += getCleanlinessScore(x);
              score += getCleanlinessScore(y);
              
              // Prefer values closer to lower bound
              const distFactor = 0.1 * (1.0 - (x - lower) / (upper - lower + 1e-9));
              score += distFactor;
              
              if (score > bestScore) {
                bestScore = score;
                bestStart = x;
              }
            }
            
            if (bestStart !== null) {
              const startVal = bestStart;
              const target = r / 4;
              const dist = Math.abs(c - target) / target;
              const pVal = Math.floor(Math.log10(c));
              const ratioVal = Math.round((c / Math.pow(10, pVal)) * 100) / 100;
              const cWeight = ratioWeights[ratioVal] || 0.1;
              const totalScore = bestScore + cWeight - 0.1 * dist;
              
              if (best === null || totalScore > best.totalScore) {
                best = { min: startVal, max: startVal + 5 * c, stepSize: c, totalScore: totalScore };
              }
            }
          }
        }
        if (best !== null) {
          yConfig = { min: best.min, max: best.max, stepSize: best.stepSize };
        }
      }
    }

    const gradientAlt = lineCtx.createLinearGradient(0, 0, 0, 140);
    gradientAlt.addColorStop(0, 'rgba(75, 127, 204, 0.24)');
    gradientAlt.addColorStop(1, 'rgba(75, 127, 204, 0.02)');

    const gradientExp = lineCtx.createLinearGradient(0, 0, 0, 140);
    gradientExp.addColorStop(0, 'rgba(248, 113, 113, 0.24)');
    gradientExp.addColorStop(1, 'rgba(248, 113, 113, 0.02)');

    let monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
    if (state.dashboard.lineYear === '2025-26') {
      monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
      monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি'];
    }
    const labels = state.language === 'bn' ? monthsBn : monthsEn;

    const labelAlt = state.language === 'bn' ? 'মোট বরাদ্দ' : 'Total Alt';
    const labelExp = state.language === 'bn' ? 'মোট খরচ' : 'Total Exp';

    state.charts.line = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: labelAlt,
            data: lineVal.altData || [],
            borderColor: '#4b7fcc',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: gradientAlt,
            pointBackgroundColor: '#4b7fcc',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: labelExp,
            data: lineVal.data || [],
            borderColor: '#f87171',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: gradientExp,
            pointBackgroundColor: '#f87171',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: true,
          axis: 'x'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: true,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const val = context.raw;
                return label + ': ' + formatDisplayNumber(val);
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 9,
                weight: '600'
              },
              color: '#64748b'
            }
          },
          y: {
            min: yConfig.min,
            max: yConfig.max,
            afterBuildTicks: function(scale) {
              scale.ticks = [
                { value: yConfig.min },
                { value: yConfig.min + yConfig.stepSize },
                { value: yConfig.min + 2 * yConfig.stepSize },
                { value: yConfig.min + 3 * yConfig.stepSize },
                { value: yConfig.min + 4 * yConfig.stepSize },
                { value: yConfig.min + 5 * yConfig.stepSize }
              ];
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.4)',
              drawBorder: false
            },
            ticks: {
              stepSize: yConfig.stepSize,
              font: {
                family: "'Inter', sans-serif",
                size: 8,
                weight: '600'
              },
              color: '#64748b',
              callback: function(value) {
                return formatDisplayNumber(value);
              }
            }
          }
        }
      }
    });
  }
}

export function initMainDashboardCharts() {
  initDonutChart();
  initLineChart();
}

// --- Language Switch Event Listener (Registered Once at Module Scope) ---
window.addEventListener("languagechange", (e) => {
  const lang = e.detail.language;

  // Update line chart
  if (state.charts.line) {
    state.charts.line.data.datasets[0].label = lang === 'bn' ? 'মোট বরাদ্দ' : 'Total Alt';
    state.charts.line.data.datasets[1].label = lang === 'bn' ? 'মোট খরচ' : 'Total Exp';
    let monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
    if (state.dashboard.lineYear === '2025-26') {
      monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
      monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি'];
    }
    state.charts.line.data.labels = lang === 'bn' ? monthsBn : monthsEn;
    state.charts.line.update();
  }

  // Update donut chart header label
  if (state.charts.donut) {
    const donutVal = DONUT_MOCK_DATA[state.dashboard.donutVehicle || "Jeep"];
    const headerValEl = document.getElementById("donut-header-held-val");
    if (headerValEl) {
      headerValEl.innerText = lang === 'bn' ? convertDigitsToBengali(donutVal.held) : donutVal.held;
    }
    state.charts.donut.update();
  }
});
