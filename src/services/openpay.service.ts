import axios from 'axios';

// Configuración inicial de Openpay
// Para desarrollo usar 'sandbox-api.openpay.pe', para producción 'api.openpay.pe'
const isProd = process.env.NODE_ENV === 'production';
const OPENPAY_BASE_URL = isProd 
  ? 'https://api.openpay.pe/v1' 
  : 'https://sandbox-api.openpay.pe/v1';

const MERCHANT_ID = process.env.OPENPAY_MERCHANT_ID || 'tu_merchant_id';
const PRIVATE_KEY = process.env.OPENPAY_PRIVATE_KEY || 'tu_private_key';

// Token de autenticación básico (Base64)
const authStr = Buffer.from(`${PRIVATE_KEY}:`).toString('base64');

export interface ChargeRequest {
  source_id: string; // token_id generado por el frontend
  method: string; // 'card'
  amount: number;
  currency: string;
  description: string;
  order_id: string; // ID interno de Repreguerra
  device_session_id: string; // Anti-fraude
  customer: {
    name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
}

export const openpayService = {
  createCharge: async (data: ChargeRequest) => {
    try {
      const response = await axios.post(
        `${OPENPAY_BASE_URL}/${MERCHANT_ID}/charges`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authStr}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error en Openpay Service:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
};
