import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js'

export async function registerDeviceRequestCommand(
  interaction: ChatInputCommandInteraction,
) {
  if (interaction.commandName !== 'request-device') return

  const modal = new ModalBuilder()
    .setCustomId('deviceRequest')
    .setTitle('Device Request')

  const brand = new TextInputBuilder()
    .setCustomId('brandName')
    .setLabel('Brand Name')
    .setStyle(TextInputStyle.Short)

  const model = new TextInputBuilder()
    .setCustomId('modelName')
    .setLabel('Model Name')
    .setStyle(TextInputStyle.Short)

  const soc = new TextInputBuilder()
    .setCustomId('socName')
    .setLabel('SoC Name')
    .setStyle(TextInputStyle.Short)

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(brand),
    new ActionRowBuilder<TextInputBuilder>().addComponents(model),
    new ActionRowBuilder<TextInputBuilder>().addComponents(soc),
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

  const formatted = `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``

  await interaction.reply({ content: formatted, ephemeral: true })
}
