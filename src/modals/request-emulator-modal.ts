import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js'
import { ALLOWED_CHANNELS } from '../constants.js'

export async function registerEmulatorRequestCommand(
  interaction: ChatInputCommandInteraction,
) {
  if (interaction.commandName !== 'request-emulator') return

  if (interaction.channelId !== ALLOWED_CHANNELS[interaction.commandName]) {
    await interaction.reply({
      content: '❌ This command can only be used in #request-emulators',
      ephemeral: true,
    })
    return
  }
  const modal = new ModalBuilder()
    .setCustomId('emulatorRequest')
    .setTitle('Emulator Request')

  const name = new TextInputBuilder()
    .setCustomId('name')
    .setLabel('Emulator Name')
    .setStyle(TextInputStyle.Short)

  const website = new TextInputBuilder()
    .setCustomId('website')
    .setLabel('Website URL')
    .setStyle(TextInputStyle.Short)

  const repo = new TextInputBuilder()
    .setCustomId('repo')
    .setLabel('Repository URL')
    .setStyle(TextInputStyle.Short)

  const systems = new TextInputBuilder()
    .setCustomId('systems')
    .setLabel('Supported Systems (comma-separated)')
    .setStyle(TextInputStyle.Paragraph)

  const openSource = new TextInputBuilder()
    .setCustomId('openSource')
    .setLabel('Open Source? (true/false)')
    .setStyle(TextInputStyle.Short)

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(name),
    new ActionRowBuilder<TextInputBuilder>().addComponents(website),
    new ActionRowBuilder<TextInputBuilder>().addComponents(repo),
    new ActionRowBuilder<TextInputBuilder>().addComponents(systems),
    new ActionRowBuilder<TextInputBuilder>().addComponents(openSource),
  )

  await interaction.showModal(modal)
}

export async function handleEmulatorModal(interaction: ModalSubmitInteraction) {
  if (interaction.customId !== 'emulatorRequest') return

  const data = {
    name: interaction.fields.getTextInputValue('name'),
    website: interaction.fields.getTextInputValue('website'),
    repository: interaction.fields.getTextInputValue('repo'),
    systems: interaction.fields
      .getTextInputValue('systems')
      .split(',')
      .map((s) => s.trim()),
    openSource:
      interaction.fields.getTextInputValue('openSource').toLowerCase() ===
      'true',
  }

  const formatted = `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``

  if (
    interaction.channel &&
    interaction.channel.isTextBased() &&
    'send' in interaction.channel
  ) {
    await interaction.channel.send({ content: formatted })
  }
}
