// PageOne Systems - small site behaviours (no dependencies besides Bootstrap)
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Header shadow once the page scrolls
    var header = document.querySelector(".site-header");
    function onScroll() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Current year in the footer
    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    // Fade sections in as they scroll into view
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    // Careers: confirmation after an application is submitted
    var applied = document.getElementById("appliedmsg");
    if (applied && /[?&]applied=1/.test(location.search)) applied.classList.remove("d-none");

    // Contact form: preselect the topic from ?topic=hire (used by "Request talent" links)
    var topicMatch = /[?&]topic=(\w+)/.exec(location.search);
    var topicOption = topicMatch && document.querySelector('option[data-topic="' + topicMatch[1] + '"]');
    if (topicOption) topicOption.selected = true;

    // Forms: return the visitor to the right page after FormSubmit accepts the submission
    document.querySelectorAll("input[data-next]").forEach(function (input) {
        input.value = new URL(input.getAttribute("data-next"), location.href).href;
    });

    // Animated "neural network" background for hero / visual panels
    function network(canvas) {
        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var nodes = [];
        var w, h;

        function resize() {
            var rect = canvas.getBoundingClientRect();
            w = rect.width; h = rect.height;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var count = Math.round(Math.min(80, (w * h) / 14000));
            nodes = [];
            for (var i = 0; i < count; i++) {
                nodes.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.8 + 0.8, hot: Math.random() < 0.15
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            var maxDist = 130;
            for (var i = 0; i < nodes.length; i++) {
                for (var j = i + 1; j < nodes.length; j++) {
                    var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < maxDist) {
                        ctx.strokeStyle = "rgba(170,190,255," + (0.22 * (1 - d / maxDist)) + ")";
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                    }
                }
            }
            nodes.forEach(function (n) {
                ctx.fillStyle = n.hot ? "rgba(255,120,125,0.95)" : "rgba(210,222,255,0.85)";
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
            });
        }

        function step() {
            nodes.forEach(function (n) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
            });
            draw();
            requestAnimationFrame(step);
        }

        resize();
        window.addEventListener("resize", resize);
        if (reduceMotion) draw(); else step();
    }

    document.querySelectorAll("canvas.network").forEach(network);
})();
