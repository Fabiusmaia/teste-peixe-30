import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './src/users/entities/user.entity';
import { Candidate } from './src/candidates/entities/candidate.entity';
import candidatesData from './candidates.seed.json'
import 'dotenv/config';

async function bootstrap() {
  const dataSource = new DataSource({
    type: 'mongodb',
    url: process.env.MONGO_URL,
    entities: [User, Candidate],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getMongoRepository(User);
  const email = 'admin@example.com';
  const password = await bcrypt.hash('123456', 10);

  const existingUser = await userRepository.findOne({ where: { email } });
  if (!existingUser) {
    const user = userRepository.create({
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userRepository.save(user);
    console.log('Usuário seed criado:', email);
  } else {
    console.log('Usuário já existe:', email);
  }

  const candidateRepository = dataSource.getMongoRepository(Candidate);

  for (const c of candidatesData) {
    const existing = await candidateRepository.findOne({
      where: { email: c.email },
    });
    if (!existing) {
      const candidate = candidateRepository.create({
        ...c,
        score: 0,
        invited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await candidateRepository.save(candidate);
      console.log('Candidato criado:', c.name);
    } else {
      console.log('Candidato já existe:', c.name);
    }
  }

  await dataSource.destroy();
  console.log('Seed finalizado!');
}

bootstrap().catch((err) => {
  console.error('Erro ao rodar seed:', err);
});
