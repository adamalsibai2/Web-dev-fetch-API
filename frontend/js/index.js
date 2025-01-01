"use strict";

const MAX_LENGTH = 50;
const PAGE_LIMIT = 12;
const BASE_URL = "http://localhost:3000/blogs";

const articlesWrapper = document.querySelector(".articles-wrapper");
const paginationContainer = document.querySelector(".pagination-container");
const searchInput = document.querySelector(".search-bar input");

let currentPage = 1;
let totalBlogs = 0;
let searchQuery = "";

async function fetchBlogs(page = 1, query = "") {
    const url = new URL(BASE_URL);
    url.searchParams.append("_page", page);
    url.searchParams.append("_limit", PAGE_LIMIT);
    url.searchParams.append("_sort", "date");
    url.searchParams.append("_order", "desc");

    if (query) {
        url.searchParams.append("q", query);  
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.statusText}`);
        }
 
        const blogs = await response.json();
        totalBlogs = response.headers.get("X-Total-Count");
        totalBlogs = parseInt(totalBlogs, 10) || 0;

        displayBlogs(blogs);
        createPaginationButtons();
        updateActiveButton();  
    } catch (error) {
        console.log(error.message);
    }
}

function displayBlogs(blogs) {
    articlesWrapper.innerHTML = ""; 

    blogs.forEach((blog) => {
        const truncatedContent = blog.content.length > MAX_LENGTH 
            ? blog.content.substring(0, MAX_LENGTH) + "..." 
            : blog.content;

        const article = document.createElement("article");
        article.classList.add('blog');
        article.innerHTML = `
            <h2>${blog.title}</h2>
            <p>${truncatedContent}</p>
            <small>${new Date(blog.date).toLocaleString()}</small>
        `;

        article.addEventListener("click", () => {
            window.location.href = `details.html?id=${blog.id}`;
        });

        articlesWrapper.appendChild(article);
    });
}

function createPaginationButtons() {
    const totalPages = Math.ceil(totalBlogs / PAGE_LIMIT);
    paginationContainer.innerHTML = ""; 

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.classList.add("page-btn");
        button.textContent = i;

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            currentPage = i;
            fetchBlogs(currentPage, searchQuery);  
        });

        paginationContainer.appendChild(button);
    }
}

function updateActiveButton() {
    document.querySelectorAll(".page-btn").forEach(button => {
        button.classList.remove("active");  
    });

    const activeButton = paginationContainer.querySelector(`.page-btn:nth-child(${currentPage})`);
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim();
    currentPage = 1;  
    fetchBlogs(currentPage, searchQuery);
});


window.addEventListener("DOMContentLoaded", () => {
    fetchBlogs(currentPage, searchQuery);  
});

        
