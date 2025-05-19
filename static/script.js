// --- BLOG PAGE LOGIC ---

// Theme toggle (shared)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Burger menu (shared)
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function () {
    // Only run blog logic if on blog.html
    if (!document.getElementById('addPostForm')) return;

    // Inject .modal-list vertical style for search modal
    const style = document.createElement('style');
    style.textContent = `
        .modal-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Set the current date in the date field on page load and restrict to today only
    const today = new Date().toISOString().split('T')[0];
    const postDate = document.getElementById('postDate');
    if (postDate) {
        postDate.value = today;
        postDate.setAttribute('min', today);
        postDate.setAttribute('max', today);
    }

    // Store blog post references for search
    let blogPostRefs = [];

    // Add a new blog post
    document.getElementById('addPostForm').addEventListener('submit', function (event) {
        event.preventDefault();

        document.getElementById('postAlert').innerHTML = '';

        const postTopic = document.getElementById('postTopic').value;
        const postAuthor = document.getElementById('postAuthor').value;
        const postDate = document.getElementById('postDate').value;
        const postContent = document.getElementById('postContent').value;
        const postConfirm = document.getElementById('postConfirm').checked;

        if (!postTopic.trim()) {
            document.getElementById('postTopic').focus();
            return;
        }
        if (!postAuthor.trim()) {
            document.getElementById('postAuthor').focus();
            return;
        }
        if (!postDate) {
            alert('The date is required. Please select a date.');
            document.getElementById('postDate').focus();
            return;
        }
        if (postDate !== today) {
            alert('The date must be today.');
            document.getElementById('postDate').focus();
            return;
        }
        if (!postContent.trim()) {
            document.getElementById('postContent').focus();
            return;
        }
        if (!postConfirm) {
            document.getElementById('postAlert').innerHTML = `
                <span class="inline-alert">
                    <input type="checkbox" id="postConfirmInline" onclick="document.getElementById('postConfirm').checked=this.checked;document.getElementById('postAlert').innerHTML='';" style="margin-right:0.5rem;">
                    Please confirm you have checked your blog for accuracy, grammar, and spelling.
                </span>
            `;
            document.getElementById('postConfirmInline').focus();
            return;
        }

        const blogPosts = document.querySelector('.blog-posts');
        if (!blogPosts) return;

        const postDiv = document.createElement('div');
        postDiv.className = 'blog-post';
        postDiv.setAttribute('data-author', postAuthor);

        // Assign a unique id for search navigation
        const postId = 'blog-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        postDiv.id = postId;

        const postTitle = document.createElement('h3');
        postTitle.textContent = `${postTopic} - by ${postAuthor} on ${postDate}`;
        postDiv.appendChild(postTitle);

        const postText = document.createElement('p');
        postText.textContent = postContent;
        postText.className = 'post-content';
        postDiv.appendChild(postText);

        // Emoji container
        const emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-container';
        emojiContainer.innerHTML = `
            <button type="button" onclick="incrementEmoji(this, '👍')">👍 <span class="emoji-count">0</span></button>
            <button type="button" onclick="incrementEmoji(this, '❤️')">❤️ <span class="emoji-count">0</span></button>
            <button type="button" onclick="incrementEmoji(this, '😂')">😂 <span class="emoji-count">0</span></button>
            <button type="button" onclick="incrementEmoji(this, '😮')">😮 <span class="emoji-count">0</span></button>
            <button type="button" onclick="incrementEmoji(this, '😢')">😢 <span class="emoji-count">0</span></button>
        `;
        postDiv.appendChild(emojiContainer);

        // Discuss section
        const discussSection = document.createElement('div');
        discussSection.className = 'discuss-section dynamic-modal-anchor';
        discussSection.innerHTML = `
            <h4>Discuss:</h4>
            <div class="comments"></div>
            <div class="comment-row">
                <input type="text" class="comment-author" placeholder="Your First Name" required>
                <input type="date" class="comment-date" required>
            </div>
            <textarea class="comment-input" placeholder="Write your comment here..." required></textarea>
            <div style="margin-bottom: 1rem;">
                <input type="checkbox" class="comment-confirm" required>
                <label>I've checked my comment for accuracy, grammar, and spelling.</label>
            </div>
            <div class="commentAlert"></div>
            <button class="comment-button" type="button">Comment</button>
        `;
        postDiv.appendChild(discussSection);

        // Set the current date for the comment date field and restrict to today only
        const commentDateField = discussSection.querySelector('.comment-date');
        commentDateField.value = today;
        commentDateField.setAttribute('min', today);
        commentDateField.setAttribute('max', today);

        // Comment button logic
        discussSection.querySelector('.comment-button').addEventListener('click', function (e) {
            addComment(e, this);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => {
            blogPosts.removeChild(postDiv);
            updateScrollToTopButton(); // Update after removal
        };
        postDiv.appendChild(deleteButton);

        blogPosts.appendChild(postDiv);

        // Add to blogPostRefs for search
        blogPostRefs.push({
            id: postId,
            title: postTopic,
            element: postDiv
        });

        // Clear input fields
        document.getElementById('postTopic').value = '';
        document.getElementById('postAuthor').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postConfirm').checked = false;
        document.getElementById('postDate').value = today;

        updateScrollToTopButton(); // Update after adding
    });

    // Add a comment to the discuss section
    function addComment(event, button) {
        if (event) event.preventDefault();

        const parent = button.parentElement;
        const commentAuthorInput = parent.querySelector('.comment-author');
        const commentAuthor = commentAuthorInput.value.trim();
        const commentDateInput = parent.querySelector('.comment-date');
        const commentDate = commentDateInput.value;
        const commentInput = parent.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        const commentConfirm = parent.querySelector('.comment-confirm').checked;
        const commentAlertDiv = parent.querySelector('.commentAlert');
        commentAlertDiv.innerHTML = '';

        const today = new Date().toISOString().split('T')[0];

        if (!commentAuthor) {
            commentAuthorInput.focus();
            return;
        }
        if (!commentDate) {
            commentDateInput.focus();
            commentAlertDiv.innerHTML = `
                <span class="inline-alert">
                    Please select a date for your comment.
                </span>
            `;
            return;
        }
        if (commentDate !== today) {
            commentDateInput.focus();
            commentAlertDiv.innerHTML = `
                <span class="inline-alert">
                    The comment date must be today.
                </span>
            `;
            return;
        }
        if (!commentText) {
            commentInput.focus();
            return;
        }
        if (!commentConfirm) {
            commentAlertDiv.innerHTML = `
                <span class="inline-alert">
                    <input type="checkbox" class="comment-confirm-inline" onclick="this.closest('div').parentElement.querySelector('.comment-confirm').checked=this.checked;this.closest('.inline-alert').remove();" style="margin-right:0.5rem;">
                    Please confirm you have checked your comment for accuracy, grammar, and spelling.
                </span>
            `;
            parent.querySelector('.comment-confirm-inline').focus();
            return;
        }

        // Ensure comments are appended to the correct .comments section
        const commentsDiv = parent.querySelector('.comments');
        if (!commentsDiv) return;

        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.setAttribute('data-author', commentAuthor);

        const commentContent = document.createElement('span');
        commentContent.innerHTML = `<strong>${commentAuthor}</strong> on ${commentDate}:<br>${commentText}`;
        commentContent.className = 'comment-content';
        commentDiv.appendChild(commentContent);

        commentsDiv.appendChild(commentDiv);

        // Clear comment fields
        commentAuthorInput.value = '';
        commentInput.value = '';
        parent.querySelector('.comment-confirm').checked = false;
        commentDateInput.value = today;
    }

    // Increment emoji count (does not trigger comment requirement)
    window.incrementEmoji = function (button, emoji) {
        const countSpan = button.querySelector('.emoji-count');
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
    };

    // Blog search functionality
    window.searchBlogs = function () {
        const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
        document.getElementById('searchInput').value = ''; // Clear search box after search
        if (!keyword) {
            showModal([], true);
            return;
        }
        // Find all blog posts with matching title (case-insensitive, all topics)
        const matches = blogPostRefs.filter(ref => ref.title.toLowerCase().includes(keyword));
        showModal(matches, false);
    };

    // Modal navigation state
    let modalMatches = [];
    let modalCurrentIndex = 0;

    // Robust modal logic
    function showModal(matches, emptySearch) {
        const overlay = document.getElementById('searchModalOverlay');
        const modal = document.getElementById('searchModal');
        modalMatches = matches;
        modalCurrentIndex = 0;

        // Remove any previous dynamic modals
        document.querySelectorAll('.dynamic-modal-below').forEach(el => el.remove());

        overlay.style.display = 'flex';

        if (emptySearch) {
            modal.innerHTML = `
                <h3>Blog Search Results</h3>
                <div class="modal-instruction">Please enter a keyword to search blog titles.</div>
                <button class="modal-close" onclick="closeModal()">Close</button>
            `;
            modal.focus();
            return;
        }

        if (matches.length === 0) {
            modal.innerHTML = `
                <h3>Blog Search Results</h3>
                <div class="modal-instruction">No blogs found for your search.</div>
                <button class="modal-close" onclick="closeModal()">Close</button>
            `;
            modal.focus();
            return;
        }

        // Build modal content for multiple results
        let html = `<h3>Blog Search Results</h3>
            <div class="modal-instruction">Select blog(s) to view. Close this window when no longer required.</div>
            <form class="modal-list">`;
        matches.forEach((ref, idx) => {
            html += `<label><input type="checkbox" class="modal-blog-check" value="${ref.id}"> ${ref.title}</label>`;
        });
        html += `</form>
            <button onclick="goToCheckedBlogs(event)" style="margin-bottom:1rem;background:#007bff;color:#fff;border:none;padding:0.5rem 1rem;border-radius:5px;cursor:pointer;">Go to Selected Blogs</button>
            <button class="modal-close" onclick="closeModal()">Close</button>
        `;
        modal.innerHTML = html;
        modal.focus();
    }

    window.closeModal = function () {
        document.getElementById('searchModalOverlay').style.display = 'none';
        document.querySelectorAll('.dynamic-modal-below').forEach(el => el.remove());
    };

    window.goToCheckedBlogs = function (event) {
        if (event) event.preventDefault();
        // Get all checked blogs
        const checks = document.querySelectorAll('.modal-blog-check:checked');
        if (checks.length === 0) {
            alert('Please select at least one blog to view.');
            return;
        }
        // Build an array of blog ids in order
        const blogIds = Array.from(checks).map(input => input.value);
        // Start navigation
        closeModal();
        navigateBlogs(blogIds, 0);
    };

    // Insert the modal ABOVE the blog post being viewed
    window.navigateBlogs = function (blogIds, idx) {
        if (idx >= blogIds.length) {
            closeModal();
            return;
        }
        // Remove any previous modal
        document.querySelectorAll('.dynamic-modal-below').forEach(el => el.remove());
        // Scroll to blog
        const blog = document.getElementById(blogIds[idx]);
        if (blog) {
            blog.scrollIntoView({ behavior: 'smooth', block: 'center' });
            blog.style.boxShadow = '0 0 0 3px #007bff';
            setTimeout(() => blog.style.boxShadow = '', 2000);

            // Show modal above this blog
            const dynamicDiv = document.createElement('div');
            dynamicDiv.className = 'dynamic-modal-below';
            dynamicDiv.innerHTML = `
                <div class="modal" tabindex="1" style="z-index:3001;">
                    <h3>Viewing Blog: ${blog.querySelector('h3').textContent}</h3>
                    <div class="modal-instruction">Continue to next blog or close this window when no longer required.</div>
                    <button onclick="navigateBlogs(['${blogIds.join("','")}'], ${idx + 1})" style="margin-bottom:1rem;background:#007bff;color:#fff;border:none;padding:0.5rem 1rem;border-radius:5px;cursor:pointer;" ${idx + 1 >= blogIds.length ? 'disabled' : ''}>Continue to Next Blog</button>
                    <button class="modal-close" onclick="closeModal()">Close</button>
                </div>
            `;
            // Insert the modal above the blog post
            blog.parentNode.insertBefore(dynamicDiv, blog);
            // Focus the modal for accessibility
            setTimeout(() => {
                const modalEl = dynamicDiv.querySelector('.modal');
                if (modalEl) modalEl.focus();
            }, 0);
        }
    };

    // Close modal when clicking outside modal content
    document.getElementById('searchModalOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });

    // Scroll to the top of the page
    window.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Show or hide the "Return to Top" button
    function updateScrollToTopButton() {
        const scrollToTopButton = document.getElementById('scrollToTop');
        const blogPostsDiv = document.getElementById('blogPosts');
        if (scrollToTopButton && blogPostsDiv) {
            const posts = blogPostsDiv.querySelectorAll('.blog-post');
            // Show button only if there is at least one post and the user has scrolled down 200px
            if (posts.length > 0 && window.scrollY > 200) {
                scrollToTopButton.style.display = 'block';
            } else {
                scrollToTopButton.style.display = 'none';
            }
        }
    }

    // Ensure the button is correct on page load
    updateScrollToTopButton();

    // Update button on scroll
    window.addEventListener('scroll', updateScrollToTopButton);

    // Allow Enter to submit the blog post form from any input (except textarea)
    document.getElementById('addPostForm').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            this.requestSubmit();
        }
    });

    // Add event delegation for comment submission via Enter key
    document.addEventListener('keydown', function (e) {
        // Only trigger on Enter key, not Shift+Enter (for newlines in textarea)
        if (e.key === 'Enter' && !e.shiftKey) {
            // If focus is on a comment textarea, submit comment
            const active = document.activeElement;
            if (active && active.classList.contains('comment-input')) {
                e.preventDefault();
                // Find the related comment button and trigger click
                const discussSection = active.closest('.discuss-section');
                if (discussSection) {
                    const commentBtn = discussSection.querySelector('.comment-button');
                    if (commentBtn) commentBtn.click();
                }
            }
        }
    });
});

// Contact form handling for index.html
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            // Optionally validate email/message here
            // Redirect to success.html with name as query param
            window.location.href = `success.html?name=${encodeURIComponent(name)}`;
        });
    }
});