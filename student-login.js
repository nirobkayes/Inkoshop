class StudentLogin {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.initEventListeners();
    }

    initEventListeners() {
        const loginForm = document.getElementById('student-login-form');
        const backBtn = document.getElementById('back-btn');

        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const usernameInput = document.getElementById('student-username');
        const passwordInput = document.getElementById('student-password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        const student = this.students.find(
            s => s.username === username && s.password === password
        );

        if (student) {
            // Store login state
            localStorage.setItem('studentLoggedIn', 'true');
            localStorage.setItem('currentStudent', username);
            window.location.href = 'student-dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    }
}

// Initialize login
const studentLogin = new StudentLogin();