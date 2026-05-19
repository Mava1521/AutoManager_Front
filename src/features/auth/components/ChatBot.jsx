// src/features/auth/components/SupportChatbot.jsx
import { useState, useRef, useEffect } from "react";
import "../../../styles/ChatBot.css";

// ─── Constantes ───────────────────────────────────────────────────────────────

const BOT_AVATAR = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const MAIN_MENU = [
  { id: "vehicles", label: "🚗 Información sobre vehículos" },
  { id: "roles",    label: "🔐 Roles y permisos del sistema" },
  { id: "account",  label: "👤 Problemas con mi cuenta" },
  { id: "contact",  label: "✉️ Contactar a un asesor" },
  { id: "close",    label: "👋 No, gracias — ya resolví mi duda" },
];

const MENU_RESPONSES = {
  vehicles: {
    text: "En AutoManager puedes consultar el catálogo completo de vehículos: marca, modelo, localidad y más.\n\nSi tienes el rol **Admin** también puedes crear, editar y eliminar registros.",
    showMenu: true,
  },
  roles: {
    text: "El sistema maneja dos roles:\n\n• **Viewer / Aspirante** → Solo lectura del catálogo.\n• **Admin** → Control total (crear, editar, eliminar).\n\nSi necesitas cambio de rol, contacta a un asesor.",
    showMenu: true,
  },
  account: {
    text: "Si olvidaste tu contraseña, usa el enlace **'Olvidé mi contraseña'** en la pantalla de inicio.\n\nSi el problema persiste, podemos conectarte con un asesor.",
    showMenu: true,
  },
};

// ─── Modelo de mensaje ────────────────────────────────────────────────────────

const createMessage = (sender, text) => ({
  id: crypto.randomUUID(),
  sender,
  text,
  timestamp: new Date(),
});

// ─── Servicio de contacto ─────────────────────────────────────────────────────

/**
 * Llama a POST /api/support/contact en el backend FastAPI.
 *
 * En desarrollo el proxy de Vite (vite.config.js) redirige
 * las rutas /api/* al servidor local en el puerto 8000.
 * En producción, frontend y backend deben compartir dominio
 * o configurar el proxy en el servidor (Nginx/Render).
 */
