# Modal Component

A comprehensive modal system with theme-aware styling, accessibility features, and multiple variants for the brutalist portfolio.

## Features

- **Theme-aware styling** - Adapts to extreme-brutalist and refined-brutalist themes
- **Multiple sizes** - sm, md, lg, xl, and full screen options
- **Backdrop blur effects** - Configurable backdrop blur for modern aesthetics
- **Focus management** - Automatic focus trapping and restoration
- **Accessibility features** - ARIA labels, keyboard navigation, screen reader support
- **Responsive behavior** - Mobile-optimized layouts and interactions
- **Portal rendering** - Proper z-index stacking with React portals
- **Scroll prevention** - Optional body scroll locking
- **Multiple variants** - Default, brutal, minimal, and floating styles

## Components

### Modal

The base modal component with full customization options.

```tsx
import { Modal } from "@/components/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="My Modal"
      description="This is a modal description"
      size="md"
      variant="default"
    >
      <p>Modal content goes here</p>
    </Modal>
  );
}
```

### ConfirmModal

A specialized modal for confirmation dialogs.

```tsx
import { ConfirmModal } from "@/components/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation
    setIsOpen(false);
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Confirm Action"
      message="Are you sure you want to continue?"
      onConfirm={handleConfirm}
      confirmText="Yes, Continue"
      cancelText="Cancel"
    />
  );
}
```

### AlertModal

A specialized modal for alert/notification dialogs.

```tsx
import { AlertModal } from "@/components/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Success!"
      message="Your action was completed successfully."
      variant="success"
      buttonText="Great!"
    />
  );
}
```

## Hooks

### useModal

Basic modal state management hook.

```tsx
import { useModal } from "@/components/ui";

function MyComponent() {
  const modal = useModal();

  return (
    <>
      <button onClick={modal.open}>Open Modal</button>
      <Modal {...modal.modalProps}>
        <p>Modal content</p>
      </Modal>
    </>
  );
}
```

### useConfirmModal

Hook for managing confirmation modals with promise-based API.

```tsx
import { useConfirmModal, ConfirmModal } from "@/components/ui";

function MyComponent() {
  const confirmModal = useConfirmModal();

  const handleDelete = async () => {
    const confirmed = await confirmModal.confirm({
      title: "Delete Item",
      message: "This action cannot be undone.",
      isDestructive: true,
    });

    if (confirmed) {
      // Proceed with deletion
    }
  };

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmModal {...confirmModal.modalProps} />
    </>
  );
}
```

### useAlertModal

Hook for managing alert modals with promise-based API.

```tsx
import { useAlertModal, AlertModal } from "@/components/ui";

function MyComponent() {
  const alertModal = useAlertModal();

  const showSuccess = async () => {
    await alertModal.alert({
      title: "Success!",
      message: "Operation completed successfully.",
      variant: "success",
    });
    // This runs after the user closes the alert
  };

  return (
    <>
      <button onClick={showSuccess}>Show Success</button>
      <AlertModal {...alertModal.modalProps} />
    </>
  );
}
```

## Props

### Modal Props

| Prop                   | Type                                               | Default     | Description                             |
| ---------------------- | -------------------------------------------------- | ----------- | --------------------------------------- |
| `isOpen`               | `boolean`                                          | -           | Whether the modal is open               |
| `onClose`              | `() => void`                                       | -           | Function called when modal should close |
| `size`                 | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`           | `'md'`      | Modal size                              |
| `variant`              | `'default' \| 'brutal' \| 'minimal' \| 'floating'` | `'default'` | Modal style variant                     |
| `theme`                | `ThemeType`                                        | -           | Override theme (optional)               |
| `closeOnBackdropClick` | `boolean`                                          | `true`      | Close modal when backdrop is clicked    |
| `closeOnEscape`        | `boolean`                                          | `true`      | Close modal when Escape key is pressed  |
| `showCloseButton`      | `boolean`                                          | `true`      | Show the close button in header         |
| `title`                | `string`                                           | -           | Modal title                             |
| `description`          | `string`                                           | -           | Modal description                       |
| `overlayBlur`          | `boolean`                                          | `true`      | Apply backdrop blur effect              |
| `preventScroll`        | `boolean`                                          | `true`      | Prevent body scroll when modal is open  |
| `trapFocus`            | `boolean`                                          | `true`      | Trap focus within modal                 |
| `role`                 | `'dialog' \| 'alertdialog'`                        | `'dialog'`  | ARIA role                               |

### ConfirmModal Props

Extends Modal props with:

| Prop            | Type         | Default     | Description                    |
| --------------- | ------------ | ----------- | ------------------------------ |
| `message`       | `string`     | -           | Confirmation message           |
| `confirmText`   | `string`     | `'Confirm'` | Confirm button text            |
| `cancelText`    | `string`     | `'Cancel'`  | Cancel button text             |
| `onConfirm`     | `() => void` | -           | Function called when confirmed |
| `onCancel`      | `() => void` | -           | Function called when cancelled |
| `isDestructive` | `boolean`    | `false`     | Style as destructive action    |
| `loading`       | `boolean`    | `false`     | Show loading state             |

### AlertModal Props

Extends Modal props with:

| Prop         | Type                                          | Default  | Description            |
| ------------ | --------------------------------------------- | -------- | ---------------------- |
| `message`    | `string`                                      | -        | Alert message          |
| `buttonText` | `string`                                      | `'OK'`   | Button text            |
| `variant`    | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Alert type             |
| `icon`       | `React.ReactNode`                             | -        | Custom icon (optional) |

## Styling

The Modal component uses CSS custom properties for theme-aware styling:

```css
.brutal-modal {
  --modal-bg: var(--current-bg);
  --modal-text: var(--current-text);
  --modal-border: var(--current-text);
  --modal-accent: var(--current-accent);
  --modal-shadow: var(--current-shadow-brutal);
  --modal-border-radius: var(--current-border-radius);
  --modal-animation-duration: var(--current-animation-duration);
}
```

## Accessibility

The Modal component includes comprehensive accessibility features:

- **ARIA attributes** - Proper `role`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- **Focus management** - Automatic focus trapping and restoration
- **Keyboard navigation** - Escape to close, Tab for focus cycling
- **Screen reader support** - Semantic HTML structure and labels
- **Reduced motion** - Respects `prefers-reduced-motion` setting

## Theme Integration

The Modal automatically adapts to the current theme:

- **Extreme Brutalist** - Sharp edges, high contrast, glitch effects
- **Refined Brutalist** - Rounded corners, subtle shadows, smooth animations

## Performance

- **Portal rendering** - Renders outside component tree for proper stacking
- **Lazy loading** - Only renders when open
- **Optimized animations** - Uses CSS transforms and opacity for smooth performance
- **Memory management** - Proper cleanup of event listeners and effects

## Browser Support

- Modern browsers with ES2015+ support
- CSS custom properties support required
- Backdrop-filter support for blur effects (graceful degradation)

## Examples

See `ModalDemo.tsx` for comprehensive usage examples and interactive demonstrations.
