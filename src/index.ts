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
import { ALLOWED_CHANNELS } from './constants.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const allowedDeviceChannelId = ALLOWED_CHANNELS['request-device']
const allowedEmulatorChannelId = ALLOWED_CHANNELS['request-emulator']

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`)

  try {
    const devicesChannel = await client.channels.fetch(allowedDeviceChannelId)
    const emulatorsChannel = await client.channels.fetch(
      allowedEmulatorChannelId,
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
    const { commandName, channelId } = interaction

    const isWrongChannel =
      (commandName === 'request-device' &&
        channelId !== allowedDeviceChannelId) ||
      (commandName === 'request-emulator' &&
        channelId !== allowedEmulatorChannelId)

    if (isWrongChannel) {
      await interaction.reply({
        content:
          '❌ This command can only be used in the designated request channel.',
        ephemeral: true,
      })
      return
    }

    if (commandName === 'request-device') {
      await registerDeviceRequestCommand(interaction)
    }

    if (commandName === 'request-emulator') {
      await registerEmulatorRequestCommand(interaction)
    }
  }

  if (interaction.isModalSubmit()) {
    await handleDeviceModal(interaction)
    await handleEmulatorModal(interaction)
  }
})

client.login(process.env.DISCORD_TOKEN)
