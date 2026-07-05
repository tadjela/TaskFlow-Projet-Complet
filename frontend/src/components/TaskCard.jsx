import { FiEdit2, FiTrash2, FiClock, FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { formatDate, priorityLabel, statusLabel } from '../utils/helpers'

export default function TaskCard({ task, onDelete, onStatusChange }) {
  return (
    <div className="card mb-3 shadow-sm border-0 w-100">
      <div className="card-body">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">

          {/* Informations de la tâche */}
          <div className="flex-grow-1 w-100">

            {/* Titre + catégorie */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h5 className="mb-0 text-break">
                {task.title}
              </h5>

              {task.category && (
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: task.category.color,
                    color: "#fff"
                  }}
                >
                  {task.category.name}
                </span>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-muted small mb-3 text-break">
                {task.description}
              </p>
            )}

            {/* Badges */}
            <div className="d-flex flex-wrap align-items-center gap-2">

              <span className={`badge badge-priority-${task.priority}`}>
                Priorité {priorityLabel(task.priority)}
              </span>

              <span className={`badge badge-status-${task.status}`}>
                {statusLabel(task.status)}
              </span>

              {task.deadline && (
                <span
                  className={`small d-flex align-items-center gap-1 ${
                    task.is_overdue
                      ? "text-danger fw-bold"
                      : "text-muted"
                  }`}
                >
                  <FiClock />
                  {formatDate(task.deadline)}
                  {task.is_overdue && " (en retard)"}
                </span>
              )}

            </div>
          </div>

          {/* Boutons */}
          <div className="d-flex flex-wrap gap-2 align-self-md-start">

            {task.status !== "terminee" && (
              <button
                className="btn btn-sm btn-outline-success"
                title="Marquer comme terminée"
                onClick={() => onStatusChange(task.id, "terminee")}
              >
                <FiCheckCircle />
              </button>
            )}

            <Link
              to={`/tasks/${task.id}/edit`}
              className="btn btn-sm btn-outline-primary"
              title="Modifier"
            >
              <FiEdit2 />
            </Link>

            <button
              className="btn btn-sm btn-outline-danger"
              title="Supprimer"
              onClick={() => onDelete(task)}
            >
              <FiTrash2 />
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}