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

export async function registerDeviceRequestCommand(
  interaction: ChatInputCommandInteraction,
) {
  if (interaction.commandName !== 'request-device') return
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
          .setCustomId('deviceCheckConfirm')
          .setPlaceholder('Does this device exist on EmuReady?')
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

export async function handleDeviceCheckConfirm(
  interaction: StringSelectMenuInteraction,
) {
  if (interaction.customId !== 'deviceCheckConfirm') return

  const modal = new ModalBuilder()
    .setCustomId('deviceRequest')
    .setTitle('Device Request')
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('brandName')
          .setLabel('Brand Name')
          .setPlaceholder('e.g. Samsung, Google, Apple')
          .setStyle(TextInputStyle.Short),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('modelName')
          .setLabel('Model Name')
          .setPlaceholder('e.g. Galaxy S21, Pixel 5')
          .setStyle(TextInputStyle.Short),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('socName')
          .setLabel('SoC Name')
          .setPlaceholder('e.g. Qualcomm Snapdragon 888, Exynos 2100')
          .setStyle(TextInputStyle.Short),
      ),
    )

  await interaction.showModal(modal)
}

export async function handleDeviceModal(interaction: ModalSubmitInteraction) {
  if (interaction.customId !== 'deviceRequest') return

  const data = {
    brandName: interaction.fields.getTextInputValue('brandName'),
    modelName: interaction.fields.getTextInputValue('modelName'),
    socName: interaction.fields.getTextInputValue('socName'),
  }

  const user = interaction.user
  const username = user.globalName ?? user.username

  const formatted = formatInteractionData(data, username)
  await interaction.reply({ content: formatted })
}
