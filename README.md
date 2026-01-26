# 🖥️ Silicon Dreams: Build. Profit. Repeat.

> **"The only PC building simulator where you can scam people with used GPUs."**

You can play and test the game at: https://silicon-dreams.vercel.app/

## 📖 About
**Silicon Dreams** is a browser-based tycoon game built with **React** and **Vite**. You start with a rusty screwdriver and $1,200, and work your way up to a tech empire.

Unlike other clickers, this game features **logic-based assembly**. You can't just jam a Threadripper into an LGA1151 socket. You have to match sockets, manage power draw, and ensure RAM compatibility.

It also features a **Global Player Market** powered by Firebase. If you find a "Golden Chip" CPU, you can sell it to a real player for profit.

**NOTE:** Any use of Jules was only used to check and run tests on the code No logic was made by it.

## ✨ Features
* **🛠️ Realistic Assembly:** Logic checks for Socket, RAM type (DDR4/5), and Form Factors.
* **📉 Dynamic Economy:** Buy low from pallets, sell high on the global market.
* **🌍 Multiplayer Trading:** List items on a real-time global marketplace (Firestore).
* **⚡ Overclocking & Binning:** Test your silicon lottery luck. Find "Golden Samples."
* **📈 Skill Trees:** Level up your Barter, Repair, and Overclocking skills.
* **💾 Auto-Save:** LocalStorage for progress, Cloud for trading.

## 🛠️ Tech Stack
* **Frontend:** React 19, Vite, Tailwind CSS
* **State Management:** Zustand (w/ Persistence Middleware)
* **Backend / DB:** Firebase (Firestore & Auth)
* **Icons:** Lucide React

**Sound:** Music made by me. SFX made with code.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm or pnpm

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/yourusername/silicon-dreams.git](https://github.com/yourusername/silicon-dreams.git)
    cd silicon-dreams
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    * Rename `.env.example` to `.env`.
    * Add your Firebase configuration (see Setup Guide below).

4.  **Run the game**
    ```bash
    npm run dev
    ```

## ⚙️ Configuration (Firebase)
To enable the **Global Market**, you need a Firebase project.
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a project and enable **Firestore Database** and **Authentication** (Anonymous).
3.  Copy your config keys into `.env`:
    ```env
    VITE_API_KEY=your_key
    VITE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_PROJECT_ID=your_project_id
    VITE_STORAGE_BUCKET=your_project.appspot.com
    VITE_MESSAGING_SENDER_ID=your_id
    VITE_APP_ID=your_app_id
    ```

## 📸 Screenshots
| Workshop | Global Market |
|:---:|:---:|
| ![Workshop](https://media.discordapp.net/attachments/1429192095729586179/1465136861465809099/image.png?ex=69780288&is=6976b108&hm=e3168cdeeb2e813897a5a8a145d81411c9c4dda4493444bd326430874fcb7c4d&=&format=webp&quality=lossless&width=1128&height=537) | ![Market](https://media.discordapp.net/attachments/1429192095729586179/1465136862334292182/image.png?ex=69780288&is=6976b108&hm=bb459431774578ca7f848d6b9bc989c94e8eb7f53624e8eb8de8d61394477736&=&format=webp&quality=lossless&width=1128&height=530) |

## 🤝 Contributing
Found a bug? Want to add more parts?
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewGPU`)
3.  Commit your Changes (`git commit -m 'Add RTX 5090'`)
4.  Push to the Branch (`git push origin feature/NewGPU`)
5.  Open a Pull Request

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.