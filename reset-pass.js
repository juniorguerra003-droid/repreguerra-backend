const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const password = "password123";
  const password_hash = await bcrypt.hash(password, 10);
  
  await prisma.user.update({
    where: { email: 'admin@repreguerra.com' },
    data: { password_hash }
  });
  console.log("Contraseña actualizada con éxito a: " + password);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
