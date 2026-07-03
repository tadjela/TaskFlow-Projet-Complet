export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const priorityLabel = (priority) => {
  const labels = { basse: 'Basse', moyenne: 'Moyenne', haute: 'Haute' }
  return labels[priority] || priority
}

export const statusLabel = (status) => {
  const labels = { a_faire: 'À faire', en_cours: 'En cours', terminee: 'Terminée' }
  return labels[status] || status
}

export const initials = (name = '') => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
