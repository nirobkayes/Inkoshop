document.addEventListener('DOMContentLoaded', () => {
    const teacherPortalBtn = document.getElementById('teacher-portal-btn');
    const studentPortalBtn = document.getElementById('student-portal-btn');

    teacherPortalBtn.addEventListener('click', () => {
        window.location.href = 'teacher-login.html';
    });

    studentPortalBtn.addEventListener('click', () => {
        window.location.href = 'student-login.html';
    });
});