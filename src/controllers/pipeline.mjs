import axios from 'axios';

const RANDOMMER_API_KEY = 'aec8d8a9a66c490faa08bca28a3cccb8';

const headers = {
  'X-Api-Key': RANDOMMER_API_KEY
};

async function getRandomUser() {
  const { data } = await axios.get('https://randomuser.me/api/');
  return data.results[0];
}

async function getRandomPhone() {
  const { data } = await axios.get('https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1', { headers });
  return data[0];
}

async function getRandomIBAN() {
  const { data } = await axios.get('https://randommer.io/api/Bank/IBAN?country=FR&Quantity=1', { headers });
  return data[0];
}

async function getCreditCard() {
  const { data } = await axios.get('https://randommer.io/api/Card?Quantity=1', { headers });
  return data[0];
}

async function getPet() {
  const { data } = await axios.get('https://randommer.io/api/Animal?Quantity=1', { headers });
  return data[0];
}

async function getRandomName() {
  const { data } = await axios.get('https://randommer.io/api/Name?nameType=fullname&Quantity=1', { headers });
  return data[0];
}

async function getJoke() {
  const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
  return data.joke;
}

async function getActivity() {
  const { data } = await axios.get('https://www.boredapi.com/api/activity');
  return data.activity;
}

async function buildUserProfile() {
  try {
    const user = await getRandomUser();
    const phone = await getRandomPhone();
    const iban = await getRandomIBAN();
    const creditCard = await getCreditCard();
    const pet = await getPet();
    const name = await getRandomName();
    const joke = await getJoke();
    const activity = await getActivity();

    const profile = {
      fullName: `${user.name.first} ${user.name.last}`,
      email: user.email,
      phone,
      iban,
      creditCard,
      pet,
      randomName: name,
      joke,
      suggestedActivity: activity,
      picture: user.picture.large
    };

    console.log('\n Profil généré :\n');
    console.log(JSON.stringify(profile, null, 2));
  } catch (error) {
    console.error('Erreur lors de la génération du profil :', error.message);
  }
}

buildUserProfile();
