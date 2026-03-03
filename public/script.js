document.addEventListener("DOMContentLoaded", () => {
  fetchProjects();
  setupContactForm();
});


async function fetchProjects() {
  const grid = document.getElementById("projectsGrid");

  try {
 
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Backend not reachable");

    const projects = await response.json();
    renderProjects(projects, grid);
  } catch (error) {
    console.warn(
      "Backend server not running. Using fallback data for preview.",
    );
  
    const mockProjects = [
      {
        title: "E-Commerce API",
        description:
          "RESTful API built with Node, Express, and JWT Authentication.",
        techStack: "Node.js, Express, MongoDB",
        projectLink: "#",
      },
      {
        title: "Task Manager UI",
        description: "Mobile-first Kanban board application.",
        techStack: "HTML, CSS, JavaScript",
        projectLink: "#",
      },
      {
        title: "Real-Time Chat",
        description: "WebSocket based chat application with chat rooms.",
        techStack: "Socket.io, Node, React",
        projectLink: "#",
      },
    ];
    renderProjects(mockProjects, grid);
  }
}

function renderProjects(projects, container) {
  container.innerHTML = "";

  if (projects.length === 0) {
    container.innerHTML = "<p>No projects found in database.</p>";
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <span class="tech"><strong>Tech:</strong> ${project.techStack}</span>
                    <a href="${project.projectLink}" class="btn" target="_blank">View Live</a>
                `;
    container.appendChild(card);
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const statusDiv = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    statusDiv.textContent = "Sending message...";
    statusDiv.style.color = "#3498db";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        statusDiv.textContent = result.success || "Message sent successfully!";
        statusDiv.style.color = "green";
        form.reset(); 
      } else {
        statusDiv.textContent = result.error || "Validation failed.";
        statusDiv.style.color = "red";
      }
    } catch (error) {
      statusDiv.textContent = "Message Simulated! (Backend not connected)";
      statusDiv.style.color = "green";
      form.reset();
    }
  });
}
