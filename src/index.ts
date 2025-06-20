import {
  Client,
  GatewayIntentBits,
  Events,
  Interaction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js'
import 'dotenv/config'

import {
  handleDeviceCheckConfirm,
  registerDeviceRequestCommand,
  handleDeviceModal,
} from './modals/request-device-modal.js'

import {
  handleEmulatorCheckConfirm,
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

  const selectMenuHandlers: Record<
    string,
    (i: StringSelectMenuInteraction) => Promise<void>
  > = {
    deviceCheckConfirm: handleDeviceCheckConfirm,
    emulatorCheckConfirm: handleEmulatorCheckConfirm,
  }

  const modalHandlers: Record<
    string,
    (i: ModalSubmitInteraction) => Promise<void>
  > = {
    deviceRequest: handleDeviceModal,
    emulatorRequest: handleEmulatorModal,
  }

  if (interaction.isStringSelectMenu()) {
    const handler = selectMenuHandlers[interaction.customId]
    if (handler) await handler(interaction)
  }

  if (interaction.isModalSubmit()) {
    const handler = modalHandlers[interaction.customId]
    if (handler) await handler(interaction)
  }
})

const restrictedChannels = Object.values(ALLOWED_CHANNELS)

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return
  if (!restrictedChannels.includes(message.channelId)) return
  if (message.type !== 0 || message.author.bot) return // allow command replies

  await message.delete().catch(console.error)

  const commandName = Object.entries(ALLOWED_CHANNELS).find(
    ([, id]) => id === message.channelId,
  )?.[0]

  const commandText = commandName ? `/${commandName}` : 'the correct command'

  await message.channel.send({
    content: `<@${message.author.id}> ❌ Please use ${commandText} in this channel.`,
  })
})

client.login(process.env.DISCORD_TOKEN)
