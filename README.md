# PC Deployment Dashboard

A web-based IT support dashboard designed to streamline and manage large-scale PC deployment and rollout projects. This application allows IT administrators to efficiently track old and new PC details, monitor replacement statuses, and log system activities with user authentication.

## Main Features

* **User Authentication System:** Secure registration and login functionality using Employee IDs.
* **Comprehensive PC Management (CRUD):** * **Create:** Add new deployment records mapping old hardware to new hardware.
    * **Read:** View all deployment records in a responsive, sortable data table.
    * **Update:** Edit existing records and update their deployment status (e.g., "Replaced" vs. "Not Replaced").
    * **Delete:** Remove outdated or incorrect PC records.
* **Real-time Search & Filtering:** Instantly filter PC records by name, serial number, or IP address.
* **Dynamic Sorting:** Clickable table headers to sort data ascending or descending.
* **Activity Logging:** Automated tracking of user actions (Login, Register, Create, Update, Delete) with timestamps, viewable on a dedicated logs page that auto-refreshes.
* **Interactive UI:** Collapsible sidebar navigation and intuitive popup modals for data entry, eliminating the need for constant page reloads.

## Technologies Used

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL-based Backend-as-a-Service)
* **Icons & Fonts:** System fonts (Segoe UI, Tahoma) with custom CSS styling

## Project Structure

```text
pc-dashboard/
├── index.html        # Main dashboard view containing the data table
├── login.html        # User login page
├── register.html     # New user registration page
├── logs.html         # System activity logs page
├── script.js         # Core CRUD logic, sorting, and search functionality
├── login.js          # Authentication logic for the login page
├── register.js       # User creation and validation logic
├── logs.js           # Logic to fetch, format, and auto-refresh activity logs
├── sidebar.js        # Collapsible sidebar navigation generation
├── style.css         # Global stylesheet, UI components, and modal styling
└── LICENSE           # MIT License file


## Installation & Setup

### 1. Local Deployment

Clone this repository:

```bash
git clone https://github.com/username/pc-dashboard.git
cd pc-dashboard
