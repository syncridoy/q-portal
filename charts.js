import { state, DONUT_MOCK_DATA, LINE_MOCK_DATA } from './state.js';
import { TRANSLATIONS, convertDigitsToBengali, formatDisplayNumber } from './translations.js';

export function initMainDashboardCharts() {
  // --- Donut Chart Rendering ---
  const donutCanvas = document.getElementById("held-donut-chart");
  if (donutCanvas) {
    if (state.charts.donut) {
      state.charts.donut.destroy();
    }
    
    const donutCtx = donutCanvas.getContext("2d");
    const donutVal = DONUT_MOCK_DATA[state.dashboard.donutVehicle || "Jeep"];

    // Update centered text overlay values
    const centerValEl = document.getElementById("donut-center-val");
    if (centerValEl) {
      centerValEl.innerText = state.language === 'bn' ? convertDigitsToBengali(donutVal.held) : donutVal.held;
    }
    const centerLblEl = document.getElementById("donut-center-label");
    if (centerLblEl) {
      centerLblEl.innerText = TRANSLATIONS[state.language]["card_title_held"] || "Held";
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
        cutout: '70%',
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
                  label = label === 'UR' ? 'ইউআর' : (label === 'Att' ? 'সংযুক্ত' : 'উদ্বৃত্ত');
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

  // --- Line Chart Rendering ---
  const lineCanvas = document.getElementById("total-exp-line-chart");
  if (lineCanvas) {
    if (state.charts.line) {
      state.charts.line.destroy();
    }

    const lineCtx = lineCanvas.getContext("2d");
    const lineVal = LINE_MOCK_DATA[state.dashboard.lineYear || "2025-26"][state.dashboard.lineGrade || "Diesel"];

    const gradient = lineCtx.createLinearGradient(0, 0, 0, 140);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
    const labels = state.language === 'bn' ? monthsBn : monthsEn;

    state.charts.line = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: lineVal.data,
          borderColor: '#3b82f6',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          backgroundColor: gradient,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const val = context.raw;
                return (state.language === 'bn' ? 'ব্যয়: ' : 'Exp: ') + formatDisplayNumber(val);
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
            grid: {
              color: 'rgba(226, 232, 240, 0.4)',
              drawBorder: false
            },
            ticks: {
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
