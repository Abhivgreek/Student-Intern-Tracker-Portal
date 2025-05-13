// Contact form functionality
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form")
  const contactList = document.getElementById("contact-list")

  // Function to load contact messages
  async function loadContactMessages() {
    if (contactList) {
      try {
        const response = await fetch("/api/contact")
        if (!response.ok) {
          throw new Error("Failed to fetch contact messages")
        }

        const contactData = await response.json()

        // Clear existing content
        contactList.innerHTML = ""

        if (contactData.length === 0) {
          contactList.innerHTML = '<div class="alert alert-info">No contact messages yet.</div>'
          return
        }

        // Create contact message entries
        contactData.forEach((contact) => {
          const contactItem = document.createElement("div")
          contactItem.className = "card mb-3 shadow-sm"
          contactItem.innerHTML = `
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0">${contact.name}</h5>
                                <span class="badge bg-primary">${contact.subject}</span>
                            </div>
                            <h6 class="card-subtitle mb-2 text-muted">${contact.email}</h6>
                            <p class="card-text">${contact.message}</p>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <small class="text-muted">Submitted: ${new Date(contact.created_at).toLocaleString()}</small>
                                </div>
                            </div>
                        </div>
                    `
          contactList.appendChild(contactItem)
        })
      } catch (error) {
        console.error("Error loading contact messages:", error)
        contactList.innerHTML =
          '<div class="alert alert-danger">Failed to load contact messages. Please try again later.</div>'
      }
    }
  }

  // Load contact messages if we're on the admin page
  if (contactList) {
    loadContactMessages()
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        })

        if (!response.ok) {
          throw new Error("Failed to submit contact message")
        }

        // Create a success alert
        const alertDiv = document.createElement("div")
        alertDiv.className = "alert alert-success alert-dismissible fade show mt-3"
        alertDiv.role = "alert"
        alertDiv.innerHTML = `
                    <strong>Thank you, ${name}!</strong> Your message has been sent successfully. We'll get back to you soon.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `

        // Insert the alert before the form
        contactForm.parentNode.insertBefore(alertDiv, contactForm)

        // Reset the form
        contactForm.reset()

        // Scroll to the top of the form to see the alert
        window.scrollTo({
          top: alertDiv.offsetTop - 100,
          behavior: "smooth",
        })

        // Remove the alert after 5 seconds
        setTimeout(() => {
          alertDiv.remove()
        }, 5000)
      } catch (error) {
        console.error("Error submitting contact message:", error)

        // Create an error alert
        const alertDiv = document.createElement("div")
        alertDiv.className = "alert alert-danger alert-dismissible fade show mt-3"
        alertDiv.role = "alert"
        alertDiv.innerHTML = `
                    <strong>Oops!</strong> Something went wrong while submitting your message. Please try again later.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `

        // Insert the alert before the form
        contactForm.parentNode.insertBefore(alertDiv, contactForm)
      }
    })
  }
})
