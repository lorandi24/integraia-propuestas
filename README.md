# Generador de Propuestas – IntegraIA by EMET

Aplicación web para que consultores de IntegraIA generen, en menos de 5 minutos, propuestas comerciales profesionales de servicios de IA para pymes mexicanas. Lista para enviar en PDF o por WhatsApp.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · `lz-string`. Sin backend, sin base de datos, sin autenticación. Las tres rutas se prerenderizan como estáticas (~105–120 kB First Load JS).

## Funcionalidades

| Ruta | Qué hace |
|---|---|
| `/` | Inicio: explicación de la herramienta y acceso a nueva propuesta / última propuesta. |
| `/nueva` | Formulario guiado en 4 pasos: **Cliente → Diagnóstico → ROI → Servicio e inversión**. Validación por paso, sugerencias rápidas de oportunidades, nivel de madurez automático a partir del score, autoguardado del borrador en el navegador. |
| `/propuesta` | Vista previa de la propuesta y acciones: **Editar, Copiar texto, Copiar enlace, Descargar PDF, Enviar a IntegraIA (WhatsApp 52 1 999 297 8891), Enviar al cliente**. |

La propuesta generada incluye: portada con logo y datos del cliente, resumen ejecutivo, situación actual y oportunidades (con indicador de madurez), propuesta de valor y alcance/entregables por servicio, beneficios y ROI (solo si se capturó), inversión y condiciones (forma de pago, CFDI, vigencia de 15 días, confidencialidad), siguientes pasos con CTA y bloque de firmas.

### Enlace compartible sin base de datos
Toda la propuesta se comprime en el *hash* de la URL (`/propuesta#d=…&c=1`). El hash nunca se envía al servidor, así que los datos del cliente no quedan en logs. El parámetro `c=1` abre el **modo cliente**: solo muestra “Descargar PDF” y “Aceptar propuesta” (abre WhatsApp con un mensaje de aceptación al número de IntegraIA).

### PDF
“Descargar PDF” usa la impresión nativa del navegador con hojas de estilo de impresión dedicadas (A4, portada a sangre, márgenes de 16 mm, sin cortes dentro de tarjetas). Es texto vectorial seleccionable y no agrega librerías pesadas. En el diálogo elige **Guardar como PDF** y activa **Gráficos de fondo** (Chrome lo respeta automáticamente).

## Correr en local

Requiere Node.js 18.18+ (recomendado 20 o 22).

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:3000. Para validar la versión de producción:

```bash
npm run build && npm start
```

## Logo

Copia tu archivo a `public/logo-integraia.png`. Si no existe, la app muestra automáticamente un isotipo SVG de marcador de posición (sin imágenes rotas).

## Personalización rápida

| Qué | Dónde |
|---|---|
| Número de WhatsApp de IntegraIA | `lib/catalog.ts` → `WHATSAPP_INTEGRAIA` (y el texto “999 297 8891” en `components/ProposalDocument.tsx` / `lib/proposal.ts`) |
| Servicios, alcance, entregables y duraciones sugeridas | `lib/catalog.ts` → `SERVICES` |
| Giros, oportunidades sugeridas, niveles de madurez, formas de pago | `lib/catalog.ts` |
| Redacción de la propuesta (resumen, beneficios, condiciones, CTA) | `lib/proposal.ts` → `buildProposal` |
| Vigencia de la propuesta | `lib/proposal.ts` → `VALIDITY_DAYS` |
| Colores de marca | `tailwind.config.ts` (`navy`, `cyan.electric`, `teal.brand`) |
| Consultor por defecto | `lib/types.ts` → `emptyProposal().consultant` |

## Estructura

```
app/
  layout.tsx          # Fuentes (Inter + Space Grotesk), metadatos
  page.tsx            # Inicio
  nueva/page.tsx      # Formulario
  propuesta/page.tsx  # Vista previa
  globals.css         # Componentes Tailwind + estilos de impresión
components/
  Logo.tsx            # Logo PNG con fallback SVG
  ProposalForm.tsx    # Wizard de 4 pasos
  ProposalDocument.tsx# Documento (pantalla + PDF)
  ProposalView.tsx    # Barra de acciones, copiar, PDF, WhatsApp
lib/
  catalog.ts          # Catálogo de servicios y textos
  proposal.ts         # Motor de generación + versiones texto/WhatsApp
  format.ts           # Moneda MXN, fechas, teléfonos, folio
  storage.ts          # Borrador local + codificación del enlace
  types.ts
```

## Despliegue

### Vercel (recomendado)
1. Sube el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repo. Vercel detecta Next.js; no requiere variables de entorno.
3. Deploy. Opcional: asigna un dominio como `propuestas.integraia.mx`.

### Netlify / otro hosting Node
Comando de build `npm run build`, comando de inicio `npm start` (o el adaptador de Next.js de Netlify, que se configura solo).

## Notas
- Los datos se guardan solo en el navegador del consultor (`localStorage`). “Limpiar formulario” los borra.
- Los enlaces compartidos son largos (≈700–1,500 caracteres) porque contienen la propuesta completa; WhatsApp los maneja sin problema.
- Las páginas tienen `noindex` para que las propuestas no aparezcan en buscadores.
