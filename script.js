function addRow() {
    const table = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const rowIndex = table.rows.length; // به‌دست آوردن شماره ردیف جدید

    newRow.innerHTML = `
        <td class="row-number">${rowIndex}</td> <!-- شماره ردیف -->
        <td><input type="text" name="courseName" placeholder="(اختیاری)"></td>
        <td><input type="number" name="courseGrade" placeholder="از 20 نمره" max="20" min="0"></td>
        <td><input type="number" name="courseUnits" placeholder="مثلا 2 واحد"></td>
        <td><button id="button_x" onclick="removeRow(this)">X</button></td>
    `;

    // اضافه کردن کلاس انیمیشن برای اضافه کردن ردیف
    newRow.classList.add('fade-in');
    setTimeout(() => newRow.classList.remove('fade-in'), 500); // حذف کلاس انیمیشن پس از اتمام

    updateRowNumbers(); // به‌روزرسانی شماره ردیف‌ها
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    
    // اضافه کردن کلاس انیمیشن برای حذف کردن ردیف
    row.classList.add('fade-out');
    setTimeout(() => {
        row.parentNode.removeChild(row);
        updateRowNumbers(); // به‌روزرسانی شماره ردیف‌ها پس از حذف یک ردیف
    }, 500); // زمان انیمیشن باید با زمان تعریف شده در CSS هماهنگ باشد
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

    // نمایش پیام موفقیت
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000); // پیام بعد از 3 ثانیه مخفی می‌شود
}

function loadGrades() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const tableBody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    courses.forEach((course, index) => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td class="row-number">${index + 1}</td> <!-- شماره ردیف -->
            <td><input type="text" name="courseName" value="${course.name}" placeholder="(اختیاری)"></td>
            <td><input type="number" name="courseGrade" value="${course.grade}" placeholder="از 20 نمره" max="20" min="0"></td>
            <td><input type="number" name="courseUnits" value="${course.units}" placeholder="مثلا 2 واحد"></td>
            <td><button id="button_x" onclick="removeRow(this)">X</button></td>
        `;
    });
    updateRowNumbers(); // به‌روزرسانی شماره ردیف‌ها
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

function addRequiredCourses() {
    fetch('requiredCourses.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];

            data.forEach((course, index) => {
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                    <td class="row-number">${tableBody.rows.length + 1}</td> <!-- شماره ردیف -->
                    <td><input type="text" name="courseName" value="${course.name}" placeholder="(اختیاری)" readonly></td>
                    <td><input type="number" name="courseGrade" placeholder="از 20 نمره" max="20" min="0"></td>
                    <td><input type="number" name="courseUnits" value="${course.units}" placeholder="مثلا 2 واحد" readonly></td>
                    <td><button id="button_x" onclick="removeRow(this)">X</button></td>
                `;
                newRow.classList.add('fade-in');
                setTimeout(() => newRow.classList.remove('fade-in'), 500); // حذف کلاس انیمیشن پس از اتمام
            });
            updateRowNumbers(); // به‌روزرسانی شماره ردیف‌ها
        })
        .catch(error => console.error('Error loading required courses:', error));
}

function updateRowNumbers() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        rows[i].getElementsByClassName('row-number')[0].innerText = i + 1;
    }
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