async function sendSupportContact({ senderEmail, subject, message }) {
  const response = await fetch("/api/support/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_email: senderEmail,
      subject,
      message,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Error al enviar la consulta.");
  }

  return response.json();
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isBot = message.sender === "bot";
  return (
    <div className={`chatbot-message ${isBot ? "chatbot-message--bot" : "chatbot-message--user"}`}>
      {isBot && <span className="chatbot-avatar">{BOT_AVATAR}</span>}
      <div className="chatbot-bubble">
        {message.text.split("\n").map((line, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        ))}
        <span className="chatbot-timestamp">
          {message.timestamp.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function MenuOptions({ options, onSelect }) {
  return (
    <div className="chatbot-menu">
      {options.map((opt) => (
        <button
          key={opt.id}
          className={`chatbot-menu-btn ${opt.id === "close" ? "chatbot-menu-btn--close" : ""}`}
          onClick={() => onSelect(opt)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ContactForm({ onSubmit, onCancel, loading }) {
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setEmailError("Por favor ingresa un correo válido.");
      return;
    }
    if (!subject.trim() || !message.trim()) return;
    setEmailError("");
    onSubmit({ senderEmail: email, subject, message });
  };

  const isFormReady = isValidEmail(email) && subject.trim() && message.trim();

  return (
    <div className="chatbot-contact-form">
      <p className="chatbot-contact-form__title">Escríbenos tu consulta</p>

      <label className="chatbot-contact-label">Tu correo electrónico</label>
      <input
        className={`chatbot-contact-input ${emailError ? "chatbot-contact-input--error" : ""}`}
        type="email"
        placeholder="tunombre@correo.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
      />
      {emailError && <span className="chatbot-contact-error">{emailError}</span>}

      <label className="chatbot-contact-label">Asunto</label>
      <input
        className="chatbot-contact-input"
        type="text"
        placeholder="Ej: No puedo iniciar sesión"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <label className="chatbot-contact-label">Mensaje</label>
      <textarea
        className="chatbot-contact-textarea"
        placeholder="Cuéntanos tu consulta con detalle..."
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="chatbot-contact-actions">
        <button
          className="chatbot-contact-btn chatbot-contact-btn--cancel"
          onClick={onCancel}
          disabled={loading}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="chatbot-contact-btn chatbot-contact-btn--send"
          onClick={handleSubmit}
          disabled={loading || !isFormReady}
          type="button"
        >
          {loading ? "Enviando..." : "Enviar consulta"}
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SupportChatbot() {
  const [isOpen, setIsOpen]                   = useState(false);
  const [messages, setMessages]               = useState([]);
  const [showMenu, setShowMenu]               = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [sendingEmail, setSendingEmail]       = useState(false);
  const [hasUnread, setHasUnread]             = useState(true);
  const [isClosed, setIsClosed]               = useState(false); // conversación finalizada
  const messagesEndRef                        = useRef(null);

  // Saludo inicial al abrir por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "¡Hola! Soy AutoBot 🤖, el asistente de AutoManager.\n\n¿En qué puedo ayudarte hoy?",
        true,
      );
    }
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showMenu, showContactForm]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const addBotMessage = (text, withMenuAfter = false) => {
    setMessages((prev) => [...prev, createMessage("bot", text)]);
    if (withMenuAfter) {
      setTimeout(() => setShowMenu(true), 350);
    }
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, createMessage("user", text)]);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleMenuSelect = (option) => {
    setShowMenu(false);
    addUserMessage(option.label);

    // Opción: cerrar conversación
    if (option.id === "close") {
      setTimeout(() => {
        addBotMessage(
          "¡Perfecto! Que tengas un excelente día. 😊\n\nSi en algún momento necesitas ayuda, aquí estaré.",
        );
        setIsClosed(true);
      }, 300);
      return;
    }

    // Opción: contactar asesor
    if (option.id === "contact") {
      setTimeout(() => {
        addBotMessage(
          "Claro 👍 Completa el formulario a continuación. Un asesor revisará tu consulta y te responderá a la brevedad.\n\nRevisa también tu carpeta de **spam** por si acaso.",
        );
        setTimeout(() => setShowContactForm(true), 400);
      }, 300);
      return;
    }

    // Resto de opciones del menú
    const response = MENU_RESPONSES[option.id];
    if (response) {
      setTimeout(() => addBotMessage(response.text, response.showMenu), 400);
    }
  };

  const handleContactSubmit = async (formData) => {
    setSendingEmail(true);
    setShowContactForm(false);

    try {
      await sendSupportContact(formData);
      addBotMessage(
        "✅ ¡Consulta enviada! Un asesor revisará tu mensaje a la brevedad.\n\nRevisa tu bandeja de entrada y también la carpeta de **spam** por si acaso.",
        true,
      );
    } catch (err) {
      addBotMessage(
        `❌ ${err.message || "No fue posible enviar tu consulta."} Por favor intenta de nuevo.`,
        true,
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const handleContactCancel = () => {
    setShowContactForm(false);
    addBotMessage("Entendido. ¿En qué más puedo ayudarte?", true);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setIsClosed(false);
    setShowMenu(false);
    setShowContactForm(false);
    // El useEffect de isOpen disparará el saludo nuevamente
    addBotMessage(
      "¡Hola de nuevo! 👋 ¿En qué puedo ayudarte?",
      true,
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="chatbot-wrapper" aria-label="Asistente virtual AutoManager">

      {/* Botón flotante */}
      <button
        className={`chatbot-trigger ${isOpen ? "chatbot-trigger--active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
        type="button"
      >
        {hasUnread && !isOpen && (
          <span className="chatbot-trigger__badge" aria-hidden="true" />
        )}
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="Chat de soporte AutoManager">

          {/* Header */}
          <div className="chatbot-header">
            <span className="chatbot-header__avatar">{BOT_AVATAR}</span>
            <div className="chatbot-header__info">
              <span className="chatbot-header__name">AutoBot</span>
              <span className="chatbot-header__status">● En línea</span>
            </div>
          </div>

          {/* Mensajes */}
          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {showMenu && !showContactForm && !isClosed && (
              <MenuOptions options={MAIN_MENU} onSelect={handleMenuSelect} />
            )}

            {showContactForm && (
              <ContactForm
                onSubmit={handleContactSubmit}
                onCancel={handleContactCancel}
                loading={sendingEmail}
              />
            )}

            {/* Estado: conversación cerrada */}
            {isClosed && (
              <div className="chatbot-closed">
                <button
                  className="chatbot-new-chat-btn"
                  onClick={handleNewConversation}
                  type="button"
                >
                  Iniciar nueva consulta
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

        </div>
      )}
    </div>
  );
}