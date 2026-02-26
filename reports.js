// Sample PC data
const pcs = [
    { plant: 'Plant A', department: 'IT', status: 'Not Replaced' },
    { plant: 'Plant B', department: 'HR', status: 'Replaced' },
    { plant: 'Plant A', department: 'IT', status: 'Replaced' },
    { plant: 'Plant C', department: 'Finance', status: 'Not Replaced' },
    { plant: 'Plant B', department: 'HR', status: 'Not Replaced' },
];

// ====== Replaced vs Not Replaced Pie Chart ======
const statusCounts = pcs.reduce((acc, pc) => {
    acc[pc.status] = (acc[pc.status] || 0) + 1;
    return acc;
}, {});

const ctxStatus = document.getElementById('statusChart').getContext('2d');
new Chart(ctxStatus, {
    type: 'pie',
    data: {
        labels: Object.keys(statusCounts),
        datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#10b981','#fee2e2'],
            borderColor: ['#065f46','#991b1b'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
    }
});

// ====== PCs by Plant Bar Chart ======
const plantCounts = pcs.reduce((acc, pc) => {
    acc[pc.plant] = (acc[pc.plant] || 0) + 1;
    return acc;
}, {});

const ctxPlant = document.getElementById('plantChart').getContext('2d');
new Chart(ctxPlant, {
    type: 'bar',
    data: {
        labels: Object.keys(plantCounts),
        datasets: [{
            label: 'Number of PCs',
            data: Object.values(plantCounts),
            backgroundColor: '#3b82f6'
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } }
    }
});

// ====== PCs by Department Bar Chart ======
const deptCounts = pcs.reduce((acc, pc) => {
    acc[pc.department] = (acc[pc.department] || 0) + 1;
    return acc;
}, {});

const ctxDept = document.getElementById('deptChart').getContext('2d');
new Chart(ctxDept, {
    type: 'bar',
    data: {
        labels: Object.keys(deptCounts),
        datasets: [{
            label: 'Number of PCs',
            data: Object.values(deptCounts),
            backgroundColor: '#f59e0b'
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } }
    }
});