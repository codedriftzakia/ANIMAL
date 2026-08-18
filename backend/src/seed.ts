import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Animal from './models/Animal';
import Feedback from './models/Feedback';
import { recalculateAnimalWelfare } from './services/welfareLogic';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/faunapulse';

const SEED_ANIMALS = [
  {
    name: 'Barnaby',
    species: 'Golden Retriever',
    habitat: 'Rescue & Rehabilitation Center',
    careTier: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    healthIndex: 94,
    mood: 'Vibrant',
    tagline: 'Gentle therapy dog and shelter favorite',
    bio: 'Barnaby is a 4-year-old rescued Golden Retriever who brings joy to visitors and therapy patients daily. He loves agility games and belly rubs.',
    specialNotes: 'Enjoys morning walks near the pond. All vaccinations up to date.',
  },
  {
    name: 'Kira',
    species: 'Red Panda',
    habitat: 'High Canopy Sanctuary',
    careTier: 'Standard',
    imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    healthIndex: 88,
    mood: 'Playful',
    tagline: 'Agile canopy climber with a penchant for bamboo shoots',
    bio: 'Kira arrived from a regional breeding conservation program. She spends most of her mornings scaling cedar trees and eating fresh bamboo leaves.',
    specialNotes: 'Prefers cool shaded platforms. Enjoys apple slices as enrichment treats.',
  },
  {
    name: 'Milo',
    species: 'Capybara',
    habitat: 'Wetland Oasis',
    careTier: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
    healthIndex: 91,
    mood: 'Calm',
    tagline: 'The epitome of tranquility and social harmony',
    bio: 'Milo is the peaceful heart of the Wetland exhibit. He shares his habitat effortlessly with ducks, turtles, and visiting wildlife.',
    specialNotes: 'Loves mud baths on warm afternoons. Requires daily water filtration checks.',
  },
  {
    name: 'Aria',
    species: 'Snow Leopard',
    habitat: 'Alpine Cliff Habitat',
    careTier: 'High Attention',
    imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    healthIndex: 78,
    mood: 'Reserved',
    tagline: 'Majestic mountain predator undergoing welfare tracking',
    bio: 'Aria was rescued after losing her mother in remote alpine terrain. She requires continuous environmental enrichment and stealth agility puzzles.',
    specialNotes: 'Needs solitary feeding hours. Responds well to puzzle-box rewards.',
  },
  {
    name: 'Tembo',
    species: 'African Elephant',
    habitat: 'Savannah Reserve',
    careTier: 'Standard',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
    healthIndex: 86,
    mood: 'Vibrant',
    tagline: 'Rescued sanctuary matriarch and herd leader',
    bio: 'Tembo leads a group of 3 rescued elephants in our expansive savannah reserve. She communicates through deep infrasonic rumbles.',
    specialNotes: 'Requires daily foot care and dust bath maintenance.',
  },
  {
    name: 'Kai',
    species: 'Green Sea Turtle',
    habitat: 'Marine Reef Lagoon',
    careTier: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    healthIndex: 92,
    mood: 'Calm',
    tagline: 'Rehabilitated ocean navigator',
    bio: 'Kai was treated for a fin injury caused by marine debris. Now fully recovered, he swims gracefully among coral reefs in our lagoon habitat.',
    specialNotes: 'Diet includes seagrass pellets and fresh algae enrichment.',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing existing data...');
    await Animal.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Inserting seed animals...');
    const insertedAnimals = await Animal.insertMany(SEED_ANIMALS);

    console.log('Creating sample feedback entries...');
    const sampleFeedbacks = [
      {
        animalId: insertedAnimals[0]._id, // Barnaby
        userName: 'Dr. Sarah Jenkins',
        userRole: 'Veterinarian',
        ratings: { overall: 5, welfare: 5, enclosure: 5, interaction: 5 },
        tags: ['Active & Playful', 'Clean Habitat', 'Healthy Diet'],
        comment: 'Barnaby passed his quarterly health examination with flying colors! High energy, clear coat, excellent weight management.',
        isUrgent: false,
        sentiment: 'POSITIVE',
        status: 'Highlighted',
        staffNote: 'Included in monthly newsletter spotlight.',
      },
      {
        animalId: insertedAnimals[0]._id, // Barnaby
        userName: 'Alex Rivera',
        userRole: 'Visitor',
        ratings: { overall: 5, welfare: 5, enclosure: 4, interaction: 5 },
        tags: ['Friendly Interaction', 'Great Visitor Engagement'],
        comment: 'My children loved playing fetch with Barnaby today. He is such a gentle soul and so well cared for by staff!',
        isUrgent: false,
        sentiment: 'POSITIVE',
        status: 'Resolved',
      },
      {
        animalId: insertedAnimals[1]._id, // Kira
        userName: 'Elena Rostova',
        userRole: 'Volunteer',
        ratings: { overall: 4, welfare: 4, enclosure: 5, interaction: 4 },
        tags: ['Enrichment Needed', 'Active & Playful'],
        comment: 'Kira spent the morning exploring the new rope bridge! She seems eager for additional climbing structures in the upper canopy.',
        isUrgent: false,
        sentiment: 'POSITIVE',
        status: 'Under Review',
        staffNote: 'Requested quote for cedar climbing logs.',
      },
      {
        animalId: insertedAnimals[3]._id, // Aria
        userName: 'Marcus Vance',
        userRole: 'Caretaker',
        ratings: { overall: 3, welfare: 3, enclosure: 3, interaction: 2 },
        tags: ['Dietary Concern', 'Stress Signs'],
        comment: 'Aria appeared slightly hesitant during afternoon feeding. Left half her meal untouched. Recommending quiet monitoring.',
        isUrgent: false,
        sentiment: 'NEUTRAL',
        status: 'Under Review',
        staffNote: 'Vet team scheduled for evening observation.',
      },
      {
        animalId: insertedAnimals[2]._id, // Milo
        userName: 'Chloe Bennett',
        userRole: 'Visitor',
        ratings: { overall: 5, welfare: 5, enclosure: 5, interaction: 5 },
        tags: ['Clean Habitat', 'Peaceful Behavior'],
        comment: 'Milo resting in the sun with the ducklings was the highlight of our sanctuary visit! Super clean water pond.',
        isUrgent: false,
        sentiment: 'POSITIVE',
        status: 'Resolved',
      },
      {
        animalId: insertedAnimals[4]._id, // Tembo
        userName: 'Robert Chen',
        userRole: 'Caretaker',
        ratings: { overall: 4, welfare: 4, enclosure: 4, interaction: 4 },
        tags: ['Good Hydration', 'Social Group Active'],
        comment: 'Tembo led the herd through mud bath enrichment today. All elephants showed healthy skin hydration levels.',
        isUrgent: false,
        sentiment: 'POSITIVE',
        status: 'Resolved',
      },
      {
        animalId: insertedAnimals[5]._id, // Kai
        userName: 'Samantha Green',
        userRole: 'Volunteer',
        ratings: { overall: 5, welfare: 5, enclosure: 5, interaction: 5 },
        tags: ['Clean Habitat', 'High Energy'],
        comment: 'Kai was swimming energetically near the glass panel. Water quality tests show optimal salinity and temperature.',
        isUrgent: false,
        sentiment: 'POSITIVE',
        status: 'Resolved',
      },
    ];

    await Feedback.insertMany(sampleFeedbacks);

    console.log('Recalculating welfare metrics for all animals...');
    for (const animal of insertedAnimals) {
      await recalculateAnimalWelfare(animal._id.toString());
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
