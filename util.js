const ConvertToBase64 = (file) => {
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

// Usage 
// ConvertToBase64(file)
//     .then((data) => {
//         console.log(data);
//         sendMessage(data);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
