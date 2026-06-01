import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const {
      nombres,
      documento,
      email,
      telefono,
      domicilio,
      tipoBien,
      montoReclamado,
      descripcionBien,
      tipoReclamo,
      detalle,
      pedido,
    } = req.body;

    // Validación básica
    if (!nombres || !documento || !email || !domicilio || !tipoBien || !descripcionBien || !tipoReclamo || !detalle || !pedido) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        nombres,
        documento,
        email,
        telefono,
        domicilio,
        tipoBien,
        montoReclamado: montoReclamado ? parseFloat(montoReclamado) : null,
        descripcionBien,
        tipoReclamo,
        detalle,
        pedido,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Reclamo registrado exitosamente',
      complaintId: complaint.id,
    });
  } catch (error) {
    console.error('Error al crear reclamo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    console.error('Error al obtener reclamos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, respuesta } = req.body;

    const updated = await prisma.complaint.update({
      where: { id },
      data: { 
        estado,
        ...(respuesta && { respuesta })
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar reclamo:', error);
    res.status(500).json({ error: 'Error al actualizar el reclamo' });
  }
};
