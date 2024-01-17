function submitForm() {
    const form = document.getElementById("admissionForm");
    const messageContainer = document.getElementById("messageContainer");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("submitForm.php", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                messageContainer.innerHTML = `<p>${result.message}</p>`;
                console.log("Data submitted successfully");
            } else {
                console.error("Data submission failed");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
}
