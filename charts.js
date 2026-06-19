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

  // --- Line Chart Language Switch Event Listener ---
  window.addEventListener("languagechange", (e) => {
    if (state.charts.line) {
      const lang = e.detail.language;
      state.charts.line.data.datasets[0].label = lang === 'bn' ? 'মোট বরাদ্দ' : 'Total Alt';
      state.charts.line.data.datasets[1].label = lang === 'bn' ? 'মোট খরচ' : 'Total Exp';
      let monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      let monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
      if (state.dashboard.lineYear === '2025-26') {
        monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ'];
      }
      state.charts.line.data.labels = lang === 'bn' ? monthsBn : monthsEn;
      state.charts.line.update();
    }
  });

  // --- Line Chart Rendering ---
  const lineCanvas = document.getElementById("total-exp-line-chart");
  if (lineCanvas) {
    if (state.charts.line) {
      state.charts.line.destroy();
    }

    const lineCtx = lineCanvas.getContext("2d");
    const lineVal = state.dashboard.lineChartData || { altData: [], data: [], alt: 0, total: 0 };

    const gradeYConfig = {
      "Diesel": { min: 80000, max: 130000, stepSize: 10000 },
      "MS-74": { min: 30000, max: 80000, stepSize: 10000 },
      "100 Octane": { min: 10000, max: 60000, stepSize: 10000 }
    };
    const currentGradeConfig = gradeYConfig[state.dashboard.lineGrade || "Diesel"] || gradeYConfig["Diesel"];

    const gradientAlt = lineCtx.createLinearGradient(0, 0, 0, 140);
    gradientAlt.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
    gradientAlt.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const gradientExp = lineCtx.createLinearGradient(0, 0, 0, 140);
    gradientExp.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
    gradientExp.addColorStop(1, 'rgba(239, 68, 68, 0)');

    let monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
    if (state.dashboard.lineYear === '2025-26') {
      monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ'];
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
            borderColor: '#3b82f6',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: gradientAlt,
            pointBackgroundColor: '#3b82f6',
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
            min: currentGradeConfig.min,
            max: currentGradeConfig.max,
            grid: {
              color: 'rgba(226, 232, 240, 0.4)',
              drawBorder: false
            },
            ticks: {
              stepSize: currentGradeConfig.stepSize,
              maxTicksLimit: 6,
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
