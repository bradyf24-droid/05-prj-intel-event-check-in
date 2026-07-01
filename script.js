const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCounter = document.getElementById("waterCount");
const zeroCounter = document.getElementById("zeroCount");
const powerCounter = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");

let count = 0;
const maxCount = 50;
let attendees = [];

function getSavedCount(key) {
  const saved = localStorage.getItem(key);
  return saved ? parseInt(saved, 10) : 0;
}

function getSavedAttendees() {
  const saved = localStorage.getItem("attendeeList");
  return saved ? JSON.parse(saved) : [];
}

function saveCounts() {
  localStorage.setItem("checkInCount", count);
  localStorage.setItem("waterCount", waterCounter.textContent);
  localStorage.setItem("zeroCount", zeroCounter.textContent);
  localStorage.setItem("powerCount", powerCounter.textContent);
  localStorage.setItem("attendeeList", JSON.stringify(attendees));
}

function restoreCounts() {
  count = getSavedCount("checkInCount");
  attendeeCount.textContent = count;
  progressBar.style.width = `${Math.round((count / maxCount) * 100)}%`;

  waterCounter.textContent = getSavedCount("waterCount");
  zeroCounter.textContent = getSavedCount("zeroCount");
  powerCounter.textContent = getSavedCount("powerCount");

  attendees = getSavedAttendees();
  renderAttendeeList();
}

function addAttendeeToList(name, teamName) {
  const attendee = { name: name, team: teamName };
  attendees.push(attendee);

  const listItem = document.createElement("li");
  listItem.className = "attendee-item";
  listItem.textContent = `${name} — ${teamName}`;
  attendeeList.appendChild(listItem);
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";
  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";
    listItem.textContent = `${attendee.name} — ${attendee.team}`;
    attendeeList.appendChild(listItem);
  });
}

function getTeamCount(teamId) {
  return parseInt(document.getElementById(teamId).textContent, 10) || 0;
}

restoreCounts();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  count++;
  console.log("Total check-ins:", count);

  const percentage = Math.round((count / maxCount) * 100);
  console.log(`Progress: ${percentage}%`);

  attendeeCount.textContent = count;
  progressBar.style.width = `${percentage}%`;

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  addAttendeeToList(name, teamName);
  saveCounts();

  let message = `Welcome, ${name} from ${teamName}!`;

  if (count === maxCount) {
    const waterCount = getTeamCount("waterCount");
    const zeroCount = getTeamCount("zeroCount");
    const powerCount = getTeamCount("powerCount");

    const highestCount = Math.max(waterCount, zeroCount, powerCount);
    let winningTeam = "";

    if (highestCount === waterCount) {
      winningTeam = "Team Water Wise";
    }
    if (highestCount === zeroCount) {
      winningTeam = winningTeam
        ? `${winningTeam} and Team Net Zero`
        : "Team Net Zero";
    }
    if (highestCount === powerCount) {
      winningTeam = winningTeam
        ? `${winningTeam} and Team Renewables`
        : "Team Renewables";
    }

    if (winningTeam.includes("and")) {
      message = `🎉 Goal reached! It's a tie between ${winningTeam}! Great work everyone!`;
    } else {
      message = `🎉 Goal reached! ${winningTeam} is the winning team!`;
    }
  }

  greeting.textContent = message;

  form.reset();
});
