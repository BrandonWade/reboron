'use strict';

var modalFactory = require('./modalFactory');
var insertKeyframesRule = require('domkit/insertKeyframesRule');
var appendVendorPrefix = require('domkit/appendVendorPrefix');

var animation = {
    show: {
        animationDuration: '0.4s',
        animationTimingFunction: 'cubic-bezier(0.7,0,0.3,1)'
    },

    hide: {
        animationDuration: '0.4s',
        animationTimingFunction: 'cubic-bezier(0.7,0,0.3,1)'
    },

    showModalAnimation: insertKeyframesRule({
        '0%': {
            opacity: 0,
            transform: 'translate(-50%, -300px)'
        },
        '100%': {
            opacity: 1,
            transform: 'translate(-50%, -50%)'
        }
    }),

    hideModalAnimation: insertKeyframesRule({
        '0%': {
            opacity: 1,
            transform: 'translate(-50%, -50%)'
        },
        '100%': {
            opacity: 0,
            transform: 'translate(-50%, 100px)'
        }
    }),

    showBackdropAnimation: insertKeyframesRule({
        '0%': {
            opacity: 0
        },
        '100%': {
            opacity: 0.9
        }
    }),

    hideBackdropAnimation: insertKeyframesRule({
        '0%': {
            opacity: 0.9
        },
        '100%': {
            opacity: 0
        }
    }),

    showContentAnimation: insertKeyframesRule({
        '0%': {
            opacity: 0,
            transform: 'translate(0, -20px)'
        },
        '100%': {
            opacity: 1,
            transform: 'translate(0, 0)'
        }
    }),

    hideContentAnimation: insertKeyframesRule({
        '0%': {
            opacity: 1,
            transform: 'translate(0, 0)'
        },
        '100%': {
            opacity: 0,
            transform: 'translate(0, 50px)'
        }
    })
};

var showAnimation = animation.show;
var hideAnimation = animation.hide;
var showModalAnimation = animation.showModalAnimation;
var hideModalAnimation = animation.hideModalAnimation;
var showBackdropAnimation = animation.showBackdropAnimation;
var hideBackdropAnimation = animation.hideBackdropAnimation;
var showContentAnimation = animation.showContentAnimation;
var hideContentAnimation = animation.hideContentAnimation;

module.exports = modalFactory({
    getRef: function getRef(willHidden) {
        return 'modal';
    },
    getModalStyle: function getModalStyle(willHidden) {
        return appendVendorPrefix({
            position: "fixed",
            width: "500px",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            backgroundColor: "white",
            zIndex: 1050,
            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
            animationFillMode: 'forwards',
            animationName: willHidden ? hideModalAnimation : showModalAnimation,
            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
        });
    },
    getBackdropStyle: function getBackdropStyle(willHidden) {
        return appendVendorPrefix({
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1040,
            backgroundColor: "#373A47",
            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
            animationFillMode: 'forwards',
            animationName: willHidden ? hideBackdropAnimation : showBackdropAnimation,
            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
        });
    },
    getContentStyle: function getContentStyle(willHidden) {
        return appendVendorPrefix({
            margin: 0,
            opacity: 0,
            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
            animationFillMode: 'forwards',
            animationDelay: '0.25s',
            animationName: showContentAnimation,
            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
        });
    }
});
