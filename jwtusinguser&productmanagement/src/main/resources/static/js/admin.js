function ensureAdmin() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!token || role !== "ADMIN") {
    window.location.href = "/admin-login.html";
    return false;
  }

  const welcome = document.getElementById("welcomeText");
  if (welcome) {
    welcome.innerText = `Welcome, ${username}`;
  }

  return true;
}

async function loadAdminData() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/admin/home", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const text = await response.text();

    const resultBox = document.getElementById("apiResult");
    if (resultBox) {
      resultBox.innerText = text;
    }

  } catch (error) {
    console.error(error);
    alert("Failed to load admin data");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  ensureAdmin();
});