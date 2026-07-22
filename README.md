# Landing · Banco de Talento en Salud — Magneto

Landing page sencilla y práctica para que profesionales del sector salud
(médicos, enfermeros(as), instrumentadores(as), auxiliares, bacteriólogos(as)…)
dejen su hoja de vida en el banco de talento de Magneto para empresas como
SURA, Hospital Pablo Tobón Uribe y Fundación Santa Fe de Bogotá.

## Estructura

```
index.html            → Página completa (una sola landing)
assets/css/styles.css → Estilos con tokens de marca en :root
assets/js/main.js     → Lógica del modal de registro por pasos
assets/img/           → Ilustraciones de profesionales del banner
```

Es 100% estática: no requiere build ni dependencias. Para verla localmente:

```bash
npx serve .   # o simplemente abrir index.html en el navegador
```

## Flujo de registro (modal)

1. **Registro rápido** — nombre completo, teléfono (+57), correo y checkbox
   obligatorio de aceptación de tratamiento de datos personales.
2. **Éxito** — confirmación con el nombre de la persona y opción de continuar.
3. **Perfil opcional** — profesión, especialidad, ciudad, experiencia,
   registro ReTHUS y adjuntar hoja de vida. Puede cerrarse en cualquier momento.
4. **Final** — confirmación de perfil guardado.

El modal es accesible: `role="dialog"`, foco atrapado, cierre con `Esc`,
validación con mensajes en español y estados `aria-invalid`.

## Integración de datos

Todo el envío pasa por una sola función en `assets/js/main.js`:

```js
function submitToBackend(payload) { … }
```

Hoy persiste en `localStorage` (clave `magneto-salud-registro`).
Para conectar el backend/CRM/API de Magneto, reemplaza el cuerpo de esa
función por un `fetch` POST al endpoint correspondiente.

## Marca

Los colores están centralizados como variables CSS en `styles.css`:

```css
--green:        #0cbb4e;  /* verde Magneto (CTA, "m" derecha) */
--green-bright: #1bd15f;  /* verde claro del logo ("m" izquierda, "empleos") */
--navy:         #2b1656;  /* morado profundo del logo Magneto */
--bg:           #f4f6f9;  /* gris de fondo, como el buscador de empleos */
```

El logo "magneto empleos" está recreado con tipografía (Baloo 2) y CSS a
partir del logo oficial: "m" en dos tonos de verde, letras en morado y
"empleos" en verde. Si se prefiere el asset vectorial oficial, basta con
reemplazar el bloque `.logo__stack` en `index.html` por el SVG del manual.

## Fotos del banner

El banner del hero usa un collage de tres ilustraciones vectoriales de
profesionales de la salud (`assets/img/profesional-*.svg`). Para usar
fotografías reales, reemplaza cada archivo por una foto con la misma ruta y
nombre (o cambia la extensión en `index.html`). Recomendado: formato vertical
4:5 (ej. 800×1000), `object-fit: cover` se encarga del recorte.

Pendientes para ajustar con el manual de identidad definitivo:

- [ ] Confirmar hex exactos y tipografía del manual (hoy se usa Poppins con
      fallback del sistema y Baloo 2 para el logo; se cargan desde Google Fonts).
- [ ] Reemplazar los nombres de empresas por sus logos oficiales autorizados
      (sección `#empresas`, marcada con `TODO`).
- [ ] Verificar la URL real de la Política de Tratamiento de Datos
      (hoy apunta a `magneto365.com/co/politica-de-privacidad`).
