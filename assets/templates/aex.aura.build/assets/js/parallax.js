document.addEventListener('DOMContentLoaded', () => {
    const blinds = document.querySelectorAll('.js-hero-blind');
    const immersiveBg = document.querySelector('.js-immersive-bg');

    // Ticker variables for smooth animation requestAnimationFrame
    let lastKnownScrollPosition = 0;
    let ticking = false;

    function doParallax(scrollPos) {
        // Hero Parallax - Heavy, cinematic stagger with clamped limits
        if (scrollPos < 1200) {
            blinds.forEach((blind, index) => {
                const distanceFromCenter = Math.abs(2 - index);
                const baseSpeed = 0.028;
                const stagger = distanceFromCenter * 0.02;

                // Clamp the movement to avoid exposing background edges
                const yMoveRaw = scrollPos * (baseSpeed + stagger);
                const yMoveClamped = Math.max(-180, Math.min(yMoveRaw, 180));

                blind.style.transform = `translate3d(0, ${yMoveClamped}px, 0)`;
            });
        }

        // Immersive Break Parallax + Zoom with clamped limits
        if (immersiveBg) {
            const rect = immersiveBg.parentElement.getBoundingClientRect();
            // Check if section is in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

                // Translate up slightly and clamp to prevent empty space
                const yMoveRaw = (scrollPercent - 0.5) * -120;
                const yMoveClamped = Math.max(-100, Math.min(yMoveRaw, 100));

                // Ensure it stays safely within the scale limit
                const scale = 1.05 + (scrollPercent * 0.05);
                const finalScale = Math.min(scale, 1.12);

                immersiveBg.style.transform = `translateY(${yMoveClamped}px) scale(${finalScale})`;
            }
        }
    }

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                doParallax(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Trigger initial state
    doParallax(window.scrollY);
});
