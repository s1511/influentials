import "./styles/style.scss";
import Shepherd from "tether-shepherd";

// Tours (launched on 2 and 4 step)
const launchTourUser = () => {
    const navbar = document.querySelector(".c-navbar");
    navbar.classList.remove("hidden-navbar");
    const tourUser = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true
        }
    });
    tourUser.addStep("user-info", {
        title: "Where to change user info",
        text: `It is always possible to update user information by clicking on this user icon above and selecting “profile” submenu.`,
        classes: "shepherd-theme-arrows c-tour-tooltip",
        attachTo: '.js-user bottom',
        buttons: [{
            text: 'Back',
            action: tourUser.cancel
        }, {
            text: "Got it",
            action: tourUser.next
        }]
    });
    tourUser.start();
};
const launchTourNetwork = () => {
    const gif = document.querySelector(".js-gif");
    gif.style.opacity = 0;
    const tourNetwork = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true
        }
    });
    const tourNetworkSteps = [
        {
            id: "access-network",
            title: "Access network",
            text: `Network is always accessible from the link in navigation menu.`,
            isLast: false,
            target: ".js-network bottom",
            targetMobile: ".js-mobilenav bottom"
        }, {
            id: "search-filter",
            title: "Search and filter",
            text: "Use a filter/search button to find influencers based on category, audience reach and other parameters.",
            isLast: false,
            target: ".js-search left",
            targetMobile: ".js-search bottom"
        }, {
            id: "save-favorites",
            title: "Save to favorites",
            text: "Add 	influencers to favorite list to acess them quicker next time.",
            isLast: true,
            target: ".js-favorite right",
            targetMobile: ".js-favorite bottom"
        }
    ];
    tourNetworkSteps.forEach( (step,i) => {
        const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        const isMobile = (width < 768);
        tourNetwork.addStep(step.id, {
            text: step.text,
            title: step.title,
            attachTo: isMobile ? step.targetMobile : step.target,
            classes: "shepherd-theme-arrows c-tour-tooltip",
            buttons: [{
                    text: 'Back',
                    action: i == 0 ? tourNetwork.cancel : tourNetwork.back
                }, {
                    text: step.isLast ? "Done" : "Next",
                    action: tourNetwork.next
                }]
        })
    });
    tourNetwork.start();
};

// UI updates
const checkStepCounter = () => {
    const stepsCounter = document.querySelector(".c-steps-counter");
    stepsCounter.classList.add("is-complete");
};
const previewLogo = (file) => {
    const preview = document.querySelector('.c-form-preview');
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        preview.src = reader.result;
        preview.style.display = `block`;
        preview.style.opacity = 1;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
};

// Onboarding logic
const redirect = (href) => {
    const wrapper = document.querySelector(".wrapper");
    setTimeout( () => { wrapper.classList.add("fade-out"); }, 200);
    setTimeout( () => { window.location = href }, 600);
};
const nextStep = (currentStep, href) => {
    // Launches tours on relevant steps
    if (currentStep == 2 || currentStep == 4) {
        currentStep == 2 ? launchTourUser() : launchTourNetwork();
        Shepherd.on("complete", () => {
            checkStepCounter();
            redirect(href)
        });
        return;
    }
    checkStepCounter();
    redirect(href);
};

// Init
const init = () => {
    const onboardingStep = parseInt(document.body.getAttribute("data-onboarding-step"));
    const skipStepBtn = document.querySelector(".js-skip-step");
    const nextStepBtn = document.querySelector(".js-next-step");
    const formSubmitBtn = document.querySelector(".js-submit");
    const fileInput = document.querySelector('input[type=file]');

    // Bind next step actions
    if (nextStepBtn) {
        nextStepBtn.addEventListener("click", (e) => {
            e.preventDefault();
            nextStep(onboardingStep, e.target.href);
        });
    }
    // Bind skip buttons not to trigger step counter
    if (skipStepBtn) {
        skipStepBtn.addEventListener("click", (e) => {
            e.preventDefault();
            redirect(e.target.href);
        });
    }
    // Check form validity before next step
    if (formSubmitBtn) {
        formSubmitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const formId = (onboardingStep == 2) ? "#user-info" : "#brand-info";
            const form = document.querySelector(formId);
            if (form.reportValidity()) {
                nextStep(onboardingStep, e.target.href);
            }
        });
    }
    // Bind pic upload
    if (fileInput) {
        fileInput.addEventListener("change", () => {
            previewLogo(fileInput.files[0])
        });
    }
};
init();