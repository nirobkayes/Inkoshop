// Store teacher password (can be changed dynamically)
let TEACHER_PASSWORD = 'onlyteachers';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('teacher-login-form');
    const backBtn = document.getElementById('back-btn');

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passwordInput = document.getElementById('teacher-password').value;

        if (passwordInput === TEACHER_PASSWORD) {
            // Store login state (you might want to use more secure methods in production)
            localStorage.setItem('teacherLoggedIn', 'true');
            window.location.href = 'teacher-dashboard.html';
        } else {
            alert('Incorrect Password');
        }
    });

    // Function to allow password change
    function changeTeacherPassword(newPassword) {
        TEACHER_PASSWORD = newPassword;
        // Optional: You might want to save this to localStorage or a backend
        alert('Teacher portal password updated successfully');
    }
});