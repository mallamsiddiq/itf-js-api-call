function formatAsUUID(str='fc3a5f9c-8883-4699-a7da-d58eb8bfbd16') {
    // Define a regex pattern for UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Remove any non-hex characters
    const cleanedStr = str.replace(/[^0-9a-f]/ig, '');

    // Check if the cleaned string matches the UUID pattern
    if (uuidPattern.test(cleanedStr)) {
        // Format the UUID string (8-4-4-4-12)
        return cleanedStr.substr(0, 8) + '-' +
            cleanedStr.substr(8, 4) + '-' +
            cleanedStr.substr(12, 4) + '-' +
            cleanedStr.substr(16, 4) + '-' +
            cleanedStr.substr(20);
    } else if (cleanedStr.length === 32) {
        // If the cleaned string is exactly 32 characters long (without dashes), try to format
        return cleanedStr.substr(0, 8) + '-' +
            cleanedStr.substr(8, 4) + '-' +
            cleanedStr.substr(12, 4) + '-' +
            cleanedStr.substr(16, 4) + '-' +
            cleanedStr.substr(20);
    } else {
        // If the input string doesn't match UUID format, return null or handle accordingly
        return null;
    }
}


document.getElementById('update-artisan-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Create a JSON object for form data
    const data = {
        skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
        // experience: [
        //     {
        //         id: formatAsUUID(), //(document.getElementById('experience-id').value),
        //         project_title: document.getElementById('experience-title').value,
        //         description: document.getElementById('experience-description').value,
        //         files: []
        //     }
        // ]
    };

    // Get the files and convert them to Base64
    const experienceFiles = document.getElementById('image').files;
    const filePromises = [];

    for (let i = 0; i < experienceFiles.length; i++) {
        const file = experienceFiles[i];
        const reader = new FileReader();
        filePromises.push(new Promise((resolve, reject) => {
            reader.onload = function (e) {
                resolve({
                    data: e.target.result.split(",")[1], // Base64-encoded file data
                    type: file.type, // MIME type of the file
                    name: file.name, // Original file name
                });
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(file);
        }));
    }

    try {
        const filesData = await Promise.all(filePromises);
        data.image = filesData || null;

        // Log the JSON payload
        console.log('JSON payload:', JSON.stringify(data));

        // Send the JSON data with Axios
        const response = await axios.patch(`${config.apiUrl}auth/user-profile/update-me/`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.authToken}` // Use the auth token from config
            }
        });

        console.log('Artisan updated successfully:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error updating artisan:', error.response.data);
            console.error('Error updating artisan:', error.response.data);
        } else {
            console.log('Error updating artisan:', error.message);
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
})()
