import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@repreguerra.com' },
    update: {
      rol: 'SUPER_ADMIN',
      password_hash: passwordHash,
    },
    create: {
      nombre_completo: 'Super Administrador',
      tipo_documento: 'DNI',
      num_documento: '00000000',
      email: 'admin@repreguerra.com',
      password_hash: passwordHash,
      telefono: '999999999',
      rol: 'SUPER_ADMIN',
    },
  });

  console.log('✅ SUPER_ADMIN creado exitosamente:');
  console.log('Email:', admin.email);
  console.log('Contraseña: admin123');
  console.log('Rol:', admin.rol);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
