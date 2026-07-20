/**
 * Demo — Asistente virtual Complejo Baden Baden
 * Respuestas precisas según lo que pide el visitante (capacidad, tipo, precio).
 */
(function () {
  'use strict';

  const WA = '5493743482081';
  const WA_BASE = 'https://wa.me/' + WA;
  const IVA_NOTE = 'Precios por noche + IVA 21% · Temporada 2025–2026';

  /** Inventario real del complejo */
  const UNITS = [
    { nombre: 'Alecrin / Marmelero', tipo: 'cabana', min: 2, max: 3, precio: 90000, nota: '1 matrimonial + 1 simple · cocina · parrilla · A/C' },
    { nombre: 'Timbó Colorado / Blanco / Zoita', tipo: 'cabana', min: 4, max: 6, precio: 110000, nota: 'Tipo casita · cuchetas · cocina · parrilla' },
    { nombre: 'Lapacho Rosa / Blanco / Negro', tipo: 'cabana', min: 4, max: 6, precio: 120000, nota: 'Bungalow · cocina completa · parrilla' },
    { nombre: 'Incienso', tipo: 'cabana', min: 5, max: 7, precio: 140000, nota: 'Bungalow 2 hab. · cochera · parrilla' },
    { nombre: 'Guayubira', tipo: 'cabana', min: 6, max: 8, precio: 160000, nota: 'Casa temporada · galería cubierta' },
    { nombre: 'Laurel Negro (VIP)', tipo: 'cabana', min: 5, max: 7, precio: 165000, nota: '2 dorm. · 2 baños · hogar a leña' },
    { nombre: 'Grapia', tipo: 'cabana', min: 6, max: 8, precio: 165000, nota: 'Cabaña nueva · 3 hab. con A/C' },
    { nombre: 'Laurel Amarillo (VIP)', tipo: 'cabana', min: 6, max: 8, precio: 185000, nota: '2 baños · hogar a leña · galería' },
    { nombre: 'Palo Rosa', tipo: 'cabana', min: 10, max: 16, precio: 300000, nota: '4 dorm. · 3 baños · piscina privada' },
    { nombre: 'Araticú / Ingá / Ñangapirí', tipo: 'depto', min: 3, max: 5, precio: 110000, nota: 'Planta alta · cocina · terraza con parrilla' },
    { nombre: 'Hab. hotel Estándar', tipo: 'hotel', min: 1, max: 4, precio: 70000, nota: 'Araucaria, Espina Corona, Urunday, Curupay' },
    { nombre: 'Hab. hotel Superior', tipo: 'hotel', min: 1, max: 4, precio: 80000, nota: 'Con frigobar · Loro Negro, Cancharana, Cedro' },
    { nombre: 'Albergue × 12', tipo: 'albergue', min: 4, max: 12, precio: 17500, porPersona: true, minNoche: 70000, nota: 'Sin ropa de cama · baños compartidos' },
    { nombre: 'Albergue × 16', tipo: 'albergue', min: 4, max: 16, precio: 17500, porPersona: true, minNoche: 70000, nota: 'Sin ropa de cama · baños compartidos' }
  ];

  const QUICK = [
    { label: 'Para 2 personas', q: 'Cabaña para 2 personas' },
    { label: 'Para 6', q: 'Opciones para 6 personas' },
    { label: 'Pileta', q: '¿Cuánto sale la pileta?' },
    { label: 'Colegios', q: 'Viaje de egresados' },
    { label: 'Reservar', q: 'Quiero consultar disponibilidad' }
  ];

  function fmt(n) {
    return '$' + n.toLocaleString('es-AR');
  }

  function normalize(t) {
    return (t || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function parsePeople(text) {
    const n = normalize(text);
    if (/\b(pareja|dos)\b/.test(n) || /\bpara\s*2\b/.test(n) || /\b2\s*person/.test(n)) return 2;
    if (/\b(tres)\b/.test(n) || /\bpara\s*3\b/.test(n) || /\b3\s*person/.test(n)) return 3;
    if (/\b(cuatro)\b/.test(n) || /\bpara\s*4\b/.test(n) || /\b4\s*person/.test(n)) return 4;
    if (/\b(cinco)\b/.test(n) || /\bpara\s*5\b/.test(n) || /\b5\s*person/.test(n)) return 5;
    if (/\b(seis)\b/.test(n) || /\bpara\s*6\b/.test(n) || /\b6\s*person/.test(n)) return 6;
    if (/\b(siete)\b/.test(n) || /\bpara\s*7\b/.test(n) || /\b7\s*person/.test(n)) return 7;
    if (/\b(ocho)\b/.test(n) || /\bpara\s*8\b/.test(n) || /\b8\s*person/.test(n)) return 8;
    if (/\bpara\s*10\b/.test(n) || /\b10\s*person/.test(n)) return 10;
    if (/\bpara\s*12\b/.test(n) || /\b12\s*person/.test(n)) return 12;
    if (/\bpara\s*16\b/.test(n) || /\b16\s*person/.test(n)) return 16;
    const m = n.match(/\b(\d{1,2})\s*(pers|pax|gente)?\b/);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num >= 1 && num <= 20) return num;
    }
    return null;
  }

  function parseTipo(text) {
    const n = normalize(text);
    if (/\b(cabana|cabanas|bungalow)\b/.test(n)) return 'cabana';
    if (/\b(depto|departamento|departamentos)\b/.test(n)) return 'depto';
    if (/\b(hotel|habitacion|habitaciones|dormi)\b/.test(n)) return 'hotel';
    if (/\b(albergue|litera|colegio|egresado|escuela)\b/.test(n)) return 'albergue';
    return null;
  }

  function fitsUnit(u, people, tipo) {
    if (tipo && u.tipo !== tipo) return false;
    if (people == null) return true;
    return people >= u.min && people <= u.max;
  }

  function priceLine(u, people) {
    if (u.porPersona) {
      const pers = people || u.min;
      const total = Math.max(u.precio * pers, u.minNoche || 0);
      return fmt(u.precio) + '/pers. · desde ' + fmt(total) + '/noche (mín.)';
    }
    return fmt(u.precio) + '/noche';
  }

  function unitsHtml(list, people) {
    if (!list.length) return '';
    return (
      '<ul class="bb-unit-list">' +
      list
        .map(
          (u) =>
            '<li class="bb-unit">' +
            '<div class="bb-unit-top"><strong>' +
            u.nombre +
            '</strong><span class="bb-unit-price">' +
            priceLine(u, people) +
            '</span></div>' +
            '<div class="bb-unit-meta">' +
            u.min +
            '–' +
            u.max +
            ' pers. · ' +
            u.nota +
            '</div></li>'
        )
        .join('') +
      '</ul>'
    );
  }

  function answerForQuery(text) {
    const n = normalize(text);
    const people = parsePeople(text);
    const tipo = parseTipo(text);

    // FAQ específicas primero
    if (/\b(hola|buenas|buen dia|hey)\b/.test(n) && n.split(' ').length <= 4) {
      return {
        html:
          '<p>¡Hola! Decime <strong>para cuántas personas</strong> buscás y te paso las opciones exactas con precio.</p>' +
          '<p class="bb-muted">Ejemplo: “cabaña para 2” o “opciones para 6 personas”.</p>',
        wa: false
      };
    }

    if (/\b(piscina|pileta|tobogan|entrada)\b/.test(n) && !/\b(cabana|hotel|aloj|dormir)\b/.test(n)) {
      return {
        html:
          '<p><strong>Entrada a piscinas</strong> (mayores de 4 años):</p>' +
          '<ul class="bb-simple"><li>Lun–Vie: <strong>$7.000</strong></li><li>Sáb / Dom / Feriados: <strong>$8.000</strong></li></ul>' +
          '<p class="bb-muted">Quincho $10.000/día · Carpa $10.000/noche (ambos + entrada).</p>',
        wa: false
      };
    }

    if (/\b(check.?in|check.?out|horario de llegada|horario de salida)\b/.test(n)) {
      return {
        html:
          '<p><strong>Check-in:</strong> desde las 14:00 hs<br><strong>Check-out:</strong> hasta las 10:00 hs</p>' +
          '<p class="bb-muted">Reserva con 50% de depósito bancario.</p>',
        wa: false
      };
    }

    if (/\b(toalla|desayuno|incluye)\b/.test(n)) {
      return {
        html:
          '<p><strong>No incluyen</strong> toallas ni desayuno.</p>' +
          '<ul class="bb-simple"><li>Ropa de cama: sí en cabañas, deptos y hotel</li><li>Albergue: traer sábanas, almohada y manta</li></ul>',
        wa: false
      };
    }

    if (/\b(cancel|reembolso|devolucion)\b/.test(n)) {
      return {
        html:
          '<p>Con <strong>10 días o más</strong> de anticipación: reembolso con retención del 24%.</p>' +
          '<p>Sin esa anticipación: no hay devolución.</p>',
        wa: true
      };
    }

    if (/\b(donde|ubicacion|llegar|direccion|ruta 12)\b/.test(n)) {
      return {
        html:
          '<p><strong>RN12 1435 · Jardín América, Misiones</strong></p>' +
          '<ul class="bb-simple"><li>Desde Posadas: ~100 km (1 h 15)</li><li>Desde Iguazú: ~200 km (2 h 30)</li></ul>',
        wa: false
      };
    }

    if (/\b(colegio|egresado|estudiantil|escuela|contingente)\b/.test(n)) {
      return {
        html:
          '<p>Para <strong>colegios / egresados</strong> armamos paquete a medida:</p>' +
          '<ul class="bb-simple"><li>Albergue 12 o 16 plazas</li><li>Menú grupal (desayuno, almuerzo, cena)</li><li>Bosque de los Desafíos + piscinas</li></ul>' +
          '<p>El precio depende de cantidad de alumnos y noches. Te lo cotizan por WhatsApp.</p>',
        wa: true,
        waMsg: 'Hola! Quiero cotizar viaje escolar / egresados en Baden Baden.'
      };
    }

    if (/\b(promo|3x2|3×2|descuento)\b/.test(n)) {
      return {
        html:
          '<p><strong>Promo temporada baja:</strong> alojate 3 noches, pagá 2.</p>' +
          '<p class="bb-muted">Válido en cabañas · No incluye Vacaciones de Invierno · Sujeto a disponibilidad.</p>',
        wa: true
      };
    }

    if (/\b(mascota|perro|gato)\b/.test(n)) {
      return {
        html: '<p>La política de mascotas <strong>varía según la unidad</strong>. Hay que confirmarlo con el complejo antes de reservar.</p>',
        wa: true,
        waMsg: 'Hola! Quiero consultar si admiten mascotas y en qué unidades.'
      };
    }

    if (/\b(reservar|disponibilidad|quiero ir|consultar fecha)\b/.test(n) && people == null && !tipo) {
      return {
        html:
          '<p>Para confirmar fechas y cerrar la reserva, el complejo responde por <strong>WhatsApp</strong>.</p>' +
          '<p class="bb-muted">Si me decís cuántas personas y cuántas noches, te armo el mensaje con las opciones.</p>',
        wa: true
      };
    }

    // Consulta de alojamiento / precios → respuesta filtrada
    const asksLodging =
      people != null ||
      tipo != null ||
      /\b(precio|precios|tarifa|cuanto|cuesta|opcion|opciones|aloj|dormir|hosped|queda|hay)\b/.test(n);

    if (asksLodging) {
      let list = UNITS.filter((u) => fitsUnit(u, people, tipo));

      // Si pidió cabaña para N y no hay, ampliar a todo lo que entre N
      if (tipo && !list.length && people != null) {
        list = UNITS.filter((u) => fitsUnit(u, people, null));
      }

      // Si solo dijo "precios" sin personas: pedir precisión, no volcar todo
      if (people == null && !tipo && /\b(precio|precios|tarifa|cuanto)\b/.test(n)) {
        return {
          html:
            '<p>Para darte un precio útil, necesito el tamaño del grupo.</p>' +
            '<p>Decime por ejemplo:</p>' +
            '<ul class="bb-simple"><li>“Cabaña para 2”</li><li>“Opciones para 6 personas”</li><li>“Habitación hotel para 4”</li></ul>' +
            '<p class="bb-muted">Rangos rápidos: cabañas desde ' +
            fmt(90000) +
            ' · hotel desde ' +
            fmt(70000) +
            ' · depto ' +
            fmt(110000) +
            '.</p>',
          wa: false
        };
      }

      if (!list.length) {
        return {
          html:
            '<p>No encontré una unidad exacta para <strong>' +
            (people ? people + ' personas' : 'ese pedido') +
            (tipo ? ' en ' + tipoLabel(tipo) : '') +
            '</strong>.</p>' +
            '<p>Probá otra cantidad o consultá por WhatsApp: a veces se puede sumar 1 persona extra ($17.500).</p>',
          wa: true
        };
      }

      list = list.slice().sort((a, b) => {
        const pa = a.porPersona ? (a.minNoche || a.precio * (people || a.min)) : a.precio;
        const pb = b.porPersona ? (b.minNoche || b.precio * (people || b.min)) : b.precio;
        return pa - pb;
      });

      // Si pidió cabaña, no mezclar hotel salvo que no haya cabañas
      const onlyTipo = tipo ? list : list.filter((u) => u.tipo !== 'albergue' || people >= 8);
      const show = (tipo ? list : onlyTipo).slice(0, 6);

      let title = 'Opciones';
      if (tipo && people) title = tipoLabel(tipo) + ' para ' + people + ' personas';
      else if (people) title = 'Opciones para ' + people + ' personas';
      else if (tipo) title = tipoLabel(tipo) + ' disponibles';

      let html =
        '<p><strong>' +
        title +
        '</strong></p>' +
        unitsHtml(show, people) +
        '<p class="bb-muted">' +
        IVA_NOTE +
        '. Sin toallas ni desayuno.</p>';

      // Si pidió cabaña para 2, mencionar hotel solo como alternativa breve
      if (tipo === 'cabana' && people === 2) {
        html +=
          '<p class="bb-alt">Alternativa más económica: habitación hotel desde <strong>' +
          fmt(70000) +
          '</strong>/noche (hasta 4 pers.).</p>';
      }

      const cheapest = show[0];
      const waMsg =
        'Hola! Quiero consultar disponibilidad' +
        (people ? ' para ' + people + ' personas' : '') +
        (cheapest ? ' — me interesa ' + cheapest.nombre + ' (' + priceLine(cheapest, people) + ')' : '') +
        '.';

      return { html: html, wa: true, waMsg: waMsg };
    }

    return {
      html:
        '<p>No estoy seguro de lo que necesitás. Probá ser más concreto:</p>' +
        '<ul class="bb-simple"><li>“Cabaña para 2 personas”</li><li>“¿Cuánto sale la pileta?”</li><li>“Viaje de egresados”</li></ul>',
      wa: true,
      waMsg: 'Hola! Consulté el asistente del sitio y necesito ayuda con: ' + text
    };
  }

  function tipoLabel(t) {
    return { cabana: 'Cabañas', depto: 'Departamentos', hotel: 'Habitaciones hotel', albergue: 'Albergues' }[t] || t;
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
      .bb-chat-launcher:hover { transform: scale(1.08); }
      .bb-chat-launcher.is-open { animation: none; background: #1A3C2A; font-size: 1.4rem; }
      .bb-chat-launcher-badge {
        position: absolute; top: -6px; right: -6px;
        background: #c0392b; color: #fff;
        font-size: .62rem; font-weight: 800; letter-spacing: .04em;
        text-transform: uppercase; padding: 3px 7px; border-radius: 8px;
        border: 2px solid #fff;
      }
      .bb-chat-hint {
        position: fixed; bottom: 118px; right: 104px; z-index: 1001;
        background: #1A3C2A; color: #fff;
        font-size: .82rem; font-weight: 700; font-family: inherit;
        padding: 10px 14px; border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,.25);
        max-width: 200px; line-height: 1.35;
        opacity: 0; pointer-events: none; transform: translateX(8px);
        transition: opacity .35s, transform .35s;
      }
      .bb-chat-hint.visible { opacity: 1; transform: translateX(0); }
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
        width: min(400px, calc(100vw - 24px));
        height: min(560px, calc(100vh - 200px));
        background: #fff; border-radius: 18px;
        box-shadow: 0 16px 48px rgba(0,0,0,.28);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; pointer-events: none; transform: translateY(16px) scale(.97);
        transition: opacity .28s ease, transform .28s ease;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      }
      .bb-chat-panel.open { opacity: 1; pointer-events: all; transform: none; }
      .bb-chat-header {
        background: #1A3C2A; color: #fff; padding: 14px 16px; flex-shrink: 0;
        display: flex; align-items: center; gap: 10px;
      }
      .bb-chat-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: #C9A84C; display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem; flex-shrink: 0;
      }
      .bb-chat-header h3 { font-size: 1rem; margin: 0; font-weight: 700; line-height: 1.2; }
      .bb-chat-header p { margin: 2px 0 0; font-size: .72rem; color: rgba(255,255,255,.78); }
      .bb-chat-demo-badge {
        margin-left: auto; background: rgba(255,255,255,.12);
        color: #F0D98A; font-size: .62rem; font-weight: 800; letter-spacing: .06em;
        text-transform: uppercase; padding: 4px 8px; border-radius: 6px;
      }
      .bb-chat-close {
        background: rgba(255,255,255,.12); border: none; color: #fff;
        width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .bb-chat-messages {
        flex: 1; overflow-y: auto; padding: 14px 14px 18px;
        background: #EEF1EF;
        display: flex; flex-direction: column; gap: 12px;
      }
      .bb-msg {
        max-width: 94%; padding: 12px 14px; border-radius: 12px;
        font-size: 15px; line-height: 1.55;
        animation: bbMsgIn .25s ease;
      }
      @keyframes bbMsgIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: none; }
      }
      .bb-msg-bot {
        background: #fff; color: #141414; align-self: flex-start;
        border: 1px solid #D8DED9; border-bottom-left-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,.04);
      }
      .bb-msg-bot p { margin: 0 0 10px; }
      .bb-msg-bot p:last-child { margin-bottom: 0; }
      .bb-msg-bot .bb-muted { color: #4a524c; font-size: 13px; margin-top: 10px; }
      .bb-msg-bot .bb-alt { margin-top: 10px; padding-top: 10px; border-top: 1px solid #E4E8E5; font-size: 14px; color: #2a3a30; }
      .bb-msg-user {
        background: #1A3C2A; color: #fff; align-self: flex-end;
        border-bottom-right-radius: 4px; font-size: 15px;
      }
      .bb-simple { margin: 6px 0 0; padding-left: 18px; }
      .bb-simple li { margin: 4px 0; }
      .bb-unit-list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
      .bb-unit {
        background: #F5F7F5; border: 1px solid #DCE3DD; border-radius: 10px;
        padding: 10px 12px;
      }
      .bb-unit-top { display: flex; flex-direction: column; gap: 2px; }
      .bb-unit-top strong { font-size: 14px; color: #14241a; line-height: 1.3; }
      .bb-unit-price { font-size: 14px; font-weight: 700; color: #1A3C2A; }
      .bb-unit-meta { font-size: 12.5px; color: #4a524c; margin-top: 4px; line-height: 1.4; }
      .bb-msg-typing {
        align-self: flex-start; background: #fff; padding: 12px 16px;
        border-radius: 12px; display: flex; gap: 5px; border: 1px solid #D8DED9;
      }
      .bb-msg-typing span {
        width: 7px; height: 7px; border-radius: 50%; background: #7a857c;
        animation: bbDot 1.2s infinite ease-in-out;
      }
      .bb-msg-typing span:nth-child(2) { animation-delay: .15s; }
      .bb-msg-typing span:nth-child(3) { animation-delay: .3s; }
      @keyframes bbDot {
        0%, 80%, 100% { transform: translateY(0); opacity: .4; }
        40% { transform: translateY(-4px); opacity: 1; }
      }
      .bb-chat-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .bb-chat-actions a, .bb-chat-actions button {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 700; font-family: inherit;
        padding: 9px 12px; border-radius: 8px; cursor: pointer; text-decoration: none; border: none;
      }
      .bb-btn-wa { background: #25D366; color: #fff; }
      .bb-btn-sec { background: #E8F0EB; color: #1A3C2A; }
      .bb-chat-quick {
        display: flex; gap: 6px; padding: 10px 12px; overflow-x: auto;
        background: #fff; border-top: 1px solid #E0E5E1; flex-shrink: 0;
      }
      .bb-chip {
        flex-shrink: 0; border: 1.5px solid #C9D2CB; background: #fff;
        color: #1A3C2A; font-size: 13px; font-weight: 600; font-family: inherit;
        padding: 8px 12px; border-radius: 100px; cursor: pointer;
      }
      .bb-chip:hover { border-color: #1A3C2A; background: #E8F0EB; }
      .bb-chat-input {
        display: flex; gap: 8px; padding: 12px; background: #fff;
        border-top: 1px solid #E0E5E1; flex-shrink: 0;
      }
      .bb-chat-input input {
        flex: 1; border: 1.5px solid #C9D2CB; border-radius: 10px;
        padding: 12px 14px; font-size: 15px; font-family: inherit; color: #141414;
      }
      .bb-chat-input input:focus { outline: none; border-color: #1A3C2A; }
      .bb-chat-send {
        background: #C9A84C; color: #fff; border: none; border-radius: 10px;
        width: 46px; font-size: 1.15rem; cursor: pointer; font-weight: 700;
      }
      .bb-chat-note {
        font-size: 11px; color: #6a736c; text-align: center;
        padding: 0 12px 10px; background: #fff; flex-shrink: 0;
      }
      @media (max-width: 640px) {
        .bb-chat-launcher { right: 16px; bottom: 92px; width: 64px; height: 64px; }
        .bb-chat-hint { right: 90px; bottom: 108px; max-width: 160px; }
        .bb-chat-panel {
          left: 0; right: 0; bottom: 0; width: 100%;
          height: min(90vh, 680px); border-radius: 18px 18px 0 0;
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
    launcher.setAttribute('aria-label', 'Abrir chat Baden Baden');
    launcher.innerHTML =
      '<span class="bb-chat-ico" aria-hidden="true">💬</span><span class="bb-chat-launcher-badge">Demo</span>';

    const hint = document.createElement('div');
    hint.className = 'bb-chat-hint';
    hint.id = 'bbChatHint';
    hint.innerHTML = '<strong>Chat</strong>Consultá opciones →';
    hint.setAttribute('aria-hidden', 'true');

    const panel = document.createElement('div');
    panel.className = 'bb-chat-panel';
    panel.id = 'bbChatPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Asistente Baden Baden');
    panel.innerHTML =
      '<div class="bb-chat-header">' +
      '<div class="bb-chat-avatar" aria-hidden="true">🌿</div>' +
      '<div style="flex:1;min-width:0;"><h3>Asistente Baden Baden</h3>' +
      '<p>Te digo opciones exactas según tu grupo</p></div>' +
      '<span class="bb-chat-demo-badge">Demo</span>' +
      '<button type="button" class="bb-chat-close" id="bbChatClose" aria-label="Cerrar">✕</button></div>' +
      '<div class="bb-chat-messages" id="bbChatMsgs"></div>' +
      '<div class="bb-chat-quick" id="bbChatQuick"></div>' +
      '<form class="bb-chat-input" id="bbChatForm">' +
      '<input type="text" id="bbChatInput" placeholder="Ej: cabaña para 2 personas" autocomplete="off" maxlength="400">' +
      '<button type="submit" class="bb-chat-send" aria-label="Enviar">↑</button></form>' +
      '<p class="bb-chat-note">Demo · La reserva se confirma por WhatsApp con el complejo</p>';

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

    setTimeout(() => hint.classList.add('visible'), 1200);
    setTimeout(() => hint.classList.remove('visible'), 7000);

    let welcomed = false;
    function open() {
      panel.classList.add('open');
      launcher.classList.add('is-open');
      launcher.querySelector('.bb-chat-ico').textContent = '✕';
      hint.classList.remove('visible');
      if (!welcomed) {
        welcomed = true;
        addBotHtml(
          '<p>¡Hola! Decime <strong>para cuántas personas</strong> buscás alojamiento y te paso las unidades que entran, con precio.</p>' +
            '<p class="bb-muted">Ejemplo: “cabaña para 2” o tocá un botón de abajo.</p>'
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

  function addBotHtml(html, actions) {
    const wrap = document.createElement('div');
    wrap.className = 'bb-msg bb-msg-bot';
    wrap.innerHTML = html;
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

  function sendUser(text) {
    addUser(text);
    showTyping();
    const delay = 400 + Math.random() * 350;

    setTimeout(() => {
      hideTyping();
      const ans = answerForQuery(text);
      const actions = [];
      if (ans.wa) {
        actions.push({
          label: 'Consultar por WhatsApp',
          href: waLink(ans.waMsg || 'Hola! Vi el asistente de Baden Baden y quiero consultar: ' + text),
          className: 'bb-btn-wa'
        });
      }
      actions.push({
        label: 'Ver alojamientos',
        className: 'bb-btn-sec',
        onClick: () => document.getElementById('alojamientos')?.scrollIntoView({ behavior: 'smooth' })
      });
      addBotHtml(ans.html, actions);
    }, delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
