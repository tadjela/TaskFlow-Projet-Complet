import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TaskService from '../services/TaskService'
import TaskForm from '../components/TaskForm'
import Loading from '../components/Loading'
import { useToast } from '../context/ToastContext.jsx'

export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    TaskService.get(id)
      .then((res) => setTask(res.data.data))
      .catch(() => {
        showToast('Tâche introuvable.', 'error')
        navigate('/tasks')
      })
      .finally(() => setFetching(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await TaskService.update(id, values)
      showToast('Tâche modifiée avec succès.')
      navigate('/tasks')
    } catch (err) {
      if (err.response?.status !== 422) {
        showToast('Erreur lors de la modification de la tâche.', 'error')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <Loading label="Chargement de la tâche..." />
  if (!task) return null

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="fw-title mb-4">Modifier la tâche</h2>
        <div className="card">
          <div className="card-body">
            <TaskForm
              initialValues={{ ...task, category_id: task.category?.id || '' }}
              onSubmit={handleSubmit}
              submitLabel="Enregistrer les modifications"
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
