// Custom JS can be added here. Datatables configuration, mermaid configuration
// or other custom settings that do not make sense to put in the template

document.addEventListener('DOMContentLoaded', function () {
    // PRAM dropdown controls.
    const pramDropdowns = Array.from(document.querySelectorAll('details.pram-dropdown'));

    const expandCollapseButton = document.getElementById('expand-collapse-all');

    // Adjust these values to change the dropdown animation speed.
    const PRAM_OPEN_DURATION = 700;
    const PRAM_CLOSE_DURATION = 550;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get the body belonging directly to a PRAM dropdown.
    function getPramDropdownBody(dropdown) {
        return dropdown.querySelector(':scope > .pram-dropdown-body');
    }

    // Return true only when every PRAM dropdown is open.
    function areAllPramDropdownsOpen() {
        return (
            pramDropdowns.length > 0 &&
            pramDropdowns.every(function (dropdown) {
                return dropdown.open;
            })
        );
    }

    // Synchronize the Expand All / Collapse All button.
    function updatePramExpandCollapseButton() {
        if (!expandCollapseButton) {
            return;
        }

        const allOpen = areAllPramDropdownsOpen();

        expandCollapseButton.textContent = allOpen ? 'Collapse All' : 'Expand All';

        expandCollapseButton.setAttribute('aria-expanded', String(allOpen));
    }

    // Remove temporary inline animation styles.
    function resetPramDropdownBodyStyles(body) {
        body.style.height = '';
        body.style.overflow = '';
        body.style.transition = '';
    }

    // Open or close one PRAM dropdown with a height transition.
    function setPramDropdownOpen(dropdown, shouldOpen, animate = true) {
        if (!dropdown) {
            return Promise.resolve();
        }

        if (dropdown.dataset.pramAnimating === 'true') {
            return Promise.resolve();
        }

        if (dropdown.open === shouldOpen) {
            return Promise.resolve();
        }

        const body = getPramDropdownBody(dropdown);

        if (!body || !animate || prefersReducedMotion) {
            dropdown.open = shouldOpen;
            updatePramExpandCollapseButton();

            return Promise.resolve();
        }

        dropdown.dataset.pramAnimating = 'true';

        return new Promise(function (resolve) {
            if (shouldOpen) {
                // Open <details> first so the body can be measured.
                dropdown.open = true;

                const targetHeight = body.scrollHeight;

                // Establish the collapsed starting state.
                body.style.transition = 'none';
                body.style.height = '0px';
                body.style.overflow = 'hidden';

                // Force layout so the browser commits the zero-height state.
                body.offsetHeight;

                body.style.transition = `height ${PRAM_OPEN_DURATION}ms ` + 'cubic-bezier(0.4, 0, 0.2, 1)';

                body.style.height = `${targetHeight}px`;

                const finishOpening = function (event) {
                    if (event.target !== body || event.propertyName !== 'height') {
                        return;
                    }

                    body.removeEventListener('transitionend', finishOpening);

                    resetPramDropdownBodyStyles(body);
                    delete dropdown.dataset.pramAnimating;

                    updatePramExpandCollapseButton();
                    resolve();
                };

                body.addEventListener('transitionend', finishOpening);

                return;
            }

            // Capture the current height while <details> is still open.
            const startingHeight = body.getBoundingClientRect().height;

            // Establish the full-height starting state.
            body.style.transition = 'none';
            body.style.height = `${startingHeight}px`;
            body.style.overflow = 'hidden';

            // Force layout before applying the collapsed state.
            body.offsetHeight;

            body.style.transition = `height ${PRAM_CLOSE_DURATION}ms ` + 'cubic-bezier(0.4, 0, 0.2, 1)';

            body.style.height = '0px';

            const finishClosing = function (event) {
                if (event.target !== body || event.propertyName !== 'height') {
                    return;
                }

                body.removeEventListener('transitionend', finishClosing);

                // Close <details> only after the visual collapse finishes.
                dropdown.open = false;

                resetPramDropdownBodyStyles(body);
                delete dropdown.dataset.pramAnimating;

                updatePramExpandCollapseButton();
                resolve();
            };

            body.addEventListener('transitionend', finishClosing);
        });
    }

    // Find the PRAM dropdown associated with the current URL hash.
    function getPramDropdownFromHash() {
        if (!window.location.hash) {
            return null;
        }

        let id;

        try {
            id = decodeURIComponent(window.location.hash.substring(1));
        } catch (error) {
            return null;
        }

        const target = document.getElementById(id);

        if (!target) {
            return null;
        }

        if (target.matches('details.pram-dropdown')) {
            return target;
        }

        return target.closest('details.pram-dropdown');
    }

    // Open and scroll to the PRAM dropdown referenced by the URL hash.
    async function openPramDropdownFromHash(options = {}) {
        const { animate = false, smoothScroll = false } = options;

        const dropdown = getPramDropdownFromHash();

        if (!dropdown) {
            return;
        }

        await setPramDropdownOpen(dropdown, true, animate);

        requestAnimationFrame(function () {
            dropdown.scrollIntoView({
                behavior: smoothScroll ? 'smooth' : 'auto',
                block: 'start',
            });
        });
    }

    if (pramDropdowns.length > 0) {
        pramDropdowns.forEach(function (dropdown) {
            const summary = dropdown.querySelector(':scope > summary');

            if (!summary) {
                return;
            }

            // Override the native instant toggle so opening and closing can animate.
            summary.addEventListener('click', function (event) {
                event.preventDefault();

                setPramDropdownOpen(dropdown, !dropdown.open, true);
            });

            // Keep the global button synchronized with individual dropdown changes.
            dropdown.addEventListener('toggle', function () {
                updatePramExpandCollapseButton();
            });
        });

        // Expand or collapse all PRAM dropdowns.
        if (expandCollapseButton) {
            expandCollapseButton.addEventListener('click', function () {
                const shouldOpen = !areAllPramDropdownsOpen();

                pramDropdowns.forEach(function (dropdown) {
                    setPramDropdownOpen(dropdown, shouldOpen, true);
                });
            });
        }

        // Open a directly linked dropdown immediately on initial page load.
        openPramDropdownFromHash({
            animate: false,
            smoothScroll: false,
        });

        // Open a linked dropdown with animation when the hash changes.
        window.addEventListener('hashchange', function () {
            openPramDropdownFromHash({
                animate: true,
                smoothScroll: true,
            });
        });

        updatePramExpandCollapseButton();
    }
});
