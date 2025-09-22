  // ======= CONFIGURACIÓN GOOGLE FORMS =======
  const FORM_ID = "1fB1WhHjE8PWssJLVxg1ucjlw6CD8dzBfjuCux-4Mub4";
  // Reemplaza cada entry.* con los IDs reales de tu formulario (ver instrucciones)
  const ENTRY_IDS = {
    nombre: "entry.203986870",
    apPaterno: "entry.498342649",
    apMaterno: "entry.220730048",
    documento: "entry.581004029",
    telefono: "entry.1598487705",
    correo: "entry.1008212861",
    empresa: "entry.303071963",
    cargo: "entry.520641510"
  };

  // ======= PASOS (una pregunta por pantalla) =======
  const steps = [
    { key: 'nombre',    label: '¿Cuál es tu <b>nombre</b>?',                   type: 'text',    required:true,  attrs:{autocomplete:'given-name'} },
    { key: 'apPaterno', label: '¿Cuál es tu <b>apellido paterno</b>?',         type: 'text',    required:true,  attrs:{autocomplete:'family-name'} },
    { key: 'apMaterno', label: '¿Cuál es tu <b>apellido materno</b>?',         type: 'text',    required:true },
    { key: 'documento', label: 'Ingresa tu <b>número de documento</b> (DNI/CE/Pasaporte)', type: 'text', required:true,  attrs:{ inputmode:'numeric', pattern:'[0-9]{8,12}' } },
    { key: 'telefono',  label: 'Tu <b>teléfono móvil</b>',                     type: 'tel',     required:true,  attrs:{ inputmode:'tel', pattern:'[0-9\s+()-]{6,}', placeholder:'+51 999 999 999' } },
    { key: 'correo',    label: 'Tu <b>correo electrónico</b>',                 type: 'email',   required:true,  attrs:{ placeholder:'tucorreo@ejemplo.com' } },
    { key: 'empresa',   label: '¿En qué <b>empresa</b> trabajas?',             type: 'text',    required:true },
    { key: 'cargo',     label: '¿Cuál es tu <b>cargo</b>?',                    type: 'text',    required:true }
  ];

  // ======= ESTADO =======
  let idx = 0;
  const values = Object.fromEntries(steps.map(s=>[s.key, '']));

  // Elementos del DOM - se inicializarán cuando el DOM esté listo
  let elStep, elProgress, btnBack, btnNext, btnSubmit, msg;

  function setProgress(){
    const pct = Math.round(((idx) / steps.length) * 100);
    elProgress.style.width = pct + '%';
  }

  function render(){
    const s = steps[idx];
    setProgress();
    btnBack.disabled = idx === 0;
    btnNext.classList.toggle('hidden', idx === steps.length-1);
    btnSubmit.classList.toggle('hidden', idx !== steps.length-1);

    elStep.innerHTML = `
      <label class="block text-lg sm:text-xl font-semibold text-slate-800"><span id="qLabel" class="typing"></span></label>
      <input id="field" class="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:outline-none focus-glow text-base"/> 
      <p class="mt-2 text-xs text-slate-500">${s.required ? 'Requerido.' : ''}</p>
    `;

    const input = document.getElementById('field');
    input.type = s.type || 'text';
    if (s.attrs){ for (const [k,v] of Object.entries(s.attrs)) input.setAttribute(k,v); }
    input.value = values[s.key] || '';
    typeQuestion(s.label, document.getElementById('qLabel'));
    input.focus();

    gsap.from(elStep, {y: 16, opacity: 0, duration: .35, ease:'power2'});
  }

  function validate(){
    const s = steps[idx];
    const input = document.getElementById('field');
    if (s.required && !input.value.trim()) { shake(); return false; }
    if (input.hasAttribute('pattern')){
      const rx = new RegExp('^'+ input.getAttribute('pattern') +'$');
      if (!rx.test(input.value.trim())){ shake(); return false; }
    }
    if (input.type === 'email'){
      const ok = /.+@.+\..+/.test(input.value.trim());
      if (!ok){ shake(); return false; }
    }
    values[s.key] = input.value.trim();
    return true;
  }

  function shake(){
    gsap.fromTo('#field', {x:-6}, {x:0, duration:.3, ease:'power2', repeat:2, yoyo:true});
  }

  // Las funciones de evento se inicializarán en DOMContentLoaded

  // ======= ENVÍO A GOOGLE FORMS =======
  function buildNativeForm(payload) {
    const native = document.createElement('form');
    native.method = 'POST';
    native.action = `https://docs.google.com/forms/d/${FORM_ID}/formResponse`;
    native.target = 'hidden_iframe';
    native.style.display = 'none';
    for (const [k, v] of Object.entries(payload)) {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = k; input.value = v; native.appendChild(input);
    }
    document.body.appendChild(native); return native;
  }

  function setStatus(type, text){
    msg.classList.remove('text-red-600','text-emerald-600');
    msg.classList.add(type==='ok'? 'text-emerald-600':'text-red-600');
    msg.textContent = text;
  }


  // ======= EFECTO DE TIPEO TIPO LLM =======
  function stripTags(html){ return html.replace(/<[^>]*>/g,''); }
  function typeQuestion(html, target){
    const plain = stripTags(html);
    target.textContent = '';
    let i = 0;
    const speed = 30; // ms por carácter
    const timer = setInterval(()=>{
      target.textContent = plain.slice(0, ++i);
      if (i >= plain.length){ clearInterval(timer); target.innerHTML = html; }
    }, speed);
  }


  // ======= IMPLEMENTACIÓN PERSONALIZADA COSMOS =======
  function createCustomStarField() {
    const canvas = document.getElementById('space');
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available!');
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let nebulas = [];
    let shootingStars = [];
    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseInfluence = 0;
    let animationStarted = false;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Ensure canvas is positioned correctly
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '-1';

      console.log(`Canvas resized to: ${width}x${height}`);
      initStars();
      initNebulas();
    }

    // Inicializar estrellas usando datos reales o procedurales
    function initStars() {
      stars = [];
      console.log('Initializing stars...');

      // Always create some procedural stars first for immediate visibility
      for (let i = 0; i < 200; i++) {
        stars.push(createStar({
          x: Math.random() * width,
          y: Math.random() * height,
          mag: Math.random() * 6
        }));
      }

      console.log(`✨ Created ${stars.length} procedural stars`);

      // Try to enhance with real data
      fetch('data.json')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          console.log('📡 Cargando catálogo estelar real...');

          // Replace some procedural stars with real ones
          stars = stars.slice(0, 100); // Keep some procedural stars

          data.slice(0, 300).forEach(star => {
            const x = (star.x || (Math.random() - 0.5) * 1000) * 0.5 + width / 2;
            const y = (star.y || (Math.random() - 0.5) * 1000) * 0.5 + height / 2;

            stars.push(createStar({
              x: x,
              y: y,
              mag: star.mag || Math.random() * 6,
              name: star.name || null
            }));
          });

          console.log(`🌟 Enhanced with ${stars.length} total stars`);
        })
        .catch(error => {
          console.log('🌟 Using procedural stars only:', error.message);
        });

      // Start animation immediately
      if (!animationStarted) {
        animationStarted = true;
        animate();
      }
    }

    function createStar({ x, y, mag, name = null }) {
      const radius = Math.max(0.3, 2.5 - (mag / 3));
      const brightness = Math.max(0.2, 1.3 - (mag / 5));

      // Clasificación espectral realista
      let color, temp;
      if (mag < 1) {
        color = [173, 216, 255]; // O/B - Azul brillante
        temp = 'hot';
      } else if (mag < 2.5) {
        color = [255, 244, 234]; // A/F - Blanco/Amarillo claro
        temp = 'warm';
      } else if (mag < 4) {
        color = [255, 223, 186]; // G/K - Amarillo/Naranja
        temp = 'medium';
      } else {
        color = [255, 182, 108]; // M - Rojo/Naranja
        temp = 'cool';
      }

      return {
        x, y,
        originalX: x,
        originalY: y,
        radius,
        brightness,
        color,
        temp,
        name,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
        depth: Math.random() * 3 + 1 // Para efecto parallax
      };
    }

    function initNebulas() {
      nebulas = [];
      for (let i = 0; i < 4; i++) {
        nebulas.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 150 + Math.random() * 200,
          color: [54, 224, 153],
          opacity: 0.02 + Math.random() * 0.03,
          drift: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3
          },
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function createShootingStar() {
      if (Math.random() < 0.003) { // 0.3% probabilidad por frame
        const side = Math.floor(Math.random() * 4);
        let startX, startY, endX, endY;

        switch(side) {
          case 0: // Desde arriba
            startX = Math.random() * width;
            startY = -50;
            endX = startX + (Math.random() - 0.5) * 400;
            endY = height / 2 + Math.random() * 200;
            break;
          case 1: // Desde derecha
            startX = width + 50;
            startY = Math.random() * height;
            endX = width / 2 - Math.random() * 200;
            endY = startY + (Math.random() - 0.5) * 400;
            break;
          case 2: // Desde abajo
            startX = Math.random() * width;
            startY = height + 50;
            endX = startX + (Math.random() - 0.5) * 400;
            endY = height / 2 - Math.random() * 200;
            break;
          default: // Desde izquierda
            startX = -50;
            startY = Math.random() * height;
            endX = width / 2 + Math.random() * 200;
            endY = startY + (Math.random() - 0.5) * 400;
        }

        shootingStars.push({
          startX, startY, endX, endY,
          currentX: startX,
          currentY: startY,
          progress: 0,
          speed: 0.02 + Math.random() * 0.03,
          life: 1,
          tail: []
        });
      }
    }

    // Event listeners
    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseInfluence = 1;
    });

    canvas.addEventListener('mouseleave', () => {
      mouseInfluence = 0;
    });

    window.addEventListener('resize', resizeCanvas);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      time += 0.016; // ~60fps

      // Fondo espacial con gradiente dinámico
      const bgGradient = ctx.createRadialGradient(
        width * 0.3, height * 0.2, 0,
        width * 0.7, height * 0.8, Math.max(width, height)
      );
      bgGradient.addColorStop(0, 'rgba(2, 6, 23, 1)');
      bgGradient.addColorStop(0.5, 'rgba(19, 97, 119, 0.3)');
      bgGradient.addColorStop(1, 'rgba(2, 6, 23, 1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Dibujar nebulosas
      nebulas.forEach(nebula => {
        nebula.x += nebula.drift.x;
        nebula.y += nebula.drift.y;
        nebula.pulse += 0.02;

        // Wrap around
        if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
        if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius;
        if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius;

        const pulseOpacity = nebula.opacity * (1 + Math.sin(nebula.pulse) * 0.3);

        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        nebulaGradient.addColorStop(0, `rgba(${nebula.color.join(',')}, ${pulseOpacity})`);
        nebulaGradient.addColorStop(0.7, `rgba(${nebula.color.join(',')}, ${pulseOpacity * 0.3})`);
        nebulaGradient.addColorStop(1, 'rgba(54, 224, 153, 0)');

        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, width, height);
      });

      // Dibujar estrellas
      stars.forEach((star, index) => {
        // Efecto parallax basado en profundidad
        const parallaxX = (mouseX - width / 2) * (0.01 / star.depth) * mouseInfluence;
        const parallaxY = (mouseY - height / 2) * (0.01 / star.depth) * mouseInfluence;

        star.x = star.originalX + parallaxX;
        star.y = star.originalY + parallaxY;

        // Efecto de proximidad del mouse
        const mouseDistance = Math.sqrt((mouseX - star.x) ** 2 + (mouseY - star.y) ** 2);
        const mouseEffect = Math.max(0, 1 - mouseDistance / 100) * mouseInfluence;

        // Efectos de parpadeo y pulsación
        star.twinklePhase += star.twinkleSpeed * 0.02;
        star.pulsePhase += 0.015;

        const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
        const pulse = Math.sin(star.pulsePhase) * 0.2 + 0.8;

        const finalRadius = star.radius * pulse * (1 + mouseEffect);
        const finalOpacity = star.brightness * twinkle * (1 + mouseEffect * 0.5);

        // Dibujar halo para estrellas brillantes
        if (star.radius > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, finalRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color.join(',')}, ${finalOpacity * 0.1})`;
          ctx.fill();
        }

        // Dibujar estrella principal con mayor visibilidad
        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(finalRadius, 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color.join(',')}, ${Math.max(finalOpacity, 0.5)})`;
        ctx.fill();

        // Agregar un punto central más brillante para mejor visibilidad
        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(finalRadius * 0.5, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.8})`;
        ctx.fill();

        // Crear líneas de constelación ocasionales
        if (index % 25 === 0 && mouseEffect > 0.5) {
          const nearStars = stars.filter((otherStar, otherIndex) => {
            if (otherIndex === index) return false;
            const dist = Math.sqrt((star.x - otherStar.x) ** 2 + (star.y - otherStar.y) ** 2);
            return dist < 120;
          });

          nearStars.forEach(nearStar => {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(nearStar.x, nearStar.y);
            ctx.strokeStyle = `rgba(54, 224, 153, ${0.1 * mouseEffect})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        }
      });

      // Crear y animar estrellas fugaces
      createShootingStar();

      shootingStars = shootingStars.filter(shootingStar => {
        shootingStar.progress += shootingStar.speed;
        shootingStar.life -= 0.01;

        if (shootingStar.progress >= 1 || shootingStar.life <= 0) {
          return false;
        }

        // Interpolación para posición actual
        shootingStar.currentX = shootingStar.startX + (shootingStar.endX - shootingStar.startX) * shootingStar.progress;
        shootingStar.currentY = shootingStar.startY + (shootingStar.endY - shootingStar.startY) * shootingStar.progress;

        // Agregar punto a la cola
        shootingStar.tail.push({
          x: shootingStar.currentX,
          y: shootingStar.currentY,
          opacity: shootingStar.life
        });

        // Limitar tamaño de la cola
        if (shootingStar.tail.length > 15) {
          shootingStar.tail.shift();
        }

        // Dibujar cola
        shootingStar.tail.forEach((point, i) => {
          const opacity = (point.opacity * (i / shootingStar.tail.length)) * 0.8;
          const size = (i / shootingStar.tail.length) * 3;

          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        });

        // Dibujar cabeza brillante
        ctx.beginPath();
        ctx.arc(shootingStar.currentX, shootingStar.currentY, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.life})`;
        ctx.fill();

        return true;
      });

      requestAnimationFrame(animate);
    }

    // Inicializar inmediatamente
    console.log('🌌 Iniciando campo de estrellas personalizado...');
    resizeCanvas();
    initNebulas();
    console.log('🌌 Campo de estrellas personalizado iniciado');
  }


  // ======= PEQUEÑO TEST-HARNESS EN CONSOLA =======
  function runTests(){
    console.group('%cPruebas rápidas','color:#136177;font-weight:bold');
    try{
      console.assert(Array.isArray(steps) && steps.length===8, 'Debe haber 8 pasos.');
      console.assert(typeof typeQuestion === 'function', 'typeQuestion existe');
      const prev = idx; idx = 0; setProgress(); idx = prev;
      const width = document.getElementById('progress').style.width;
      console.assert(width.endsWith('%'), 'La barra de progreso debe actualizarse con %');
      console.assert(FORM_ID && FORM_ID.length>10, 'FORM_ID configurado');
      console.assert(typeof buildNativeForm==='function', 'buildNativeForm existe');
    }catch(e){ console.error('Fallo de pruebas:', e); }
    console.groupEnd();
  }

  // ======= INIT UI (inicializando fondo interactivo) =======
  window.addEventListener('DOMContentLoaded', ()=>{
    console.log('🌌 Inicializando aplicación...');

    // Inicializar elementos del DOM
    elStep = document.getElementById('step');
    elProgress = document.getElementById('progress');
    btnBack = document.getElementById('btnBack');
    btnNext = document.getElementById('btnNext');
    btnSubmit = document.getElementById('btnSubmit');
    msg = document.getElementById('msg');

    // Verificar que todos los elementos existen
    if (!elStep || !elProgress || !btnBack || !btnNext || !btnSubmit || !msg) {
      console.error('❌ No se pudieron encontrar algunos elementos del DOM');
      return;
    }

    console.log('✅ Elementos del DOM inicializados correctamente');

    // Configurar event listeners para navegación
    btnNext.addEventListener('click', ()=>{
      console.log('Next button clicked, current idx:', idx);
      if (!validate()) return;
      if (idx < steps.length-1){
        idx++;
        console.log('Moving to step:', idx);
        render();
      }
    });

    btnBack.addEventListener('click', ()=>{
      console.log('Back button clicked, current idx:', idx);
      if (idx > 0){
        idx--;
        console.log('Moving back to step:', idx);
        render();
      }
    });

    btnSubmit.addEventListener('click', ()=>{
      console.log('Submit button clicked, current idx:', idx);
      if (!validate()) return;

      // mapa a entry IDs
      const payload = {
        [ENTRY_IDS.nombre]:   values.nombre,
        [ENTRY_IDS.apPaterno]:values.apPaterno,
        [ENTRY_IDS.apMaterno]:values.apMaterno,
        [ENTRY_IDS.documento]:values.documento,
        [ENTRY_IDS.telefono]: values.telefono,
        [ENTRY_IDS.correo]:   values.correo,
        [ENTRY_IDS.empresa]:  values.empresa,
        [ENTRY_IDS.cargo]:    values.cargo,
      };

      for (const k of Object.keys(payload)){
        if (!k || k.includes('XXXXXXXXXX')){
          setStatus('err','Falta configurar los entry IDs. Revisa el bloque ENTRY_IDS en el código.');
          return;
        }
      }

      setStatus('ok','Enviando…');
      const native = buildNativeForm(payload);

      const hidden = document.getElementById('hidden_iframe');
      const onDone = ()=>{
        setStatus('ok','¡Listo! Registro enviado correctamente.');
        Object.keys(values).forEach(k=>values[k]='');
        idx = 0; render();
        native.remove(); hidden.removeEventListener('load', onDone);
      };
      hidden.addEventListener('load', onDone, { once:true });
      native.submit();
    });

    // Enter = continuar; Shift+Enter = atrás
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        (idx === steps.length-1 ? btnSubmit : btnNext).click();
      }
      if (e.key === 'Enter' && e.shiftKey){
        e.preventDefault();
        btnBack.click();
      }
    });

    // Inicializar fondo cosmos
    createCustomStarField();

    // Renderizar primera pregunta
    render();

    // Animaciones de entrada
    gsap.from('header img', {y: 12, opacity: 0, duration: .5, ease: 'power2'});
    gsap.from('header h1', {y: 16, opacity: 0, duration: .6, ease: 'power2'});

    // Ejecutar tests
    runTests();

    console.log('🎉 Aplicación inicializada completamente');
  });
