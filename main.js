    const username = "TheRealDuckers";
    const apiKey = "0bc8bd5a-463d-4a8a-be8b-457ef651742d";

    const excludedProjects = ["MySecretProject"];
    const excludedLanguages = ["Other", "<<LAST_LANGUAGE>>"];

    fetch(`https://hackatime.hackclub.com/api/v1/users/${username}/stats?api_key=${apiKey}`)
      .then(res => res.json())
      .then(json => {
        const data = json.data;

        // Filter projects
        const filteredProjects = (data.projects || []).filter(
          proj => !excludedProjects.includes(proj.name)
        );
        const excludedProjectSeconds = (data.projects || [])
          .filter(proj => excludedProjects.includes(proj.name))
          .reduce((sum, proj) => sum + proj.total_seconds, 0);

        // Filter languages
        const filteredLanguages = (data.languages || []).filter(
          lang => !excludedLanguages.includes(lang.name)
        );
        const excludedLanguageSeconds = (data.languages || [])
          .filter(lang => excludedLanguages.includes(lang.name))
          .reduce((sum, lang) => sum + lang.total_seconds, 0);

        // Adjust total time
        const adjustedTotalSeconds = data.total_seconds - excludedProjectSeconds - excludedLanguageSeconds;
        const adjustedTotalText = `${Math.floor(adjustedTotalSeconds / 3600)}h ${Math.floor((adjustedTotalSeconds % 3600) / 60)}m`;

        // Display stats
        document.getElementById("allTime").textContent = adjustedTotalText;
        document.getElementById("dailyAvg").textContent = data.human_readable_daily_average;

        const topLang = filteredLanguages.reduce((max, lang) => lang.total_seconds > max.total_seconds ? lang : max, filteredLanguages[0]);
        document.getElementById("topLang").textContent = topLang ? `${topLang.name} (${topLang.text})` : "None";

        // Language Pie Chart
        const langLabels = filteredLanguages.map(lang => lang.name);
        const langValues = filteredLanguages.map(lang => lang.total_seconds);
        const langColors = ['#00ffcc', '#ff6b6b', '#feca57', '#5f27cd', '#54a0ff', '#1dd1a1', '#ff9ff3'];

        new Chart(document.getElementById("langChart"), {
          type: 'pie',
          data: {
            labels: langLabels,
            datasets: [{
              data: langValues,
              backgroundColor: langColors,
              borderColor: '#222',
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              legend: {
                labels: { color: '#e0e0e0' }
              },
              title: {
                display: true,
                text: 'Language Breakdown (Excluding Hidden)',
                color: '#00ffcc',
                font: { size: 18 }
              }
            }
          }
        });

        // Project Bar Chart
        const projLabels = filteredProjects.map(proj => proj.name);
        const projValues = filteredProjects.map(proj => proj.total_seconds / 3600); // convert to hours

        new Chart(document.getElementById("projectChart"), {
          type: 'bar',
          data: {
            labels: projLabels,
            datasets: [{
              label: 'Hours Coded',
              data: projValues,
              backgroundColor: '#00ffcc',
              borderColor: '#00ffcc',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                ticks: { color: '#e0e0e0' },
                grid: { color: '#333' }
              },
              y: {
                beginAtZero: true,
                ticks: { color: '#e0e0e0' },
                grid: { color: '#333' }
              }
            },
            plugins: {
              legend: {
                labels: { color: '#e0e0e0' }
              },
              title: {
                display: true,
                text: 'Project Time',
                color: '#00ffcc',
                font: { size: 18 }
              }
            }
          }
        });
      })
      .catch(err => {
        console.error("Error loading stats:", err);
      });
