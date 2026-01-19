// Dashboard logic placeholder
// Currently used only for future enhancements

// Attendance Percentage Chart
new Chart(document.getElementById('attendanceChart'), {
    type: 'doughnut',
    data: {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [82, 18]
        }]
    }
});

// Employee Performance Chart
new Chart(document.getElementById('employeePerformanceChart'), {
    type: 'bar',
    data: {
        labels: ['Work Quality', 'Teamwork', 'Punctuality'],
        datasets: [{
            label: 'Score (out of 5)',
            data: [4.2, 3.8, 4.5]
        }]
    },
    options: {
        scales: {
            y: {
                min: 0,
                max: 5
            }
        }
    }
});

