const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Usuarios en la base de datos:");
  users.forEach(u => {
    console.log(`- Email: ${u.email} | Rol: ${u.rol}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
