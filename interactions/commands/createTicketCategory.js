exports.data = {
  name: "ticket",
  description: "Commande en général pour les tickets",
  type: 1,
  options: [
    {
      type: 2,
      name: "create",
      description: "Création",
      options: [
        {
          type: 1,
          name: "catégorie",
          description: "Pour créer",
          options: [
            {
              type: 3,
              name: "nom",
              description: "Le nom de la categorie",
              required: true,
            },
            {
              type: 3,
              name: "description",
              description: "La description de la categorie",
              required: true,
            },
            {
              type: 3,
              name: "nom_categorie",
              description: "Nom de la catégorie (sur le serveur)",
              required: true,
            },
            {
              type: 3,
              name: "name",
              description:
                '# VAR "{{ user.username }} {{ user.id }} {{ user.tag }}"',
              required: true,
            },
            {
              type: 3,
              name: "topic",
              description:
                '# VAR "{{ user.username }} {{ user.id }} {{ user.tag }}"',
              required: true,
            },
            {
              type: 3,
              name: "title",
              description:
                'Le titre de l\'embed # VAR "{{ user.username }} {{ user.id }} {{ user.tag }}"',
              required: true,
            },
            {
              type: 3,
              name: "description_embed",
              description:
                'La description de l\'embed # VAR "{{ user.username }} {{ user.id }} {{ user.tag }}"',
              required: true,
            },
            {
              type: 3,
              name: "color",
              description: "La couleur de l'embed ( Exemple #9B9B9B )",
              required: true,
            },
            {
              type: 3,
              name: "emoji",
              description: "L'emojie du bouton",
              required: true,
            },
            {
              type: 3,
              name: "label",
              description: "Le text du bouton",
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 2,
      name: "delete",
      description: "Supprimer",
      options: [
        {
          type: 1,
          name: "catégorie",
          description: "Pour Supprimer",
          options: [
            {
              type: 3,
              name: "name",
              description: "Le nom de la catégorie",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};

exports.execute = (client, interaction) => {
  const group = interaction.options.getSubcommandGroup();
  const type = interaction.options.getSubcommand();

  const { options } = interaction;
  const { database } = client;

  if (group === "create") {
    if (type === "catégorie") {
      const data = new Object({
        uuid: Math.floor(Math.random() * 100000),
        name: options.getString("nom"),
        description: options.getString("description"),
        category: options.getString("nom_categorie"),
        categoryID: "undefined",
        channel: new Object({
          name: options.getString("name"),
          topic: options.getString("topic"),
          embed: new Object({
            title: options.getString("title"),
            description: options.getString("description_embed"),
            color: options.getString("color"),
          }),
        }),
        button: {
          emoji: options.getString("emoji"),
          label: options.getString("label"),
        },
      });
      database.query("INSERT INTO bot_tickets_category (data) VALUES (?)", [
        JSON.stringify(data),
      ]);
      database.query("UPDATE bot_tickets_data SET edit = ? WHERE id = 1", [
        "true",
      ]);
      interaction.reply({
        content:
          "Nouvelle catégorie enregistrer, elle sera setup a la prochaine update du système !",
        ephemeral: true,
      });
    }
  }
};
