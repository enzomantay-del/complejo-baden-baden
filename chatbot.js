/**
 * Demo — Asistente virtual Complejo Baden Baden
 * Respuestas basadas en la info del sitio. Deriva a WhatsApp cuando corresponde.
 */
(function () {
  'use strict';

  const WA = '5493743482081';
  const WA_BASE = 'https://wa.me/' + WA;

  const KB = [
    {
      id: 'saludo',
      keys: ['hola', 'buenas', 'buen dia', 'buen día', 'buenos dias', 'hey', 'ola'],
      reply:
        '¡Hola! Soy el asistente virtual de Baden Baden (demo).\n\nPuedo ayudarte con precios, alojamientos, piscinas, grupos escolares y cómo reservar.\n\n¿Qué necesitás saber?'
    },
    {
      id: 'precios',
      keys: ['precio', 'precios', 'tarifa', 'tarifas', 'cuanto', 'cuánto', 'cuesta', 'valor', 'costo'],
      reply:
        'Tarifas temporada verano 2025–2026 (+ IVA 21%):\n\n• Cabañas: desde $90.000/noche\n• Departamentos: $110.000/noche\n• Hab. hotel: desde $70.000/noche\n• Albergue: $17.500/persona (mín. $70.000/hab.)\n• Entrada pileta: $7.000 (L–V) · $8.000 (F/S/D)\n\n¿Querés que te pase un estimado por WhatsApp?'
    },
    {
      id: 'cabanas',
      keys: ['cabana', 'cabaña', 'cabanas', 'cabañas', 'bungalow', 'alojamiento', 'dormir', 'hosped'],
      reply:
        'Tenemos varios tipos:\n\n🏡 Cabañas (2 a 16 pers.) — desde $90.000\n🏠 Departamentos (5 pers.) — $110.000\n🛏️ Habitaciones hotel (4 pers.) — desde $70.000\n👥 Albergue grupal (12 o 16) — $17.500/pers.\n\nTodas con nombres de árboles nativos de Misiones. ¿Para cuántas personas buscás?'
    },
    {
      id: 'piscina',
      keys: ['piscina', 'pileta', 'piletas', 'tobogan', 'tobogán', 'toboganes', 'entrada', 'dia de pileta', 'día de pileta'],
      reply:
        'Las piscinas tienen toboganes y guardavidas.\n\nEntrada (mayores de 4 años):\n• Lun–Vie: $7.000\n• Sáb / Dom / Feriados: $8.000\n\nQuincho: $10.000/día (+ entrada).\nCarpa: $10.000/noche (+ entrada).\n\nLos huéspedes del complejo usan las instalaciones según su estadía.'
    },
    {
      id: 'checkin',
      keys: ['check in', 'check-in', 'checkin', 'llegada', 'horario', 'entrada aloj', 'checkout', 'check out', 'check-out', 'salida'],
      reply:
        'Horarios de alojamiento:\n\n🕒 Check-in: desde las 14:00 hs\n🏁 Check-out: hasta las 10:00 hs\n\nReserva: 50% de depósito bancario anticipado.'
    },
    {
      id: 'toallas',
      keys: ['toalla', 'toallas', 'desayuno', 'incluye', 'que incluye', 'qué incluye'],
      reply:
        'Importante:\n\n• No incluyen toallas ni desayuno.\n• Ropa de cama: sí en cabañas, deptos y hotel.\n• En albergues: traer sábanas, almohada y manta.\n\nEl desayuno se puede contratar en el restaurante del complejo.'
    },
    {
      id: 'cancelacion',
      keys: ['cancel', 'cancelacion', 'cancelación', 'devolucion', 'devolución', 'reembolso'],
      reply:
        'Si cancelás con al menos 10 días de anticipación, se reembolsa con una retención del 24% (facturación e IVA).\n\nSin esa anticipación, no hay devolución. Los plazos bancarios pueden demorar.'
    },
    {
      id: 'mascotas',
      keys: ['mascota', 'mascotas', 'perro', 'gata', 'gato', 'animal'],
      reply:
        'La política de mascotas puede variar según el tipo de alojamiento.\n\nTe recomiendo confirmarlo por WhatsApp antes de reservar — te conecto con el complejo.'
    },
    {
      id: 'ubicacion',
      keys: ['ubicacion', 'ubicación', 'donde', 'dónde', 'llegar', 'direccion', 'dirección', 'ruta', 'mapa', 'jardin', 'jardín'],
      reply:
        'Estamos en Jardín América, Misiones, sobre la Ruta Nacional 12 (RN12 1435).\n\n🚗 Desde Posadas: ~100 km (1 h 15)\n🚗 Desde Iguazú: ~200 km (2 h 30)\n🚌 Colectivo: bajada frente al complejo\n\nCerca: Saltos del Tabay (4 km), San Ignacio (30 km).'
    },
    {
      id: 'estudiantil',
      keys: ['colegio', 'escuela', 'egresado', 'egresados', 'estudiantil', 'alumno', 'alumnos', 'viaje de', 'grupo escolar', 'contingente'],
      reply:
        '¡Es una de nuestras especialidades! Hace 28 años recibimos grupos escolares.\n\nEl paquete puede incluir:\n• Albergue 12 o 16 plazas\n• Menú grupal (desayuno, almuerzo y cena)\n• Bosque de los Desafíos (tirolesa, etc.)\n• Piscinas y canchas\n\nArmamos presupuesto a medida. ¿Querés hablar con un asesor por WhatsApp?'
    },
    {
      id: 'albergue',
      keys: ['albergue', 'litera', 'literas', 'cucheta'],
      reply:
        'Albergues grupales:\n\n• Hasta 12 o 16 personas\n• $17.500 por persona/noche\n• Mínimo $70.000/hab. (base 4 pers.)\n• Baños compartidos\n• Sin ropa de cama (traer sábanas, almohada y manta)\n\nIdeal para colegios y grupos.'
    },
    {
      id: 'promo',
      keys: ['promo', 'promocion', 'promoción', '3x2', '3×2', 'descuento', 'oferta'],
      reply:
        'Promo temporada baja: alojate 3 noches y pagá solo 2.\n\nVálido en cabañas · No incluye Vacaciones de Invierno · Sujeto a disponibilidad.\n\nPodés usar la calculadora del sitio (botón dorado) para ver el ahorro estimado.'
    },
    {
      id: 'estacionamiento',
      keys: ['estacionamiento', 'parking', 'auto', 'cochera', 'estacionar'],
      reply:
        'El estacionamiento es gratuito para visitantes y huéspedes.\n\nExcepción: si pernoctás dentro del vehículo, se cobra como carpa.'
    },
    {
      id: 'restaurante',
      keys: ['restaurante', 'comida', 'comer', 'menu', 'menú', 'gastronomia', 'gastronomía'],
      reply:
        'Tenemos restaurante con cocina regional misionera, apto para familias y grupos.\n\nPara menú o reservas de comidas grupales, lo mejor es consultar por WhatsApp.'
    },
    {
      id: 'pago',
      keys: ['pago', 'pagar', 'transferencia', 'efectivo', 'mercadopago', 'tarjeta'],
      reply:
        'Aceptamos transferencia bancaria y efectivo.\n\nPara reservar se pide 50% de depósito anticipado. Consultá el método actualizado por WhatsApp.'
    },
    {
      id: 'contacto',
      keys: ['contacto', 'telefono', 'teléfono', 'whatsapp', 'llamar', 'escribir', 'mail', 'email', 'correo'],
      reply:
        'Contacto Baden Baden:\n\n📱 WhatsApp: +54 9 3743 482-081\n📞 Tel: (03743) 482-081 / 482-083\n✉️ campingbaden@yahoo.com.ar\n📍 RN12 1435 · Jardín América\n\n¿Te abro un chat de WhatsApp ahora?'
    },
    {
      id: 'reservar',
      keys: ['reservar', 'reserva', 'disponibilidad', 'quiero ir', 'consultar', 'hablen'],
      reply:
        'Perfecto. Para confirmar disponibilidad y cerrar la reserva, el equipo responde por WhatsApp.\n\nPodés escribirles ahora con un mensaje listo, o completar el formulario de contacto del sitio.'
    },
    {
      id: 'gracias',
      keys: ['gracias', 'thank', 'listo', 'ok', 'dale'],
      reply: '¡De nada! Si necesitás algo más, acá estoy. Para reservar, WhatsApp es el canal más rápido.'
    }
  ];

  const QUICK = [
    { label: 'Precios', q: '¿Cuáles son los precios?' },
    { label: 'Cabañas', q: '¿Qué alojamientos tienen?' },
    { label: 'Piscinas', q: '¿Cuánto sale la pileta?' },
    { label: 'Colegios', q: 'Viaje de egresados / colegio' },
    { label: 'Reservar', q: 'Quiero consultar disponibilidad' }
  ];

  function normalize(t) {
    return (t || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matchIntent(text) {
    const n = normalize(text);
    let best = null;
    let bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const k of item.keys) {
        const kn = normalize(k);
        if (n === kn) score += 10;
        else if (n.includes(kn)) score += kn.length > 3 ? 4 : 2;
      }
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    return bestScore > 0 ? best : null;
  }

  function waLink(msg) {
    return WA_BASE + '?text=' + encodeURIComponent(msg);
  }

  function injectStyles() {
    if (document.getElementById('bb-chat-styles')) return;
    const s = document.createElement('style');
    s.id = 'bb-chat-styles';
    s.textContent = `
      .bb-chat-launcher {
        position: fixed; bottom: 100px; right: 24px; z-index: 1001;
        width: 68px; height: 68px; border-radius: 50%;
        background: linear-gradient(145deg, #C9A84C 0%, #b8943e 100%);
        color: #fff; border: 3px solid #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.85rem; cursor: pointer;
        box-shadow: 0 8px 28px rgba(201,168,76,.55), 0 4px 12px rgba(0,0,0,.2);
        transition: transform .2s, box-shadow .2s;
        animation: bbPulse 2s ease-in-out infinite;
      }
      .bb-chat-launcher:hover { transform: scale(1.08); box-shadow: 0 10px 36px rgba(201,168,76,.65); }
      .bb-chat-launcher.is-open {
        animation: none;
        background: #1A3C2A;
        font-size: 1.4rem;
      }
      .bb-chat-launcher-badge {
        position: absolute; top: -6px; right: -6px;
        background: #c0392b; color: #fff;
        font-size: .62rem; font-weight: 800; letter-spacing: .04em;
        text-transform: uppercase; padding: 3px 7px; border-radius: 8px;
        border: 2px solid #fff; line-height: 1.2;
        box-shadow: 0 2px 8px rgba(0,0,0,.25);
      }
      .bb-chat-hint {
        position: fixed; bottom: 118px; right: 104px; z-index: 1001;
        background: #1A3C2A; color: #fff;
        font-size: .82rem; font-weight: 700; font-family: inherit;
        padding: 10px 14px; border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,.25);
        max-width: 200px; line-height: 1.35;
        opacity: 0; pointer-events: none;
        transform: translateX(8px);
        transition: opacity .35s, transform .35s;
      }
      .bb-chat-hint.visible { opacity: 1; transform: translateX(0); pointer-events: none; }
      .bb-chat-hint::after {
        content: ''; position: absolute; right: -8px; top: 50%;
        transform: translateY(-50%);
        border: 8px solid transparent; border-left-color: #1A3C2A;
      }
      .bb-chat-hint strong { color: #F0D98A; display: block; font-size: .68rem;
        text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2px; }
      @keyframes bbPulse {
        0%, 100% { box-shadow: 0 8px 28px rgba(201,168,76,.55), 0 0 0 0 rgba(201,168,76,.45); }
        50% { box-shadow: 0 8px 28px rgba(201,168,76,.55), 0 0 0 14px rgba(201,168,76,0); }
      }
      .bb-chat-panel {
        position: fixed; bottom: 184px; right: 24px; z-index: 1002;
        width: min(380px, calc(100vw - 32px));
        height: min(520px, calc(100vh - 210px));
        background: #fff; border-radius: 20px;
        box-shadow: 0 16px 48px rgba(0,0,0,.28);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; pointer-events: none; transform: translateY(16px) scale(.97);
        transition: opacity .28s ease, transform .28s ease;
      }
      .bb-chat-panel.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }
      .bb-chat-header {
        background: linear-gradient(135deg, #1A3C2A 0%, #2A5C40 100%);
        color: #fff; padding: 16px 18px; flex-shrink: 0;
        display: flex; align-items: center; gap: 12px;
      }
      .bb-chat-avatar {
        width: 42px; height: 42px; border-radius: 50%;
        background: #C9A84C; display: flex; align-items: center; justify-content: center;
        font-size: 1.3rem; flex-shrink: 0;
      }
      .bb-chat-header h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; margin: 0; line-height: 1.2; }
      .bb-chat-header p { margin: 2px 0 0; font-size: .72rem; color: rgba(255,255,255,.75); }
      .bb-chat-demo-badge {
        margin-left: auto; background: rgba(255,211,74,.2); border: 1px solid rgba(255,211,74,.45);
        color: #F0D98A; font-size: .62rem; font-weight: 800; letter-spacing: .08em;
        text-transform: uppercase; padding: 4px 8px; border-radius: 6px;
      }
      .bb-chat-close {
        background: rgba(255,255,255,.12); border: none; color: #fff;
        width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
        font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .bb-chat-messages {
        flex: 1; overflow-y: auto; padding: 16px; background: #F7F2EA;
        display: flex; flex-direction: column; gap: 10px;
      }
      .bb-msg {
        max-width: 88%; padding: 11px 14px; border-radius: 14px;
        font-size: .87rem; line-height: 1.55; white-space: pre-wrap;
        animation: bbMsgIn .3s ease;
      }
      @keyframes bbMsgIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: none; }
      }
      .bb-msg-bot { background: #fff; color: #1A1A18; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
      .bb-msg-user { background: #1A3C2A; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
      .bb-msg-typing {
        align-self: flex-start; background: #fff; padding: 12px 16px;
        border-radius: 14px; display: flex; gap: 5px; box-shadow: 0 1px 4px rgba(0,0,0,.06);
      }
      .bb-msg-typing span {
        width: 7px; height: 7px; border-radius: 50%; background: #9A9A92;
        animation: bbDot 1.2s infinite ease-in-out;
      }
      .bb-msg-typing span:nth-child(2) { animation-delay: .15s; }
      .bb-msg-typing span:nth-child(3) { animation-delay: .3s; }
      @keyframes bbDot {
        0%, 80%, 100% { transform: translateY(0); opacity: .4; }
        40% { transform: translateY(-4px); opacity: 1; }
      }
      .bb-chat-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .bb-chat-actions a, .bb-chat-actions button {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: .78rem; font-weight: 700; font-family: inherit;
        padding: 8px 12px; border-radius: 8px; cursor: pointer; text-decoration: none; border: none;
      }
      .bb-btn-wa { background: #25D366; color: #fff; }
      .bb-btn-wa:hover { background: #1ebe5d; }
      .bb-btn-sec { background: #E8F0EB; color: #1A3C2A; }
      .bb-chat-quick {
        display: flex; gap: 6px; padding: 10px 14px; overflow-x: auto;
        background: #fff; border-top: 1px solid #E8E8E4; flex-shrink: 0;
        -webkit-overflow-scrolling: touch;
      }
      .bb-chip {
        flex-shrink: 0; border: 1.5px solid #E8E8E4; background: #fff;
        color: #1A3C2A; font-size: .75rem; font-weight: 600; font-family: inherit;
        padding: 7px 12px; border-radius: 100px; cursor: pointer;
        transition: border-color .2s, background .2s;
      }
      .bb-chip:hover { border-color: #1A3C2A; background: #E8F0EB; }
      .bb-chat-input {
        display: flex; gap: 8px; padding: 12px 14px; background: #fff;
        border-top: 1px solid #E8E8E4; flex-shrink: 0;
      }
      .bb-chat-input input {
        flex: 1; border: 1.5px solid #E8E8E4; border-radius: 10px;
        padding: 11px 14px; font-size: .88rem; font-family: inherit;
      }
      .bb-chat-input input:focus { outline: none; border-color: #1A3C2A; }
      .bb-chat-send {
        background: #C9A84C; color: #fff; border: none; border-radius: 10px;
        width: 44px; font-size: 1.1rem; cursor: pointer; font-weight: 700;
      }
      .bb-chat-send:hover { background: #b8943e; }
      .bb-chat-note {
        font-size: .65rem; color: #9A9A92; text-align: center;
        padding: 0 12px 10px; background: #fff; flex-shrink: 0;
      }
      @media (max-width: 640px) {
        .bb-chat-launcher { right: 16px; bottom: 92px; width: 64px; height: 64px; font-size: 1.7rem; }
        .bb-chat-hint { right: 90px; bottom: 108px; max-width: 160px; font-size: .78rem; }
        .bb-chat-panel {
          left: 0; right: 0; bottom: 0; width: 100%;
          height: min(88vh, 640px); border-radius: 20px 20px 0 0;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function buildUI() {
    injectStyles();

    const launcher = document.createElement('button');
    launcher.className = 'bb-chat-launcher';
    launcher.id = 'bbChatLauncher';
    launcher.setAttribute('aria-label', 'Abrir chat demo Baden Baden');
    launcher.setAttribute('title', 'Chat demo Baden Baden');
    launcher.innerHTML = `
      <span class="bb-chat-ico" aria-hidden="true">💬</span>
      <span class="bb-chat-launcher-badge">Demo</span>
    `;

    const hint = document.createElement('div');
    hint.className = 'bb-chat-hint';
    hint.id = 'bbChatHint';
    hint.innerHTML = '<strong>Nuevo</strong>Probá el chat demo →';
    hint.setAttribute('aria-hidden', 'true');

    const panel = document.createElement('div');
    panel.className = 'bb-chat-panel';
    panel.id = 'bbChatPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Asistente virtual Baden Baden');
    panel.innerHTML = `
      <div class="bb-chat-header">
        <div class="bb-chat-avatar" aria-hidden="true">🌿</div>
        <div style="flex:1;min-width:0;">
          <h3>Asistente Baden Baden</h3>
          <p>Respuestas al instante · Demo para el dueño</p>
        </div>
        <span class="bb-chat-demo-badge">Demo</span>
        <button type="button" class="bb-chat-close" id="bbChatClose" aria-label="Cerrar">✕</button>
      </div>
      <div class="bb-chat-messages" id="bbChatMsgs"></div>
      <div class="bb-chat-quick" id="bbChatQuick"></div>
      <form class="bb-chat-input" id="bbChatForm">
        <input type="text" id="bbChatInput" placeholder="Escribí tu consulta…" autocomplete="off" maxlength="400">
        <button type="submit" class="bb-chat-send" aria-label="Enviar">↑</button>
      </form>
      <p class="bb-chat-note">Demo ilustrativa · Para reservar se confirma por WhatsApp con el complejo</p>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(hint);
    document.body.appendChild(panel);

    const quick = panel.querySelector('#bbChatQuick');
    QUICK.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bb-chip';
      b.textContent = c.label;
      b.addEventListener('click', () => sendUser(c.q));
      quick.appendChild(b);
    });

    launcher.addEventListener('click', toggle);
    panel.querySelector('#bbChatClose').addEventListener('click', close);
    panel.querySelector('#bbChatForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = panel.querySelector('#bbChatInput');
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      sendUser(v);
    });

    // Hint flotante para que se note el botón
    setTimeout(() => hint.classList.add('visible'), 1200);
    setTimeout(() => hint.classList.remove('visible'), 8000);

    let welcomed = false;
    function open() {
      panel.classList.add('open');
      launcher.classList.add('is-open');
      launcher.querySelector('.bb-chat-ico').textContent = '✕';
      hint.classList.remove('visible');
      if (!welcomed) {
        welcomed = true;
        addBot(
          '¡Hola! Soy el asistente virtual de Complejo Baden Baden.\n\nEsta es una demo para mostrar cómo un chatbot puede atender consultas 24/7 y derivar reservas a WhatsApp.\n\nProbá con los botones de abajo o escribí una pregunta.'
        );
      }
      setTimeout(() => panel.querySelector('#bbChatInput').focus(), 280);
    }
    function close() {
      panel.classList.remove('open');
      launcher.classList.remove('is-open');
      launcher.querySelector('.bb-chat-ico').textContent = '💬';
    }
    function toggle() {
      if (panel.classList.contains('open')) close();
      else open();
    }

    window.bbChatOpen = open;
  }

  function msgsEl() {
    return document.getElementById('bbChatMsgs');
  }

  function addUser(text) {
    const el = document.createElement('div');
    el.className = 'bb-msg bb-msg-user';
    el.textContent = text;
    msgsEl().appendChild(el);
    scrollBottom();
  }

  function addBot(text, actions) {
    const wrap = document.createElement('div');
    wrap.className = 'bb-msg bb-msg-bot';
    wrap.textContent = text;
    if (actions && actions.length) {
      const row = document.createElement('div');
      row.className = 'bb-chat-actions';
      actions.forEach((a) => {
        if (a.href) {
          const link = document.createElement('a');
          link.href = a.href;
          link.target = '_blank';
          link.rel = 'noopener';
          link.className = a.className || 'bb-btn-wa';
          link.textContent = a.label;
          row.appendChild(link);
        } else if (a.onClick) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = a.className || 'bb-btn-sec';
          btn.textContent = a.label;
          btn.addEventListener('click', a.onClick);
          row.appendChild(btn);
        }
      });
      wrap.appendChild(row);
    }
    msgsEl().appendChild(wrap);
    scrollBottom();
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'bb-msg-typing';
    t.id = 'bbTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgsEl().appendChild(t);
    scrollBottom();
  }

  function hideTyping() {
    const t = document.getElementById('bbTyping');
    if (t) t.remove();
  }

  function scrollBottom() {
    const m = msgsEl();
    if (m) m.scrollTop = m.scrollHeight;
  }

  function needsWhatsApp(intent) {
    return intent && ['reservar', 'mascotas', 'estudiantil', 'contacto', 'precios'].includes(intent.id);
  }

  function sendUser(text) {
    addUser(text);
    showTyping();
    const intent = matchIntent(text);
    const delay = 550 + Math.random() * 450;

    setTimeout(() => {
      hideTyping();
      if (!intent) {
        addBot(
          'No tengo esa respuesta exacta en la demo, pero el equipo de Baden Baden sí puede ayudarte.\n\nEscribiles por WhatsApp y te responden con disponibilidad y precios actualizados.',
          [
            {
              label: '💬 Abrir WhatsApp',
              href: waLink('Hola! Consulté el asistente del sitio y necesito ayuda con: ' + text),
              className: 'bb-btn-wa'
            },
            {
              label: 'Ver tarifas',
              className: 'bb-btn-sec',
              onClick: () => {
                document.getElementById('tarifas')?.scrollIntoView({ behavior: 'smooth' });
              }
            }
          ]
        );
        return;
      }

      const actions = [];
      if (needsWhatsApp(intent) || intent.id === 'reservar') {
        actions.push({
          label: '💬 Consultar por WhatsApp',
          href: waLink(
            'Hola! Vi el asistente virtual de Baden Baden y quiero consultar sobre: ' +
              (intent.id === 'estudiantil' ? 'viaje escolar / egresados' : text)
          ),
          className: 'bb-btn-wa'
        });
      }
      if (intent.id === 'precios' || intent.id === 'cabanas') {
        actions.push({
          label: 'Ver alojamientos',
          className: 'bb-btn-sec',
          onClick: () => document.getElementById('alojamientos')?.scrollIntoView({ behavior: 'smooth' })
        });
      }
      if (intent.id === 'promo') {
        actions.push({
          label: 'Abrir calculadora',
          className: 'bb-btn-sec',
          onClick: () => {
            if (typeof toggleCalc === 'function') toggleCalc();
          }
        });
      }

      addBot(intent.reply, actions.length ? actions : undefined);
    }, delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
