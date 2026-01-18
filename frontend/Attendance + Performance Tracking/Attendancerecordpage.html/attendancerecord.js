const statusField = document.getElementById("status");
const timeSection = document.getElementById("timeSection");
const leaveSection = document.getElementById("leaveSection");
const form = document.getElementById("attendanceForm");
const message = document.getElementById("message");

// Show / hide fields based on status
statusField.addEventListener("change", () => {
  timeSection.classList.add("hidden");
  leaveSection.classList.add("hidden");

  if (statusField.value === "PRESENT" || statusField.value === "LATE") {
    timeSection.classList.remove("hidden");
  }

  if (statusField.value === "ABSENT") {
    leaveSection.classList.remove("hidden");
  }
});

// Submit Attendance
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = empId.value.trim();
  const sessionId = sessionIdInput = document.getElementById("sessionId").value.trim();
  const status = statusField.value;

  if (!userId || !sessionId || !status) {
    message.innerText = "All mandatory fields are required.";
    message.style.color = "red";
    return;
  }

  let requestBody = {
    userId,
    sessionId,
    status
  };

  // PRESENT / LATE
  if (status === "PRESENT" || status === "LATE") {
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;

    if (!checkIn || !checkOut) {
      message.innerText = "Check-in and Check-out are required.";
      message.style.color = "red";
      return;
    }

    requestBody.checkIn = checkIn;
    requestBody.checkOut = checkOut;
  }

  // ABSENT
  if (status === "ABSENT") {
    const leaveReason = document.getElementById("leaveReason").value;

    if (!leaveReason) {
      message.innerText = "Leave reason is required.";
      message.style.color = "red";
      return;
    }

    requestBody.leaveReason = leaveReason;
  }

  try {
    const response = await fetch("https://YOUR_BACKEND_URL/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.success) {
      message.innerText = data.message;
      message.style.color = "green";
      form.reset();
      timeSection.classList.add("hidden");
      leaveSection.classList.add("hidden");
    } else {
      message.innerText = "Attendance submission failed.";
      message.style.color = "red";
    }
  } catch (error) {
    message.innerText = "Server error. Please try again.";
    message.style.color = "red";
  }
});
