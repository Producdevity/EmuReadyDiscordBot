import { Client, GatewayIntentBits, Events, Interaction } from 'discord.js'
import 'dotenv/config'

import {
  registerDeviceRequestCommand,
  handleDeviceModal,
} from './modals/request-device-modal.js'

import {
  registerEmulatorRequestCommand,
  handleEmulatorModal,
} from './modals/request-emulator-modal.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user?.tag}`)
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    await registerDeviceRequestCommand(interaction)
    await registerEmulatorRequestCommand(interaction)
  }

  if (interaction.isModalSubmit()) {
    await handleDeviceModal(interaction)
    await handleEmulatorModal(interaction)
  }
})

client.login(process.env.DISCORD_TOKEN)
