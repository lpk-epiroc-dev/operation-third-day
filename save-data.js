/*function saveData() {
    // Select the form
    const form = document.getElementById('dataForm');

    // Create an array to store the form data
    let formData = [];

    // Loop through each element in the form
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];

        // Check if the element is a select or input (text or date)
        if (element.tagName === 'SELECT' || (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'date'))) {
            // Add the element's value to the formData array
            formData.push(element.value);
        }
    }

    // Create CSV string from the formData array
    let csvContent = formData.join(",") + "\n";

    // Create a Blob from the CSV string
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link to download the Blob
    let link = document.createElement("a");
    if (link.download !== undefined) {
        // Set the download attribute and URL
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "form_data.csv");

        // Append the link to the document body and trigger a click event
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
*/

function saveData() {
    // Get form data
    const form = document.getElementById('dataForm');
    const formData = new FormData(form);
    
    // Create arrays to store the headers and values
    let headers = [];
    let values = [];
    formData.forEach((value, key) => {
        headers.push(key);
        values.push(value);
    });
    
    // Convert arrays to CSV strings
    const headerRow = headers.join(',') + '\n';
    const valueRow = values.join(',') + '\n';
    
    // Fetch the existing data from the CSV file
    fetch('data.csv')
        .then(response => response.text())
        .then(existingData => {
            if (existingData.trim().length === 0) {
                // If the file is empty, add headers
                const newData = headerRow + valueRow;
                saveToFile(newData);
            } else {
                // If the file is not empty, append new data
                const newData = existingData + valueRow;
                saveToFile(newData);
            }
        })
        .catch(() => {
            // If the file doesn't exist, create it with headers and new data
            const newData = headerRow + valueRow;
            saveToFile(newData);
        });
}

function saveToFile(data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
}


