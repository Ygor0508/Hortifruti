import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Verificar se o usuário admin já existe
  const existingUser = await prisma.usuario.findFirst({
    where: { nivel: 3 }
  });

  if (!existingUser) {
    
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await prisma.usuario.create({
      data: {
        nome: 'Admin',
        email: 'admin@hotmail.com',
        senha: hashedPassword,
        nivel: 3
      }
    });

    console.log('Usuário Admin criado com sucesso!');
  } else {
    console.log('Usuário Admin já existe, seed ignorado.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  // Comando para rodar o Script: npx prisma db seed

