const themeToggle = document.getElementById('themeToggle');

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('theme');

// Default to light mode unless 'dark' is stored
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Show sun (light mode)
} else {
    // Light mode by default
    document.body.classList.remove('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Show moon (dark mode)
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');

    themeToggle.innerHTML = isDarkTheme
        ? '<i class="fas fa-sun"></i>'  // Show sun when in dark mode
        : '<i class="fas fa-moon"></i>'; // Show moon when in light mode

    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

const toggleThemeBtn = document.getElementById('theme-toggle');

// Check localStorage on page load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Toggle theme on button click
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    // Store preference
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});


// Particles.js for Hero Section
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: document.body.classList.contains('dark-theme') ? '#A5B4FC' : '#1F2937' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: document.body.classList.contains('dark-theme') ? '#A5B4FC' : '#1F2937', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// Form Handling (Mock)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const spinner = document.getElementById('loginSpinner');
        const errorDiv = document.getElementById('loginError');
        spinner.classList.remove('d-none');
        errorDiv.textContent = '';
        setTimeout(() => {
            spinner.classList.add('d-none');
            errorDiv.textContent = 'Login failed. Please try again.';
        }, 1000);
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const spinner = document.getElementById('registerSpinner');
        const errorDiv = document.getElementById('registerError');
        spinner.classList.remove('d-none');
        errorDiv.textContent = '';
        setTimeout(() => {
            spinner.classList.add('d-none');
            errorDiv.textContent = 'Registration successful! Please login.';
            errorDiv.classList.remove('text-danger');
            errorDiv.classList.add('text-success');
        }, 1000);
    });
}

const predictionForm = document.getElementById('predictionForm');
if (predictionForm) {
    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const spinner = document.getElementById('predictSpinner');
        const resultDiv = document.getElementById('predictionResult');
        const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(input => input.value);

        spinner.classList.remove('d-none');
        resultDiv.textContent = '';

        try {
            if (symptoms.length === 0) {
                resultDiv.classList.add('text-danger');
                resultDiv.textContent = 'Please select at least one symptom.';
                spinner.classList.add('d-none');
                return;
            }

            const response = await fetch('http://localhost:8080/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symptoms }),
            });

            if (!response.ok) {
                throw new Error('Prediction failed');
            }

            const disease = await response.text();
            resultDiv.classList.add('text-success');
            resultDiv.innerHTML = `
                <div class="result-card">
                    <h4>Prediction Result</h4>
                    <p><strong>Possible Condition:</strong> ${disease}</p>
                    <p><strong>Recommendation:</strong> Consult a doctor for a proper diagnosis.</p>
                </div>
            `;
        } catch (error) {
            resultDiv.classList.add('text-danger');
            resultDiv.textContent = 'Error: Unable to get prediction. Please try again.';
        } finally {
            spinner.classList.add('d-none');
        }
    });
}

// Initialize Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));