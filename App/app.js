const stateSelect = document.getElementById("stateSelect");
const barChartCanvas = document.getElementById("barChart").getContext("2d");


let currentChart = null;

fetch("http://localhost:8000/GEO_UFO.geojson")
  .then((response) => response.json())
  .then((data) => {
    const sightings = data.features;

    console.log(sightings);
    const states = [...new Set(sightings.map((sighting) => sighting.properties.State))];

    states.sort();

    states.forEach((state) => {
      const option = document.createElement("option");
      option.textContent = state;
      stateSelect.appendChild(option);
    });

    // chart
    updateChart(sightings, states[0]);

    stateSelect.addEventListener("change", () => {
      const selectedState = stateSelect.value;
      updateChart(sightings, selectedState);
    });
  })
  .catch((error) => console.error("Error loading data:", error));

function updateChart(sightings, selectedState) {
  const filteredSightings = sightings.filter((sighting) => sighting.properties.State === selectedState);

  const sightingsByMonth = {};

  filteredSightings.forEach((sighting) => {
    const dateParts = sighting.properties.Date.split("/");
    const month = dateParts[0];

    if (sightingsByMonth[month]) {
      sightingsByMonth[month]++;
    } else {
      sightingsByMonth[month] = 1;
    }
  });

  const months = Object.keys(sightingsByMonth);
  const sightingCounts = months.map((month) => sightingsByMonth[month]);

  // Destroy existing chart if exists
  if (currentChart) {
    currentChart.destroy();
  }

  // Create new chart
  currentChart = new Chart(barChartCanvas, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: `UFO Sightings in ${selectedState}`,
          data: sightingCounts,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Sightings",
          },
        },
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
      },
    },
  });
}

