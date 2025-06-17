import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import 'dotenv/config'

const commands = [
  new SlashCommandBuilder()
    .setName('request-device')
    .setDescription('Submit a device request')
    .toJSON(),
]

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
  body: commands,
})

console.log('✅ Registered slash commands')
