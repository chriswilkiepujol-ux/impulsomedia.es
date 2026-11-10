// Client testimonials shown on /opiniones and /en/reviews; also used for Review structured data.
export interface ClientReview { quote: string; author: string; role: string }

export const reviewsEn: ClientReview[] = [
        {
          quote: "Brand new website built completely from scratch, fast and well organised. Direct communication the whole way through.",
          author: "Sotovet",
          role: "Veterinary Clinic",
        },
        {
          quote: "They understood the business from day one. The site reflects exactly what we wanted, and bookings have gone up.",
          author: "Ágora Sotogrande",
          role: "Restaurant & Nightclub",
        },
        {
          quote: "Quick communication and clear results within the first few weeks of going live.",
          author: "Pujol Wilkie",
          role: "Legal Services",
        },
        {
          quote: "The booking flow was exactly what we needed for a UK audience. Everything just works, and updates are turned around fast.",
          author: "Racket Breaks",
          role: "Padel Travel & Booking",
        },
        {
          quote: "Our media kit finally looks as good as our content. Brands take us seriously now, and enquiries have picked up since launch.",
          author: "Nathan & Josh",
          role: "Content Creator Media Kit",
        },
        {
          quote: "The automated content pipeline lets us publish reviews and news at a pace we could never manage manually, without the site feeling generic.",
          author: "OnlineGames.cat",
          role: "Video Game News & Reviews",
        },
      ]

export const reviewsEs: ClientReview[] = [
        {
          quote: "Web totalmente nueva construida desde cero, rápida y bien organizada. Comunicación directa en todo momento.",
          author: "Sotovet",
          role: "Clínica Veterinaria",
        },
        {
          quote: "Entendieron el negocio desde el primer día. La web refleja exactamente lo que queríamos, y las reservas han subido.",
          author: "Ágora Sotogrande",
          role: "Restaurante y Discoteca",
        },
        {
          quote: "Comunicación rápida y resultados claros desde las primeras semanas.",
          author: "Pujol Wilkie",
          role: "Servicios Jurídicos",
        },
        {
          quote: "El flujo de reservas era justo lo que necesitábamos para un público del Reino Unido. Todo funciona, y los cambios se resuelven rápido.",
          author: "Racket Breaks",
          role: "Viajes y Reservas de Pádel",
        },
        {
          quote: "Nuestro media kit por fin luce tan bien como nuestro contenido. Las marcas ahora nos toman en serio y las consultas han aumentado desde el lanzamiento.",
          author: "Nathan & Josh",
          role: "Media Kit de Creadores",
        },
        {
          quote: "El pipeline de contenido automatizado nos permite publicar análisis y noticias a un ritmo que nunca podríamos gestionar manualmente, sin que el sitio se sienta genérico.",
          author: "OnlineGames.cat",
          role: "Noticias y Análisis de Videojuegos",
        },
      ]
