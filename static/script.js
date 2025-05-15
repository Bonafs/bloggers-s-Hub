// Responsive nav menu
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// Dark mode toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Blog post data (sample)
const blogPosts = [
    {
        id: 1,
        title: "Welcome to Bloggers' Hub",
        content: "This is the first post on Bloggers' Hub. Stay tuned for more updates and stories from our community!",
        author: "Admin",
        date: "2025-05-15",
        category: "news",
        likes: 2,
        comments: [
            { author: "Jane", text: "Excited for this platform!" }
        ]
    },
    {
        id: 2,
        title: "Tech Trends 2025",
        content: "Let's explore the latest technology trends for 2025, including AI, IoT, and more.",
        author: "Techie",
        date: "2025-05-14",
        category: "tech",
        likes: 5,
        comments: [
            { author: "Alex", text: "Great insights!" }
        ]
    },
    {
        id: 3,
        title: "Healthy Lifestyle Tips",
        content: "Discover simple lifestyle changes that can improve your health and well-being.",
        author: "WellnessPro",
        date: "2025-05-13",
        category: "lifestyle",
        likes: 3,
        comments: []
    }
];

// Render blog posts
function renderPosts(posts) {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;
    blogList.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'blog-post';
        postDiv.innerHTML = `
            <div class="post-title" onclick="openModal(${post.id})">${post.title}</div>
            <div class="post-meta">By ${post.author} | ${post.date} | <span class="post-category">${capitalize(post.category)}</span></div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button class="like-btn" onclick="likePost(${post.id})">👍 <span id="like-count-${post.id}">${post.likes}</span></button>
                <button class="comment-btn" onclick="toggleComments(${post.id})">💬 Comments (${post.comments.length})</button>
            </div>
            <div class="comment-section" id="comments-${post.id}" style="display:none;">
                <div class="comment-list">
                    ${post.comments.map(c => `<div class="comment"><span class="comment-author">${c.author}:</span> <span class="comment-text">${c.text}</span></div>`).join('')}
                </div>
                <form onsubmit="addComment(event, ${post.id})">
                    <input type="text" name="author" placeholder="Your name" required>
                    <input type="text" name="text" placeholder="Your comment" required>
                    <button type="submit" class="comment-btn">Add Comment</button>
                </form>
            </div>
        `;
        blogList.appendChild(postDiv);
    });
}

// Capitalize category
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Like post
function likePost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (post) {
        post.likes += 1;
        document.getElementById(`like-count-${id}`).textContent = post.likes;
    }
}

// Toggle comments
function toggleComments(id) {
    const section = document.getElementById(`comments-${id}`);
    if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
    }
}

// Add comment
function addComment(event, id) {
    event.preventDefault();
    const form = event.target;
    const author = form.author.value.trim();
    const text = form.text.value.trim();
    if (author && text) {
        const post = blogPosts.find(p => p.id === id);
        if (post) {
            post.comments.push({ author, text });
            renderPosts(filteredPosts());
        }
    }
}

// Modal for post details
function openModal(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${post.title}</h2>
        <div class="post-meta">By ${post.author} | ${post.date} | <span class="post-category">${capitalize(post.category)}</span></div>
        <div class="post-content">${post.content}</div>
        <div class="comment-list">
            <h3>Comments</h3>
            ${post.comments.length ? post.comments.map(c => `<div class="comment"><span class="comment-author">${c.author}:</span> <span class="comment-text">${c.text}</span></div>`).join('') : '<div>No comments yet.</div>'}
        </div>
    `;
    modal.style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Filtering and search
function filteredPosts() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    let posts = blogPosts;
    if (categoryFilter && categoryFilter.value !== 'all') {
        posts = posts.filter(p => p.category === categoryFilter.value);
    }
    if (searchInput && searchInput.value.trim()) {
        const q = searchInput.value.trim().toLowerCase();
        posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }
    return posts;
}

// Event listeners for filtering
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blog-list')) {
        renderPosts(blogPosts);
        document.getElementById('searchInput').addEventListener('input', () => renderPosts(filteredPosts()));
        document.getElementById('categoryFilter').addEventListener('change', () => renderPosts(filteredPosts()));
    }
    // Modal close on outside click
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
});

