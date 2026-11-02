const views = {
	dashboard: { title: "Overview", heading: "A good day to <span>make progress.</span>", subtitle: 'You have <strong>2 classes</strong> and <strong>3 things due</strong> this week. You\'re doing better than you think.' },
	courses: { title: "My courses", heading: "Curiosity looks good <span>on you.</span>", subtitle: "Your classes, all in one place. Keep your momentum going.", kicker: "YOUR FALL SEMESTER", section: "All courses", action: "Browse courses", items: [
		["PSY 204", "Human Behavior", "Dr. Olivia Lee · 3 credits · Tue / Thu, 10:30 AM", "72% complete", "A", ""],
		["BIO 118", "Ecology & Earth", "Prof. A. Rivera · 4 credits · Mon / Wed, 1:00 PM", "48% complete", "B+", "yellow"],
		["STA 210", "Data & Methods", "Dr. Sam Patel · 3 credits · Wed / Fri, 9:00 AM", "36% complete", "A-", "coral"],
		["ENG 142", "Stories & Society", "Prof. J. Brooks · 3 credits · Mon / Thu, 2:30 PM", "81% complete", "A", ""]
	] },
	schedule: { title: "Schedule", heading: "Make room for <span>what matters.</span>", subtitle: "A little structure, with plenty of room to breathe.", kicker: "WEEK OF NOVEMBER 2", section: "Your classes", action: "Plan study time", items: [
		["MON · NOV 02", "Ecology & Earth", "1:00 – 2:15 PM · Hawthorne Hall, Room 108", "Lecture", "BIO", ""],
		["TUE · NOV 03", "Research Methods", "10:30 – 11:45 AM · Hawthorne Hall, Room 204", "Lecture", "PSY", "yellow"],
		["WED · NOV 04", "Data & Methods", "9:00 – 9:50 AM · West Science, Lab 3", "Lab", "STA", "coral"],
		["WED · NOV 04", "Ecology & Earth", "1:00 – 2:15 PM · Hawthorne Hall, Room 108", "Lecture", "BIO", ""],
		["THU · NOV 05", "Human Behavior", "10:30 – 11:45 AM · Hawthorne Hall, Room 204", "Seminar", "PSY", "yellow"],
		["FRI · NOV 06", "Data & Methods", "9:00 – 9:50 AM · West Science, Lab 3", "Lab", "STA", "coral"]
	] },
	assignments: { title: "Assignments", heading: "Small steps, <span>big finish.</span>", subtitle: "You're on top of it. Here's what's coming up next.", kicker: "YOUR TO-DO LIST", section: "Upcoming work", action: "Add a study block", items: [
		["DUE TODAY", "Research reflection", "Human Behavior · Essay · About 45 min", "Due today", "✎", "coral"],
		["NOV 04", "Field notes: ecosystem", "Ecology & Earth · Lab journal · About 30 min", "In 2 days", "⌁", "yellow"],
		["NOV 06", "Statistics, quiz 3", "Data & Methods · Quiz · About 1 hour", "In 4 days", "▤", ""],
		["NOV 10", "Observation journal", "Human Behavior · Journal · About 40 min", "In 8 days", "✎", "coral"],
		["NOV 12", "Reading response: wild places", "Ecology & Earth · Short response · About 1 hour", "In 10 days", "⌁", "yellow"]
	] },
	grades: { title: "Grades", heading: "Look how far <span>you've come.</span>", subtitle: "Steady work adds up. Your current term average is looking strong.", kicker: "FALL 2026 · CURRENT TERM GPA 3.82", section: "Course grades", action: "View grade details", grades: [["Human Behavior", "PSY 204", "94.2%", "A"], ["Ecology & Earth", "BIO 118", "88.6%", "B+"], ["Data & Methods", "STA 210", "92.8%", "A-"], ["Stories & Society", "ENG 142", "96.1%", "A"]] },
	messages: { title: "Messages", heading: "Good conversations <span>start here.</span>", subtitle: "A few notes from the people cheering you on.", kicker: "YOUR INBOX · 2 UNREAD", section: "Recent messages", action: "New message", items: [
		["TODAY · 9:14 AM", "Dr. Olivia Lee", "A note about your research reflection. You're asking exactly the right questions.", "New", "OL", ""],
		["YESTERDAY · 3:40 PM", "Student Success Team", "Your advising check-in is confirmed for next Thursday at 2:00 PM.", "New", "SS", "yellow"],
		["OCT 30 · 11:08 AM", "Prof. A. Rivera", "Great observations in this week's field notes. Take a look at my comments when you have a moment.", "Read", "AR", "coral"],
		["OCT 28 · 2:15 PM", "Jordan Brooks", "The study group is meeting in the library again on Wednesday. Join us if you can!", "Read", "JB", ""]
	] }
};

