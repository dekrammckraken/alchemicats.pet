const DOM_CONTENT_LOADED = 'DOMContentLoaded';
const TIME_MINUTE = 60000;

const ANI_END = "animationend";
const TOUCH_START = "touchstart";
const TOUCH_MOVE = "touchmove";
const TOUCH_END = "touchend";

const MOUSE_LEAVE = "mouseleave";
const MOUSE_MOVE = "mousemove";
const EVT_CLICK = "click";

document.addEventListener(
    DOM_CONTENT_LOADED,
    async () => {
        try {
            const alchemyModule = await import('./alchemy.js');

            await Promise.all([
                import('./alchemy.ext.js'),
                import('./alchemy.flake.js'),
                import('./alchemy.immutable.js')
            ]);

            const alchemy = new alchemyModule.Alchemy();
            await alchemy.spawn();

        } catch (error) {
            console.error(error);
        }
    },
    { passive: true }
);
