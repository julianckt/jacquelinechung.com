/**
 * Manages simulation freeze state, showcase timeout, and user interaction wake-up triggers.
 */
export class SimulationLifecycleController {
  /**
   * @param {Object} options
   * @param {number} [options.timeoutMs=5000] - Duration before automatic wake-up
   * @param {number} [options.moveThreshold=50] - Cumulative mouse movement distance to trigger wake-up
   * @param {() => void} [options.onWake] - Callback when transitioning from frozen to active
   */
  constructor({ timeoutMs = 5000, moveThreshold = 50, onWake = () => {} } = {}) {
    this.isFrozen = true;
    this.moveThreshold = moveThreshold;
    this.onWake = onWake;
    this.accumulatedMovement = 0;
    this.lastPosition = null;

    if (timeoutMs > 0) {
      this.timerId = setTimeout(() => {
        this.wake();
      }, timeoutMs);
    } else {
      this.timerId = null;
    }
  }

  /**
   * Accumulates relative mouse movement delta.
   * @param {number} dx
   * @param {number} dy
   */
  handleMouseMove(dx, dy) {
    if (!this.isFrozen) return;
    const distance = Math.hypot(dx, dy);
    this.accumulatedMovement += distance;
    if (this.accumulatedMovement >= this.moveThreshold) {
      this.wake();
    }
  }

  /**
   * Tracks absolute pointer position across moves.
   * @param {number} x
   * @param {number} y
   */
  handlePointerPosition(x, y) {
    if (!this.isFrozen) return;
    if (this.lastPosition) {
      const dx = x - this.lastPosition.x;
      const dy = y - this.lastPosition.y;
      this.handleMouseMove(dx, dy);
    }
    this.lastPosition = { x, y };
  }

  /**
   * Triggered on direct interaction like click or drag start.
   */
  handleUserInteraction() {
    if (!this.isFrozen) return;
    this.wake();
  }

  /**
   * Wakes up the simulation and triggers callback.
   */
  wake() {
    if (!this.isFrozen) return;
    this.isFrozen = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (typeof this.onWake === 'function') {
      this.onWake();
    }
  }

  /**
   * Cleans up pending timers.
   */
  destroy() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
