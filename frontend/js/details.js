"use strict";

let blogId;

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    blogId = urlParams.get("id");

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
        document.getElementById("blog-title").textContent = blog.title;
        document.getElementById("blog-author").textContent = `Author: ${blog.author}`;
        document.getElementById("blog-content").innerHTML = blog.content; // Render HTML content
        
        document.getElementById("edit-link").href = `edit.html?id=${blog.id}`;   
    })
    .catch(error => {
        console.error("Error fetching blog:", error);
        showNotification("Failed to fetch blog. Please try again.", "error");
    });
}

document.getElementById("delete-link").addEventListener("click", function(event) {
    if (confirm("Are you sure you want to delete this blog?")) {
        fetch(`http://localhost:3000/blogs/${blogId}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                window.location.href = "index.html"; 
            } else {
                throw new Error("Failed to delete blog");
            }
        })
        .catch(error => {
            console.error("Error deleting blog:", error);
            showNotification("Failed to delete blog. Please try again.", "error");
        });
    }
});

function showNotification(message, type) {
    const notificationContainer = document.querySelector(".notification-container");
    const notification = document.querySelector(".notification");
    notification.textContent = message;
    notification.className = `notification ${type}`; 
    notificationContainer.classList.remove("hidden");
    
    setTimeout(() => {
        notificationContainer.classList.add("hidden");
    }, 3000);
}



