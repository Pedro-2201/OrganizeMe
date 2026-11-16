import Icon from './Icon'
import { useTheme } from '../hooks/useTheme'

function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'

  return (
    <button
      type="button"
      className={`theme-toggle-button ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={17} />
    </button>
  )
}

export default ThemeToggle
