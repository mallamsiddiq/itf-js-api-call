/**
 * Converts a file to a Base64-encoded string.
 * @param {File} file - The file to convert.
 * @return {Promise<Object>} - A promise that resolves with an object containing Base64 data, file type, and file name.
 */
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = {
                data: e.target.result.split(",")[1], // Base64-encoded file data
                type: file.type, // MIME type of the file
                name: file.name, // Original file name
            };
            resolve(data);
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Formats a string as a UUID if it matches the UUID pattern.
 * @param {string} str - The string to format. Default is a sample UUID.
 * @return {string|null} - The formatted UUID or null if the input doesn't match the UUID format.
 */
const formatAsUUID = (str = '467e3957-be4d-4a3d-a897-6a904b021c8c') => {
    // Define a regex pattern for UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Remove any non-hex characters
    const cleanedStr = str.replace(/[^0-9a-f]/ig, '');

    // Check if the cleaned string matches the UUID pattern
    if (uuidPattern.test(cleanedStr)) {
        // Return the cleaned string if it already matches the UUID pattern
        return cleanedStr;
    } else if (cleanedStr.length === 32) {
        // If the cleaned string is exactly 32 characters long (without dashes), format it
        return cleanedStr.substr(0, 8) + '-' +
               cleanedStr.substr(8, 4) + '-' +
               cleanedStr.substr(12, 4) + '-' +
               cleanedStr.substr(16, 4) + '-' +
               cleanedStr.substr(20);
    } else {
        // If the input string doesn't match the UUID format, return null or handle accordingly
        return null;
    }
};
