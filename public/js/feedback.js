// Feedback form functionality
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackList = document.getElementById('feedback-list');
    
    // Function to load feedback entries
    async function loadFeedback() {
        if (feedbackList) {
            try {
                const response = await fetch('/api/feedback');
                if (!response.ok) {
                    throw new Error('Failed to fetch feedback');
                }
                
                const feedbackData = await response.json();
                
                // Clear existing content
                feedbackList.innerHTML = '';
                
                if (feedbackData.length === 0) {
                    feedbackList.innerHTML = '<div class="alert alert-info">No feedback submissions yet.</div>';
                    return;
                }
                
                // Create feedback entries
                feedbackData.forEach(feedback => {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = 'card mb-3 shadow-sm';
                    feedbackItem.innerHTML = `
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0">${feedback.name}</h5>
                                <span class="badge bg-primary">${feedback.type || 'General'}</span>
                            </div>
                            <h6 class="card-subtitle mb-2 text-muted">${feedback.email}</h6>
                            <p class="card-text">${feedback.message}</p>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <small class="text-muted">Rating: ${feedback.rating || 'N/A'}</small>
                                </div>
                                <div>
                                    <small class="text-muted">Submitted: ${new Date(feedback.created_at).toLocaleString()}</small>
                                </div>
                            </div>
                        </div>
                    `;
                    feedbackList.appendChild(feedbackItem);
                });
                
            } catch (error) {
                console.error('Error loading feedback:', error);
                feedbackList.innerHTML = '<div class="alert alert-danger">Failed to load feedback. Please try again later.</div>';
            }
        }
    }
    
    // Load feedback if we're on the admin page
    if (feedbackList) {
        loadFeedback();
    }
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const feedbackType = document.getElementById('feedback-type').value;
            const message = document.getElementById('message').value;
            const rating = document.querySelector('input[name="rating"]:checked').value;
            const contactPermission = document.getElementById('contact-permission').checked ? 'on' : 'off';
            
            try {
                const response = await fetch('/submit-feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name, 
                        email, 
                        type: feedbackType, 
                        message, 
                        rating, 
                        permission: contactPermission 
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to submit feedback');
                }
                
                // Create a success alert
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
                alertDiv.role = 'alert';
                alertDiv.innerHTML = `
                    <strong>Thank you for your feedback, ${name}!</strong> We appreciate you taking the time to share your thoughts with us.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                // Insert the alert before the form
                feedbackForm.parentNode.insertBefore(alertDiv, feedbackForm);
                
                // Reset the form
                feedbackForm.reset();
                
                // Set default rating back to 5
                document.getElementById('rating5').checked = true;
                
                // Scroll to the top of the form to see the alert
                window.scrollTo({
                    top: alertDiv.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Remove the alert after 5 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
                
            } catch (error) {
                console.error('Error submitting feedback:', error);
                
                // Create an error alert
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
                alertDiv.role = 'alert';
                alertDiv.innerHTML = `
                    <strong>Oops!</strong> Something went wrong while submitting your feedback. Please try again later.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                // Insert the alert before the form
                feedbackForm.parentNode.insertBefore(alertDiv, feedbackForm);
            }
        });
    }
});
