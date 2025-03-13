let capacity = 0;
let projects = [];

// Set Capacity
document.getElementById('setCapacity').addEventListener('click', () => {
    const inputCapacity = parseInt(document.getElementById('capacity').value);
    if (isNaN(inputCapacity) || inputCapacity <= 0) {
        return;
    }
    capacity = inputCapacity;
    document.getElementById('currentCapacity').textContent = capacity;
});

// Add Project
document.getElementById('addProject').addEventListener('click', () => {
    const name = document.getElementById('projectName').value.trim();
    const value = parseInt(document.getElementById('projectValue').value);
    const weight = parseInt(document.getElementById('projectWeight').value);

    // Validate inputs
    if (!name || isNaN(value) || value <= 0 || isNaN(weight) || weight <= 0) {
        alert('Please provide valid project details!');
        return;
    }

    // Add to project list
    projects.push({ name, value, weight });
    updateProjectList();

    // Clear input fields
    document.getElementById('projectName').value = '';
    document.getElementById('projectValue').value = '';
    document.getElementById('projectWeight').value = '';
});

// Update Project List
function updateProjectList() {
    const tbody = document.getElementById('projectList').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    projects.forEach((project, index) => {
        const row = document.createElement('tr');

        // Create table cells
        const nameCell = document.createElement('td');
        nameCell.textContent = project.name;

        const valueCell = document.createElement('td');
        valueCell.textContent = project.value;

        const weightCell = document.createElement('td');
        weightCell.textContent = project.weight;

        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => removeProject(index));
        actionCell.appendChild(removeButton);

        // Append cells to row
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(weightCell);
        row.appendChild(actionCell);

        // Append row to table body
        tbody.appendChild(row);
    });
}

// Remove Project
function removeProject(index) {
    projects.splice(index, 1);
    updateProjectList();
}

// Optimize Selection
document.getElementById('optimizeSelection').addEventListener('click', () => {
    const result = knapsack(capacity, projects);
    document.getElementById('optimizedValue').textContent = result.value;
    document.getElementById('selectedProjects').textContent = result.items.map(item => item.name).join(', ');

    // Render charts
    const selectedProjects = result.items;
    const unselectedProjects = projects.filter(project => !selectedProjects.includes(project));
    renderCharts(selectedProjects, unselectedProjects);
});

// Knapsack Function
function knapsack(capacity, projects) {
    const n = projects.length;
    const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (projects[i - 1].weight <= w) {
                dp[i][w] = Math.max(
                    projects[i - 1].value + dp[i - 1][w - projects[i - 1].weight],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    const items = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            items.push(projects[i - 1]);
            w -= projects[i - 1].weight;
        }
    }

    return { value: dp[n][capacity], items };
}

// Render Charts
function renderCharts(selectedProjects, unselectedProjects) {
    const barCanvas = document.getElementById('barChart');
    const pieCanvas = document.getElementById('pieChart');

    // Bar Chart: Values of Selected vs Unselected Projects
    new Chart(barCanvas, {
        type: 'bar',
        data: {
            labels: ['Selected Projects', 'Unselected Projects'],
            datasets: [{
                label: 'Total Value',
                data: [
                    selectedProjects.reduce((sum, project) => sum + project.value, 0),
                    unselectedProjects.reduce((sum, project) => sum + project.value, 0)
                ],
                backgroundColor: ['#56ab2f', '#a8e063']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Value Comparison' }
            }
        }
    });

    // Pie Chart: Distribution of Selected Projects
    new Chart(pieCanvas, {
        type: 'pie',
        data: {
            labels: selectedProjects.map(project => project.name),
            datasets: [{
                data: selectedProjects.map(project => project.value),
                backgroundColor: selectedProjects.map((_, i) =>
                    `hsl(84, 100%, 50%)`
                )
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: 'Selected Project Distribution' }
            }
        }
    });
    // Render Charts
function renderCharts(selectedProjects, unselectedProjects) {
    // Bar Chart: Values of Selected vs Unselected Projects
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: ['Selected Projects', 'Unselected Projects'],
            datasets: [{
                label: 'Total Value',
                data: [
                    selectedProjects.reduce((sum, project) => sum + project.value, 0),
                    unselectedProjects.reduce((sum, project) => sum + project.value, 0)
                ],
                backgroundColor: ['#56ab2f', '#a8e063']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Value Comparison' }
            }
        }
    });

    // Pie Chart: Distribution of Selected Projects
    new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: selectedProjects.map(project => project.name),
            datasets: [{
                data: selectedProjects.map(project => project.value),
                backgroundColor: selectedProjects.map((_, i) =>
                    `hsl(${i * 40}, 70%, 50%)`
                )
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: 'Selected Project Distribution' }
            }
        }
    });
}

}
