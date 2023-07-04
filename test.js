const { fetchData } = require('./index.js');

jest.mock('./index.js', () => ({
    fetchData: jest.fn(),
  }));
  
  test('Test de récupération de données de l\'API', async () => {
    // Définir la réponse mockée de l'API
    const mockedData = { /* Votre réponse mockée de l'API */ };
    fetchData.mockResolvedValue(mockedData);
  
    // Appeler la fonction qui récupère les données
    const data = await fetchData(/* Votre URL de l'API */);
  
    // Vérifier que fetchData a été appelée avec les bons paramètres
    expect(fetchData).toHaveBeenCalledWith(/* Vos paramètres d'URL de l'API */);
  
    // Vérifier que les données ont été correctement récupérées
    expect(data).toEqual(mockedData);
  });
  