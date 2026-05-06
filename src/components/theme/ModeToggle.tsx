import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, Moon, Sun } from 'lucide-react'
import { useTheme } from './use-theme'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu.Root>
      <div className="theme-toggle-wrap">
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="theme-toggle-trigger"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <Sun className="theme-toggle-sun" aria-hidden="true" />
            <Moon className="theme-toggle-moon" aria-hidden="true" />
            <span className="theme-toggle-sr-only">Toggle theme</span>
          </button>
        </DropdownMenu.Trigger>
        <span className="theme-toggle-text">Toggle theme</span>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="theme-toggle-menu" sideOffset={10} align="start">
            <DropdownMenu.Item
              className="theme-toggle-item"
              onSelect={() => setTheme('light')}
            >
              <span>Light</span>
              {theme === 'light' ? <Check size={16} aria-hidden="true" /> : null}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="theme-toggle-item"
              onSelect={() => setTheme('dark')}
            >
              <span>Dark</span>
              {theme === 'dark' ? <Check size={16} aria-hidden="true" /> : null}
            </DropdownMenu.Item>
            <DropdownMenu.Arrow className="theme-toggle-arrow" width={14} height={8} />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </div>
    </DropdownMenu.Root>
  )
}