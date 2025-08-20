import { DataSource } from 'typeorm';
import { AppDataSource } from './datasource';
import { Specialite } from '../entities/specialite.entity';
import { Medecin } from '../entities/medecin.entity';
import { Patient } from '../entities/patient.entity';
import { Pharmacie } from '../entities/pharmacie.entity';
import { User } from '../entities/user.entity'; // pour lier aux users existants
import { Availability } from '../entities/availability.entity';
import { AvailabilityType, Role } from '../entities/enums';

async function seed() {
  const ds: DataSource = AppDataSource;
  await ds.initialize();

  const userRepo = ds.getRepository(User);
  const specialiteRepo = ds.getRepository(Specialite);
  const medecinRepo = ds.getRepository(Medecin);
  const patientRepo = ds.getRepository(Patient);
  const availabilityRepo = ds.getRepository(Availability);
  const pharmacieRepo = ds.getRepository(Pharmacie);

  // ---------- 1️⃣ Seed Specialites ----------
  const specialitesDemo = [
    'Cardiologie',
    'Dermatologie',
    'ORL',
    'Gynécologie',
    'Pédiatrie',
    'Psychiatrie',
    'Médecine générale',
    'Médecine du travail',
    'Orthopédie',
    'Ophtalmologie',
    'Pneumologie',
    'Réhabilitation',
    'Médecine légale',
    'Pharmacologie',
  ];
  await specialiteRepo.upsert(
    specialitesDemo.map((nom) => ({ nom })),
    ['nom'], // clé unique
  );
  const specialitesEntities = await specialiteRepo.find();

  // ---------- 2️⃣ Seed Pharmacies ----------
  const pharmaciesDemo = [
    {
      nom: 'Pharma A',
      adresse: '10 rue A, Cotonou',
      gln: '0001',
      apiEndpoint: 'http://localhost:4000/mock/pharmacy/1',
      publicKey: 'pk1',
      lat: 6.3702935,
      lng: 2.3912365,
    },
    {
      nom: 'Pharma B',
      adresse: '20 rue B, Cotonou',
      gln: '0002',
      apiEndpoint: 'http://localhost:4000/mock/pharmacy/2',
      publicKey: 'pk2',
      lat: 6.3707735,
      lng: 2.3945865,
    },
    {
      nom: 'Pharma C',
      adresse: '30 rue C, Cotonou',
      gln: '0003',
      apiEndpoint: 'http://localhost:4000/mock/pharmacy/3',
      publicKey: 'pk3',
      lat: 6.3705535,
      lng: 2.3900065,
    },
  ];
  await pharmacieRepo.upsert(
    pharmaciesDemo,
    ['gln'], // clé unique
  );

  // -------------------------
  // Seed Users demo
  // -------------------------
  const usersDemo = [
    {
      email: 'doctor1@test.com',
      password: 'pass',
      role: Role.Medecin,
      phone: '22960000001',
    },
    {
      email: 'doctor2@test.com',
      password: 'pass',
      role: Role.Medecin,
      phone: '22960000002',
    },
    {
      email: 'patient1@test.com',
      password: 'pass',
      role: Role.Patient,
      phone: '22960000003',
    },
    {
      email: 'patient2@test.com',
      password: 'pass',
      role: Role.Patient,
      phone: '22960000004',
    },
  ];

  for (const u of usersDemo) {
    await userRepo.upsert(u, ['email']);
  }
  const usersEntities = await userRepo.find();

  // ---------- 3️⃣ Seed Medecins ----------
  const medecinsDemo = [
    {
      user: usersEntities[0],
      specialitesNames: ['Cardiologie'],
      weekendPremium: 20,
      tarifs: 100,
      rpps: 'RPPS001',
      lieux: ['Cotonou'],
    },
    {
      user: usersEntities[1],
      specialitesNames: ['Dermatologie'],
      weekendPremium: 15,
      tarifs: 80,
      rpps: 'RPPS002',
      lieux: ['Parakou'],
    },
  ];

  for (const m of medecinsDemo) {
    // Cherche si le medecin existe déjà
    let med = await medecinRepo.findOne({
      where: { user: { id: m.user.id } },
      relations: ['specialites'],
    });

    if (!med) {
      // Crée si n'existe pas
      med = medecinRepo.create({
        user: m.user,
        weekendPremium: m.weekendPremium,
        tarifs: m.tarifs,
        rpps: m.rpps,
        lieux: m.lieux,
        specialites: specialitesEntities.filter((s) =>
          m.specialitesNames.includes(s.nom),
        ),
      });
    } else {
      // Met à jour les champs scalaires
      med.weekendPremium = m.weekendPremium;
      med.tarifs = m.tarifs;
      // Met à jour les spécialités
      med.specialites = specialitesEntities.filter((s) =>
        m.specialitesNames.includes(s.nom),
      );
    }

    const savedMed = await medecinRepo.save(med);

    // Créneaux week-end
    const availabilities = [
      {
        medecin: savedMed,
        start: new Date('2025-08-17T10:00:00Z'),
        end: new Date('2025-08-17T11:00:00Z'),
        type: AvailabilityType.Weekend,
        capacity: 1,
      },
      {
        medecin: savedMed,
        start: new Date('2025-08-18T14:00:00Z'),
        end: new Date('2025-08-18T15:00:00Z'),
        type: AvailabilityType.Weekend,
        capacity: 1,
      },
    ];

    for (const a of availabilities) {
      await availabilityRepo.save(availabilityRepo.create(a));
    }
  }

  // -------------------------
  // Seed Patients
  // -------------------------
  const patientsDemo = [
    {
      user: usersEntities[2],
      dateNaissance: new Date('1985-01-01'),
      assurances: ['Assurance A'],
      dossiers: {},
    },
    {
      user: usersEntities[3],
      dateNaissance: new Date('1990-05-15'),
      assurances: ['Assurance B'],
      dossiers: {},
    },
  ];

  for (const p of patientsDemo) {
    const patient = patientRepo.create(p);
    await patientRepo.save(patient);
  }

  console.log('✅ Seed terminé');
  await ds.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
