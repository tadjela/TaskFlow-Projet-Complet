import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ value, onChange, placeholder = 'Rechercher une tâche...' }) {
  return (
    <div className="input-group">
      <span className="input-group-text bg-white border-end-0">
        <FiSearch />
      </span>
      <input
        type="text"
        className="form-control border-start-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
