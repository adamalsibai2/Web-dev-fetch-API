"use strict";

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id");

    fetch(`http://localhost:3000/blogs/${blogId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Blog not found. Please check the URL and try again.");
                }
                throw new Error(`Failed to fetch blog: ${response.statusText}`);
            }
            return response.json();
        })
        .then(blog => {
            document.getElementById("title").value = blog.title;
            document.getElementById("author").value = blog.author;
            document.getElementById("content").value = blog.content;
            if (document.getElementById("image")) {
                document.getElementById("image").value = blog.image || "";
            }
        })
        .catch(error => {
            console.error("Error fetching blog:", error);
            showNotification(error.message, "error");
        });

    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const content = document.getElementById("content").value.trim();
        const image = document.getElementById("image") ? document.getElementById("image").value.trim() : "";

        // Input validation
        if (!title || !author || !content || title.length < 3 || author.length < 3 || content.length < 10) {
            showNotification("All fields are required and must meet minimum length requirements.", "error");
            return;
        }

        const updatedBlog = {
            title,
            author,
            content,
            image,
            date: new Date().toISOString(),
        };

        fetch(`http://localhost:3000/blogs/${blogId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBlog),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "index.html"; 
            } else {
                throw new Error("Failed to update blog");
            }
        })
        .catch(error => {
            console.error("Error updating blog:", error);
            showNotification("Failed to update blog. Please try again.", "error");
        });
    });

    let notificationTimeout;
    function showNotification(message, type) {
        const notificationContainer = document.querySelector(".notification-container");
        const notification = notificationContainer.querySelector(".notification");
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notificationContainer.classList.remove("hidden");

        if (notificationTimeout) clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            notificationContainer.classList.add("hidden");
        }, 3000);
    }
};




     
