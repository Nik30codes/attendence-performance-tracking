const form = document.getElementById("performanceForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId").value.trim();
  const metricId = document.getElementById("metricId").value.trim();
  const evaluatorId = document.getElementById("evaluatorId").value.trim();
  const score = document.getElementById("score").value;
  const recordedDate = document.getElementById("recordedDate").value;

  if (!userId || !metricId || !evaluatorId || !score || !recordedDate) {
    message.innerText = "All fields are required.";
    message.style.color = "red";
    return;
  }

  if (score < 0 || score > 100) {
    message.innerText = "Score must be between 0 and 100.";
    message.style.color = "red";
    return;
  }

  const requestBody = {
    userId: userId,
    metricId: metricId,
    evaluatorId: evaluatorId,
    score: Number(score),
    recordedDate: recordedDate
  };

  try {
    const response = await fetch(
      "https://YOUR_BACKEND_URL/performance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (data.success) {
      message.innerText = data.message;
      message.style.color = "green";
      form.reset();
    } else {
      message.innerText = "Failed to save performance record.";
      message.style.color = "red";
    }
  } catch (error) {
    message.innerText = "Server error. Please try again later.";
    message.style.color = "red";
  }
});
