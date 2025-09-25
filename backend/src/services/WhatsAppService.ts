import axios from 'axios';

export interface WhatsAppMessage {
  to: string;
  message: string;
}

export interface RouteNotificationData {
  routeName: string;
  scheduledDate: string;
  shift: string;
  driverName: string;
  helperName?: string;
}

export class WhatsAppService {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || '';
    this.apiToken = process.env.WHATSAPP_API_TOKEN || '';
    
    if (!this.apiUrl) {
      console.warn('WhatsApp API URL not configured. Messages will not be sent.');
    }
  }

  /**
   * Envia uma mensagem para um número de telefone via WhatsApp
   */
  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.apiUrl) {
      console.warn('WhatsApp API not configured. Message not sent to:', phoneNumber);
      return false;
    }

    try {
      // Remove caracteres não numéricos do telefone
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Adiciona código do país se não tiver (assumindo Brasil +55)
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      // Detectar tipo de API pela URL
      const isZApi = this.apiUrl.includes('z-api.io');
      const isBaileys = this.apiUrl.includes('baileys') || this.apiUrl.includes('localhost:3001');
      
      let requestData: any;
      let headers: any;

      if (isZApi) {
        // Formato para Z-API
        requestData = {
          phone: formattedPhone,
          message: message
        };
        headers = {
          'Content-Type': 'application/json'
        };
      } else if (isBaileys) {
        // Formato para Baileys
        requestData = {
          sessionId: 'default',
          phone: formattedPhone,
          message: message
        };
        headers = {
          'Content-Type': 'application/json'
        };
      } else {
        // Formato genérico para outras APIs
        requestData = {
          to: formattedPhone,
          message: message
        };
        headers = {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        };
      }

      const response = await axios.post(
        this.apiUrl,
        requestData,
        {
          headers,
          timeout: 10000 // 10 segundos de timeout
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log(`WhatsApp message sent successfully to ${formattedPhone}`);
        return true;
      } else {
        console.error(`Failed to send WhatsApp message to ${formattedPhone}:`, response.data);
        return false;
      }
    } catch (error: any) {
      console.error(`Error sending WhatsApp message to ${phoneNumber}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      return false;
    }
  }

  /**
   * Envia notificação de nova rota para motorista e ajudante
   */
  async sendRouteNotification(
    driverPhone: string,
    helperPhone: string | undefined,
    routeData: RouteNotificationData
  ): Promise<{ driverSent: boolean; helperSent: boolean }> {
    const message = this.createRouteMessage(routeData);
    
    const results = {
      driverSent: false,
      helperSent: false
    };

    // Enviar para o motorista
    if (driverPhone) {
      results.driverSent = await this.sendMessage(driverPhone, message);
    }

    // Enviar para o ajudante (se existir)
    if (helperPhone) {
      results.helperSent = await this.sendMessage(helperPhone, message);
    }

    return results;
  }

  /**
   * Cria a mensagem formatada para notificação de rota
   */
  private createRouteMessage(routeData: RouteNotificationData): string {
    const { routeName, scheduledDate, shift, driverName, helperName } = routeData;
    
    // Formatar a data
    const date = new Date(scheduledDate);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Formatar o turno
    const shiftText = this.formatShift(shift);

    let message = `🚛 *Nova Rota Criada*\n\n`;
    message += `📋 *Rota:* ${routeName}\n`;
    message += `📅 *Data:* ${formattedDate}\n`;
    message += `⏰ *Turno:* ${shiftText}\n`;
    
    if (helperName) {
      message += `👥 *Equipe:* ${driverName} (Motorista) e ${helperName} (Ajudante)\n`;
    } else {
      message += `👤 *Motorista:* ${driverName}\n`;
    }
    
    message += `\n✅ Rota criada com sucesso! Verifique os detalhes no sistema.`;

    return message;
  }

  /**
   * Formata o turno para exibição
   */
  private formatShift(shift: string): string {
    switch (shift?.toLowerCase()) {
      case 'morning':
      case 'manha':
        return 'Manhã';
      case 'afternoon':
      case 'tarde':
        return 'Tarde';
      case 'night':
      case 'noite':
        return 'Noite';
      default:
        return shift || 'Não especificado';
    }
  }

  /**
   * Valida se um número de telefone está no formato correto
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber) return false;
    
    // Remove caracteres não numéricos
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Verifica se tem pelo menos 10 dígitos (DDD + número)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }

  /**
   * Formata um número de telefone para o padrão brasileiro
   */
  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Se não tem código do país, adiciona +55
    if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
      return `+55${cleanPhone}`;
    } else if (cleanPhone.length === 10) {
      return `+5511${cleanPhone}`;
    } else if (cleanPhone.startsWith('55')) {
      return `+${cleanPhone}`;
    }
    
    return phoneNumber;
  }
}
