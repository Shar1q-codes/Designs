// Every style and experience file is picked up automatically: add a file, register it in designs.ts.
// Kept in its own module so these load after base.css (glob imports are hoisted within a module).
import.meta.glob('./styles/*.css', { eager: true });
import.meta.glob('./experiences/*.css', { eager: true });
