import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Sembrando productos de prueba...");

  // Crear una categoría base
  const cat = await prisma.category.create({
    data: {
      nombre: 'Herramientas',
      estado: true,
    }
  });

  // Crear productos
  await prisma.product.createMany({
    data: [
      {
        categoryId: cat.id,
        nombre: 'Taladro Percutor Bosch 800W',
        sku: 'BOSCH-800W',
        descripcion: 'Taladro profesional con velocidad variable y reversa.',
        precio: 250.00,
        stock: 15,
        imagen_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        estado: true,
      },
      {
        categoryId: cat.id,
        nombre: 'Set de Destornilladores Stanley (6 piezas)',
        sku: 'STANLEY-SET6',
        descripcion: 'Set de destornilladores magnéticos.',
        precio: 45.50,
        stock: 30,
        imagen_url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        estado: true,
      },
      {
        categoryId: cat.id,
        nombre: 'Martillo de Uña Truper',
        sku: 'TRUPER-MART',
        descripcion: 'Martillo con mango de fibra de vidrio.',
        precio: 28.00,
        stock: 50,
        imagen_url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        estado: true,
      }
    ]
  });

  console.log("✅ Productos de prueba creados exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
