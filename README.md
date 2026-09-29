# Cat Escape

Juego web 2D de plataformas desarrollado con **HTML5, CSS3, JavaScript ES6+ y JSON**.

## Características

- 15 niveles divididos en 3 mundos.
- Mundo Casa, Jardín y Ciudad.
- Movimiento, salto e interacción.
- Pescados coleccionables.
- Llaves y puertas bloqueadas.
- Obstáculos, zonas peligrosas y enemigos sencillos.
- Trampolines.
- Cámara con desplazamiento lateral.
- Sistema de 1 a 3 estrellas.
- Progreso persistente mediante `localStorage`.
- Selector de niveles.
- Controles táctiles para pantallas pequeñas.
- Efectos de partículas.
- Audio generado con Web Audio API, sin archivos externos.
- Datos de niveles separados en `levels.json`.

## Controles

- `A` / `←` — moverse a la izquierda
- `D` / `→` — moverse a la derecha
- `W`, `↑` o `Espacio` — saltar
- `E` — interactuar con la puerta
- `Esc` — pausa

## Cómo ejecutarlo

Debido a que el juego carga `levels.json` con `fetch`, se recomienda ejecutarlo mediante un servidor web local.

### Opción 1 — Visual Studio Code

1. Instala la extensión **Live Server**.
2. Abre esta carpeta.
3. Haz clic derecho en `index.html`.
4. Selecciona **Open with Live Server**.

### Opción 2 — Python

Desde esta carpeta ejecuta:

```bash
python -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

## GitHub Pages

El proyecto es compatible con GitHub Pages.

1. Sube todos los archivos del proyecto al repositorio.
2. En GitHub entra a `Settings > Pages`.
3. Selecciona `Deploy from a branch`.
4. Selecciona `main` y `/root`.
5. Guarda.

## Archivos principales

- `index.html` — estructura de la interfaz.
- `styles.css` — diseño visual y responsive.
- `game.js` — motor, físicas, renderizado, UI y progreso.
- `levels.json` — configuración de mundos y niveles.

## Personalización

Puedes crear o modificar niveles editando `levels.json`.

Cada nivel permite configurar plataformas, pescados, peligros, enemigos, llaves, puertas y trampolines sin cambiar el motor principal.

---

Proyecto creado como videojuego web autocontenido y apto para portafolio.

## Ajuste v1.1 — salto y plataformas

Se corrigió la dificultad del movimiento:

- Impulso de salto aumentado de `650` a `880`.
- Gravedad reajustada a `1550`.
- Salto corto menos agresivo al soltar el botón.
- Coyote time aumentado a `0.14 s`.
- Jump buffer aumentado a `0.14 s`.
- Varias plataformas altas fueron bajadas ligeramente.
- Pescados y llaves fueron recolocados para coincidir con las nuevas alturas.

El objetivo es que el juego siga pareciendo un plataformas completo, pero que no exija saltos extremadamente precisos.
