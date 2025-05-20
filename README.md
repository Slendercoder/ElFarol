# 🍻 El Farol Bar Problem – Experimental Platform

**ElFarol** is a fully functional experimental platform built with [nodeGame](https://nodegame.org/) to run small-group versions of the El Farol Bar Problem. It is designed for behavioral experiments in coordination and decision-making, and is ready for deployment in laboratory or online settings.

---

## 🧠 About the El Farol Bar Problem

The El Farol Bar Problem is a classic game-theoretic scenario where individuals decide independently whether to attend a bar with limited capacity. If too many attend, the experience is diminished; if too few attend, the bar is underutilized. This setup models coordination challenges and collective behavior dynamics.

---

## 🚀 Features

- **Modular Game Design**: Built using nodeGame's modular architecture, facilitating easy customization and extension.
- **Real-Time Interaction**: Supports synchronous experiments with real-time data collection.
- **Bot Integration**: Includes bots to simulate player behavior, useful for testing and demonstrations.
- **Monitoring Tools**: Provides interfaces to monitor ongoing experiments and participant behavior.
- **Ready for Deployment**: Pre-configured for immediate use in experimental settings.

---

## 🗂️ Repository Structure

```

ElFarol/
├── client/                # Client-side HTML, CSS, and JS files
├── server/                # Server-side logic and configuration
├── game/                  # Game logic and flow definitions
├── public/                # Static assets served to clients
├── launcher.js            # Script to launch the nodeGame server
├── package.json           # Node.js project configuration
└── README.md              # Project documentation

````

---

## 🛠️ Installation

### Prerequisites

Before installing ElFarol, ensure the following are installed on your system:

- **Node.js** (LTS version): [Download Node.js](https://nodejs.org/en/download/)
- **Git**: [Download Git](https://git-scm.com/downloads)

To verify installations, run:

```bash
node --version
npm --version
git --version
````

### Installing nodeGame

1. **Download the nodeGame Installer**:

   Visit the [nodeGame installation page](https://nodegame.org/install.htm) and download the installer script.

2. **Run the Installer**:

   Open a terminal, navigate to the directory containing the installer, and execute:

   ```bash
   node nodegame-installer.js
   ```

   Follow the on-screen instructions to complete the installation.

3. **Verify Installation**:

   After installation, you can start the nodeGame server by running:

   ```bash
   node launcher.js
   ```

   Then, open your browser and navigate to `http://localhost:8080` to access the nodeGame interface.

---

## 🧪 Running the El Farol Experiment

1. **Start the Server**:

   In the project directory, launch the server:

   ```bash
   node launcher.js
   ```

2. **Access the Experiment**:

   Open your browser and navigate to:

   ```
   http://localhost:8080/ElFarol
   ```

   This will load the El Farol experiment interface.

3. **Monitor the Experiment**:

   To monitor the experiment's progress and participant behavior, access the monitor interface:

   ```
   http://localhost:8080/ElFarol/monitor
   ```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For questions, suggestions, or contributions, please open an issue or contact the repository maintainer.
