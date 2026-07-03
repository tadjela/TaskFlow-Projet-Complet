export default function Footer() {
  return (
    <footer className="text-center text-muted py-3 border-top bg-white small">
      © {new Date().getFullYear()} TaskFlow — Application de gestion de tâches. Tous droits réservés.
    </footer>
  )
}
