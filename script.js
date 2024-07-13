function addRow() {
    const table = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="text" name="courseName" placeholder="(اختیاری)"></td>
        <td><input type="number" name="courseGrade" placeholder="از 20 نمره" max="20" min="0"></td>
        <td><input type="number" name="courseUnits" placeholder="مثلا 2 واحد"></td>
        <td><button id="button_x" onclick="removeRow(this)">X</button></td>
    `;
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function calculateGPA() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let totalUnits = 0;
    let totalPoints = 0;

    for (let i = 0; i < rows.length; i++) {
        const grade = parseFloat(rows[i].getElementsByTagName('input')[1].value);
        const units = parseFloat(rows[i].getElementsByTagName('input')[2].value);
        if (!isNaN(units) && !isNaN(grade)) {
            totalUnits += units;
            totalPoints += units * grade;
        }
    }

    const gpa = totalPoints / totalUnits;
    document.getElementById('gpaResult').innerText = `معدل کل: ${gpa.toFixed(2)}`;
}

function saveGrades() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const courses = [];

    for (let i = 0; i < rows.length; i++) {
        const name = rows[i].getElementsByTagName('input')[0].value;
        const grade = rows[i].getElementsByTagName('input')[1].value;
        const units = rows[i].getElementsByTagName('input')[2].value;
        if (name || grade || units) {
            courses.push({ name, grade, units });
        }
    }

    localStorage.setItem('courses', JSON.stringify(courses));
}

function loadGrades() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const tableBody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    courses.forEach(course => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td><input type="text" name="courseName" value="${course.name}" placeholder="(اختیاری)"></td>
            <td><input type="number" name="courseGrade" value="${course.grade}" placeholder="از 20 نمره" max="20" min="0"></td>
            <td><input type="number" name="courseUnits" value="${course.units}" placeholder="مثلا 2 واحد"></td>
            <td><button id="button_x" onclick="removeRow(this)">X</button></td>
        `;
    });
}

document.addEventListener('DOMContentLoaded', loadGrades);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/GPA/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}
function clearCache() {
    localStorage.clear(); // تمام مقادیر ذخیره شده در localStorage را پاک می‌کند
    location.reload();
}
function showSuccessMessage() {
    const messageElement = document.getElementById('successMessage');
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10); // مقدار کوچکی از تأخیر برای فعال‌سازی ترنزیشن

    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 500); // زمان تطابق با مدت ترنزیشن در CSS
    }, 2000); // پیام بعد از 2 ثانیه مخفی می‌شود
}

function saveGrades() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const courses = [];

    for (let i = 0; i < rows.length; i++) {
        const name = rows[i].getElementsByTagName('input')[0].value;
        const grade = rows[i].getElementsByTagName('input')[1].value;
        const units = rows[i].getElementsByTagName('input')[2].value;
        if (name || grade || units) {
            courses.push({ name, grade, units });
        }
    }

    localStorage.setItem('courses', JSON.stringify(courses));
    showSuccessMessage(); // نمایش پیام موفقیت
}
