class TeacherDashboard {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.videos = JSON.parse(localStorage.getItem('videos')) || [];
        this.comments = JSON.parse(localStorage.getItem('comments')) || {};

        this.initEventListeners();
        this.renderStudentList();
        this.renderVideoList();
        this.renderComments();
    }

    initEventListeners() {
        // Add Student Form
        document.getElementById('add-student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStudent();
        });

        // Add Video Form
        document.getElementById('add-video-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addVideo();
        });

        // Change Password Form
        document.getElementById('change-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changeTeacherPassword();
        });

        // Logout Button
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('teacherLoggedIn');
            window.location.href = 'index.html';
        });
    }

    addStudent() {
        const usernameInput = document.getElementById('new-username');
        const passwordInput = document.getElementById('new-password');

        const newStudent = {
            username: usernameInput.value,
            password: passwordInput.value
        };

        // Check if student already exists
        const existingStudent = this.students.find(s => s.username === newStudent.username);
        if (existingStudent) {
            alert('Student username already exists!');
            return;
        }

        this.students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(this.students));
        
        this.renderStudentList();
        usernameInput.value = '';
        passwordInput.value = '';
    }

    removeStudent(username) {
        this.students = this.students.filter(student => student.username !== username);
        localStorage.setItem('students', JSON.stringify(this.students));
        this.renderStudentList();
    }

    addVideo() {
        const titleInput = document.getElementById('video-title');
        const linkInput = document.getElementById('video-link');

        const newVideo = {
            title: titleInput.value,
            link: linkInput.value,
            id: Date.now().toString()
        };

        this.videos.push(newVideo);
        localStorage.setItem('videos', JSON.stringify(this.videos));
        
        this.renderVideoList();
        titleInput.value = '';
        linkInput.value = '';
    }

    removeVideo(videoId) {
        this.videos = this.videos.filter(video => video.id !== videoId);
        localStorage.setItem('videos', JSON.stringify(this.videos));
        this.renderVideoList();
    }

    renderStudentList() {
        const studentsList = document.getElementById('students-ul');
        studentsList.innerHTML = '';

        this.students.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${student.username}
                <button onclick="dashboard.removeStudent('${student.username}')">Remove</button>
            `;
            studentsList.appendChild(li);
        });
    }

    renderVideoList() {
        const videosList = document.getElementById('videos-ul');
        videosList.innerHTML = '';

        this.videos.forEach(video => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${video.title}
                <button onclick="dashboard.removeVideo('${video.id}')">Remove</button>
            `;
            videosList.appendChild(li);
        });
    }

    renderComments() {
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';

        Object.entries(this.comments).forEach(([videoId, videoComments]) => {
            const videoTitle = this.videos.find(v => v.id === videoId)?.title || 'Untitled Video';
            
            const videoCommentsSection = document.createElement('div');
            videoCommentsSection.innerHTML = `<h4>${videoTitle}</h4>`;

            videoComments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.innerHTML = `
                    <p>${comment.username}: ${comment.text}</p>
                    <button onclick="dashboard.replyToComment('${videoId}', '${comment.id}')">Reply</button>
                `;
                videoCommentsSection.appendChild(commentElement);
            });

            commentsList.appendChild(videoCommentsSection);
        });
    }

    replyToComment(videoId, commentId) {
        const reply = prompt('Enter your reply:');
        if (reply) {
            const comment = this.comments[videoId].find(c => c.id === commentId);
            if (comment) {
                comment.replies = comment.replies || [];
                comment.replies.push({
                    text: reply,
                    timestamp: new Date().toISOString()
                });

                localStorage.setItem('comments', JSON.stringify(this.comments));
                this.renderComments();
            }
        }
    }

    changeTeacherPassword() {
        const currentPasswordInput = document.getElementById('current-password');
        const newPasswordInput = document.getElementById('new-teacher-password');
        const confirmPasswordInput = document.getElementById('confirm-new-password');

        if (newPasswordInput.value !== confirmPasswordInput.value) {
            alert('New passwords do not match!');
            return;
        }

        // In a real application, you'd verify the current password more securely
        localStorage.setItem('teacherPassword', newPasswordInput.value);
        alert('Teacher portal password updated successfully');

        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
    }
}

// Initialize dashboard
const dashboard = new TeacherDashboard();
window.dashboard = dashboard;