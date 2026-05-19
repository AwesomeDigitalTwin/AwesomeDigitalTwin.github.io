(function($) {
    "use strict";

    $(window).on("scroll", function() {
        var scrollTop = $(window).scrollTop();
        $(".parallax-bg").css("transform", "translateY(" + scrollTop * 0.4 + "px)");
    });

    function updateCountdown(elementId, deadlineDate) {
        var element = document.getElementById(elementId);
        if (!element) return;

        var deadline = new Date(deadlineDate + "T23:59:59-12:00");

        function update() {
            var now = new Date();
            var diff = deadline - now;

            if (diff <= 0) {
                element.textContent = "(Deadline passed)";
                element.style.color = "#999";
                return;
            }

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            var countdownText = "(";
            if (days > 0) {
                countdownText += days + "d ";
            }
            if (hours > 0 || days > 0) {
                countdownText += hours + "h ";
            }
            if (minutes > 0 || hours > 0 || days > 0) {
                countdownText += minutes + "m ";
            }
            countdownText += seconds + "s remaining)";
            element.textContent = countdownText;
        }

        update();
        setInterval(update, 1000);
    }

    function initializeCollapsibleSections() {
        $(".collapsible-section").each(function() {
            var $section = $(this);
            var $collapse = $section.find(".collapse").first();
            var $toggles = $section.find(".collapsible-header, .collapsible-expand-prompt");
            var isMobileOnly = $section.hasClass("collapsible-section-mobile-only");

            function isMobileView() {
                return $(window).width() <= 480;
            }

            function setSectionExpanded(isExpanded) {
                $section.toggleClass("is-expanded", isExpanded);
                $toggles.attr("aria-expanded", isExpanded ? "true" : "false");
                $toggles.toggleClass("collapsed", !isExpanded);
            }

            function syncSectionState() {
                setSectionExpanded(isMobileOnly && !isMobileView() ? true : $collapse.hasClass("show"));
            }

            $toggles.on("click", function(event) {
                if (isMobileOnly && !isMobileView()) {
                    event.preventDefault();
                    event.stopPropagation();
                    setSectionExpanded(true);
                    return false;
                }
            });

            $collapse
                .on("show.bs.collapse", function() {
                    setSectionExpanded(true);
                })
                .on("hide.bs.collapse", function() {
                    setSectionExpanded(false);
                });

            syncSectionState();
            $(window).on("resize", syncSectionState);
        });
    }

    function initializeAbstractToggles() {
        $(".abstract-toggle").each(function() {
            var $toggle = $(this);
            var targetSelector = $toggle.attr("data-target");
            var $collapse = $(targetSelector);

            function setAbstractExpanded(isExpanded) {
                $toggle.text(isExpanded ? "Abstract (click to collapse)" : "Abstract (click to expand)");
                $toggle.attr("aria-expanded", isExpanded ? "true" : "false");
            }

            $collapse
                .on("show.bs.collapse", function() {
                    setAbstractExpanded(true);
                })
                .on("hide.bs.collapse", function() {
                    setAbstractExpanded(false);
                });

            setAbstractExpanded($collapse.hasClass("show"));
        });
    }

    $(document).ready(function() {
        updateCountdown("countdown-nonarchival-submission", "2026-03-22");
        initializeCollapsibleSections();
        initializeAbstractToggles();
    });
})(jQuery);
