document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("themeToggle");

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      document.documentElement.setAttribute("data-theme", "light");
      toggle.textContent = " Dark Mode";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      toggle.textContent = " Light Mode";
    }
  });

  // 💥 Move the conflict + registration check OUTSIDE toggle click
  // ========== Conflict Check for Hosting Form ==========
  const form = document.getElementById('organizeForm');
  const dateInput = document.getElementById('eventDate');
  const locationInput = document.getElementById('eventLocation');

  form.addEventListener('submit', async function (e) {
    const selectedDate = dateInput.value;
    const selectedLocation = locationInput.value.trim().toLowerCase();

    try {
      const response = await fetch('/all-hostings');
      const existingEvents = await response.json();

      const conflict = existingEvents.find(event =>
        event.date === selectedDate &&
        event.location.trim().toLowerCase() === selectedLocation
      );

      if (conflict) {
        e.preventDefault();
        alert(`❌ Conflict: An event is already hosted at "${selectedLocation}" on ${selectedDate}. Please choose another date or ground.`);
      }
    } catch (error) {
      console.error("❌ Error checking conflicts:", error);
    }
  });

  // ========== Registration Form: Only Allow if Hosted ==========
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      const formData = new FormData(registerForm);
      const selectedEvent = formData.get('event');
      const selectedLocation = formData.get('location').trim().toLowerCase();
      const selectedDate = formData.get('date');

      try {
        const response = await fetch('/all-hostings');
        const hostedEvents = await response.json();

        const match = hostedEvents.find(event =>
          event.event === selectedEvent &&
          event.location.trim().toLowerCase() === selectedLocation &&
          event.date === selectedDate
        );

        if (!match) {
          e.preventDefault();
          alert(`❌ Error: No hosted tournament found for "${selectedEvent}" at "${selectedLocation}" on ${selectedDate}.`);
        }
      } catch (err) {
        console.error("❌ Error during registration validation:", err);
      }
    });
  }
});

  const team1Select = document.querySelector('select[name="team1"]');
  const team2Select = document.querySelector('select[name="team2"]');

  function updateTeam2Options() {
    const selectedTeam1 = team1Select.value;

    for (const option of team2Select.options) {
      option.disabled = option.value === selectedTeam1 && option.value !== "";
    }
  }

  function updateTeam1Options() {
    const selectedTeam2 = team2Select.value;

    for (const option of team1Select.options) {
      option.disabled = option.value === selectedTeam2 && option.value !== "";
    }
  }

  team1Select.addEventListener('change', () => {
    updateTeam2Options();
  });

  team2Select.addEventListener('change', () => {
    updateTeam1Options();
  });


document.getElementById('show-events').addEventListener('click', () => {
    fetch('/all-hostings')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('events-container');
        container.innerHTML = ''; 

        if (data.length === 0) {
          container.innerHTML = '<p>No events hosted yet.</p>';
          return;
        }
        const list = document.createElement('ul');

        data.forEach(event => {
          const item = document.createElement('li');
          item.innerHTML = `<strong>${event.event}</strong> hosted at <em>${event.location}</em> on <time>${event.date}</time> between <strong>${event.team1}</strong> and <strong>${event.team2}</strong>`;
          list.appendChild(item);
        });

        container.appendChild(list);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        document.getElementById('events-container').innerHTML = '<p>Failed to load events.</p>';
      });
  });