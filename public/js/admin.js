// Admin functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is admin
  function checkAdminAuth() {
    const admin = JSON.parse(localStorage.getItem("admin"))

    if (!admin || !admin.isAdmin) {
      // Redirect to admin login if not authenticated
      window.location.href = "/admin-login.html"
      return false
    }

    return true
  }

  // Update admin navbar
  function updateAdminNavbar() {
    const admin = JSON.parse(localStorage.getItem("admin"))
    const authButtons = document.querySelector(".navbar .d-flex")

    if (admin && admin.isAdmin && authButtons) {
      // Replace login/signup buttons with admin info and logout
      authButtons.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="text-white me-3">Admin: ${admin.email}</span>
                    <button class="logout-btn" id="admin-logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `

      // Add logout functionality
      document.getElementById("admin-logout-btn").addEventListener("click", () => {
        localStorage.removeItem("admin")
        window.location.href = "/index.html"
      })
    }
  }

  // Check if we're on an admin page
  const isAdminPage = window.location.pathname.includes("/admin/")

  if (isAdminPage) {
    // Verify admin authentication
    if (!checkAdminAuth()) {
      return // Stop execution if not authenticated
    }

    // Update admin navbar
    updateAdminNavbar()
  }
})
