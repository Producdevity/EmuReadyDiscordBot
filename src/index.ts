import {
  Client,
  GatewayIntentBits,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user?.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    interaction.isChatInputCommand() &&
    interaction.commandName === 'request-device'
  ) {
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

  if (interaction.isModalSubmit() && interaction.customId === 'deviceRequest') {
    const brand = interaction.fields.getTextInputValue('brandName')
    const model = interaction.fields.getTextInputValue('modelName')
    const soc = interaction.fields.getTextInputValue('socName')

    const formatted = `\`\`\`ts
brandName: '${brand}',
modelName: '${model}',
socName: '${soc}',
\`\`\``

    await interaction.reply({ content: formatted, ephemeral: true })
  }
})

client.login(process.env.DISCORD_TOKEN)
