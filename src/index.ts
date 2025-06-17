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

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`)

  try {
    const devicesChannel = await client.channels.fetch('YOUR_DEVICE_CHANNEL_ID')
    const emulatorsChannel = await client.channels.fetch(
      'YOUR_EMULATOR_CHANNEL_ID',
    )

    if (devicesChannel?.isTextBased?.() && 'send' in devicesChannel) {
      await devicesChannel.send(
        '📥 To request a device, use the `/request-device` command. Please include brand, model, and SoC.',
      )
    }

    if (emulatorsChannel?.isTextBased?.() && 'send' in emulatorsChannel) {
      await emulatorsChannel.send(
        '📥 To request an emulator, use the `/request-emulator` command. Include name, website, repo, supported systems, and whether it’s open source.',
      )
    }
  } catch (err) {
    console.error('❌ Failed to send pinned messages:', err)
  }
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
