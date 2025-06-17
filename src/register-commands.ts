import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import 'dotenv/config'

const commands = [
  new SlashCommandBuilder()
    .setName('request-device')
    .setDescription('Submit a new device request'),

  new SlashCommandBuilder()
    .setName('request-emulator')
    .setDescription('Submit a new emulator request'),
].map((command) => command.toJSON())

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

try {
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
    body: commands,
  })
  console.log('✅ Successfully registered application commands.')
} catch (error) {
  console.error('❌ Failed to register commands:', error)
}
