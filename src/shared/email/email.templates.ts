// Email templates for the adoption flow (voluntary scope).

// Sent to the adopter confirming their adoption request was created.
export function applicationCreatedAdopterEmail(adopterName: string, petName: string) {
  return {
    subject: `Recibimos tu solicitud de adopción de ${petName}`,
    html: `
      <h2>¡Hola ${adopterName}!</h2>
      <p>Recibimos tu solicitud para adoptar a <strong>${petName}</strong>.</p>
      <p>El publicador la va a revisar y te avisaremos cuando tenga una respuesta.</p>
      <p>Gracias por darle un hogar a una mascota 🐾</p>
      <p>— El equipo de Fluffy</p>
    `,
  }
}

// Sent to the publisher notifying them of a new request for one of their pets.
export function applicationCreatedPublisherEmail(publisherName: string, petName: string, adopterName: string) {
  return {
    subject: `Nueva solicitud de adopción para ${petName}`,
    html: `
      <h2>¡Hola ${publisherName}!</h2>
      <p><strong>${adopterName}</strong> envió una solicitud para adoptar a <strong>${petName}</strong>.</p>
      <p>Ingresá a Fluffy para revisar la solicitud y aprobarla o rechazarla.</p>
      <p>— El equipo de Fluffy</p>
    `,
  }
}