const navButtons = [...document.querySelectorAll(".nav-link")];
const dashboardView = document.querySelector("#dashboardView");
const workspaceView = document.querySelector("#workspaceView");
const searchInput = document.querySelector("#globalSearch");
const searchBox = document.querySelector(".search-box");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
	toast.textContent = message;
	toast.classList.add("is-visible");
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderWorkspace(viewName) {
	const view = views[viewName];
	if (!view) return;
	document.querySelector("#pageTitle").innerHTML = view.heading;
	document.querySelector("#pageSubtitle").innerHTML = view.subtitle;
	document.querySelector("#breadcrumbCurrent").textContent = view.title;
	dashboardView.hidden = viewName !== "dashboard";
	workspaceView.hidden = viewName === "dashboard";
	document.querySelector("#searchEmpty").hidden = true;

	if (viewName !== "dashboard") {
		document.querySelector("#workspaceKicker").textContent = view.kicker;
		document.querySelector("#workspaceTitle").textContent = view.section;
		document.querySelector("#workspaceAction span").textContent = view.action;
		const content = document.querySelector("#workspaceContent");
		if (view.grades) {
			content.innerHTML = `<table class="grade-table"><thead><tr><th>COURSE</th><th>CODE</th><th>AVERAGE</th><th>GRADE</th></tr></thead><tbody>${view.grades.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`).join("")}</tbody></table>`;
		} else {
			content.innerHTML = `<div class="workspace-list">${view.items.map(item => `<article class="workspace-row" data-searchable="${item.join(" ").toLowerCase()}"><span class="workspace-row-icon ${item[5]}">${item[4]}</span><div class="workspace-row-copy"><strong>${item[1]}</strong><span>${item[2]}</span></div><span class="${viewName === "messages" ? "row-status" : "row-meta"} ${item[3] === "Due today" ? "pending" : ""}">${viewName === "schedule" ? item[3] : item[3]}</span></article>`).join("")}</div>`;
		}
	}
	filterSearch(searchInput.value);
}

function filterSearch(query) {
	const normalized = query.trim().toLowerCase();
	const activeContainer = dashboardView.hidden ? workspaceView : dashboardView;
	const entries = [...activeContainer.querySelectorAll("[data-searchable]")];
	let visibleCount = 0;
	entries.forEach(entry => {
		const matches = !normalized || entry.dataset.searchable.includes(normalized);
		entry.hidden = !matches;
		if (matches) visibleCount += 1;
	});
	document.querySelector("#searchEmpty").hidden = !normalized || visibleCount > 0;
}

function setView(viewName) {
	navButtons.forEach(button => {
		const active = button.dataset.view === viewName;
		button.classList.toggle("is-active", active);
		if (active) button.setAttribute("aria-current", "page");
		else button.removeAttribute("aria-current");
	});
	renderWorkspace(viewName);
	document.querySelector("#sidebar").classList.remove("is-open");
	document.querySelector("#mobileOverlay").classList.remove("is-visible");
	window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelectorAll("[data-open-view]").forEach(button => button.addEventListener("click", () => setView(button.dataset.openView)));
searchInput.addEventListener("input", event => filterSearch(event.target.value));
searchInput.addEventListener("keydown", event => {
	if (event.key === "Escape") {
		searchInput.value = "";
		filterSearch("");
		searchInput.blur();
	}
});

document.addEventListener("keydown", event => {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
		event.preventDefault();
		searchBox.classList.add("is-open");
		searchInput.focus();
	}
});

document.querySelector("#menuButton").addEventListener("click", () => {
	document.querySelector("#sidebar").classList.add("is-open");
	document.querySelector("#mobileOverlay").classList.add("is-visible");
});
document.querySelector("#mobileOverlay").addEventListener("click", () => {
	document.querySelector("#sidebar").classList.remove("is-open");
	document.querySelector("#mobileOverlay").classList.remove("is-visible");
});
document.querySelector("#notificationButton").addEventListener("click", () => showToast("You're all caught up. Enjoy the quiet."));
document.querySelectorAll(".profile-button, .top-avatar").forEach(button => button.addEventListener("click", () => showToast("Profile settings are coming soon.")));
document.querySelectorAll(".course-menu").forEach(button => button.addEventListener("click", () => showToast("Course options are coming soon.")));
document.querySelectorAll(".continue-link").forEach(button => button.addEventListener("click", () => showToast(`Picking up ${button.dataset.course}. Your course is ready.`)));
document.querySelectorAll("#planButton, #workspaceAction").forEach(button => button.addEventListener("click", () => showToast("Study planner is ready for your next study block.")));

const today = new Date();
document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(today).toUpperCase();
