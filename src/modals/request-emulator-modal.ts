import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import { ALLOWED_CHANNELS } from '../constants.js'
import { formatInteractionData } from '../utils/formatInteractionData.js'

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

  await interaction.reply({
    content: 'Before continuing, confirm you checked EmuReady:',
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('emulatorCheckConfirm')
          .setPlaceholder('Does this emulator already exist on EmuReady?')
          .addOptions(
            {
              label: 'No, I checked and it does not exist',
              value: 'checked_not_found',
            },
            {
              label:
                'No, I am a lazy fck and did not check and my request will be ignored',
              value: 'not_checked',
            },
          ),
      ),
    ],
    ephemeral: true,
  })
}

export async function handleEmulatorCheckConfirm(
  interaction: StringSelectMenuInteraction,
) {
  if (interaction.customId !== 'emulatorCheckConfirm') return

  const modal = new ModalBuilder()
    .setCustomId('emulatorRequest')
    .setTitle('Emulator Request')
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('name')
          .setRequired(true)
          .setLabel('Emulator Name')
          .setStyle(TextInputStyle.Short),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('website')
          .setLabel('Website URL')
          .setStyle(TextInputStyle.Short),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('repo')
          .setLabel('Repository URL')
          .setStyle(TextInputStyle.Short),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('systems')
          .setRequired(true)
          .setPlaceholder('PS3, PS4, Xbox 360, etc.')
          .setLabel('Supported Systems (comma-separated if multiple)')
          .setStyle(TextInputStyle.Short),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('openSource')
          .setRequired(true)
          .setPlaceholder('true')
          .setLabel('Open Source? (true/false)')
          .setStyle(TextInputStyle.Short),
      ),
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

  const username = interaction.user.globalName ?? interaction.user.username
  const formatted = formatInteractionData(data, username)

  await interaction.reply({ content: formatted })
}
