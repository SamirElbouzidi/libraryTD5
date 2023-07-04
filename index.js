const readline = require('readline');

// Fonction pour effectuer une requête GET à l'API
async function fetchData(url) {
  const fetch = await import('node-fetch');

  return fetch.default(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    });
}

// Fonction pour afficher les filtres disponibles
function displayFilters(filterOptions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const selectedFilters = {};

  // Fonction pour poser la question du filtre suivant
  function askNextFilterQuestion() {
    if (filterOptions.length === 0) {
      rl.close();
      fetchFilteredData(selectedFilters);
      return;
    }

    const filterName = filterOptions.shift();

    rl.question(`Voulez-vous utiliser le filtre "${filterName}" ? (o/n) : `, function(answer) {
      if (answer.toLowerCase() === 'o') {
        rl.question(`Veuillez entrer la valeur du filtre "${filterName}" : `, function(filterValue) {
          selectedFilters[filterName] = filterValue;
          askNextFilterQuestion();
        });
      } else {
        askNextFilterQuestion();
      }
    });
  }

  askNextFilterQuestion();
}

// Fonction pour récupérer les données avec les filtres sélectionnés
function fetchFilteredData(filters) {
  // URL de l'API
  const apiUrl = "https://data.culture.gouv.fr/api/records/1.0/search/?dataset=panorama-des-festivals&q=";

  let apiUrlWithFilters = apiUrl;
  const filterNames = Object.keys(filters);

  for (const filterName of filterNames) {
    if (filters[filterName]) {
      apiUrlWithFilters += `&${filterName}=${encodeURIComponent(filters[filterName])}`;
    }
  }

  // Effectuer la requête à l'API avec les filtres
  fetchData(apiUrlWithFilters)
    .then(data => {
      // Afficher les données complètes dans la console
      console.log(data);

      // Extraire la propriété 'fields' des enregistrements avec les facets
      const fields = data.records.map(record => {
        const { facets, ...otherFields } = record.fields;
        return { ...otherFields, facets };
      });

      // Afficher les données 'fields' dans la console
      console.dir(fields, { depth: null });

      // Afficher les données du groupe de facettes dans la console
      console.dir(data.facet_groups, { depth: null });
    });
}

// Liste des filtres disponibles
const filterOptions = [
  "rows",
  "start",
  "region",
  "domaine",
  "complement_domaine",
  "departement",
  "mois_habituel_de_debut"
];

// Appeler la fonction pour afficher les filtres et sélectionner les valeurs
displayFilters(filterOptions);
