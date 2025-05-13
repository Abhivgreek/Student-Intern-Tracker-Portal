// Main script for dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Dashboard script loaded");
    
    const form = document.getElementById('internship-form');
    const tableBody = document.querySelector('#internshipTable tbody');
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        // Redirect to login if not logged in
        console.log("No user found, redirecting to login");
        window.location.href = 'login.html';
        return;
    }
    
    console.log("User logged in:", user.name);
    
    // Add class to body for background
    document.body.classList.add('dashboard-page');
    
    // Update user info in navbar
    updateNavbar();
    
    // Load internships when page loads
    loadInternships();
    
    // Add event listener for form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submitted");
            saveInternship(e);
        });
    } else {
        console.error("Internship form not found");
    }
    
    // Toggle form visibility
    window.toggleForm = function() {
        if (form) {
            form.classList.toggle('hidden');
            form.reset();
            const editIdField = document.getElementById('edit-id');
            if (editIdField) {
                editIdField.value = '';
            }
        }
    }
    
    // Load internships from API
    async function loadInternships() {
        try {
            console.log("Loading internships for user ID:", user.id);
            const res = await fetch(`/api/internships?userId=${user.id}`);
            
            if (res.status === 401) {
                // Unauthorized, redirect to login
                console.error("Unauthorized access, redirecting to login");
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return;
            }
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const internships = await res.json();
            console.log("Internships loaded:", internships);
            
            if (!tableBody) {
                console.error("Table body element not found");
                return;
            }
            
            tableBody.innerHTML = '';
            
            // Initialize counters
            let activeCount = 0;
            let completedCount = 0;
            let rejectedCount = 0;
            
            internships.forEach(i => {
                // Update counters
                if (i.status === 'Active') activeCount++;
                if (i.status === 'Completed') completedCount++;
                if (i.status === 'Rejected') rejectedCount++;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="fw-medium">${i.name}</div>
                        <div class="text-muted small">${i.email}</div>
                    </td>
                    <td>${i.company}</td>
                    <td>${i.role}</td>
                    <td>
                        ${new Date(i.start_date).toLocaleDateString()} - 
                        ${new Date(i.end_date).toLocaleDateString()}
                    </td>
                    <td>
                        <div class="status-dropdown">
                            <span class="status ${i.status.toLowerCase()}">${i.status}</span>
                            <div class="status-dropdown-content">
                                <a onclick="changeStatus(${i.id}, 'Active')">Active</a>
                                <a onclick="changeStatus(${i.id}, 'Completed')">Completed</a>
                                <a onclick="changeStatus(${i.id}, 'Rejected')">Rejected</a>
                            </div>
                        </div>
                    </td>
                    <td class="actions">
                        <button class="action-btn edit" onclick="editInternship(${i.id}, '${i.name}', '${i.email}', '${i.company}', '${i.role}', '${i.start_date}', '${i.end_date}', '${i.status}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteInternship(${i.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Update counters in the UI
            const activeCountEl = document.getElementById('active-count');
            const completedCountEl = document.getElementById('completed-count');
            const rejectedCountEl = document.getElementById('rejected-count');
            
            if (activeCountEl) activeCountEl.textContent = activeCount;
            if (completedCountEl) completedCountEl.textContent = completedCount;
            if (rejectedCountEl) rejectedCountEl.textContent = rejectedCount;
            
        } catch (error) {
            console.error('Error loading internships:', error);
        }
    }
    
    // Save internship
    async function saveInternship(e) {
        e.preventDefault();
        
        const editIdField = document.getElementById('edit-id');
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const companyField = document.getElementById('company');
        const roleField = document.getElementById('role');
        const startDateField = document.getElementById('start_date');
        const endDateField = document.getElementById('end_date');
        const statusField = document.getElementById('status');
        
        if (!nameField || !emailField || !companyField || !roleField || !startDateField || !endDateField || !statusField) {
            console.error("One or more form fields not found");
            return;
        }
        
        const id = editIdField ? editIdField.value : '';
        const internship = {
            userId: user.id,
            name: nameField.value,
            email: emailField.value,
            company: companyField.value,
            role: roleField.value,
            start_date: startDateField.value,
            end_date: endDateField.value,
            status: statusField.value
        };
        
        console.log("Saving internship:", internship, "ID:", id);
        
        try {
            let url = '/api/internships';
            let method = 'POST';
            
            if (id) {
                url = `/api/internships/${id}`;
                method = 'PUT';
            }
            
            console.log(`${method} request to ${url}`);
            
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(internship)
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error saving internship');
            }
            
            const data = await res.json();
            console.log("Save response:", data);
            
            toggleForm();
            loadInternships();
            
        } catch (error) {
            console.error('Error saving internship:', error);
            alert(`Failed to save internship: ${error.message}`);
        }
    }
    
    // Edit internship
    window.editInternship = function(id, name, email, company, role, start_date, end_date, status) {
        console.log("Editing internship:", id);
        
        const editIdField = document.getElementById('edit-id');
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const companyField = document.getElementById('company');
        const roleField = document.getElementById('role');
        const startDateField = document.getElementById('start_date');
        const endDateField = document.getElementById('end_date');
        const statusField = document.getElementById('status');
        
        if (!editIdField || !nameField || !emailField || !companyField || !roleField || 
            !startDateField || !endDateField || !statusField) {
            console.error("One or more form fields not found");
            return;
        }
        
        editIdField.value = id;
        nameField.value = name;
        emailField.value = email;
        companyField.value = company;
        roleField.value = role;
        startDateField.value = start_date.split('T')[0];
        endDateField.value = end_date.split('T')[0];
        statusField.value = status;
        
        if (form && form.classList.contains('hidden')) {
            toggleForm();
        }
    }
    
    // Change status
    window.changeStatus = async function(id, status) {
        console.log("Changing status:", id, status);
        
        try {
            const res = await fetch(`/api/internships/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error changing status');
            }
            
            console.log("Status changed successfully");
            loadInternships();
            
        } catch (error) {
            console.error('Error changing status:', error);
            alert(`Failed to change status: ${error.message}`);
        }
    }
    
    // Delete internship
    window.deleteInternship = async function(id) {
        if (confirm('Are you sure you want to delete this internship?')) {
            console.log("Deleting internship:", id);
            
            try {
                const res = await fetch(`/api/internships/${id}`, {
                    method: 'DELETE'
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error deleting internship');
                }
                
                console.log("Internship deleted successfully");
                loadInternships();
                
            } catch (error) {
                console.error('Error deleting internship:', error);
                alert(`Failed to delete internship: ${error.message}`);
            }
        }
    }
    
    // Update navbar with user info and logout button
    function updateNavbar() {
        const authButtons = document.querySelector('.navbar .d-flex');
        
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="text-white me-3">Welcome, ${user.name}</span>
                    <button class="logout-btn" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    console.log("Logging out");
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                });
            }
        }
    }
});