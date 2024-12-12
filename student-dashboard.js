class StudentDashboard {
    constructor() {
        this.videos = JSON.parse(localStorage.getItem('videos')) || [];
        this.comments = JSON.parse(localStorage.getItem('comments')) || {};
        this.currentStudent = localStorage.getItem('currentStudent');
        this.currentVideoIndex = 0;
        this.player = null;

        this.initializeUI();
        this.initEventListeners();
    }

    initializeUI() {
        // Display student name
        document.getElementById('student-name').textContent = this.currentStudent;

        // Render video list
        const videoList = document.getElementById('video-list');
        videoList.innerHTML = '';

        this.videos.forEach((video, index) => {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');
            videoCard.innerHTML = `
                <h3>${video.title}</h3>
                <button onclick="studentDashboard.openVideoModal(${index})">Play Video</button>
            `;
            videoList.appendChild(videoCard);
        });
    }

    initEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        const closeBtn = document.querySelector('.close-btn');
        const videoModal = document.getElementById('video-modal');
        const commentForm = document.getElementById('comment-form');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const nextVideoBtn = document.getElementById('next-video-btn');
        const speedSelector = document.getElementById('speed-selector');

        logoutBtn.addEventListener('click', this.logout);
        closeBtn.addEventListener('click', this.closeVideoModal);
        commentForm.addEventListener('submit', (e) => this.postComment(e));
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        nextVideoBtn.addEventListener('click', () => this.playNextVideo());
        speedSelector.addEventListener('change', (e) => this.changePlaybackSpeed(e.target.value));

        // Close modal if clicked outside
        window.addEventListener('click', (e) => {
            const videoModal = document.getElementById('video-modal');
            if (e.target === videoModal) {
                this.closeVideoModal();
            }
        });
    }

    openVideoModal(index) {
        this.currentVideoIndex = index;
        const videoModal = document.getElementById('video-modal');
        videoModal.style.display = 'block';
        this.initializeYouTubePlayer(this.videos[index].link);
        this.renderComments(this.videos[index].id);
    }

    initializeYouTubePlayer(videoLink) {
        const videoId = this.extractYouTubeId(videoLink);
        
        if (this.player) {
            this.player.destroy();
        }

        this.player = new YT.Player('video-player', {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
                'controls': 0 // Disable default YouTube controls
            }
        });
    }

    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    togglePlayPause() {
        if (!this.player) return;
        
        if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }

    playNextVideo() {
        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
        this.initializeYouTubePlayer(this.videos[this.currentVideoIndex].link);
        this.renderComments(this.videos[this.currentVideoIndex].id);
    }

    changePlaybackSpeed(speed) {
        if (this.player) {
            this.player.setPlaybackRate(parseFloat(speed));
        }
    }

    closeVideoModal() {
        const videoModal = document.getElementById('video-modal');
        videoModal.style.display = 'none';
        
        if (this.player) {
            this.player.stopVideo();
        }
    }

    postComment(e) {
        e.preventDefault();
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value.trim();

        if (!commentText) return;

        const currentVideoId = this.videos[this.currentVideoIndex].id;
        
        if (!this.comments[currentVideoId]) {
            this.comments[currentVideoId] = [];
        }

        const newComment = {
            id: Date.now().toString(),
            username: this.currentStudent,
            text: commentText,
            timestamp: new Date().toISOString()
        };

        this.comments[currentVideoId].push(newComment);
        
        // Save to localStorage
        localStorage.setItem('comments', JSON.stringify(this.comments));

        // Render comments
        this.renderComments(currentVideoId);

        // Clear input
        commentInput.value = '';
    }

    renderComments(videoId) {
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = '';

        const videoComments = this.comments[videoId] || [];

        videoComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <strong>${comment.username}</strong>
                <p>${comment.text}</p>
                <small>${new Date(comment.timestamp).toLocaleString()}</small>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }

    logout() {
        localStorage.removeItem('studentLoggedIn');
        localStorage.removeItem('currentStudent');
        window.location.href = 'index.html';
    }
}

// Global initialization for YouTube API
function onYouTubeIframeAPIReady() {
    window.studentDashboard = new StudentDashboard();
}