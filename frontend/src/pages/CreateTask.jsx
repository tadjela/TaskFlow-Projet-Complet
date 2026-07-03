import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskService from '../services/TaskService'
import TaskForm from '../components/TaskForm'
import { useToast } from '../context/ToastContext.jsx'

export default function CreateTask() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await TaskService.create(values)
      showToast('Tâche créée avec succès.')
      navigate('/tasks')
    } catch (err) {
      if (err.response?.status !== 422) {
        showToast('Erreur lors de la création de la tâche.', 'error')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="fw-title mb-4">Nouvelle tâche</h2>
        <div className="card">
          <div className="card-body">
            <TaskForm onSubmit={handleSubmit} submitLabel="Créer la tâche" loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
