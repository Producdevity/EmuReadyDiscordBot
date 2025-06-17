# Discord Modal Bot

This is a simple Discord bot built with `discord.js` v14 and TypeScript. It provides a `/request-device` slash command that opens a modal to collect structured input from users.

When submitted, the bot replies with a formatted code snippet like:

```
brandName: 'Samsung',
modelName: 'Galaxy Z Flip6',
socName: 'Snapdragon 8 Gen 3',
```

---

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/your-org/discord-modal-bot.git
cd discord-modal-bot
npm install
```

### 2. Create `.env`

```bash
cp .env.example .env
```

### 3. Register Slash Commands

```bash
npm run register
```

### 4. Run the Bot

```bash
npm run dev
```

## 💡 Features

- `/request-device` slash command
- Modal with 3 required fields:
  - Brand Name
  - Model Name
  - SoC Name
- Response posted back in formatted code block

---

## 🧱 Tech Stack

- [discord.js](https://discord.js.org) v14
- TypeScript
- dotenv
- Node.js 18+

---

## 📝 License

MIT License
