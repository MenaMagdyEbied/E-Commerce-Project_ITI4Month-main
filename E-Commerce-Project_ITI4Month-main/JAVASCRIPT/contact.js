document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    let existingMessages = JSON.parse(localStorage.getItem('contact_submissions')) || [];
    existingMessages.push(formData);
    localStorage.setItem('contact_submissions', JSON.stringify(existingMessages));

    const queryParams = new URLSearchParams({
        status: 'sent',
        user: formData.name,
        ref: Math.random().toString(36).substring(7)
    }).toString();

    const newUrl = `${window.location.pathname}?${queryParams}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    const successBox = document.getElementById('successMessage');
    successBox.style.display = 'block';
    
    this.reset();

    setTimeout(() => {
        successBox.style.display = 'none';
    }, 6000);
});