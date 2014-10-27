;(function () {
    var emailSubscriptionButton, eventWrapper, subscribeButtonState, subscribeForm;

    subscribeButtonState = "unsubscribed";
    subscribeForm = $(".subscribe-form");

    // subscribeForm.click(function (event) {
    //     var submitButton, targetElement;
    //
    //     event.preventDefault();
    //     event.stopPropagation();
    //
    //     targetElement = event.currentTarget;
    //
    //     // if (subscribeForm.hasClass("unsubscribed")) {
    //    //      subscribeForm.removeClass("unsubscribed");
    //    //      subscribeForm.addClass("subscribing");
    //    //  } else if (subscribeForm.hasClass("subscribing")) {
    //    //      subscribeForm.removeClass("subscribing");
    //    //      subscribeForm.addClass("subscribed");
    //    //  }
    //
    //    submitButton = $(".subscribe-form:focus input ~ div, .subscribe-form *:focus ~ div");
    //
    //    if (submitButton === targetElement) {
    //        subscribeForm.addClass("subscribed");
    //    }
    // });

    stateCascade = {
        "unsubscribed": "subscribing",
         "subscribing": "subscribed"
    }

    EmailSubscriptionButton = function () { this.initialize() };

    EmailSubscriptionButton.prototype = {
        initialize: function (state) {
               this.state = state || "unsubscribed";

                this.form = $(".subscribe-form");
               this.glyph = form.find("aside");
               this.input = form.find("input");
              this.button = form.find("div");
            this.elements = [
                this.glyph,
                this.input,
                this.buttom
            ];
        },
        advanceState: function () {
            switch (this.state) {
                case "unsubscribed":
                    this.state = "subscribing"
                    break;
                case "subscribing":
                    this.state = "subscribing"
                    break;
            }

            updateUI();
        },
        updateUI: function () {
            this.initializeDomState();

            this.form.addClass(state);
        },
        initializeDomState: function () {
            for (state in stateCascade) {
                this.form.removeClass(state);
            }
        }
    };

    esb = new EmailSubscriptionButton();

})();