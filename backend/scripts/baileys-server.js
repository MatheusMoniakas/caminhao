/**
 * Servidor Baileys para WhatsApp
 * Execute com: node scripts/baileys-server.js
 */

const { 
  default: makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

// Configurações
const PORT = process.env.PORT || 3001;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000';

// Armazenar instâncias ativas
const activeSessions = new Map();

// Função para criar uma nova sessão
async function createSession(sessionId) {
  try {
    console.log(`🚀 Criando sessão: ${sessionId}`);
    
    const { state, saveCreds } = await useMultiFileAuthState(`./auth_info_${sessionId}`);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    console.log(`📱 Usando WA v${version.join('.')}, é a mais recente: ${isLatest}`);

    const sock = makeWASocket({
      version,
      printQRInTerminal: true,
      auth: state,
      browser: ['CaminhaoBot', 'Chrome', '1.0.0'],
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: true,
    });

    // Eventos da conexão
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log(`📱 QR Code para sessão ${sessionId}:`);
        qrcode.generate(qr, { small: true });
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(`❌ Conexão fechada para ${sessionId}, reconectando: ${shouldReconnect}`);
        
        if (shouldReconnect) {
          setTimeout(() => createSession(sessionId), 5000);
        } else {
          activeSessions.delete(sessionId);
        }
      } else if (connection === 'open') {
        console.log(`✅ Conectado com sucesso: ${sessionId}`);
        activeSessions.set(sessionId, sock);
      }
    });

    // Salvar credenciais
    sock.ev.on('creds.update', saveCreds);

    // Evento de mensagens recebidas
    sock.ev.on('messages.upsert', (m) => {
      console.log('📨 Mensagem recebida:', JSON.stringify(m, undefined, 2));
    });

    return sock;
  } catch (error) {
    console.error(`❌ Erro ao criar sessão ${sessionId}:`, error);
    throw error;
  }
}

// Endpoints da API
app.get('/', (req, res) => {
  res.json({ 
    status: 'Baileys WhatsApp Server Online',
    activeSessions: activeSessions.size,
    sessions: Array.from(activeSessions.keys())
  });
});

// Criar nova sessão
app.post('/session/create', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId é obrigatório' });
    }

    if (activeSessions.has(sessionId)) {
      return res.status(400).json({ error: 'Sessão já existe' });
    }

    await createSession(sessionId);
    res.json({ 
      success: true, 
      message: 'Sessão criada com sucesso',
      sessionId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar mensagem
app.post('/send-message', async (req, res) => {
  try {
    const { sessionId, phone, message } = req.body;
    
    if (!sessionId || !phone || !message) {
      return res.status(400).json({ 
        error: 'sessionId, phone e message são obrigatórios' 
      });
    }

    const sock = activeSessions.get(sessionId);
    if (!sock) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    // Formatar número de telefone
    const formattedPhone = phone.replace(/\D/g, '');
    const jid = `${formattedPhone}@s.whatsapp.net`;

    // Enviar mensagem
    await sock.sendMessage(jid, { text: message });
    
    res.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso',
      to: formattedPhone 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar sessões ativas
app.get('/sessions', (req, res) => {
  res.json({
    activeSessions: activeSessions.size,
    sessions: Array.from(activeSessions.keys())
  });
});

// Deletar sessão
app.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (activeSessions.has(sessionId)) {
    activeSessions.delete(sessionId);
    res.json({ success: true, message: 'Sessão deletada' });
  } else {
    res.status(404).json({ error: 'Sessão não encontrada' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Baileys rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   GET  / - Status do servidor`);
  console.log(`   POST /session/create - Criar nova sessão`);
  console.log(`   POST /send-message - Enviar mensagem`);
  console.log(`   GET  /sessions - Listar sessões`);
  console.log(`   DELETE /session/:id - Deletar sessão`);
});

// Criar sessão padrão
createSession('default').catch(console.error);
