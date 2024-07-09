document.getElementById('update-artisan-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Extract artisan ID from query string
    const urlParams = new URLSearchParams(window.location.search);
    const artisanId = urlParams.get('artisan_id');

    if (!artisanId) {
        console.error('Artisan ID not found in URL');
        return;
    }

    // Create a JSON object for form data
    const data = {
        skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
        experience: [
            {
                delete_data: document.getElementById('delete-data').checked,
                project_title: document.getElementById('experience-title').value,
                description: document.getElementById('experience-description').value,
                files: []
            }
        ]
    };

    const id = formatAsUUID(document.getElementById('experience-id').value);

    if (id) {
        data.experience[0].id = id;
        console.log('Formatted UUID:', id);
    } else {
        console.log('Invalid UUID:', id);
    }

    // Check if file input exists
    const experienceFiles = document.getElementById('experience-files')?.files;
    const filePromises = [];

    if (experienceFiles) {
        for (let i = 0; i < experienceFiles.length; i++) {
            const file = experienceFiles[i];
            filePromises.push(convertToBase64(file));
        }
    }

    try {
        const filesData = await Promise.all(filePromises);
        data.experience[0].files = filesData;

        // Log the JSON payload
        console.log('JSON payload:', JSON.stringify(data));

        // Send the JSON data with Axios
        const response = await axios.patch(`${config.apiUrl}artisans/${artisanId}/`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.authToken}` // Use the auth token from config
            }
        });

        console.log('Artisan updated successfully:', response.data.experience);
    } catch (error) {
        if (error.response) {
            console.error('Error updating artisan:', error.response);
        } else {
            console.error('Error updating artisan:', error.message);
        }
    }
});

// Bootstrap form validation
(function () {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})();