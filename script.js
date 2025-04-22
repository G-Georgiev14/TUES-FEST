function showLoginForm() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("forgotPasswordForm").style.display = "none";
    document.getElementById("loginToggle").classList.add("active");
    document.getElementById("registerToggle").classList.remove("active");
}

function showRegisterForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("forgotPasswordForm").style.display = "none";
    document.getElementById("loginToggle").classList.remove("active");
    document.getElementById("registerToggle").classList.add("active");
}

function showForgotPassword() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("forgotPasswordForm").style.display = "block";
}

function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

document.addEventListener('click', (event) => {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    const isClickInside = navLinks.contains(event.target) || hamburger.contains(event.target);

    if (!isClickInside && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

showLoginForm();
function register() {
    let username = document.getElementById("register-username").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;
    let errorMessages = [];
    
    if (password.length < 6) {
        errorMessages.push("Паролата трябва да е поне 6 символа!");
    }
    
    if (!/[A-Z]/.test(password)) {
        errorMessages.push("Паролата трябва да съдържа поне една главна буква!");
    }

    if (!/\d/.test(password)) {
        errorMessages.push("Паролата трябва да съдържа поне една цифра!");
    }

    if (!username || !email || !password) {
        errorMessages.push("Попълни всички полета!");
    }
    
    if (errorMessages.length > 0) {
        alert(errorMessages.join("\n"));
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("ttw_users")) || [];
    if (users.some(user => user.email === email)) {
        alert("Имейлът вече е регистриран!");
        return;
    }
    
    users.push({ username, email, password });
    localStorage.setItem("ttw_users", JSON.stringify(users));
    alert("Успешна регистрация! Влез в акаунта си.");
    showLogin();
}
function loadKlasacia() {
    let users = JSON.parse(localStorage.getItem("ttw_users")) || [];
    let tbody = document.getElementById("klasacia-body");

    tbody.innerHTML = "";

    users.sort((a, b) => (b.points || 0) - (a.points || 0));

    users.forEach((user, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.points || 0}</td>
        `;
        tbody.appendChild(row);
    });
}

window.onload = loadKlasacia;