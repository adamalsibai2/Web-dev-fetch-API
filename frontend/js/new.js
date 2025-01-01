"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const titleInput = document.querySelector("#title");
    const authorInput = document.querySelector("#author");
    const contentInput = document.querySelector("#content");
    const notificationContainer = document.querySelector(".notification-container");
    const notification = notificationContainer.querySelector(".notification");
    const closeNotificationBtn = notificationContainer.querySelector(".close");

    const defaultImage = "images/default.jpeg"; 
    const serverUrl = "http://localhost:3000/blogs";

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !author || !content || title.length < 3 || author.length < 3 || content.length < 10) {
            showNotification("All fields are required and must meet minimum length requirements.", "error");
            return;
        }

        const newBlog = {
            title,
            author,
            content,
            image: defaultImage,
            date: new Date().toISOString(), 
        };

        try {
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBlog),
            });

            if (!response.ok) {
                throw new Error("Failed to create a new blog. Please try again.");
            }

            window.location.href = "index.html";
        } catch (error) {
            showNotification(error.message, "error");
        }
    });

    closeNotificationBtn.addEventListener("click", () => {
        notificationContainer.classList.add("hidden");
    });

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`; 
        notificationContainer.classList.remove("hidden");

        setTimeout(() => {
            notificationContainer.classList.add("hidden");
        }, 3000);
    }
});



